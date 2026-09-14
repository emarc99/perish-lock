"""FastAPI REST API routes for PerishLock Mission Control."""

import json
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from perishlock.agent.tools import (
    load_incident_scope,
    get_sensor_evidence,
    get_trigger_evaluation,
    get_weather_context,
    find_eligible_partners,
    calculate_route_matrix,
    prepare_response_options,
    seal_incident_packet,
    draft_claim_notice,
    request_coordinator_approval,
    publish_sandbox_contact,
    initialize_runtime,
    _active_incident,
    _active_samples,
    _active_options,
    _approval_service,
    _evidence_store,
    _audit_log,
)
from perishlock.agent.strands_agent import DeterministicTrajectoryRunner
from perishlock.workflow.approval import ApprovalRequest

router = APIRouter(prefix="/api")


class ApprovalSubmission(BaseModel):
    request_id: str
    token: str
    selected_option_id: str
    coordinator_notes: Optional[str] = None


@router.get("/status")
def get_system_status():
    """Get current cold-room operational status and active incident summary."""
    global _active_incident, _active_samples
    if not _active_incident:
        initialize_runtime()

    temps = [s.effective_temperature_c for s in _active_samples if s.status in ("VALID", "DRIFT_WARNING")]
    latest_temp = temps[-1] if temps else 0.0
    peak_temp = max(temps) if temps else 0.0

    return {
        "status": "ONLINE",
        "chamber_id": _active_incident.chamber_id,
        "active_incident_id": _active_incident.incident_id,
        "incident_state": _active_incident.state.value,
        "latest_temperature_c": latest_temp,
        "peak_temperature_c": peak_temp,
        "target_temperature_range": "10.0 - 12.5 C",
        "commodity": _active_incident.commodity_name,
        "quantity_kg": _active_incident.quantity_kg,
        "lot_number": _active_incident.lot_number,
        "insured_value_usd": _active_incident.total_insured_value_usd,
        "sample_count": len(_active_samples),
    }


@router.get("/telemetry")
def get_telemetry_series():
    """Return time-series telemetry data points for charting."""
    global _active_samples
    if not _active_samples:
        initialize_runtime()

    return [
        {
            "timestamp": s.timestamp.isoformat() + "Z",
            "temperature_c": s.effective_temperature_c,
            "humidity_pct": s.effective_humidity_pct,
            "drift_c": s.drift_c,
            "status": s.status,
        }
        for s in _active_samples
    ]


@router.get("/incident")
def get_incident_details(incident_id: Optional[str] = None):
    """Get detailed scope and trigger evaluation for the active incident."""
    inc_id = incident_id or (_active_incident.incident_id if _active_incident else "INC-POL-RB-TOM-2026-001")
    scope = json.loads(load_incident_scope(inc_id))
    evidence = json.loads(get_sensor_evidence(inc_id))
    trigger = json.loads(get_trigger_evaluation(inc_id))
    weather = json.loads(get_weather_context(inc_id))
    return {
        "scope": scope,
        "evidence": evidence,
        "trigger": trigger,
        "weather": weather,
    }


@router.get("/salvage-options")
def get_salvage_options(incident_id: Optional[str] = None):
    """Retrieve or compute the two contrasting salvage options."""
    global _active_options, _active_incident
    inc_id = incident_id or (_active_incident.incident_id if _active_incident else "INC-POL-RB-TOM-2026-001")

    if not _active_options:
        # Run preparation
        partners = json.loads(find_eligible_partners(inc_id))
        partner_ids = [p["partner_id"] for p in partners]
        routes = json.loads(calculate_route_matrix(inc_id, partner_ids))
        opts_raw = json.loads(prepare_response_options(inc_id, partner_ids, routes))
        return opts_raw

    return {
        "incident_id": inc_id,
        "options": [opt.model_dump() for opt in _active_options.values()],
    }


@router.post("/run-agent")
def run_agent_workflow(incident_id: Optional[str] = None):
    """Trigger the Strands agent cognitive reasoning speedrun."""
    inc_id = incident_id or (_active_incident.incident_id if _active_incident else "INC-POL-RB-TOM-2026-001")
    runner = DeterministicTrajectoryRunner(inc_id)
    result = runner.run_speedrun()
    return result


@router.get("/evidence-manifest")
def get_evidence_manifest(incident_id: Optional[str] = None):
    """Retrieve the sealed SHA-256 Merkle evidence manifest."""
    inc_id = incident_id or (_active_incident.incident_id if _active_incident else "INC-POL-RB-TOM-2026-001")
    manifest = _evidence_store.get_manifest_by_incident(inc_id)
    if not manifest:
        # Seal packet if not yet sealed
        seal_incident_packet(inc_id)
        manifest = _evidence_store.get_manifest_by_incident(inc_id)

    if not manifest:
        raise HTTPException(status_code=404, detail="Evidence manifest not found.")

    return {
        "manifest": manifest.model_dump(),
        "integrity_verified": manifest.verify_integrity(),
    }


@router.get("/settlement")
def get_settlement_draft(incident_id: Optional[str] = None, option_id: str = "OPT-A-FINANCIAL-MAX"):
    """Get the draft parametric settlement notice."""
    inc_id = incident_id or (_active_incident.incident_id if _active_incident else "INC-POL-RB-TOM-2026-001")
    notice_str = draft_claim_notice(inc_id, option_id)
    return json.loads(notice_str)


@router.get("/approval-status/{request_id}")
def check_approval_status(request_id: str):
    """Check status of an approval request."""
    req = _approval_service.get_request(request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Approval request not found.")
    return req.model_dump()


@router.post("/authorize")
def authorize_salvage(submission: ApprovalSubmission):
    """Human Coordinator Authorizes an Option using single-use cryptographic token."""
    verified, msg = _approval_service.verify_and_consume(
        request_id=submission.request_id,
        raw_token=submission.token,
        selected_option_id=submission.selected_option_id,
        coordinator_notes=submission.coordinator_notes,
    )
    if not verified:
        raise HTTPException(status_code=400, detail=msg)

    # Now execute dispatch
    req = _approval_service.get_request(submission.request_id)
    dispatch_res = json.loads(
        publish_sandbox_contact(
            incident_id=req.incident_id,
            approval_id=submission.request_id,
            option_id=submission.selected_option_id,
        )
    )

    return {
        "success": True,
        "message": msg,
        "approval_request": req.model_dump(),
        "dispatch_result": dispatch_res,
    }


@router.get("/audit-log")
def get_audit_trail(incident_id: Optional[str] = None):
    """Get chronological verifiable audit ledger."""
    inc_id = incident_id or (_active_incident.incident_id if _active_incident else "INC-POL-RB-TOM-2026-001")
    entries = _audit_log.get_incident_entries(inc_id)
    return [e.model_dump() for e in entries]
