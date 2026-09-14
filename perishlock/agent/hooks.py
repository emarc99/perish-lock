"""Deterministic lifecycle hooks for the PerishLock Strands agent."""

from strands.hooks import (
    HookProvider,
    HookRegistry,
    BeforeInvocationEvent,
    BeforeToolCallEvent,
    AfterToolCallEvent,
)


class RateLimiterHook(HookProvider):
    """Prevents runaway tool loops by enforcing a strict maximum call limit per turn."""

    def __init__(self, max_calls_per_turn: int = 15):
        self.max_calls_per_turn = max_calls_per_turn
        self.tool_counts: dict[str, int] = {}

    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(BeforeInvocationEvent, self.reset_counts)
        registry.add_callback(BeforeToolCallEvent, self.check_limit)

    def reset_counts(self, event: BeforeInvocationEvent) -> None:
        self.tool_counts = {}

    def check_limit(self, event: BeforeToolCallEvent) -> None:
        tool_name = event.tool_use.get("name", "unknown")
        count = self.tool_counts.get(tool_name, 0) + 1
        self.tool_counts[tool_name] = count

        if count > self.max_calls_per_turn:
            event.cancel_tool = (
                f"SAFETY INTERCEPT: Tool '{tool_name}' exceeded maximum invocation limit "
                f"({self.max_calls_per_turn} calls per turn). Operation halted to prevent looping."
            )


class ColdRoomSafetyHook(HookProvider):
    """Enforces physical safety constraints and prevents premature dispatch without authorization."""

    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(BeforeToolCallEvent, self.verify_safety_constraints)

    def verify_safety_constraints(self, event: BeforeToolCallEvent) -> None:
        tool_name = event.tool_use.get("name", "")
        tool_input = event.tool_use.get("input", {})

        # Safety rule: publish_sandbox_contact requires explicit approval_id
        if tool_name == "publish_sandbox_contact":
            approval_id = tool_input.get("approval_id")
            if not approval_id or approval_id == "UNAPPROVED" or "draft" in str(approval_id).lower():
                event.cancel_tool = (
                    "CRITICAL SAFETY INTERCEPT: Cannot call publish_sandbox_contact without a valid "
                    "coordinator approval_id. You must first call request_coordinator_approval."
                )
