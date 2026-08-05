import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { safeNextPath } from "@/lib/supabase/auth-redirect"

/**
 * Supabase Auth email confirmation / recovery lands here after
 * /auth/v1/verify redirects with ?code=...
 * Exchanges the code for a session (cookies) and sends the user to LaunchLens UI.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = safeNextPath(searchParams.get("next"), "/dashboard")

  // Prefer the public host behind Vercel / proxies so redirects stay on launchlens.in
  const forwardedHost = request.headers.get("x-forwarded-host")
  const isLocal =
    process.env.NODE_ENV === "development" ||
    origin.includes("localhost") ||
    origin.includes("127.0.0.1")
  const base =
    !isLocal && forwardedHost
      ? `https://${forwardedHost}`
      : origin

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${base}${next}`)
      }
      console.error(
        JSON.stringify({
          level: "error",
          msg: "auth.callback_exchange_failed",
          error: error.message,
        })
      )
    } catch (err) {
      console.error(
        JSON.stringify({
          level: "error",
          msg: "auth.callback_unhandled",
          error: err instanceof Error ? err.message : String(err),
        })
      )
    }
  }

  // No code or exchange failed — branded login, not a Supabase error page
  return NextResponse.redirect(
    `${base}/auth/login?error=auth_callback`
  )
}
