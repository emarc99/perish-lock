"""Amazon Bedrock AgentCore Memory Client for PerishLock.

Connects the AWS Strands Agent to Amazon Bedrock AgentCore Memory to persist
cross-session cold-chain breach incidents, parametric trigger evaluations,
and coordinator salvage dispatch decisions.
"""

import os
import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List

logger = logging.getLogger("PerishLock.AgentCoreMemory")

DEFAULT_MEMORY_ID = os.environ.get("BEDROCK_AGENTCORE_MEMORY_ID", "perishlock_memory_demo-dG2s8s7mXm")
DEFAULT_REGION = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")


class AgentCoreMemoryClient:
    """Client for recording and retrieving cross-session events in Amazon Bedrock AgentCore Memory."""

    def __init__(self, memory_id: str = DEFAULT_MEMORY_ID, region: str = DEFAULT_REGION):
        self.memory_id = memory_id
        self.region = region
        self._client = None

    @property
    def client(self):
        if self._client is None:
            try:
                import boto3
                self._client = boto3.client("bedrock-agentcore", region_name=self.region)
            except Exception as e:
                logger.warning("Could not initialize boto3 bedrock-agentcore client: %s", e)
        return self._client

    def record_event(
        self,
        text: str,
        actor_id: str = "perishlock-coordinator",
        session_id: str = "incident-salinas-402",
        role: str = "ASSISTANT",
    ) -> Optional[Dict[str, Any]]:
        """Record an event to Amazon Bedrock AgentCore Memory using the official AWS pattern."""
        if not self.client:
            logger.info("[AgentCoreMemory Simulation] Recorded event: %s", text[:80])
            return None

        try:
            params = {
                "memoryId": self.memory_id,
                "actorId": actor_id,
                "sessionId": session_id,
                "eventTimestamp": datetime.now(timezone.utc),
                "payload": [
                    {
                        "conversational": {
                            "role": role,
                            "content": {"text": text},
                        }
                    }
                ],
                "clientToken": str(uuid.uuid4()),
            }
            response = self.client.create_event(**params)
            event = response.get("event", {})
            logger.info("Created event in Bedrock AgentCore Memory: %s", event.get("eventId"))
            return event
        except Exception as e:
            logger.warning("Failed to record event to Bedrock AgentCore Memory: %s", e)
            return None

    def list_events(
        self,
        actor_id: str = "perishlock-coordinator",
        session_id: str = "incident-salinas-402",
        max_results: int = 20,
    ) -> List[Dict[str, Any]]:
        """Retrieve historical events from Bedrock AgentCore Memory."""
        if not self.client:
            return []

        try:
            resp = self.client.list_events(
                memoryId=self.memory_id,
                actorId=actor_id,
                sessionId=session_id,
                maxResults=max_results,
            )
            return resp.get("events", [])
        except Exception as e:
            logger.warning("Failed to list events from Bedrock AgentCore Memory: %s", e)
            return []


# Global singleton instance
agentcore_memory = AgentCoreMemoryClient()
