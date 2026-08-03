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
  const [email, setEmail] = useState("")
  const [credits, setCredits] = useState<number | null>(null)
  const [plan, setPlan] = useState<string | null>(null)
  const [creditMsg, setCreditMsg] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("ll_email")
    if (saved) setEmail(saved)

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

  useEffect(() => {
    if (!email || !email.includes("@")) {
      setCredits(null)
      return
    }
    localStorage.setItem("ll_email", email.trim().toLowerCase())
    fetch(`/api/credits?email=${encodeURIComponent(email.trim().toLowerCase())}`)
      .then((r) => r.json())
      .then((d) => {
        setCredits(typeof d.credits === "number" ? d.credits : 0)
        setPlan(d.plan || null)
      })
      .catch(() => setCredits(0))
  }, [email])

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
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

      {/* Credits panel */}
      <div className="glass-strong rounded-2xl p-5 mb-10 border border-violet-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.15em] text-violet-400 mb-1">
              Validation credits
            </p>
            <p className="text-[28px] font-medium tracking-tight">
              {credits === null ? "—" : credits}
              <span className="text-[14px] text-zinc-500 font-normal ml-2">
                remaining
              </span>
            </p>
            <p className="text-[12px] text-zinc-500 mt-1">
              {plan === "early_bird"
                ? "Early Bird plan · 2 validations pack"
                : plan
                ? `Plan: ${plan}`
                : "Enter the email you used at payment"}
            </p>
            {creditMsg && (
              <p className="text-[12px] text-emerald-400 mt-1">{creditMsg}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-2 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 min-w-[220px]"
            />
            <button
              onClick={() => {
                if (!email.includes("@")) {
                  setCreditMsg("Enter a valid email")
                  return
                }
                setCreditMsg("Credits refreshed")
                setEmail(email.trim().toLowerCase())
              }}
              className="text-[13px] px-4 py-2 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

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

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-medium">Recent validations</h2>
        <p className="text-[12px] text-zinc-500">{validations.length} total</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading...</div>
      ) : validations.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <h2 className="text-xl font-medium mb-2">No ideas yet</h2>
          <p className="text-[14px] text-zinc-500 mb-8 max-w-sm mx-auto">
            Start by validating your first idea with the Brain.
          </p>
          <Link
            href="/validate"
            className="inline-flex bg-gradient-to-r from-violet-500 to-violet-600 text-[14px] font-medium px-6 py-2.5 rounded-full text-white"
          >
            Validate an idea
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {validations.map((v) => {
            const params = new URLSearchParams({
              idea: v.idea,
              score: String(v.score ?? ""),
              verdict: v.verdict ?? "",
              confidence: String(v.confidence ?? 80),
              id: v.id,
            })
            return (
              <Link
                key={v.id}
                href={`/validate/result?${params.toString()}`}
                className="glass rounded-2xl p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition block"
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
                    <p
                      className={`text-[15px] font-medium ${getVerdictColor(
                        v.verdict
                      )}`}
                    >
                      {v.verdict}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}