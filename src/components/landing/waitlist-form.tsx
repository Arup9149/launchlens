"use client"

import { useState } from "react"

type FormState = "idle" | "loading" | "success" | "duplicate" | "error"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>("idle")
  const [errorHint, setErrorHint] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === "loading" || state === "success" || state === "duplicate") return

    const value = email.trim().toLowerCase()
    if (!value.includes("@")) {
      setState("error")
      setErrorHint("Enter a valid email so we can reach you before launch.")
      return
    }

    setState("loading")
    setErrorHint("")

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setState("error")
        setErrorHint(
          typeof data.error === "string"
            ? data.error
            : "Something went wrong. Please try again in a moment."
        )
        return
      }

      setEmail("")
      setState(data.alreadyOnList ? "duplicate" : "success")
    } catch {
      setState("error")
      setErrorHint("Network hiccup. Check your connection and try once more.")
    }
  }

  if (state === "success" || state === "duplicate") {
    return (
      <div
        className="glass rounded-2xl px-6 py-5 text-left border border-emerald-500/20"
        role="status"
        aria-live="polite"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-400/90 mb-2">
          {state === "duplicate" ? "Already on the list" : "You're in"}
        </p>
        <p className="text-[16px] font-medium text-white tracking-tight mb-1.5">
          {state === "duplicate"
            ? "You're already on Early Access."
            : "Welcome to LaunchLens Early Access."}
        </p>
        <p className="text-[13px] text-zinc-400 leading-relaxed">
          {state === "duplicate"
            ? "We'll email you before every major milestone — no need to join again."
            : "Check your inbox for a short welcome note. We'll notify you before seats open and share founder pricing first."}
        </p>
        <p className="text-[12px] text-zinc-600 mt-3">
          Know before you build.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <label className="sr-only" htmlFor="waitlist-email">
          Email for Early Access
        </label>
        <input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === "error") setState("idle")
          }}
          placeholder="you@email.com"
          autoComplete="email"
          disabled={state === "loading"}
          className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-full px-5 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={state === "loading" || !email.trim()}
          className="bg-gradient-to-r from-violet-500 to-violet-600 px-7 py-3 rounded-full text-[14px] font-medium text-white whitespace-nowrap hover:from-violet-400 hover:to-violet-500 transition disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 min-w-[9.5rem]"
        >
          {state === "loading" ? (
            <>
              <span
                className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                aria-hidden
              />
              Securing your seat…
            </>
          ) : (
            "Join Early Access"
          )}
        </button>
      </div>
      {state === "error" && errorHint && (
        <p className="text-[13px] text-red-400 text-left" role="alert">
          {errorHint}
        </p>
      )}
      {state === "idle" && (
        <p className="text-[12px] text-zinc-600 text-left sm:text-center">
          Founder seats · No spam · Unsubscribe anytime
        </p>
      )}
      {state === "loading" && (
        <p className="text-[12px] text-zinc-500 text-left sm:text-center">
          Adding you to the Early Access list…
        </p>
      )}
    </form>
  )
}
