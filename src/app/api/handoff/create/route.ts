import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"
import { getAuthOrigin } from "@/lib/supabase/auth-redirect"

/**
 * Create a short-lived secure continuation URL for cross-device handoff.
 * Reuses Supabase Auth magic-link infrastructure (one-time, expires automatically).
 * Does not expose JWTs, service keys, or long-lived secrets in the QR payload.
 */
export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "Sign in required to continue on another device." },
        { status: 401 }
      )
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Handoff is temporarily unavailable." },
        { status: 503 }
      )
    }

    const admin = createAdminClient()
    const origin = getAuthOrigin()
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`

    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: user.email,
      options: {
        redirectTo,
      },
    })

    if (error || !data?.properties?.action_link) {
      console.error(
        JSON.stringify({
          level: "error",
          msg: "handoff.generate_link_failed",
          error: error?.message,
        })
      )
      return NextResponse.json(
        { error: "Could not create continuation link. Try again." },
        { status: 500 }
      )
    }

    const hashedToken = data.properties.hashed_token
    let continueUrl: string

    if (hashedToken) {
      continueUrl = `${origin}/auth/handoff?token_hash=${encodeURIComponent(hashedToken)}&type=magiclink&next=${encodeURIComponent("/dashboard")}`
    } else {
      continueUrl = data.properties.action_link
    }

    const expiresAt = Date.now() + 55 * 60 * 1000

    return NextResponse.json({
      url: continueUrl,
      expiresAt,
      email: user.email.replace(/(.{2}).+(@.+)/, "$1***$2"),
    })
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "handoff.create_unhandled",
        error: err instanceof Error ? err.message : String(err),
      })
    )
    return NextResponse.json(
      { error: "Handoff failed. Please try again." },
      { status: 500 }
    )
  }
}
