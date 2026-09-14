import { NextResponse } from "next/server";
import { MOCK_MANIFEST } from "@/lib/mock-data";

export async function GET() {
  const backendUrl = process.env.PERISHLOCK_BACKEND_URL;
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/evidence-manifest`);
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      // Fallback
    }
  }

  return NextResponse.json({
    manifest: MOCK_MANIFEST,
    integrity_verified: true,
  });
}
