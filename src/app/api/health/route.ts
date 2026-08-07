import { NextResponse } from "next/server"

/**
 * Liveness / readiness for load balancers, WAF health checks, and uptime monitors.
 * Does not expose secrets or internal topology.
 */
export async function GET() {
  const checks: Record<string, string> = {
    app: "ok",
  }

  const hasSb =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  checks.supabase_config = hasSb ? "ok" : "missing"

  const hasBrain =
    !!process.env.OPENROUTER_API_KEY?.trim() ||
    (process.env.BRAIN_PROVIDER || "").toLowerCase() === "ollama"
  checks.brain_config = hasBrain ? "ok" : "missing"

  const degraded = Object.values(checks).some((v) => v !== "ok")

  return NextResponse.json(
    {
      status: degraded ? "degraded" : "ok",
      service: "launchlens",
      time: new Date().toISOString(),
      checks,
    },
    {
      status: degraded ? 503 : 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}
