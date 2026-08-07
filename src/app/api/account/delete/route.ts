import { NextResponse } from "next/server"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"
import {
  requireUser,
  isAuthOk,
  rateLimit,
  rateLimitHeaders,
  audit,
  safeLog,
} from "@/lib/security"

/**
 * POST /api/account/delete — account + app data deletion.
 * Body: { confirm: "DELETE" }
 */
export async function POST(request: Request) {
  const auth = await requireUser()
  if (!isAuthOk(auth)) return auth.response

  const rl = rateLimit(`account:delete:${auth.user.id}`, 3, 60 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) }
    )
  }

  const body = await request.json().catch(() => ({}))
  if (body.confirm !== "DELETE") {
    return NextResponse.json(
      { error: 'Send { "confirm": "DELETE" } to proceed' },
      { status: 400 }
    )
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Account deletion is temporarily unavailable" },
      { status: 503 }
    )
  }

  try {
    const db = createAdminClient()
    const uid = auth.user.id

    await db.from("validations").delete().eq("user_id", uid)
    await db.from("founder_credits").delete().eq("user_id", uid)
    await db.from("payment_events").delete().eq("user_id", uid)

    const { error: authErr } = await db.auth.admin.deleteUser(uid)
    if (authErr) {
      safeLog("error", "account.delete_auth_failed", {
        error: authErr.message,
      })
      audit({
        action: "account.delete",
        userId: uid,
        outcome: "error",
        meta: { stage: "auth" },
      })
      return NextResponse.json(
        { error: "Data cleared but auth cleanup failed. Contact support." },
        { status: 500 }
      )
    }

    audit({ action: "account.delete", userId: uid, outcome: "ok" })

    return NextResponse.json({
      success: true,
      message: "Account and associated data deleted",
    })
  } catch {
    safeLog("error", "account.delete_failed")
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 })
  }
}
