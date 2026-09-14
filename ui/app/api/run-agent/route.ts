import { NextResponse } from "next/server";
import { MOCK_AGENT_STEPS, MOCK_OPTIONS, MOCK_SETTLEMENT, MOCK_MANIFEST } from "@/lib/mock-data";

export async function POST() {
  const backendUrl = process.env.PERISHLOCK_BACKEND_URL;
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/run-agent`, { method: "POST" });
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      // Fallback
    }
  }

  // Simulated 8-step speedrun execution response
  return NextResponse.json({
    incident_id: "INC-POL-RB-TOM-2026-001",
    steps_executed: MOCK_AGENT_STEPS.length,
    manifest_hash: MOCK_MANIFEST.sha256_merkle_root,
    options: MOCK_OPTIONS,
    settlement_claim: MOCK_SETTLEMENT,
    approval_status: "PENDING",
    approval_request_id: "APR-2026-SALINAS-001",
    raw_approval_token: "TOKEN-XJ9K42-PERISHLOCK-VERIFIED-HMAC",
    approval_url: "/api/authorize",
    steps: MOCK_AGENT_STEPS,
  });
}
