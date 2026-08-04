import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { useCreditForUser } from "@/lib/credits/server"
import { ensureFounderCreditsRow } from "@/lib/credits/ensure-founder"

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
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const row = await ensureFounderCreditsRow(supabase, user)

    return NextResponse.json({
      email: row.email,
      credits: row.credits,
      plan: row.plan,
      userId: user.id,
      bootstrapped: row.bootstrapped,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed"
    console.error(
      JSON.stringify({ level: "error", msg: "credits.get_failed", error: message })
    )
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
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

    // Ensure row exists before consume (new founder with 3 can use immediately)
    await ensureFounderCreditsRow(supabase, user)

    try {
      const result = await useCreditForUser(supabase, user.id)
      return NextResponse.json({ credits: result.credits, plan: result.plan })
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string; credits?: number }
      if (e.status === 402) {
        return NextResponse.json(
          { error: e.message || "No validations remaining", credits: e.credits ?? 0 },
          { status: 402 }
        )
      }
      throw err
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
