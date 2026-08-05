"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { safeNextPath } from "@/lib/supabase/auth-redirect"

function HandoffInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"working" | "ok" | "error">("working")
  const [message, setMessage] = useState("Continuing your session\u2026")

  useEffect(() => {
    let cancelled = false

    async function run() {
      const tokenHash = searchParams.get("token_hash")
      const type = searchParams.get("type") || "magiclink"
      const next = safeNextPath(searchParams.get("next"), "/dashboard")

      if (!tokenHash) {
        setStatus("error")
        setMessage("This continuation link is invalid or incomplete.")
        return
      }

      try {
        const supabase = createClient()
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "magiclink" | "email",
        })

        if (cancelled) return

        if (error) {
          setStatus("error")
          setMessage(
            error.message?.includes("expired")
              ? "This QR code has expired. Generate a new one on your desktop."
              : "Could not continue session. Sign in on this device, or scan a fresh QR."
          )
          return
        }

        setStatus("ok")
        setMessage("Session continued. Opening Dashboard\u2026")
        router.replace(next)
      } catch {
        if (cancelled) return
        setStatus("error")
        setMessage("Something went wrong. Please sign in on this device.")
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [searchParams, router])

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center">
        <p className="text-[11px] uppercase tracking-[0.14em] text-violet-400 mb-3">
          LaunchLens
        </p>
        <h1 className="text-xl font-medium mb-2">
          {status === "working" && "Continuing\u2026"}
          {status === "ok" && "You\u2019re in"}
          {status === "error" && "Couldn\u2019t continue"}
        </h1>
        <p className="text-[14px] text-zinc-400 mb-6">{message}</p>
        {status === "error" && (
          <Link
            href="/auth/login?next=/dashboard"
            className="inline-flex bg-gradient-to-r from-violet-500 to-violet-600 text-[14px] font-medium px-6 py-2.5 rounded-full text-white transition"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  )
}

export default function HandoffPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center text-zinc-500">
          Loading\u2026
        </div>
      }
    >
      <HandoffInner />
    </Suspense>
  )
}
