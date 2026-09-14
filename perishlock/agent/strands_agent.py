"""AWS Strands Agent factory for PerishLock."""

import os
import json
from pathlib import Path
from typing import Optional, List, Dict, Any

from strands import Agent, AgentSkills
from strands.models import BedrockModel

from perishlock.agent.prompts import PERISHLOCK_SYSTEM_PROMPT
from perishlock.agent.hooks import RateLimiterHook, ColdRoomSafetyHook
from perishlock.agent.steering import DispatchApprovalSteeringHandler, ToneGuardrailHandler
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
)

SKILLS_DIR = Path(__file__).parent / "skills"

PERISHLOCK_TOOLS = [
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
]


def create_perishlock_agent(
    model_id: str = "amazon.nova-pro-v1:0",
    use_bedrock: Optional[bool] = None,
    callback_handler: Any = "default",
) -> Agent:
    """Create and configure a production AWS Strands Agent for PerishLock."""
    try:
        import boto3
        has_aws_env = bool(boto3.Session().get_credentials())
    except Exception:
        has_aws_env = bool(os.environ.get("AWS_ACCESS_KEY_ID") or os.environ.get("AWS_PROFILE"))
    should_use_bedrock = use_bedrock if use_bedrock is not None else has_aws_env

    plugins = [
        AgentSkills(skills=[str(SKILLS_DIR)]),
        DispatchApprovalSteeringHandler(),
        ToneGuardrailHandler(),
    ]
    hooks = [
        RateLimiterHook(max_calls_per_turn=25),
        ColdRoomSafetyHook(),
    ]

    kwargs: Dict[str, Any] = {
        "tools": PERISHLOCK_TOOLS,
        "plugins": plugins,
        "hooks": hooks,
        "system_prompt": PERISHLOCK_SYSTEM_PROMPT,
    }
    if callback_handler != "default":
        kwargs["callback_handler"] = callback_handler

    if should_use_bedrock:
        try:
            kwargs["model"] = BedrockModel(model_id=model_id)
        except Exception:
            pass

    return Agent(**kwargs)


class DeterministicTrajectoryRunner:
    """Zero-credential judge runner that deterministically executes the canonical PerishLock tool workflow."""

    def __init__(self, incident_id: str = "INC-POL-RB-TOM-2026-001"):
        self.incident_id = incident_id
        self.execution_log: List[Dict[str, Any]] = []

    def run_speedrun(self) -> Dict[str, Any]:
        """Execute the canonical 8-step cognitive salvage workflow."""
        steps = []

        # Step 1: load scope
        s1 = json.loads(load_incident_scope(self.incident_id))
        steps.append({"step": "load_incident_scope", "status": "success", "data": s1})

        # Step 2: sensor evidence
        s2 = json.loads(get_sensor_evidence(self.incident_id))
        steps.append({"step": "get_sensor_evidence", "status": "success", "data": s2})

        # Step 3: trigger evaluation
        s3 = json.loads(get_trigger_evaluation(self.incident_id))
        steps.append({"step": "get_trigger_evaluation", "status": "success", "data": s3})

        # Step 4: weather context
        s4 = json.loads(get_weather_context(self.incident_id))
        steps.append({"step": "get_weather_context", "status": "success", "data": s4})

        # Step 5: find partners & route matrix
        partners_raw = json.loads(find_eligible_partners(self.incident_id))
        partner_ids = [p["partner_id"] for p in partners_raw]
        routes = json.loads(calculate_route_matrix(self.incident_id, partner_ids))
        steps.append({"step": "find_eligible_partners", "status": "success", "count": len(partners_raw)})
        steps.append({"step": "calculate_route_matrix", "status": "success", "routes": routes})

        # Step 6: prepare response options
        options_result = json.loads(prepare_response_options(self.incident_id, partner_ids, routes))
        steps.append({"step": "prepare_response_options", "status": "success", "options": options_result["options"]})

        # Step 7: seal incident packet
        sealed = json.loads(seal_incident_packet(self.incident_id))
        steps.append({"step": "seal_incident_packet", "status": "success", "manifest": sealed})

        # Step 8: draft claim notice
        claim = json.loads(draft_claim_notice(self.incident_id, "OPT-A-FINANCIAL-MAX"))
        steps.append({"step": "draft_claim_notice", "status": "success", "claim": claim})

        # Step 9: request coordinator approval
        approval = json.loads(request_coordinator_approval(self.incident_id, ["OPT-A-FINANCIAL-MAX", "OPT-B-SOCIAL-RAPID"]))
        steps.append({"step": "request_coordinator_approval", "status": "success", "approval": approval})

        self.execution_log = steps
        return {
            "incident_id": self.incident_id,
            "steps_executed": len(steps),
            "manifest_hash": sealed["sha256_merkle_root"],
            "options": options_result["options"],
            "settlement_claim": claim,
            "approval_status": approval["status"],
            "approval_request_id": approval["request_id"],
            "raw_approval_token": approval["raw_approval_token"],
            "approval_url": approval["approval_url"],
            "steps": steps,
        }
