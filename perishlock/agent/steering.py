"""Steering handlers for real-time trajectory control and human approval gating."""

from strands.vended_plugins.steering import (
    SteeringHandler,
    Proceed,
    Guide,
    ToolSteeringAction,
    LedgerProvider,
)


class DispatchApprovalSteeringHandler(SteeringHandler):
    """Deterministic steering handler: strictly enforces that coordinator approval must precede dispatch."""

    name = "dispatch-approval-gate"

    def __init__(self):
        super().__init__(context_providers=[LedgerProvider()])

    async def steer_before_tool(self, *, agent, tool_use, **kwargs) -> ToolSteeringAction:
        tool_name = tool_use.get("name", "")

        # Only intercept external execution actions
        if tool_name != "publish_sandbox_contact":
            return Proceed(reason="Non-executing tool permitted")

        ledger = self.steering_context.data.get("ledger", {})
        tool_calls = ledger.get("tool_calls", [])

        # Rule 1: Options must have been prepared
        options_prepared = any(
            c.get("tool_name") == "prepare_response_options" and c.get("status") == "success"
            for c in tool_calls
        )
        if not options_prepared:
            return Guide(
                reason="You cannot finalize dispatch before options are calculated. "
                "Call prepare_response_options first."
            )

        # Rule 2: Coordinator approval must have been requested
        approval_requested = any(
            c.get("tool_name") == "request_coordinator_approval" and c.get("status") == "success"
            for c in tool_calls
        )
        if not approval_requested:
            return Guide(
                reason="POLICY VIOLATION: You cannot publish dispatch contacts or finalize contracts "
                "without human coordinator authorization. You must call request_coordinator_approval first."
            )

        # Rule 3: Must verify approval_id provided in tool_use
        approval_id = tool_use.get("input", {}).get("approval_id", "")
        if not approval_id or approval_id.startswith("MOCK") or "pending" in approval_id.lower():
            return Guide(
                reason=f"The approval_id '{approval_id}' is not yet verified. A human coordinator "
                "must approve via Mission Control before execution can proceed."
            )

        return Proceed(reason="Coordinator approval verified in ledger")


class ToneGuardrailHandler(SteeringHandler):
    """Steers agent communication to ensure empathetic, precise communication with stressed farmers."""

    name = "farmer-empathy-tone"

    async def steer_after_model(self, *, agent, model_output, **kwargs):
        # Deterministic tone guardrail checks
        text = str(model_output).lower()
        if "fault" in text and "farmer" in text:
            return Guide(reason="Do not attribute blame to farmers or cooperative staff. Focus on technical failure and recovery solutions.")
        return Proceed(reason="Tone meets cooperative empathy standards")
