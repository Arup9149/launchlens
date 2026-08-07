import { NextResponse } from "next/server"
import {
  requireUser,
  isAuthOk,
  rateLimit,
  rateLimitHeaders,
  audit,
  safeLog,
} from "@/lib/security"

/**
 * GET /api/account/export — data portability (authenticated).
 */
export async function GET() {
  const auth = await requireUser()
  if (!isAuthOk(auth)) return auth.response

  const rl = rateLimit(`account:export:${auth.user.id}`, 5, 60 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Export rate limited. Try again later." },
      { status: 429, headers: rateLimitHeaders(rl) }
    )
  }

  try {
    const { data: validations, error: vErr } = await auth.supabase
      .from("validations")
      .select("id, idea, score, verdict, confidence, created_at")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .limit(200)

    if (vErr) {
      safeLog("error", "account.export_validations_failed", { code: vErr.code })
      return NextResponse.json({ error: "Could not export data" }, { status: 500 })
    }

    const { data: credits } = await auth.supabase
      .from("founder_credits")
      .select("credits, plan, updated_at")
      .eq("user_id", auth.user.id)
      .maybeSingle()

    audit({
      action: "account.export",
      userId: auth.user.id,
      outcome: "ok",
    })

    return NextResponse.json(
      {
        exportedAt: new Date().toISOString(),
        user: {
          id: auth.user.id,
          email: auth.user.email,
        },
        credits: credits || null,
        validations: validations || [],
      },
      { headers: rateLimitHeaders(rl) }
    )
  } catch {
    safeLog("error", "account.export_failed")
    return NextResponse.json({ error: "Could not export data" }, { status: 500 })
  }
}
