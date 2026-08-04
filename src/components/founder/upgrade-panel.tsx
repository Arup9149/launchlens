"use client"

import Link from "next/link"

type UpgradePanelProps = {
  className?: string
}

/**
 * Shown when Early Founder allocation is exhausted.
 * Presentation only — does not change payment backend.
 */
export function UpgradePanel({ className = "" }: UpgradePanelProps) {
  return (
    <div
      className={`glass-strong rounded-2xl p-6 sm:p-8 border border-violet-500/25 ${className}`.trim()}
    >
      <p className="text-[12px] uppercase tracking-[0.16em] text-violet-400 mb-2">
        Early Founder
      </p>
      <h2 className="text-xl sm:text-2xl font-medium tracking-tight mb-3">
        You&apos;re ready for the next stage.
      </h2>
      <p className="text-[15px] text-zinc-400 leading-relaxed mb-5 max-w-xl">
        You&apos;ve completed your Early Founder allocation. When you&apos;re
        ready, unlock deeper capacity for the same founder workspace.
      </p>

      <p className="text-[13px] text-zinc-500 mb-2">Unlock:</p>
      <ul className="space-y-1.5 mb-6 text-[14px] text-zinc-300">
        {[
          "Unlimited Founder Validations",
          "Unlimited Workshop sessions",
          "Future AI Brain upgrades",
          "Priority feature releases",
          "Founder pricing",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-violet-400 shrink-0" aria-hidden>
              ·
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-[13px] text-zinc-500">Early Founder</span>
        <span className="text-2xl font-medium tracking-tight">₹799</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/validate"
          className="inline-flex min-h-11 items-center justify-center bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition text-center"
        >
          Become an Early Founder
        </Link>
        <Link
          href="/#waitlist"
          className="inline-flex min-h-11 items-center justify-center text-[14px] font-medium px-7 py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition text-center"
        >
          Continue with Waitlist
        </Link>
      </div>
    </div>
  )
}
