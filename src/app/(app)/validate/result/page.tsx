"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

function ResultContent() {
  const searchParams = useSearchParams()
  const idea = searchParams.get("idea") || "Your idea"

  // Temporary mock result (later this will come from the research agents)
  const score = 78
  const verdict = "Go"
  const verdictColor = "text-emerald-400"

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link href="/validate" className="text-[13px] text-zinc-500 hover:text-white transition mb-6 inline-block">
          ← Validate another idea
        </Link>
        <h1 className="text-3xl font-medium tracking-tight mb-2">Validation Report</h1>
        <p className="text-[15px] text-zinc-500">Based on current market signals</p>
      </div>

      {/* Idea summary */}
      <div className="glass rounded-2xl p-6 mb-6">
        <p className="text-[12px] uppercase tracking-wider text-zinc-500 mb-2">Your idea</p>
        <p className="text-[15px] text-zinc-200 leading-relaxed">{idea}</p>
      </div>

      {/* Score + Verdict */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-[12px] uppercase tracking-wider text-zinc-500 mb-2">Score</p>
          <p className="text-5xl font-medium tracking-tight">{score}</p>
          <p className="text-[13px] text-zinc-500 mt-1">out of 100</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-[12px] uppercase tracking-wider text-zinc-500 mb-2">Verdict</p>
          <p className={`text-4xl font-medium tracking-tight ${verdictColor}`}>{verdict}</p>
          <p className="text-[13px] text-zinc-500 mt-1">Recommended action</p>
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-[15px] font-medium mb-2">Market Demand</h3>
          <p className="text-[14px] text-zinc-400 leading-relaxed">
            Real research results will appear here (Reddit, G2, Product Hunt, search trends...).
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-[15px] font-medium mb-2">Competition</h3>
          <p className="text-[14px] text-zinc-400 leading-relaxed">
            Competitor landscape and differentiation opportunities will show here.
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-[15px] font-medium mb-2">Indie Revenue Potential</h3>
          <p className="text-[14px] text-zinc-400 leading-relaxed">
            Realistic $5k–20k MRR estimate based on similar products will appear here.
          </p>
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <Link
          href="/validate"
          className="text-[14px] font-medium px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
        >
          Validate another
        </Link>
        <Link
          href="/dashboard"
          className="text-[14px] font-medium px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-zinc-500">Loading report...</div>}>
      <ResultContent />
    </Suspense>
  )
}