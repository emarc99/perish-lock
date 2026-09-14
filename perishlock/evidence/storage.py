"""Evidence packet storage interface."""

import json
from pathlib import Path
from typing import Optional, Dict, Any
from perishlock.evidence.manifest import EvidenceManifest


class EvidenceStore:
    """Manages persistence of sealed evidence packets to local storage or simulated S3."""

    def __init__(self, storage_dir: str | Path = "./evidence_vault"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self._memory_cache: Dict[str, EvidenceManifest] = {}

    def save_manifest(self, manifest: EvidenceManifest) -> Path:
        self._memory_cache[manifest.incident_id] = manifest
        file_path = self.storage_dir / f"{manifest.manifest_id}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(manifest.model_dump_json(indent=2))
        return file_path

    def get_manifest_by_incident(self, incident_id: str) -> Optional[EvidenceManifest]:
        if incident_id in self._memory_cache:
            return self._memory_cache[incident_id]

        for p in self.storage_dir.glob("*.json"):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if data.get("incident_id") == incident_id:
                        manifest = EvidenceManifest(**data)
                        self._memory_cache[incident_id] = manifest
                        return manifest
            except Exception:
                continue
        return None
