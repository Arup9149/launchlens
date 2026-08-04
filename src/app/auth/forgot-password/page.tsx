"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Logo } from "@/components/logo"

/**
 * Map provider/auth errors to founder-facing copy.
 * Raw message is logged by the caller — never disable provider rate limits.
 */
function friendlyResetError(message: string): string {
  const lower = (message || "").toLowerCase()

  if (
    lower.includes("rate limit") ||
    lower.includes("rate_limit") ||
    lower.includes("too many requests") ||
    lower.includes("email rate limit exceeded") ||
    lower.includes("over_email_send_rate_limit")
  ) {
    return "You've requested a password reset several times recently. Please wait a few minutes before trying again."
  }

  if (lower.includes("invalid") && lower.includes("email")) {
    return "Please enter a valid email address."
  }

  if (lower.includes("network") || lower.includes("fetch failed")) {
    return "We couldn't reach the server. Check your connection and try again."
  }

  return message
    .replace(/supabase/gi, "LaunchLens")
    .replace(/\s+/g, " ")
    .trim()
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const origin =
      typeof window !== "undefined" ? window.location.origin : ""

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: origin ? `${origin}/auth/login` : undefined,
      }
    )

    if (resetError) {
      // Preserve underlying provider error for diagnostics
      console.error(
        JSON.stringify({
          level: "error",
          msg: "auth.password_reset_failed",
          email: email.trim().toLowerCase(),
          providerMessage: resetError.message,
          status: resetError.status,
          name: resetError.name,
        })
      )
      setError(friendlyResetError(resetError.message))
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center px-6 py-10 safe-px safe-pb">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo href="/" size="md" />
        </div>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-medium tracking-tight mb-2 text-center sm:text-left">
            Reset your password
          </h1>
          <p className="text-[14px] text-zinc-500 mb-8 text-center sm:text-left leading-relaxed">
            We&apos;ll help you get back into LaunchLens.
          </p>

          {sent ? (
            <div className="space-y-6">
              <p
                className="text-[14px] text-emerald-400 leading-relaxed"
                role="status"
              >
                If an account exists for that email, you&apos;ll receive a reset
                link shortly. Check your inbox and spam folder.
              </p>
              <Link
                href="/auth/login"
                className="block w-full text-center bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium py-3 rounded-full text-white transition"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-[13px] text-zinc-400 mb-2"
                >
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition"
                />
              </div>

              {error && (
                <p className="text-[13px] text-red-400" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium py-3 rounded-full text-white transition disabled:opacity-40"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}

          {!sent && (
            <p className="text-[13px] text-zinc-500 text-center mt-6">
              Remembered it?{" "}
              <Link
                href="/auth/login"
                className="text-violet-400 hover:text-violet-300"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
