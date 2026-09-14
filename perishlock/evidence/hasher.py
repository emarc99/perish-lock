"""Cryptographic hashing utilities for canonical deterministic evidence manifests."""

import hashlib
import json
from typing import Any, Dict


def canonical_json_bytes(data: Any) -> bytes:
    """Serialize any JSON-compatible structure into deterministic, sorted canonical bytes."""
    return json.dumps(
        data,
        sort_keys=True,
        ensure_ascii=True,
        separators=(",", ":"),
        default=str,
    ).encode("utf-8")


def sha256_digest(data: Any) -> str:
    """Generate SHA-256 hex digest for arbitrary data."""
    if isinstance(data, (bytes, bytearray)):
        b = data
    elif isinstance(data, str):
        b = data.encode("utf-8")
    else:
        b = canonical_json_bytes(data)
    return hashlib.sha256(b).hexdigest()
