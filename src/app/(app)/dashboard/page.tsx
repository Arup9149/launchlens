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
  const [brainOk, setBrainOk] = useState<boolean | null>(null)

  useEffect(() => {
    fetch("/api/validations/list")
      .then((res) => res.json())
      .then((json) => {
        setValidations(json.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    fetch("/api/brain/health")
      .then((r) => r.json())
      .then((d) => setBrainOk(!!d.ok))
      .catch(() => setBrainOk(false))
  }, [])

  const getVerdictColor = (verdict: string) => {
    if (verdict === "Go") return "text-emerald-400"
    if (verdict === "Pivot") return "text-amber-400"
    return "text-red-400"
  }

  const tools = [
    {
      title: "Validate idea",
      desc: "Run a full Brain analysis and get a Go / Pivot / Kill report.",
      href: "/validate",
      cta: "Start validation",
    },
    {
      title: "Polish Garage",
      desc: "Sharpen problem, ICP, wedge, and pricing with the Brain.",
      href: "/workshop/polish",
      cta: "Open polish",
    },
    {
      title: "Related ideas",
      desc: "Expand into adjacent opportunities and broader scope.",
      href: "/workshop/related",
      cta: "Expand idea",
    },
    {
      title: "Architecture Brain",
      desc: "Generate modules, stack, flow, and a 30-day build plan.",
      href: "/workshop/architecture",
      cta: "Design MVP",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
            {brainOk !== null && (
              <span
                className={`text-[11px] px-2.5 py-1 rounded-full border ${
                  brainOk
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-red-500/30 text-red-400"
                }`}
              >
                {brainOk ? "Brain online" : "Brain offline"}
              </span>
            )}
          </div>
          <p className="text-[15px] text-zinc-500">
            Your idea validation and build workspace
          </p>
        </div>
        <Link
          href="/validate"
          className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-6 py-2.5 rounded-full text-white transition text-center"
        >
          + New validation
        </Link>
      </div>

      {/* Quick tools */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="glass rounded-2xl p-5 hover:bg-white/[0.04] transition block"
          >
            <h3 className="text-[14px] font-medium mb-1.5">{t.title}</h3>
            <p className="text-[12px] text-zinc-500 leading-relaxed mb-3">
              {t.desc}
            </p>
            <p className="text-[12px] text-violet-400">{t.cta} →</p>
          </Link>
        ))}
      </div>

      {/* History */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-medium">Recent validations</h2>
        <p className="text-[12px] text-zinc-500">
          {validations.length} total
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading...</div>
      ) : validations.length === 0 ? (
        <div className="glass rounded-2xl p-12 text