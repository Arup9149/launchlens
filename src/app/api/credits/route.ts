import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { useCreditForUser } from "@/lib/credits/server"
import { ensureFounderCreditsRow } from "@/lib/credits/ensure-founder"
import {
  rateLimit,
  rateLimitHeaders,
  RATE_LIMITS,
  safeLog,
} from "@/lib/security"

/**
 * Credits are scoped to auth.uid().
 * - GET: current balance; auto-allocates Early Founder starter validations if missing
 * - POST action=use: consume 1 credit (authenticated)
 * - POST action=grant is NOT available on this public API (webhook / verify only)
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const rl = rateLimit(
      `api:credits:get:${user.id}`,
      RATE_LIMITS.api.limit,
      RATE_LIMITS.api.windowMs
    )
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitHeaders(rl) }
      )
    }

    const row = await ensureFounderCreditsRow(supabase, user)

    return NextResponse.json(
      {
        credits: row.credits,
        plan: row.plan,
        bootstrapped: row.bootstrapped,
      },
      { headers: rateLimitHeaders(rl) }
    )
  } catch {
    safeLog("error", "credits.get_failed")
    return NextResponse.json(
      { error: "Failed to load credits" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const rl = rateLimit(
      `api:credits:post:${user.id}`,
      RATE_LIMITS.api.limit,
      RATE_LIMITS.api.windowMs
    )
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitHeaders(rl) }
      )
    }

    const body = await request.json().catch(() => ({}))
    const action = body.action as string

    if (action === "grant") {
      return NextResponse.json(
        {
          error:
            "Credit grants are server-only. Complete checkout; fulfillment is via verified payment.",
        },
        { status: 403 }
      )
    }

    if (action !== "use") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    await ensureFounderCreditsRow(supabase, user)

    try {
      const result = await useCreditForUser(supabase, user.id)
      return NextResponse.json(
        { credits: result.credits, plan: result.plan },
        { headers: rateLimitHeaders(rl) }
      )
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string; credits?: number }
      if (e.status === 402) {
        return NextResponse.json(
          {
            error: "No validations remaining",
            credits: e.credits ?? 0,
          },
          { status: 402 }
        )
      }
      throw err
    }
  } catch {
    safeLog("error", "credits.post_failed")
    return NextResponse.json(
      { error: "Failed to update credits" },
      { status: 500 }
    )
  }
}
