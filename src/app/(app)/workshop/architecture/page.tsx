"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

declare global {
  interface Window {
    Razorpay: any
  }
}

type FlowStep = { title: string; desc: string }
type Module = { name: string; detail: string; tip: string }
type Tech = { name: string; type: string; why: string; url?: string }
type Week = { week: string; focus: string }

function ArchitecturePageInner() {
  const searchParams = useSearchParams()
  const [idea, setIdea] = useState("")
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [guideLoading, setGuideLoading] = useState(false)

  const [potentialScore, setPotentialScore] = useState(70)
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [techStack, setTechStack] = useState<Tech[]>([])
  const [buildOrder, setBuildOrder] = useState<string[]>([])
  const [risks, setRisks] = useState<string[]>([])
  const [metrics, setMetrics] = useState<string[]>([])
  const [thirtyDayPlan, setThirtyDayPlan] = useState<Week[]>([])

  useEffect(() => {
    const q = searchParams.get("idea")
    if (q) setIdea(q)
  }, [searchParams])

  const handleGenerate = async () => {
    if (!idea.trim() || loading) return
    setLoading(true)

    try {
      const res = await fetch("/api/architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Generation failed")

      setPotentialScore(data.potentialScore ?? 70)
      setFlowSteps(data.flowSteps || [])
      setModules(data.modules || [])
      setTechStack(data.techStack || [])
      setBuildOrder(data.buildOrder || [])
      setRisks(data.risks || [])
      setMetrics(data.metrics || [])
      setThirtyDayPlan(data.thirtyDayPlan || [])
      setGenerated(true)
    } catch (err: any) {
      alert(err.message || "Architecture generation failed")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  const handleBuyGuide = async () => {
    try {
      setGuideLoading(true)
      const res = await fetch("/api/razorpay/guide", { method: "POST" })
      const data = await res.json()
      if (!data.orderId) throw new Error(data.error || "Order failed")

      const loadScript = () =>
        new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true)
            return
          }
          const script = document.createElement("script")
          script.src = "https://checkout.razorpay.com/v1/checkout.js"
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })

      const ok = await loadScript()
      if (!ok) {
        alert("Failed to load payment gateway")
        setGuideLoading(false)
        return
      }

      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "LaunchLens",
        description: "Coding Starter Guide",
        order_id: data.orderId,
        handler: function () {
          alert(
            "Payment successful!\n\nGuide access will be unlocked shortly.\n\n(In production this redirects to the actual guide.)"
          )
        },
        theme: { color: "#059669" },
        modal: {
          ondismiss: function () {
            setGuideLoading(false)
          },
        },
      })

      rzp.open()
      setGuideLoading(false)
    } catch (err) {
      console.error(err)
      alert("Unable to start payment. Please try again.")
      setGuideLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10 print:hidden">
        <Link
          href="/workshop"
          className="text-[13px] text-zinc-500 hover:text-white transition mb-4 inline-block"
        >
          ← Back to Workshop
        </Link>
        <h1 className="text-3xl font-medium tracking-tight mb-2">
          MVP Architecture Brain
        </h1>
        <p className="text-[15px] text-zinc-400 max-w-2xl">
          A complete, work-oriented blueprint for your idea — system flow,
          modules, stack, and execution plan.
        </p>
      </div>

      {!generated && (
        <div className="glass rounded-2xl p-6 mb-8 print:hidden">
          <label className="block text-[13px] text-zinc-400 mb-2">
            Your polished idea
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Paste the refined version of your idea here..."
            rows={4}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition resize-none mb-4"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim()}
            className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-6 py-2.5 rounded-full text-white transition disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Designing architecture...
              </span>
            ) : (
              "Generate Full Blueprint"
            )}
          </button>
        </div>
      )}

      {generated && (
        <div className="space-y-8 print:space-y-6">
          <div className="relative overflow-hidden glass-strong rounded-2xl p-6 border border-violet-500/20 print:border print:border-zinc-300 print:bg-white">
            <div className="relative grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <p className="text-[11px] uppercase tracking-[0.15em] text-violet-400 mb-2 print:text-zinc-500">
                  Your Idea
                </p>
                <p className="text-[15px] text-zinc-200 leading-relaxed print:text-zinc-800">
                  {idea}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-3">
                  Build Potential
                </p>
                <p className="text-4xl font-medium mb-1">{potentialScore}</p>
                <p className="text-[12px] text-zinc-500">out of 100</p>
              </div>
            </div>
          </div>

          {flowSteps.length > 0 && (
            <div className="glass rounded-2xl p-6 print:border print:border-zinc-300 print:bg-white">
              <h3 className="text-[15px] font-medium mb-1 print:text-zinc-900">
                System Flow
              </h3>
              <p className="text-[12px] text-zinc-500 mb-6">
                How a user moves through the product
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {flowSteps.map((step, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-center print:border print:border-zinc-200 print:bg-zinc-50"
                  >
                    <p className="text-[12px] text-violet-400 mb-1 print:text-violet-700">
                      0{i + 1}
                    </p>
                    <p className="text-[13px] font-medium text-zinc-200 mb-1 print:text-zinc-800">
                      {step.title}
                    </p>
                    <p className="text-[11px] text-zinc-500">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {modules.length > 0 && (
            <div className="glass rounded-2xl p-6 print:border print:border-zinc-300 print:bg-white">
              <h3 className="text-[15px] font-medium mb-1 print:text-zinc-900">
                Core Modules
              </h3>
              <p className="text-[12px] text-zinc-500 mb-5 print:hidden">
                Click any module for details
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {modules.map((mod) => (
                  <button
                    key={mod.name}
                    onClick={() =>
                      setExpandedModule(
                        expandedModule === mod.name ? null : mod.name
                      )
                    }
                    className="text-left bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 rounded-xl px-4 py-3 transition print:border print:border-zinc-200 print:bg-zinc-50"
                  >
                    <p className="text-[13px] text-zinc-200 font-medium print:text-zinc-800">
                      {mod.name}
                    </p>
                    {(expandedModule === mod.name || true) && (
                      <div className="mt-2 space-y-2">
                        <p className="text-[12px] text-zinc-400 leading-relaxed print:text-zinc-600">
                          {mod.detail}
                        </p>
                        {mod.tip && (
                          <p className="text-[12px] text-violet-300/90 leading-relaxed print:text-violet-700">
                            <span className="font-medium">Builder tip:</span>{" "}
                            {mod.tip}
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {techStack.length > 0 && (
            <div className="glass rounded-2xl p-6 print:border print:border-zinc-300 print:bg-white">
              <h3 className="text-[15px] font-medium mb-1 print:text-zinc-900">
                Recommended Tech Stack
              </h3>
              <p className="text-[12px] text-zinc-500 mb-5">
                Click any item with a link to open docs
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {techStack.map((tech) => {
                  const content = (
                    <>
                      <p className="text-[11px] text-zinc-500 mb-1">{tech.type}</p>
                      <p className="text-[13px] text-zinc-200 font-medium mb-1.5 print:text-zinc-800">
                        {tech.name}
                      </p>
                      <p className="text-[12px] text-zinc-500 leading-relaxed mb-2 print:text-zinc-600">
                        {tech.why}
                      </p>
                      {tech.url ? (
                        <p className="text-[12px] text-violet-400 print:text-violet-700">
                          Open resource →
                        </p>
                      ) : null}
                    </>
                  )

                  return tech.url ? (
                    <a
                      key={tech.name}
                      href={tech.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/40 rounded-xl p-4 transition print:border print:border-zinc-200 print:bg-zinc-50"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={tech.name}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 print:border print:border-zinc-200 print:bg-zinc-50"
                    >
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {thirtyDayPlan.length > 0 && (
            <div className="glass rounded-2xl p-6 print:border print:border-zinc-300 print:bg-white">
              <h3 className="text-[15px] font-medium mb-4 print:text-zinc-900">
                First 30-Day Execution Plan
              </h3>
              <div className="space-y-4 text-[13px]">
                {thirtyDayPlan.map((w, i) => (
                  <div key={i}>
                    <p className="text-violet-400 font-medium mb-1 print:text-violet-700">
                      {w.week}
                    </p>
                    <p className="text-zinc-400 print:text-zinc-600">{w.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {buildOrder.length > 0 && (
            <div className="glass rounded-2xl p-6 print:border print:border-zinc-300 print:bg-white">
              <h3 className="text-[15px] font-medium mb-4 print:text-zinc-900">
                Recommended Build Order
              </h3>
              <ol className="space-y-3 text-[13px] text-zinc-300 print:text-zinc-700">
                {buildOrder.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-violet-400 font-medium w-6 print:text-violet-700">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {risks.length > 0 && (
              <div className="glass rounded-2xl p-6 print:border print:border-zinc-300 print:bg-white">
                <h3 className="text-[15px] font-medium mb-4 print:text-zinc-900">
                  Key Risks
                </h3>
                <ul className="space-y-2 text-[13px] text-zinc-400 print:text-zinc-600">
                  {risks.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            )}
            {metrics.length > 0 && (
              <div className="glass rounded-2xl p-6 print:border print:border-zinc-300 print:bg-white">
                <h3 className="text-[15px] font-medium mb-4 print:text-zinc-900">
                  Success Metrics
                </h3>
                <ul className="space-y-2 text-[13px] text-zinc-400 print:text-zinc-600">
                  {metrics.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="glass-strong rounded-2xl p-6 border border-emerald-500/25 print:border print:border-emerald-600 print:bg-emerald-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.15em] text-emerald-400 mb-1 print:text-emerald-700">
                  Micro Guide
                </p>
                <h3 className="text-[16px] font-medium mb-1 print:text-zinc-900">
                  How to start coding this idea
                </h3>
                <p className="text-[13px] text-zinc-400 max-w-md print:text-zinc-600">
                  VS Code setup, Cursor / v0 workflow, Supabase + Razorpay path,
                  and first commit checklist.
                </p>
                <p className="text-[13px] text-emerald-300 mt-2 print:text-emerald-700 font-medium">
                  ₹200 · Instant access
                </p>
              </div>
              <button
                onClick={handleBuyGuide}
                disabled={guideLoading}
                className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-[13px] font-medium px-6 py-2.5 rounded-full text-white transition print:hidden disabled:opacity-60"
              >
                {guideLoading ? "Opening..." : "Get the Guide · ₹200"}
              </button>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-violet-500/20 print:hidden">
            <div>
              <p className="text-[14px] font-medium mb-1">
                Download Full Blueprint (PDF)
              </p>
              <p className="text-[12px] text-zinc-500">
                Browser print → Save as PDF
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="shrink-0 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[13px] font-medium px-6 py-2.5 rounded-full text-white transition"
            >
              Download PDF
            </button>
          </div>

          <div className="text-center pt-2 print:hidden">
            <button
              onClick={() => {
                setGenerated(false)
                setExpandedModule(null)
              }}
              className="text-[13px] text-zinc-500 hover:text-white transition"
            >
              ← Generate for another idea
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          @page {
            margin: 1.2cm;
          }
          body {
            background: white !important;
            color: #111 !important;
          }
          .glass,
          .glass-strong {
            background: #fff !important;
            border: 1px solid #d4d4d8 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
          a {
            color: #5b21b6 !important;
            text-decoration: underline;
          }
        }
      `}</style>
    </div>
  )
}

export default function ArchitecturePage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-zinc-500">Loading...</div>
      }
    >
      <ArchitecturePageInner />
    </Suspense>
  )
}