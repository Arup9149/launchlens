"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Validation = {
  id: string
  idea: string
  score: number
  verdict: string
  confidence: number
  created_at: string
}

export default function DashboardPage() {
  const [validations, setValidations] = useState<Validation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/validations/list")
      .then((res) => res.json())
      .then((json) => {
        setValidations(json.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getVerdictColor = (verdict: string) => {
    if (verdict === "Go") return "text-emerald-400"
    if (verdict === "Pivot") return "text-amber-400"
    return "text-red-400"
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-medium tracking-tight mb-2">Dashboard</h1>
          <p className="text-[15px] text-zinc-500">Your idea validation workspace</p>
        </div>
        <Link
          href="/validate"
          className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-6 py-2.5 rounded-full text-white transition"
        >
          + New validation
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading...</div>
      ) : validations.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-2">No ideas yet</h2>
          <p className="text-[14px] text-zinc-500 mb-8 max-w-sm mx-auto">
            Start by validating your first SaaS idea with real market evidence.
          </p>
          <Link
            href="/validate"
            className="inline-flex bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-6 py-2.5 rounded-full text-white transition"
          >
            Validate an idea
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {validations.map((v) => (
            <div
              key={v.id}
              className="glass rounded-2xl p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-zinc-200 truncate mb-1">
                  {v.idea}
                </p>
                <p className="text-[12px] text-zinc-500">
                  {new Date(v.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-center">
                  <p className="text-[11px] text-zinc-500 mb-0.5">Score</p>
                  <p className="text-[15px] font-medium">{v.score}</p>
                </div>
                <div className="text-center min-w-[60px]">
                  <p className="text-[11px] text-zinc-500 mb-0.5">Verdict</p>
                  <p className={`text-[15px] font-medium ${getVerdictColor(v.verdict)}`}>
                    {v.verdict}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}