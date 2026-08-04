import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { useCreditForUser } from "@/lib/credits/server"

/**
 * Credits are scoped to auth.uid().
 * - GET: current user's balance
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

    const { data, error } = await supabase
      .from("founder_credits")
      .select("credits, plan, email")
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      email: data?.email ?? user.email ?? null,
      credits: data?.credits ?? 0,
      plan: data?.plan ?? null,
      userId: user.id,
    })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
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

    // Hard block: clients cannot grant credits
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
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
