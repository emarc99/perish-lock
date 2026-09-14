import { NextResponse } from "next/server";
import { MOCK_STATUS } from "@/lib/mock-data";

export async function GET() {
  const backendUrl = process.env.PERISHLOCK_BACKEND_URL;
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/status`);
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      // Fallback to mock data
    }
  }
  return NextResponse.json(MOCK_STATUS);
}
