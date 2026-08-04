"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"

const STORAGE_KEY = "ll_onboarding_seen"

/**
 * First-login Early Founder welcome.
 * Client-only gate via localStorage — no backend/schema changes.
 */
export function OnboardingModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (typeof window === "undefined") return
      if (localStorage.getItem(STORAGE_KEY) === "1") return
      setOpen(true)
    } catch {
      // ignore storage errors
    }
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // ignore
    }
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Dismiss welcome"
        onClick={dismiss}
      />

      <div className="relative w-full max-w-lg glass-strong rounded-3xl border border-violet-500/25 p-6 sm:p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <Logo href="/dashboard" size="md" />
        </div>

        <p className="text-[12px] uppercase tracking-[0.18em] text-violet-400/90 text-center mb-3">
          Early Founder Cohort
        </p>
        <h2
          id="onboarding-title"
          className="text-2xl sm:text-3xl font-medium tracking-tight text-center mb-2"
        >
          🎉 Welcome to LaunchLens
        </h2>
        <p className="text-[14px] text-zinc-500 text-center mb-6">
          Know before you build.
        </p>

        <p className="text-[15px] text-zinc-300 leading-relaxed mb-5 text-center sm:text-left">
          Welcome to the LaunchLens Early Founder Cohort.
        </p>

        <p className="text-[13px] text-zinc-500 mb-3">
          As an Early Founder you receive:
        </p>
        <ul className="space-y-2 mb-8 text-[14px] text-zinc-300">
          {[
            "3 Founder Validations",
            "AI Workshop",
            "Personalized Founder Playbook",
            "Personalized 20-Day Builder Program",
            "Direct product influence",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="text-emerald-400 mt-0.5 shrink-0" aria-hidden>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/validate"
            onClick={dismiss}
            className="flex-1 text-center min-h-11 inline-flex items-center justify-center bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-6 py-3 rounded-full text-white transition"
          >
            Start My First Validation
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="flex-1 min-h-11 inline-flex items-center justify-center text-[14px] font-medium px-6 py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
