import { NextResponse } from "next/server"
import { emailService } from "@/lib/email"
import { isAdminConfigured } from "@/lib/supabase/admin"

/**
 * GET /api/admin/email-status
 * Protected by ADMIN_API_SECRET (Authorization: Bearer <secret>).
 * Returns latest email_events rows for production diagnostics.
 */
export async function GET(request: Request) {
  try {
    const secret = process.env.ADMIN_API_SECRET?.trim()
    if (!secret) {
      return NextResponse.json(
        { error: "ADMIN_API_SECRET is not configured" },
        { status: 503 }
      )
    }

    const auth = request.headers.get("authorization") || ""
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : ""
    if (!token || token !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Supabase service role not configured" },
        { status: 503 }
      )
    }

    const url = new URL(request.url)
    const limitParam = url.searchParams.get("limit")
    const limit = limitParam ? parseInt(limitParam, 10) : 50

    const events = await emailService.listRecent(
      Number.isFinite(limit) ? limit : 50
    )

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    })
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "admin.email_status_failed",
        error: err instanceof Error ? err.message : String(err),
      })
    )
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load events" },
      { status: 500 }
    )
  }
}
