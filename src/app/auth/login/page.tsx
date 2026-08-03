"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"

function friendlyAuthError(message: string) {
  const lower = message.toLowerCase()
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "Email or password is incorrect. Try again."
  }
  if (lower.includes("email not confirmed")) {
    return "Please verify your email before signing in."
  }
  if (lower.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again."
  }
  // Never surface provider names in the UI
  return message.replace(/supabase/gi, "LaunchLens").replace(/\s+/g, " ").trim()
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(friendlyAuthError(error.message))
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo href="/" size="md" />
        </div>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-medium tracking-tight mb-2 text-center sm:text-left">
            Welcome back to LaunchLens
          </h1>
          <p className="text-[14px] text-zinc-500 mb-8 text-center sm:text-left leading-relaxed">
            Sign in to continue validating, refining, and building your next big
            idea.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-[13px] text-zinc-400 mb-2">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-violet-500/40 transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="block text-[13px] text-zinc-400">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[12px] text-violet-400 hover:text-violet-300 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-violet-500/40 transition"
              />
            </div>

            {error && (
              <p className="text-[13px] text-red-400" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium py-3 rounded-full text-white transition disabled:opacity-40"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-[13px] text-zinc-500 text-center mt-6">
            No account?{" "}
            <Link
              href="/auth/signup"
              className="text-violet-400 hover:text-violet-300"
            >
              Create your LaunchLens account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
