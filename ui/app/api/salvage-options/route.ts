import { NextResponse } from "next/server";
import { MOCK_OPTIONS } from "@/lib/mock-data";

export async function GET() {
  const backendUrl = process.env.PERISHLOCK_BACKEND_URL;
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/salvage-options`);
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      // Fallback
    }
  }
  return NextResponse.json({
    incident_id: "INC-POL-RB-TOM-2026-001",
    options: MOCK_OPTIONS,
  });
}
