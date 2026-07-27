"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function PolishPageInner() {
  const searchParams = useSearchParams()
  const [original, setOriginal] = useState("")
  const [problem, setProblem] = useState("")
  const [icp, setIcp] = useState("")
  const [wedge, setWedge] = useState("")
  const [pricing, setPricing] = useState("")

  const [loading, setLoading] = useState(false)
  const [brainScore, setBrainScore] = useState<number | null>(null)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [summary, setSummary] = useState("")
  const [tips, setTips] = useState<string[]>([])
  const [breakdown, setBreakdown] = useState({
    marketDemand: 0,
    competitionGap: 0,
    feasibility: 0,
    timing: 0,
    monetization: 0,
  })

  useEffect(() => {
    const q = searchParams.get("idea")
    if (q) setOriginal(q)
  }, [searchParams])

  const hasOriginal = original.trim().length > 25
  const hasProblem = problem.trim().length > 20
  const hasIcp = icp.trim().length > 12
  const hasWedge = wedge.trim().length > 12
  const hasPricing = pricing.trim().length > 6

  const localScore = Math.min(
    94,
    (hasOriginal ? 58 : 38) +
      (hasProblem ? 9 : 0) +
      (hasIcp ? 8 : 0) +
      (hasWedge ? 10 : 0) +
      (hasPricing ? 7 : 0)
  )

  const displayScore = brainScore ?? localScore

  const handleBrainPolish = async () => {
    if (!original.trim() || loading) return
    setLoading(true)

    try {
      const res = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original: original.trim(),
          problem: problem.trim(),
          icp: icp.trim(),
          wedge: wedge.trim(),
          pricing: pricing.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Polish failed")

      if (data.polishedProblem) setProblem(data.polishedProblem)
      if (data.polishedIcp) setIcp(data.polishedIcp)
      if (data.polishedWedge) setWedge(data.polishedWedge)
      if (data.polishedPricing) setPricing(data.polishedPricing)

      setBrainScore(data.score)
      setConfidence(data.confidence)
      setSummary(data.summary || "")
      setTips(data.tips || [])
      setBreakdown(data.breakdown)
    } catch (err: any) {
      alert(err.message || "Brain polish failed")
    } finally {
      setLoading(false)
    }
  }

  const parameters = [
    { label: "Market Demand", score: breakdown.marketDemand, color: "bg-emerald-500" },
    { label: "Competition Gap", score: breakdown.competitionGap, color: "bg-violet-500" },
    { label: "Feasibility", score: breakdown.feasibility, color: "bg-sky-500" },
    { label: "Timing", score: breakdown.timing, color: "bg-amber-500" },
    { label: "Monetization", score: breakdown.monetization, color: "bg-fuchsia-500" },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
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
        <p className="text-[15px] text-zinc-400 max-w-2xl">
          Refine the core elements. Then run the Brain to sharpen wording and
          recalculate opportunity parameters.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
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
              placeholder="Why you instead of existing solutions?"
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

          <button
            onClick={handleBrainPolish}
            disabled={loading || !original.trim()}
            className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Brain is polishing...
              </span>
            ) : (
              "Run Brain Polish"
            )}
          </button>

          {summary && (
            <div className="glass rounded-2xl p-5">
              <p className="text-[12px] uppercase tracking-[0.15em] text-violet-400 mb-2">
                Refined summary
              </p>
              <p className="text-[14px] text-zinc-300 leading-relaxed">
                {summary}
              </p>
            </div>
          )}

          {tips.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <p className="text-[12px] uppercase tracking-[0.15em] text-zinc-500 mb-3">
                Builder tips
              </p>
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="text-[13px] text-zinc-400 leading-relaxed">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="glass rounded-2xl p-6 text-center sticky top-24">
            <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-3">
              {brainScore !== null ? "Brain Score" : "Live Score"}
            </p>
            <p className="text-5xl font-medium tracking-tight mb-1">
              {displayScore}
            </p>
            <p className="text-[13px] text-zinc-500 mb-4">out of 100</p>
            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                style={{ width: `${displayScore}%` }}
              />
            </div>
            {confidence !== null && (
              <p className="text-[12px] text-zinc-500">
                Confidence {confidence}%
              </p>
            )}
          </div>

          {brainScore !== null && (
            <div className="glass rounded-2xl p-5">
              <p className="text-[13px] font-medium mb-4">Opportunity Parameters</p>
              <div className="space-y-4">
                {parameters.map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-zinc-400">{p.label}</span>
                      <span className="text-zinc-200 font-medium">{p.score}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.color} transition-all duration-500`}
                        style={{ width: `${p.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PolishPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-zinc-500">Loading...</div>
      }
    >
      <PolishPageInner />
    </Suspense>
  )
}