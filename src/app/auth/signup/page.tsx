"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push("/dashboard")
      router.refresh()
      return
    }

    setMessage("Check your email to confirm your account (if confirmation is enabled).")
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Create account</h1>
        <p className="text-[14px] text-zinc-500 mb-8">
          Start validating ideas with LaunchLens
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-[13px] text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-violet-500/40 transition"
            />
          </div>
          <div>
            <label className="block text-[13px] text-zinc-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-violet-500/40 transition"
            />
          </div>

          {error && <p className="text-[13px] text-red-400">{error}</p>}
          {message && <p className="text-[13px] text-emerald-400">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium py-3 rounded-full text-white transition disabled:opacity-40"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-[13px] text-zinc-500 text-center mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}