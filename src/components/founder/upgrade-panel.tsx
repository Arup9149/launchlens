"use client"

import { useState } from "react"
import Link from "next/link"
import { founderContactEmail } from "@/lib/payments/flags"

type UpgradePanelProps = {
  className?: string
  email?: string
}

/**
 * Shown when Early Founder allocation is exhausted (Beta).
 * Presentation only — does not invoke Razorpay.
 */
export function UpgradePanel({ className = "", email = "" }: UpgradePanelProps) {
  const [notifyState, setNotifyState] = useState<
    "idle" | "loading" | "done" | "duplicate" | "error"
  >("idle")
  const [notifyEmail, setNotifyEmail] = useState(email)
  const contact = founderContactEmail()

  const onNotify = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = notifyEmail.trim().toLowerCase()
    if (!value.includes("@")) {
      setNotifyState("error")
      return
    }
    setNotifyState("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, name: "Builder Pass priority" }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setNotifyState("error")
        return
      }
      setNotifyState(data.alreadyOnList ? "duplicate" : "done")
    } catch {
      setNotifyState("error")
    }
  }

  return (
    <div
      className={`glass-strong rounded-2xl p-6 sm:p-8 border border-violet-500/25 ${className}`.trim()}
    >
      <p className="text-[12px] uppercase tracking-[0.16em] text-violet-400 mb-2">
        Builder Pass
      </p>
      <h2 className="text-xl sm:text-2xl font-medium tracking-tight mb-2">
        ₹799 <span className="text-[14px] font-normal text-zinc-500">(Coming Soon)</span>
      </h2>
      <p className="text-[15px] text-zinc-400 leading-relaxed mb-5 max-w-xl">
        You&apos;ve used all Founder Validations. Builder Pass launches soon.
        Join the priority list to get notified.
      </p>

      <ul className="space-y-1.5 mb-6 text-[14px] text-zinc-300">
        {[
          "More Founder Validations when Builder Pass opens",
          "Workshop sessions for your active idea",
          "Priority access as Early Founder Beta expands",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-violet-400 shrink-0" aria-hidden>
              ·
            </span>
            {item}
          </li>
        ))}
      </ul>

      {(notifyState === "done" || notifyState === "duplicate") && (
        <p className="text-[14px] text-emerald-400 mb-4" role="status">
          {notifyState === "duplicate"
            ? "You're already on the priority list."
            : "You're on the priority list. We'll email you when Builder Pass opens."}
        </p>
      )}

      {notifyState !== "done" && notifyState !== "duplicate" && (
        <form onSubmit={onNotify} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="email"
            required
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-full px-4 py-2.5 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40"
          />
          <button
            type="submit"
            disabled={notifyState === "loading"}
            className="inline-flex min-h-11 items-center justify-center bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-6 py-2.5 rounded-full text-white transition disabled:opacity-40"
          >
            {notifyState === "loading" ? "Joining…" : "Notify Me"}
          </button>
        </form>
      )}

      {notifyState === "error" && (
        <p className="text-[13px] text-red-400 mb-3" role="alert">
          Could not join the list. Check your email and try again.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`mailto:${contact}?subject=${encodeURIComponent("Builder Pass priority — LaunchLens")}`}
          className="inline-flex min-h-11 items-center justify-center text-[14px] font-medium px-7 py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition text-center"
        >
          Contact Founder
        </a>
        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center justify-center text-[14px] font-medium px-7 py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition text-center"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
