"""Append-only audit logging system for verifiable governance."""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from perishlock.evidence.hasher import sha256_digest


class AuditEntry(BaseModel):
    entry_id: str
    incident_id: str
    timestamp: datetime
    actor: str  # e.g. "sensor_monitor", "strands_agent", "coordinator:amara", "settlement_engine"
    action: str
    payload_summary: str
    payload_hash: str
    previous_entry_hash: Optional[str] = None
    signature: Optional[str] = None


class AuditLog:
    """Verifiable hash-chained audit logger."""

    def __init__(self, log_dir: str | Path = "./audit_ledger"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.log_file = self.log_dir / "events.jsonl"
        self._entries: list[AuditEntry] = []
        self._last_hash = "0" * 64
        self._load_existing()

    def record(self, incident_id: str, actor: str, action: str, payload: Any) -> AuditEntry:
        payload_hash = sha256_digest(payload)
        now = datetime.utcnow()
        entry_id = f"AUD-{len(self._entries) + 1:06d}"

        entry = AuditEntry(
            entry_id=entry_id,
            incident_id=incident_id,
            timestamp=now,
            actor=actor,
            action=action,
            payload_summary=str(payload)[:120],
            payload_hash=payload_hash,
            previous_entry_hash=self._last_hash,
        )

        entry_hash = sha256_digest(entry.model_dump(mode="json"))
        entry.signature = entry_hash
        self._last_hash = entry_hash
        self._entries.append(entry)

        with open(self.log_file, "a", encoding="utf-8") as f:
            f.write(entry.model_dump_json() + "\n")

        return entry

    def get_incident_entries(self, incident_id: str) -> list[AuditEntry]:
        return [e for e in self._entries if e.incident_id == incident_id]

    def _load_existing(self):
        if not self.log_file.exists():
            return
        try:
            with open(self.log_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line:
                        entry = AuditEntry(**json.loads(line))
                        self._entries.append(entry)
                        self._last_hash = entry.signature or sha256_digest(entry.model_dump(mode="json"))
        except Exception:
            pass
