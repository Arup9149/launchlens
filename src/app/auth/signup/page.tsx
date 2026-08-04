"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"

function friendlyAuthError(message: string) {
  const lower = message.toLowerCase()
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Sign in instead."
  }
  if (lower.includes("password")) {
    return message.replace(/supabase/gi, "LaunchLens")
  }
  return message.replace(/supabase/gi, "LaunchLens").replace(/\s+/g, " ").trim()
}

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(friendlyAuthError(error.message))
      setLoading(false)
      return
    }

    if (data.session) {
      router.push("/dashboard")
      router.refresh()
      return
    }

    // Email confirmation enabled — send founder to branded verify page
    router.push(
      `/auth/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`
    )
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center px-6 py-10 safe-px safe-pb">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo href="/" size="md" />
        </div>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-medium tracking-tight mb-2 text-center sm:text-left">
            Create your LaunchLens account
          </h1>
          <p className="text-[14px] text-zinc-500 mb-8 text-center sm:text-left leading-relaxed">
            Start validating startup ideas with AI.
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="signup-email" className="block text-[13px] text-zinc-400 mb-2">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-violet-500/40 transition"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-[13px] text-zinc-400 mb-2">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-violet-500/40 transition"
              />
              <p className="text-[12px] text-zinc-600 mt-2">
                At least 6 characters.
              </p>
            </div>

            {error && (
              <p className="text-[13px] text-red-400" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="text-[13px] text-emerald-400" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium py-3 rounded-full text-white transition disabled:opacity-40"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-[13px] text-zinc-500 text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-violet-400 hover:text-violet-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
