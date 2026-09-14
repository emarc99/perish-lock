"""Immutable Evidence Manifest and Merkle packet verification."""

from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from perishlock.evidence.hasher import sha256_digest, canonical_json_bytes


class EvidenceComponent(BaseModel):
    name: str
    item_count: int
    sha256_hash: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class EvidenceManifest(BaseModel):
    manifest_id: str
    incident_id: str
    policy_id: str
    created_at: datetime
    telemetry_hash: str
    trigger_eval_hash: str
    partner_intake_hash: str
    agent_trace_hash: str
    merkle_root_hash: str
    components: List[EvidenceComponent]
    sealed_by: str = "perishlock.evidence.sealer.v1"

    @classmethod
    def create(
        cls,
        incident_id: str,
        policy_id: str,
        telemetry_samples: List[Dict[str, Any]],
        trigger_evaluation: Dict[str, Any],
        partner_quotes: List[Dict[str, Any]],
        agent_traces: List[Dict[str, Any]],
    ) -> "EvidenceManifest":
        t_hash = sha256_digest(telemetry_samples)
        tr_hash = sha256_digest(trigger_evaluation)
        p_hash = sha256_digest(partner_quotes)
        a_hash = sha256_digest(agent_traces)

        # Compute combined Merkle root hash
        combined_payload = {
            "telemetry_hash": t_hash,
            "trigger_eval_hash": tr_hash,
            "partner_intake_hash": p_hash,
            "agent_trace_hash": a_hash,
            "incident_id": incident_id,
            "policy_id": policy_id,
        }
        root_hash = sha256_digest(combined_payload)

        components = [
            EvidenceComponent(name="telemetry_timeseries", item_count=len(telemetry_samples), sha256_hash=t_hash),
            EvidenceComponent(name="trigger_evaluation", item_count=1, sha256_hash=tr_hash),
            EvidenceComponent(name="partner_intake_and_notes", item_count=len(partner_quotes), sha256_hash=p_hash),
            EvidenceComponent(name="agent_reasoning_trace", item_count=len(agent_traces), sha256_hash=a_hash),
        ]

        manifest_id = f"MAN-{incident_id}-{root_hash[:8]}"

        return cls(
            manifest_id=manifest_id,
            incident_id=incident_id,
            policy_id=policy_id,
            created_at=datetime.utcnow(),
            telemetry_hash=t_hash,
            trigger_eval_hash=tr_hash,
            partner_intake_hash=p_hash,
            agent_trace_hash=a_hash,
            merkle_root_hash=root_hash,
            components=components,
        )

    def verify_integrity(self) -> bool:
        """Verify that the components recompute to the exact merkle_root_hash."""
        combined_payload = {
            "telemetry_hash": self.telemetry_hash,
            "trigger_eval_hash": self.trigger_eval_hash,
            "partner_intake_hash": self.partner_intake_hash,
            "agent_trace_hash": self.agent_trace_hash,
            "incident_id": self.incident_id,
            "policy_id": self.policy_id,
        }
        expected_root = sha256_digest(combined_payload)
        return expected_root == self.merkle_root_hash
