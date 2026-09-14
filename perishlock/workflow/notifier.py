"""Notification dispatcher for coordinator and carrier alerts."""

from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel


class NotificationMessage(BaseModel):
    message_id: str
    recipient: str
    channel: str  # "SMS", "EMAIL", "WEBHOOK"
    subject: str
    body: str
    timestamp: datetime
    sent: bool = True


class NotificationDispatcher:
    """Dispatches notifications and logs sandbox communications."""

    def __init__(self):
        self.sent_messages: list[NotificationMessage] = []

    def notify_coordinator(
        self,
        coordinator_email: str,
        incident_id: str,
        summary: str,
        approval_url: str,
    ) -> NotificationMessage:
        msg = NotificationMessage(
            message_id=f"NOTIF-{len(self.sent_messages) + 1:04d}",
            recipient=coordinator_email,
            channel="EMAIL",
            subject=f"[CRITICAL ACTION REQUIRED] Cold Chain Breach - Incident {incident_id}",
            body=(
                f"ALERT: Community Cold Chamber A sustained breach detected.\n"
                f"{summary}\n\n"
                f"Autonomous salvage options prepared. Review and authorize salvage dispatch immediately:\n"
                f"{approval_url}"
            ),
            timestamp=datetime.utcnow(),
            sent=True,
        )
        self.sent_messages.append(msg)
        return msg

    def notify_carrier(
        self,
        carrier_email: str,
        partner_name: str,
        pickup_address: str,
        dropoff_address: str,
        cargo_kg: float,
    ) -> NotificationMessage:
        msg = NotificationMessage(
            message_id=f"NOTIF-{len(self.sent_messages) + 1:04d}",
            recipient=carrier_email,
            channel="SMS",
            subject="Reefer Dispatch Order Authorized",
            body=(
                f"DISPATCH ORDER: Pickup {cargo_kg:.0f} kg fresh tomatoes at {pickup_address}. "
                f"Deliver to {partner_name} ({dropoff_address}). Reefer setpoint: 11.5C."
            ),
            timestamp=datetime.utcnow(),
            sent=True,
        )
        self.sent_messages.append(msg)
        return msg
