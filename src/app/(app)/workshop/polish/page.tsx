"use client"

import { useState } from "react"
import Link from "next/link"

export default function PolishPage() {
  const [original, setOriginal] = useState("")
  const [problem, setProblem] = useState("")
  const [icp, setIcp] = useState("")
  const [wedge, setWedge] = useState("")
  const [pricing, setPricing] = useState("")

  // Live mock score calculation
  const base = original.trim().length > 20 ? 62 : 40
  const extras =
    (problem.trim().length > 15 ? 8 : 0) +
    (icp.trim().length > 10 ? 7 : 0) +
    (wedge.trim().length > 10 ? 9 : 0) +
    (pricing.trim().length > 5 ? 6 : 0)

  const liveScore = Math.min(94, base + extras)

  const polishedIdea = [
    problem && `Problem: ${problem}`,
    icp && `For: ${icp}`,
    wedge && `Wedge: ${wedge}`,
    pricing && `Pricing: ${pricing}`,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/workshop"
          className="text-[13px] text-zinc-500 hover:text-white transition mb-4 inline-block"
        >
          ← Back to Workshop
        </Link>
        <h1 className="text-3xl font-medium tracking-tight mb-2">
          Idea Polishing Garage
        </h1>
        <p className="text-[15px] text-zinc-400">
          Refine the core elements. Watch the score update live.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left - Inputs */}
        <div className="lg:col-span-3 space-y-5">
          <div>
            <label className="block text-[13px] text-zinc-400 mb-2">
              Original idea
            </label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste the original idea here..."
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-[13px] text-zinc-400 mb-2">
              Clear Problem Statement
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="What exact pain does this solve?"
              rows={2}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-[13px] text-zinc-400 mb-2">
              Ideal Customer Profile (ICP)
            </label>
            <input
              value={icp}
              onChange={(e) => setIcp(e.target.value)}
              placeholder="Who exactly is this for?"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition"
            />
          </div>

          <div>
            <label className="block text-[13px] text-zinc-400 mb-2">
              Wedge / Differentiation
            </label>
            <input
              value={wedge}
              onChange={(e) => setWedge(e.target.value)}
              placeholder="Why you instead of existing tools?"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition"
            />
          </div>

          <div>
            <label className="block text-[13px] text-zinc-400 mb-2">
              Pricing Direction
            </label>
            <input
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              placeholder="e.g. ₹4,999 one-time or ₹999/mo"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition"
            />
          </div>
        </div>

        {/* Right - Live Score + Preview */}
        <div className="lg:col-span-2 space-y-5">
          {/* Live Score */}
          <div className="glass rounded-2xl p-6 text-center sticky top-24">
            <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-3">
              Live Score
            </p>
            <p className="text-5xl font-medium tracking-tight mb-1">{liveScore}</p>
            <p className="text-[13px] text-zinc-500 mb-4">out of 100</p>

            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                style={{ width: `${liveScore}%` }}
              />
            </div>

            {polishedIdea ? (
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-2">
                  Polished Version
                </p>
                <p className="text-[13px] text-zinc-300 leading-relaxed">
                  {polishedIdea}
                </p>
              </div>
            ) : (
              <p className="text-[13px] text-zinc-600">
                Fill the fields to see the polished version
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}