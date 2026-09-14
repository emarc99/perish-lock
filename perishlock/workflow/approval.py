"""Cryptographic human-in-the-loop approval token management and replay prevention."""

import hmac
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


class ApprovalRequest(BaseModel):
    request_id: str
    incident_id: str
    coordinator_email: str
    option_ids: list[str]
    created_at: datetime
    expires_at: datetime
    token_hash: str
    status: Literal["PENDING", "CONSUMED", "EXPIRED", "REVOKED"] = "PENDING"
    consumed_at: Optional[datetime] = None
    selected_option_id: Optional[str] = None
    coordinator_notes: Optional[str] = None


class ApprovalService:
    """Manages secure, single-use approval tokens for human coordinator authorization."""

    def __init__(self, secret_key: Optional[str] = None, token_ttl_minutes: int = 120):
        self._secret_key = (secret_key or secrets.token_hex(32)).encode("utf-8")
        self.token_ttl_minutes = token_ttl_minutes
        self._requests: Dict[str, ApprovalRequest] = {}
        self._raw_tokens: Dict[str, str] = {}  # request_id -> raw token (in memory)

    def create_approval_request(
        self,
        incident_id: str,
        coordinator_email: str,
        option_ids: list[str],
    ) -> tuple[ApprovalRequest, str]:
        """Create a new approval request and return the request object with the unhashed token."""
        request_id = f"APPR-{incident_id}-{secrets.token_hex(4)}"
        raw_token = secrets.token_urlsafe(32)
        token_hash = self._hash_token(raw_token)

        now = datetime.utcnow()
        expires_at = now + timedelta(minutes=self.token_ttl_minutes)

        req = ApprovalRequest(
            request_id=request_id,
            incident_id=incident_id,
            coordinator_email=coordinator_email,
            option_ids=option_ids,
            created_at=now,
            expires_at=expires_at,
            token_hash=token_hash,
            status="PENDING",
        )
        self._requests[request_id] = req
        self._raw_tokens[request_id] = raw_token
        return req, raw_token

    def verify_and_consume(
        self,
        request_id: str,
        raw_token: str,
        selected_option_id: str,
        coordinator_notes: Optional[str] = None,
    ) -> tuple[bool, str]:
        """
        Verify token and consume it.
        Enforces:
        - Must exist
        - Must not be consumed (anti-replay)
        - Must not be expired
        - Token hash must match
        - Option must be valid
        """
        req = self._requests.get(request_id)
        if not req:
            return False, f"Approval request {request_id} not found."

        if req.status == "CONSUMED":
            return False, f"SECURITY ALERT: Approval token for {request_id} has ALREADY been consumed (replay attempt blocked)."

        if req.status != "PENDING":
            return False, f"Approval request {request_id} is in status '{req.status}' and cannot be approved."

        if datetime.utcnow() > req.expires_at:
            req.status = "EXPIRED"
            return False, f"Approval request {request_id} has expired."

        provided_hash = self._hash_token(raw_token)
        if not hmac.compare_digest(provided_hash, req.token_hash):
            return False, f"SECURITY ALERT: Invalid approval token provided for {request_id} (tampering detected)."

        if selected_option_id not in req.option_ids:
            return False, f"Selected option '{selected_option_id}' is not among authorized options: {req.option_ids}."

        # Mark as consumed
        req.status = "CONSUMED"
        req.consumed_at = datetime.utcnow()
        req.selected_option_id = selected_option_id
        req.coordinator_notes = coordinator_notes

        return True, f"Approval confirmed: Option '{selected_option_id}' authorized by {req.coordinator_email}."

    def get_request(self, request_id: str) -> Optional[ApprovalRequest]:
        return self._requests.get(request_id)

    def _hash_token(self, token: str) -> str:
        return hmac.new(self._secret_key, token.encode("utf-8"), hashlib.sha256).hexdigest()
