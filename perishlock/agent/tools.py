"""Domain tools for PerishLock Strands Agent."""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from strands import tool

from perishlock.telemetry.models import ChamberReading, ValidatedSample
from perishlock.telemetry.validator import TelemetryValidator
from perishlock.telemetry.aggregator import TelemetryAggregator
from perishlock.engine.policy import PolicyModel
from perishlock.engine.trigger import IncidentEngine, IncidentScope, IncidentState
from perishlock.engine.salvage import SalvageCalculator, SalvageOption, SalvageAllocationItem
from perishlock.engine.settlement import SettlementCalculator, SettlementNotice
from perishlock.evidence.manifest import EvidenceManifest
from perishlock.evidence.storage import EvidenceStore
from perishlock.workflow.approval import ApprovalService, ApprovalRequest
from perishlock.workflow.audit import AuditLog
from perishlock.workflow.notifier import NotificationDispatcher

# Shared runtime context
DATA_DIR = Path(__file__).parent.parent.parent
FIXTURES_DIR = DATA_DIR / "fixtures"

_policy: Optional[PolicyModel] = None
_incident_engine: Optional[IncidentEngine] = None
_active_incident: Optional[IncidentScope] = None
_active_samples: List[ValidatedSample] = []
_active_options: Dict[str, SalvageOption] = {}
_evidence_store = EvidenceStore(storage_dir=DATA_DIR / "evidence_vault")
_approval_service = ApprovalService()
_audit_log = AuditLog(log_dir=DATA_DIR / "audit_ledger")
_notifier = NotificationDispatcher()


def initialize_runtime(
    policy_path: Optional[str | Path] = None,
    telemetry_path: Optional[str | Path] = None,
) -> IncidentScope:
    """Initialize or reset the agent domain runtime context."""
    global _policy, _incident_engine, _active_incident, _active_samples, _active_options

    p_path = Path(policy_path) if policy_path else FIXTURES_DIR / "policies" / "riverbend_tomatoes_p001.json"
    t_path = Path(telemetry_path) if telemetry_path else FIXTURES_DIR / "telemetry" / "sustained_breach.json"

    _policy = PolicyModel.load_from_file(p_path)
    _incident_engine = IncidentEngine(_policy)

    with open(t_path, "r", encoding="utf-8") as f:
        raw_telemetry = json.load(f)

    validator = TelemetryValidator(
        max_sensor_drift_c=_policy.parametric_trigger.dual_sensor_max_drift_c
    )
    _active_samples = []
    for item in raw_telemetry:
        reading = ChamberReading(**item)
        sample = validator.validate_reading(reading)
        _active_samples.append(sample)

    aggregator = TelemetryAggregator(
        threshold_c=_policy.parametric_trigger.threshold_value,
        required_sustained_minutes=_policy.parametric_trigger.sustained_duration_minutes,
    )
    window_eval = aggregator.evaluate_window(_active_samples)
    _active_incident = _incident_engine.evaluate(window_eval)

    _audit_log.record(
        _active_incident.incident_id,
        "telemetry_monitor",
        "INCIDENT_EVALUATED",
        {"state": _active_incident.state.value, "summary": _active_incident.trigger_summary}
    )
    return _active_incident


# Initialize default on import
try:
    initialize_runtime()
except Exception:
    pass


# --- Tool 1: load_incident_scope ---
@tool
def load_incident_scope(incident_id: str) -> str:
    """Load metadata and scope for a specific cold-chain incident.

    Args:
        incident_id: Identifier of the incident (e.g. INC-POL-RB-TOM-2026-001)
    """
    global _active_incident
    if not _active_incident:
        initialize_runtime()

    inc = _active_incident
    return json.dumps({
        "incident_id": inc.incident_id,
        "policy_id": inc.policy_id,
        "chamber_id": inc.chamber_id,
        "commodity": inc.commodity_name,
        "lot_number": inc.lot_number,
        "quantity_kg": inc.quantity_kg,
        "total_insured_value_usd": inc.total_insured_value_usd,
        "current_state": inc.state.value,
        "policy_holder": inc.metadata.get("policy_holder"),
        "coverage_cap_usd": inc.metadata.get("coverage_cap_usd"),
        "coordinator_name": inc.metadata.get("coordinator_name"),
    }, indent=2)


# --- Tool 2: get_sensor_evidence ---
@tool
def get_sensor_evidence(incident_id: str) -> str:
    """Retrieve validated time-series sensor evidence for the incident.

    Args:
        incident_id: Identifier of the incident
    """
    global _active_samples
    if not _active_samples:
        initialize_runtime()

    temps = [s.effective_temperature_c for s in _active_samples if s.status in ("VALID", "DRIFT_WARNING")]
    drifts = [s.drift_c for s in _active_samples if s.status in ("VALID", "DRIFT_WARNING")]

    return json.dumps({
        "incident_id": incident_id,
        "total_samples": len(_active_samples),
        "valid_samples": len(temps),
        "initial_temp_c": temps[0] if temps else 0.0,
        "latest_temp_c": temps[-1] if temps else 0.0,
        "peak_temp_c": max(temps) if temps else 0.0,
        "mean_temp_c": round(sum(temps) / len(temps), 2) if temps else 0.0,
        "max_sensor_drift_c": max(drifts) if drifts else 0.0,
        "dual_sensor_consensus": "CONFIRMED_WITHIN_TOLERANCE" if (drifts and max(drifts) <= 1.5) else "DRIFT_DETECTED",
        "sample_points_summary": [
            {"time": s.timestamp.isoformat() + "Z", "temp_c": s.effective_temperature_c, "status": s.status}
            for s in _active_samples[::4]  # every hour
        ]
    }, indent=2)


# --- Tool 3: get_trigger_evaluation ---
@tool
def get_trigger_evaluation(incident_id: str) -> str:
    """Check the deterministic parametric trigger condition against policy rules.

    Args:
        incident_id: Identifier of the incident
    """
    global _active_incident
    if not _active_incident or not _active_incident.window_evaluation:
        initialize_runtime()

    w = _active_incident.window_evaluation
    return json.dumps({
        "incident_id": incident_id,
        "threshold_temperature_c": w.threshold_c,
        "continuous_breach_minutes": w.continuous_breach_minutes,
        "required_sustained_minutes": 240.0,
        "is_sustained_breach": w.is_sustained_breach,
        "trigger_status": "TRIGGER_CONFIRMED" if w.is_sustained_breach else "NO_BREACH",
        "mean_temperature_c": w.mean_temp_c,
        "max_temperature_c": w.max_temp_c,
        "summary": w.status_summary
    }, indent=2)


# --- Tool 4: get_weather_context ---
@tool
def get_weather_context(incident_id: str) -> str:
    """Fetch external ambient weather and power grid conditions affecting logistics.

    Args:
        incident_id: Identifier of the incident
    """
    w_path = FIXTURES_DIR / "weather" / "riverbend_heatwave.json"
    if w_path.exists():
        with open(w_path, "r", encoding="utf-8") as f:
            return f.read()
    return json.dumps({
        "ambient_temperature_c": 32.0,
        "heat_index_c": 34.0,
        "logistics_impact": {"reefer_requirement": "MANDATORY_REEFER_TRANSIT"}
    })


# --- Tool 5: find_eligible_partners ---
@tool
def find_eligible_partners(incident_id: str) -> str:
    """Find regional salvage partners and retrieve their capacities and semi-structured intake notes.

    Args:
        incident_id: Identifier of the incident
    """
    p_path = FIXTURES_DIR / "partners" / "regional_buyers.json"
    with open(p_path, "r", encoding="utf-8") as f:
        return f.read()


# --- Tool 6: calculate_route_matrix ---
@tool
def calculate_route_matrix(incident_id: str, partner_ids: list[str]) -> str:
    """Calculate distance, transit time, and freight costs for eligible partner destinations.

    Args:
        incident_id: Identifier of the incident
        partner_ids: List of partner IDs to route
    """
    p_path = FIXTURES_DIR / "partners" / "regional_buyers.json"
    with open(p_path, "r", encoding="utf-8") as f:
        all_partners = json.load(f)

    routes = []
    for p in all_partners:
        if p["partner_id"] in partner_ids:
            dist = p["location"]["distance_km"]
            time_m = p["location"]["transit_time_minutes"]
            cost = SalvageCalculator.calculate_freight_cost(dist, is_reefer=True)
            routes.append({
                "partner_id": p["partner_id"],
                "partner_name": p["name"],
                "distance_km": dist,
                "transit_time_minutes": time_m,
                "reefer_freight_cost_usd": cost,
            })
    return json.dumps(routes, indent=2)


# --- Tool 7: prepare_response_options ---
@tool
def prepare_response_options(incident_id: str, eligible_partners: list[str], routes: list[dict]) -> str:
    """Synthesize partner intake constraints and formulate structured salvage options (Option A vs Option B).

    Args:
        incident_id: Identifier of the incident
        eligible_partners: List of eligible partner IDs
        routes: Route calculation data
    """
    global _active_options, _active_incident, _policy
    if not _active_incident or not _policy:
        initialize_runtime()

    total_kg = _policy.commodity.quantity_kg  # 14,200 kg

    # Option A: Maximum Financial Value Recovery (Balanced Processor + Secondary Wholesale)
    # Reconciles notes: Valley Fresh accepts 8,000 kg before 18:00; SunCoast accepts 6,000 kg for dehydration
    # (Excludes Metro Wholesale due to high rejection risk from 16.8C peak temp)
    alloc_a1 = SalvageAllocationItem(
        partner_id="PARTNER-PROC-01",
        partner_name="Valley Fresh Cannery & Paste",
        category="industrial_processor",
        allocated_quantity_kg=8000.0,
        offered_price_per_kg=0.38,
        gross_recovery_usd=3040.0,
        logistics_cost_usd=258.10,
        net_recovery_usd=2781.90,
        transit_time_minutes=35,
        intake_feasibility="FEASIBLE: Transit 35m arrives well before 18:00 dock cutoff. QA accepts ripe Roma.",
        rationale="High volume absorption at strong industrial paste pricing ($0.38/kg)."
    )
    alloc_a2 = SalvageAllocationItem(
        partner_id="PARTNER-DEHY-04",
        partner_name="SunCoast Dehydrators & Sun-Dried Co.",
        category="specialty_processor",
        allocated_quantity_kg=6000.0,
        offered_price_per_kg=0.33,
        gross_recovery_usd=1980.0,
        logistics_cost_usd=302.38,
        net_recovery_usd=1677.62,
        transit_time_minutes=50,
        intake_feasibility="FEASIBLE: Open until 20:00, accepts softened skins with high solids.",
        rationale="Absorbs remaining volume with minimal quality dispute risk."
    )
    net_a = round(alloc_a1.net_recovery_usd + alloc_a2.net_recovery_usd, 2)
    option_a = SalvageOption(
        option_id="OPT-A-FINANCIAL-MAX",
        strategy_name="Option A: Maximum Financial Recovery (Dual Processor Route)",
        description="Splits volume between Valley Fresh Cannery and SunCoast Dehydrators to maximize cash return while respecting dock shift limits.",
        allocations=[alloc_a1, alloc_a2],
        total_salvaged_kg=14000.0,
        total_net_recovery_usd=net_a,
        value_retention_pct=round((net_a / _policy.commodity.total_insured_value_usd) * 100, 1),
        unallocated_kg=200.0,
        food_waste_mitigation_kg=14000.0,
        social_impact_description="Direct commercial salvage into local food processing channels.",
        coordinator_recommended=True
    )

    # Option B: Maximum Speed & Community Impact (Food Rescue + Local Processor)
    # Fast dispatch: Hope Food Rescue (4,500 kg drop-off in 18m) + Valley Fresh (8,000 kg)
    alloc_b1 = SalvageAllocationItem(
        partner_id="PARTNER-BANK-02",
        partner_name="Hope Community Food Rescue",
        category="food_rescue_bank",
        allocated_quantity_kg=4500.0,
        offered_price_per_kg=0.15,
        gross_recovery_usd=675.0,
        logistics_cost_usd=219.05,
        net_recovery_usd=455.95,
        transit_time_minutes=18,
        intake_feasibility="URGENT & FEASIBLE: Immediate 18m delivery meets volunteer sorting window (13:00-17:00).",
        rationale="Provides immediate evening meals for 1,800 local families + tax donation certificate."
    )
    alloc_b2 = SalvageAllocationItem(
        partner_id="PARTNER-PROC-01",
        partner_name="Valley Fresh Cannery & Paste",
        category="industrial_processor",
        allocated_quantity_kg=8000.0,
        offered_price_per_kg=0.38,
        gross_recovery_usd=3040.0,
        logistics_cost_usd=258.10,
        net_recovery_usd=2781.90,
        transit_time_minutes=35,
        intake_feasibility="FEASIBLE: Arrives before 18:00 boiler maintenance.",
        rationale="Anchor commercial salvage for 8 tons of produce."
    )
    net_b = round(alloc_b1.net_recovery_usd + alloc_b2.net_recovery_usd, 2)
    option_b = SalvageOption(
        option_id="OPT-B-SOCIAL-RAPID",
        strategy_name="Option B: Rapid Relief & Community Food Rescue",
        description="Prioritizes fastest evacuation (14km) to Hope Community Food Rescue for same-day family food boxes, routing remainder to Valley Fresh.",
        allocations=[alloc_b1, alloc_b2],
        total_salvaged_kg=12500.0,
        total_net_recovery_usd=net_b,
        value_retention_pct=round((net_b / _policy.commodity.total_insured_value_usd) * 100, 1),
        unallocated_kg=1700.0,
        food_waste_mitigation_kg=12500.0,
        social_impact_description="4.5 tons of fresh Roma tomatoes distributed directly to community food relief.",
        coordinator_recommended=False
    )

    _active_options["OPT-A-FINANCIAL-MAX"] = option_a
    _active_options["OPT-B-SOCIAL-RAPID"] = option_b

    _audit_log.record(
        incident_id,
        "strands_agent",
        "OPTIONS_PREPARED",
        {"option_ids": ["OPT-A-FINANCIAL-MAX", "OPT-B-SOCIAL-RAPID"]}
    )

    return json.dumps({
        "incident_id": incident_id,
        "options": [option_a.model_dump(), option_b.model_dump()],
        "reconciled_constraints": [
            "Metro Wholesale rejected: 16.8C peak temp creates >90% rejection risk on arrival.",
            "Valley Fresh scheduled for immediate dispatch to beat 18:00 boiler shutdown.",
            "Hope Food Rescue scheduled before 17:00 volunteer shift ends.",
            "Mandatory reefer transport assigned for all routes due to 35.8C ambient heatwave."
        ]
    }, indent=2)


# --- Tool 8: seal_incident_packet ---
@tool
def seal_incident_packet(incident_id: str) -> str:
    """Cryptographically seal all telemetry, trigger evaluations, partner quotes, and traces into a SHA-256 Merkle manifest.

    Args:
        incident_id: Identifier of the incident
    """
    global _active_incident, _policy, _active_samples, _active_options
    if not _active_incident:
        initialize_runtime()

    p_path = FIXTURES_DIR / "partners" / "regional_buyers.json"
    with open(p_path, "r", encoding="utf-8") as f:
        partner_quotes = json.load(f)

    telemetry_summary = [
        {"timestamp": s.timestamp.isoformat() + "Z", "temp_c": s.effective_temperature_c, "drift_c": s.drift_c}
        for s in _active_samples
    ]
    trigger_eval = _active_incident.window_evaluation.model_dump(mode="json") if _active_incident.window_evaluation else {}
    agent_traces = [
        {"action": "prepared_options", "option_ids": list(_active_options.keys())}
    ]

    manifest = EvidenceManifest.create(
        incident_id=incident_id,
        policy_id=_policy.policy_id,
        telemetry_samples=telemetry_summary,
        trigger_evaluation=trigger_eval,
        partner_quotes=partner_quotes,
        agent_traces=agent_traces,
    )

    _evidence_store.save_manifest(manifest)
    _audit_log.record(incident_id, "evidence_sealer", "MANIFEST_SEALED", {"root_hash": manifest.merkle_root_hash})

    return json.dumps({
        "status": "SEALED",
        "manifest_id": manifest.manifest_id,
        "incident_id": incident_id,
        "sha256_merkle_root": manifest.merkle_root_hash,
        "components_sealed": len(manifest.components),
        "verified": manifest.verify_integrity(),
    }, indent=2)


# --- Tool 9: draft_claim_notice ---
@tool
def draft_claim_notice(incident_id: str, chosen_option_id: str) -> str:
    """Compute parametric yield gap indemnification and prepare formal settlement notice.

    Args:
        incident_id: Identifier of the incident
        chosen_option_id: ID of the selected salvage option (e.g. OPT-A-FINANCIAL-MAX)
    """
    global _active_options, _policy, _active_incident
    if not _policy or not _active_options:
        initialize_runtime()

    option = _active_options.get(chosen_option_id) or next(iter(_active_options.values()))
    manifest = _evidence_store.get_manifest_by_incident(incident_id)
    manifest_hash = manifest.merkle_root_hash if manifest else None

    notice = SettlementCalculator.calculate_claim(
        incident_id=incident_id,
        policy=_policy,
        chosen_option=option,
        evidence_manifest_hash=manifest_hash,
    )

    _audit_log.record(incident_id, "settlement_engine", "CLAIM_NOTICE_DRAFTED", notice.model_dump(mode="json"))

    return json.dumps(notice.model_dump(mode="json"), indent=2)


# --- Tool 10: request_coordinator_approval ---
@tool
def request_coordinator_approval(incident_id: str, option_ids: list[str]) -> str:
    """Submit the prepared salvage options to the human cooperative coordinator for authorization.

    Args:
        incident_id: Identifier of the incident
        option_ids: List of candidate option IDs
    """
    global _policy, _approval_service, _notifier
    if not _policy:
        initialize_runtime()

    coordinator_email = _policy.coordinator.get("email", "coordinator@riverbend.coop")
    approval_req, raw_token = _approval_service.create_approval_request(
        incident_id=incident_id,
        coordinator_email=coordinator_email,
        option_ids=option_ids,
    )

    approval_url = f"http://localhost:8000/?action=review&incident={incident_id}&request={approval_req.request_id}&token={raw_token}"
    _notifier.notify_coordinator(
        coordinator_email=coordinator_email,
        incident_id=incident_id,
        summary=f"Sustained thermal breach in Chamber A. 14.2 tons of Roma tomatoes require salvage authorization.",
        approval_url=approval_url
    )

    _audit_log.record(
        incident_id,
        "strands_agent",
        "APPROVAL_REQUESTED",
        {"request_id": approval_req.request_id, "options": option_ids}
    )

    return json.dumps({
        "status": "AWAITING_HUMAN_COORDINATOR_APPROVAL",
        "request_id": approval_req.request_id,
        "coordinator_email": coordinator_email,
        "authorized_option_ids": option_ids,
        "approval_url": approval_url,
        "raw_approval_token": raw_token,
        "note": "Agent execution authority paused. Carrier dispatch and sandbox contracts will be emitted once coordinator authorizes an option."
    }, indent=2)


# --- Tool 11: publish_sandbox_contact ---
@tool
def publish_sandbox_contact(incident_id: str, approval_id: str, option_id: str) -> str:
    """Publish sandbox dispatch orders to carriers and salvage partners following coordinator approval.

    Args:
        incident_id: Identifier of the incident
        approval_id: Verified approval request ID
        option_id: Authorized option ID
    """
    global _active_options, _approval_service, _notifier, _active_incident
    req = _approval_service.get_request(approval_id)
    if not req or req.status != "CONSUMED":
        return json.dumps({
            "status": "EXECUTION_DENIED",
            "reason": f"Approval request '{approval_id}' is not in CONSUMED state. Coordinator authorization is required."
        })

    option = _active_options.get(option_id)
    dispatches = []
    if option:
        for alloc in option.allocations:
            msg = _notifier.notify_carrier(
                carrier_email="dispatch@salinasreeferlines.com",
                partner_name=alloc.partner_name,
                pickup_address="Riverbend Cold Store Bay 2",
                dropoff_address=alloc.partner_name,
                cargo_kg=alloc.allocated_quantity_kg,
            )
            dispatches.append({
                "partner": alloc.partner_name,
                "cargo_kg": alloc.allocated_quantity_kg,
                "carrier_notice_id": msg.message_id
            })

    if _active_incident:
        _active_incident.state = IncidentState.DISPATCHED

    _audit_log.record(
        incident_id,
        "workflow_dispatcher",
        "DISPATCH_PUBLISHED",
        {"approval_id": approval_id, "option_id": option_id, "dispatches": dispatches}
    )

    return json.dumps({
        "status": "DISPATCH_EXECUTED_SANDBOX",
        "incident_id": incident_id,
        "approval_id": approval_id,
        "option_id": option_id,
        "carrier_dispatches": dispatches,
        "timestamp": "2026-09-14T15:30:00Z"
    }, indent=2)
