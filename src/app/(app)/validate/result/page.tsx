"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"

type Analysis = {
  idea: string
  score: number
  verdict: string
  confidence: number
  verdictNote?: string
  demand?: string
  competition?: string
  risks?: string
  nextSteps?: string
  builderTips?: string[]
  breakdown?: {
    marketDemand: number
    competitionGap: number
    feasibility: number
    timing: number
    monetization: number
  }
}

function ResultContent() {
  const searchParams = useSearchParams()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [expanded, setExpanded] = useState<string | null>("demand")
  const [guidesUnlocked, setGuidesUnlocked] = useState(false)

  useEffect(() => {
    setGuidesUnlocked(localStorage.getItem("ll_guides_unlocked") === "1")
  }, [])

  useEffect(() => {
    const load = async () => {
      const id = searchParams.get("id")

      if (id) {
        try {
          const res = await fetch(`/api/validations/${id}`)
          const json = await res.json()
          if (json?.data?.analysis) {
            setAnalysis(json.data.analysis)
            return
          }
          if (json?.data) {
            setAnalysis({
              idea: json.data.idea,
              score: json.data.score,
              verdict: json.data.verdict,
              confidence: json.data.confidence,
              verdictNote: json.data.analysis?.verdictNote,
              demand: json.data.analysis?.demand,
              competition: json.data.analysis?.competition,
              risks: json.data.analysis?.risks,
              nextSteps: json.data.analysis?.nextSteps,
              builderTips: json.data.analysis?.builderTips,
              breakdown: json.data.analysis?.breakdown,
            })
            return
          }
        } catch {}
      }

      const raw = sessionStorage.getItem("ll_analysis")
      if (raw) {
        try {
          setAnalysis(JSON.parse(raw))
          return
        } catch {}
      }

      setAnalysis({
        idea: searchParams.get("idea") || "Your idea",
        score: Number(searchParams.get("score") || 78),
        verdict: searchParams.get("verdict") || "Go",
        confidence: Number(searchParams.get("confidence") || 84),
        verdictNote: "Based on available signals",
        demand: "Demand analysis will appear for new Brain runs.",
        competition: "Competition analysis will appear for new Brain runs.",
        risks: "Risk analysis will appear for new Brain runs.",
        nextSteps:
          "1. Open Starter guide\n2. Open Do’s & Don’ts\n3. Continue in Workshop",
        breakdown: {
          marketDemand: 72,
          competitionGap: 65,
          feasibility: 80,
          timing: 70,
          monetization: 68,
        },
      })
    }

    load()
  }, [searchParams])

  if (!analysis) {
    return (
      <div className="p-16 text-center text-zinc-500">Loading report...</div>
    )
  }

  const {
    idea,
    score,
    verdict,
    confidence,
    verdictNote = "Based on current signals",
    demand = "No demand analysis available.",
    competition = "No competition analysis available.",
    risks = "No risk analysis available.",
    nextSteps = "No next steps available.",
    builderTips = [],
    breakdown = {
      marketDemand: score,
      competitionGap: score - 5,
      feasibility: score + 5,
      timing: score - 2,
      monetization: score - 8,
    },
  } = analysis

  const verdictColor =
    verdict === "Go"
      ? "text-emerald-400"
      : verdict === "Pivot"
      ? "text-amber-400"
      : "text-red-400"

  const parameters = [
    { label: "Market Demand", score: breakdown.marketDemand, color: "bg-emerald-500" },
    { label: "Competition Gap", score: breakdown.competitionGap, color: "bg-violet-500" },
    { label: "Feasibility", score: breakdown.feasibility, color: "bg-sky-500" },
    { label: "Timing", score: breakdown.timing, color: "bg-amber-500" },
    { label: "Monetization", score: breakdown.monetization, color: "bg-fuchsia-500" },
  ]

  const ideaParam = encodeURIComponent(idea)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 print:hidden">
        <Link
          href="/validate"
          className="text-[13px] text-zinc-500 hover:text-white transition mb-6 inline-block"
        >
          ← Validate another idea
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight mb-2">
              Validation Report
            </h1>
            <p className="text-[15px] text-zinc-500">
              Powered by LaunchLens Brain
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="shrink-0 text-[13px] font-medium px-5 py-2.5 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
          >
            Download PDF
          </button>
        </div>
      </div>

      {guidesUnlocked && (
        <div className="glass-strong rounded-2xl p-5 mb-8 border border-violet-500/25 print:hidden">
          <p className="text-[13px] font-medium mb-1">Your Early Bird guides</p>
          <p className="text-[12px] text-zinc-500 mb-3">
            Unlocked with your purchase. Open and use Download PDF on each page.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/guides/starter"
              className="text-[13px] font-medium px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white transition"
            >
              Starter setup guide
            </Link>
            <Link
              href="/guides/dos-donts"
              className="text-[13px] font-medium px-4 py-2 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
            >
              Do’s & Don’ts
            </Link>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-6 mb-8">
        <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-2">
          Analyzed Idea
        </p>
        <p className="text-[15px] text-zinc-200 leading-relaxed">{idea}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-4">
            Overall Score
          </p>
          <p className="text-4xl font-medium mb-1">{score}</p>
          <p className="text-[13px] text-zinc-500">out of 100</p>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-4">
            Verdict
          </p>
          <p className={`text-4xl font-medium mb-2 ${verdictColor}`}>{verdict}</p>
          <p className="text-[13px] text-zinc-400 max-w-[200px] leading-snug">
            {verdictNote}
          </p>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-4">
            Confidence
          </p>
          <p className="text-4xl font-medium mb-2">{confidence}%</p>
          <p className="text-[12px] text-zinc-500">Signal strength</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <h3 className="text-[15px] font-medium mb-6">Score Breakdown</h3>
        <div className="space-y-5">
          {parameters.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] text-zinc-300">{item.label}</span>
                <span className="text-[13px] font-medium">
                  {Math.max(0, Math.min(100, Math.round(item.score)))}
                </span>
              </div>
              <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{
                    width: `${Math.max(0, Math.min(100, item.score))}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 mb-10">
        {[
          { id: "demand", title: "Market Demand Signals", content: demand },
          { id: "competition", title: "Competitive Landscape", content: competition },
          { id: "risks", title: "Key Risks & Assumptions", content: risks },
          { id: "next", title: "Recommended Next Steps", content: nextSteps },
        ].map((section) => (
          <div key={section.id} className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() =>
                setExpanded(expanded === section.id ? null : section.id)
              }
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition print:hidden"
            >
              <span className="text-[14px] font-medium">{section.title}</span>
              <span className="text-zinc-500 text-lg">
                {expanded === section.id ? "−" : "+"}
              </span>
            </button>
            <div
              className={`px-5 pb-5 ${
                expanded === section.id ? "block" : "hidden print:block"
              }`}
            >
              <p className="text-[14px] text-zinc-400 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {builderTips.length > 0 && (
        <div className="glass rounded-2xl p-6 mb-10">
          <h3 className="text-[15px] font-medium mb-4">Builder tips</h3>
          <ul className="space-y-3">
            {builderTips.map((tip, i) => (
              <li key={i} className="text-[13px] text-zinc-400 leading-relaxed">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4 mb-10 print:hidden">
        <p className="text-[12px] uppercase tracking-[0.15em] text-zinc-500">
          Continue in Workshop
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href={`/workshop/polish?idea=${ideaParam}`}
            className="glass rounded-2xl p-5 hover:bg-white/[0.04] transition block"
          >
            <p className="text-[14px] font-medium mb-1">Polish Garage</p>
            <p className="text-[12px] text-zinc-500">
              Sharpen problem, ICP, wedge, pricing
            </p>
          </Link>
          <Link
            href={`/workshop/related?idea=${ideaParam}`}
            className="glass rounded-2xl p-5 hover:bg-white/[0.04] transition block"
          >
            <p className="text-[14px] font-medium mb-1">Related Ideas</p>
            <p className="text-[12px] text-zinc-500">
              Expand into adjacent opportunities
            </p>
          </Link>
          <Link
            href={`/workshop/architecture?idea=${ideaParam}`}
            className="glass rounded-2xl p-5 hover:bg-white/[0.04] transition block"
          >
            <p className="text-[14px] font-medium mb-1">Architecture</p>
            <p className="text-[12px] text-zinc-500">
              Modules, stack, and 30-day plan
            </p>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 print:hidden">
        <Link
          href="/validate"
          className="text-[14px] font-medium px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
        >
          Validate another
        </Link>
        <Link
          href="/dashboard"
          className="text-[14px] font-medium px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition"
        >
          Back to Dashboard
        </Link>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 14mm;
          }
          body {
            background: white !important;
            color: #111 !important;
          }
          .glass,
          .glass-strong {
            background: white !important;
            border: 1px solid #ddd !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-zinc-500">Loading report...</div>
      }
    >
      <ResultContent />
    </Suspense>
  )
}