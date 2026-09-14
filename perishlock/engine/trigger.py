"""Deterministic incident trigger state machine."""

from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from perishlock.telemetry.models import WindowEvaluation
from perishlock.engine.policy import PolicyModel


class IncidentState(str, Enum):
    HEALTHY = "HEALTHY"
    AT_RISK = "AT_RISK"
    BREACHED = "BREACHED"
    SALVAGE_ANALYSIS = "SALVAGE_ANALYSIS"
    PENDING_COORDINATOR_APPROVAL = "PENDING_COORDINATOR_APPROVAL"
    DISPATCHED = "DISPATCHED"
    CLAIM_FILED = "CLAIM_FILED"
    REJECTED_TRANSITORY = "REJECTED_TRANSITORY"


class IncidentScope(BaseModel):
    incident_id: str
    policy_id: str
    chamber_id: str
    commodity_name: str
    lot_number: str
    quantity_kg: float
    total_insured_value_usd: float
    state: IncidentState
    created_at: datetime
    breached_at: Optional[datetime] = None
    window_evaluation: Optional[WindowEvaluation] = None
    trigger_summary: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class IncidentEngine:
    """Evaluates telemetry windows against policy parameters to manage incident lifecycle."""

    def __init__(self, policy: PolicyModel):
        self.policy = policy
        self._incidents: Dict[str, IncidentScope] = {}

    def evaluate(self, window_eval: WindowEvaluation) -> IncidentScope:
        """Evaluate a window and create or transition incident state."""
        incident_id = f"INC-{self.policy.policy_id}-{window_eval.window_end.strftime('%Y%m%d%H%M')}"

        if window_eval.is_sustained_breach:
            state = IncidentState.BREACHED
            summary = (
                f"Sustained breach confirmed: {window_eval.continuous_breach_minutes:.1f} mins "
                f"at avg {window_eval.mean_temp_c}C exceeding threshold {self.policy.parametric_trigger.threshold_value}C."
            )
            breached_at = window_eval.window_end
        elif window_eval.continuous_breach_minutes > 0:
            state = IncidentState.AT_RISK
            summary = (
                f"Elevated temperature observed ({window_eval.continuous_breach_minutes:.1f} mins), "
                f"below required sustained trigger window of {self.policy.parametric_trigger.sustained_duration_minutes} mins."
            )
            breached_at = None
        else:
            state = IncidentState.HEALTHY
            summary = "Chamber operating within optimal thermal parameters."
            breached_at = None

        incident = IncidentScope(
            incident_id=incident_id,
            policy_id=self.policy.policy_id,
            chamber_id=self.policy.chamber_id,
            commodity_name=self.policy.commodity.name,
            lot_number=self.policy.commodity.lot_number,
            quantity_kg=self.policy.commodity.quantity_kg,
            total_insured_value_usd=self.policy.commodity.total_insured_value_usd,
            state=state,
            created_at=datetime.utcnow(),
            breached_at=breached_at,
            window_evaluation=window_eval,
            trigger_summary=summary,
            metadata={
                "policy_holder": self.policy.policy_holder,
                "coverage_cap_usd": self.policy.parametric_trigger.coverage_cap_usd,
                "coordinator_name": self.policy.coordinator.get("name"),
            }
        )
        self._incidents[incident_id] = incident
        return incident

    def get_incident(self, incident_id: str) -> Optional[IncidentScope]:
        return self._incidents.get(incident_id)
