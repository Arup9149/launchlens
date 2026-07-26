"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useState } from "react"

function ResultContent() {
  const searchParams = useSearchParams()
  const idea = searchParams.get("idea") || "Your idea"
  const score = Number(searchParams.get("score") || 78)
  const confidence = Number(searchParams.get("confidence") || 84)
  const verdict = searchParams.get("verdict") || "Go"

  const verdictNote =
    verdict === "Go"
      ? "Strong signals with manageable competition"
      : verdict === "Pivot"
      ? "Potential exists but needs a clearer wedge"
      : "Weak demand or high competition risk"

  const verdictColor =
    verdict === "Go"
      ? "text-emerald-400"
      : verdict === "Pivot"
      ? "text-amber-400"
      : "text-red-400"

  const breakdown = [
    { label: "Market Demand", score: Math.min(95, score + 4), color: "bg-emerald-500" },
    { label: "Competition Gap", score: Math.min(95, score - 7), color: "bg-violet-500" },
    { label: "Feasibility", score: Math.min(95, score + 10), color: "bg-sky-500" },
    { label: "Timing", score: Math.min(95, score - 2), color: "bg-amber-500" },
    { label: "Monetization", score: Math.min(95, score - 9), color: "bg-fuchsia-500" },
  ]

  const probabilities = [
    { label: "Chance of finding first 10 paying users", value: Math.min(90, score - 5) },
    { label: "Chance of reaching $5k MRR in 12 months", value: Math.min(70, Math.floor(score * 0.55)) },
    { label: "Risk of being outcompeted early", value: Math.max(15, 100 - score - 10) },
  ]

  const [expanded, setExpanded] = useState<string | null>("demand")

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/validate"
          className="text-[13px] text-zinc-500 hover:text-white transition mb-6 inline-block"
        >
          ← Validate another idea
        </Link>
        <h1 className="text-3xl font-medium tracking-tight mb-2">
          Validation Report
        </h1>
        <p className="text-[15px] text-zinc-500">
          Evidence-based analysis · Mock data for now
        </p>
      </div>

      {/* Idea card */}
      <div className="glass rounded-2xl p-6 mb-8">
        <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-2">
          Analyzed Idea
        </p>
        <p className="text-[15px] text-zinc-200 leading-relaxed">{idea}</p>
      </div>

      {/* Score + Verdict + Confidence */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {/* Score */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-4">
            Overall Score
          </p>
          <div className="relative w-28 h-28 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-medium tracking-tight">{score}</span>
            </div>
          </div>
          <p className="text-[13px] text-zinc-500">out of 100</p>
        </div>

        {/* Verdict */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-4">
            Verdict
          </p>
          <p className={`text-4xl font-medium tracking-tight mb-2 ${verdictColor}`}>
            {verdict}
          </p>
          <p className="text-[13px] text-zinc-400 max-w-[180px] leading-snug">
            {verdictNote}
          </p>
        </div>

        {/* Confidence */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-4">
            Confidence
          </p>
          <p className="text-4xl font-medium tracking-tight mb-2">{confidence}%</p>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <p className="text-[12px] text-zinc-500 mt-3">Based on signal strength</p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="glass rounded-2xl p-6 mb-8">
        <h3 className="text-[15px] font-medium mb-6">Score Breakdown</h3>
        <div className="space-y-5">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] text-zinc-300">{item.label}</span>
                <span className="text-[13px] font-medium text-zinc-200">
                  {Math.max(20, Math.min(98, item.score))}
                </span>
              </div>
              <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: `${Math.max(20, Math.min(98, item.score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Probabilities */}
      <div className="glass rounded-2xl p-6 mb-8">
        <h3 className="text-[15px] font-medium mb-6">Key Probabilities</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {probabilities.map((p) => (
            <div
              key={p.label}
              className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-center"
            >
              <p className="text-2xl font-medium tracking-tight mb-1">
                {Math.max(5, Math.min(95, p.value))}%
              </p>
              <p className="text-[12px] text-zinc-500 leading-snug">{p.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Evidence Sections */}
      <div className="space-y-3 mb-10">
        {[
          {
            id: "demand",
            title: "Market Demand Signals",
            content:
              "Mock: Moderate-to-strong demand detected across Reddit communities and search trends. Several threads show founders actively looking for faster validation tools. Search volume for related keywords has grown ~28% YoY.",
          },
          {
            id: "competition",
            title: "Competitive Landscape",
            content:
              "Mock: A few tools exist (ValidatorAI, IdeaProof, etc.) but most stop at a basic score. Very few offer a full Workshop + evidence-linked report focused on indie-scale revenue. Clear differentiation opportunity.",
          },
          {
            id: "risks",
            title: "Key Risks & Assumptions",
            content:
              "Mock: Main risk is low willingness-to-pay if the report feels generic. Assumption that founders will pay ₹5,999 for deep research needs testing. Also dependent on quality of live data sources.",
          },
          {
            id: "next",
            title: "Recommended Next Steps",
            content:
              "1. Talk to 10 indie founders this week.\n2. Build a simple landing page and test pricing.\n3. Run a small paid validation test.\n4. Consider starting with a one-time report product before full Workshop.",
          },
        ].map((section) => (
          <div key={section.id} className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() =>
                setExpanded(expanded === section.id ? null : section.id)
              }
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition"
            >
              <span className="text-[14px] font-medium">{section.title}</span>
              <span className="text-zinc-500 text-lg">
                {expanded === section.id ? "−" : "+"}
              </span>
            </button>
            {expanded === section.id && (
              <div className="px-5 pb-5">
                <p className="text-[14px] text-zinc-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
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
    <Suspense
      fallback={
        <div className="p-16 text-center text-zinc-500">Loading report...</div>
      }
    >
      <ResultContent />
    </Suspense>
  )
}