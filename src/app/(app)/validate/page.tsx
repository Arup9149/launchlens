"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UpgradePanel } from "@/components/founder/upgrade-panel"
import { isPaymentEnabled } from "@/lib/payments/flags"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function ValidatePage() {
  const [idea, setIdea] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [brainOk, setBrainOk] = useState<boolean | null>(null)
  const [brainMsg, setBrainMsg] = useState("")
  const [credits, setCredits] = useState<number | null>(null)
  const router = useRouter()

  const paymentEnabled = isPaymentEnabled()
  const skipPayment =
    !paymentEnabled || process.env.NEXT_PUBLIC_SKIP_PAYMENT === "true"

  useEffect(() => {
    const saved = localStorage.getItem("ll_email")
    if (saved) setEmail(saved)

    fetch("/api/brain/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setBrainOk(!!(d.online ?? d.ok))
        setBrainMsg(d.message || "")
      })
      .catch(() => {
        setBrainOk(false)
        setBrainMsg("Could not reach Brain")
      })
  }, [])

  useEffect(() => {
    const e = email.trim().toLowerCase()
    if (e.includes("@")) localStorage.setItem("ll_email", e)
    fetch("/api/credits", { cache: "no-store" })
      .then((r) => {
        if (r.status === 401) {
          setCredits(null)
          return null
        }
        return r.json()
      })
      .then((d) => {
        if (!d) return
        setCredits(typeof d.credits === "number" ? d.credits : 0)
      })
      .catch(() => setCredits(null))
  }, [email])

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
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
  }

  const useCredit = async () => {
    const res = await fetch("/api/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "use" }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "No Founder Validations remaining")
    }
    setCredits(typeof data.credits === "number" ? data.credits : 0)
    return data
  }

  const verifyPayment = async (response: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => {
    const res = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "Payment verification failed")
    }
    setCredits(typeof data.credits === "number" ? data.credits : null)
    return data
  }

  const unlockGuides = () => {
    localStorage.setItem("ll_guides_unlocked", "1")
  }

  const goToResult = (
    analysis: any,
    score: number,
    verdict: string,
    confidence: number,
    validationId?: string
  ) => {
    sessionStorage.setItem(
      "ll_analysis",
      JSON.stringify({ idea: idea.trim(), ...analysis })
    )
    const params = new URLSearchParams({
      idea: idea.trim(),
      score: String(score),
      verdict,
      confidence: String(confidence),
      paid: "1",
    })
    if (validationId) params.set("id", validationId)
    router.push(`/validate/result?${params.toString()}`)
  }

  const runAnalysisAndSave = async () => {
    setStatus("Running your idea through the Brain…")
    const analyzeRes = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: idea.trim() }),
    })
    const analyzeData = await analyzeRes.json()
    if (!analyzeRes.ok || !analyzeData.analysis) {
      throw new Error(analyzeData.error || "Brain analysis failed")
    }
    const analysis = analyzeData.analysis
    const score = analysis.score
    const verdict = analysis.verdict
    const confidence = analysis.confidence
    setStatus("Saving your validation…")
    const saveRes = await fetch("/api/validations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idea: idea.trim(),
        score,
        verdict,
        confidence,
        analysis: { idea: idea.trim(), ...analysis },
      }),
    })
    const saveData = await saveRes.json()
    return {
      analysis,
      score,
      verdict,
      confidence,
      validationId: saveData?.id as string | undefined,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim() || loading) return

    const userEmail = email.trim().toLowerCase()
    if (!userEmail.includes("@")) {
      alert(
        "Add the email tied to your Early Founder account so we can unlock your report."
      )
      return
    }

    localStorage.setItem("ll_email", userEmail)

    if (brainOk === false) {
      alert(
        brainMsg ||
          "Brain is temporarily unavailable. Check OPENROUTER_API_KEY on the host and try again."
      )
      return
    }

    setLoading(true)
    setStatus("Checking your Founder Validations…")

    try {
      const creditRes = await fetch("/api/credits", { cache: "no-store" })
      if (creditRes.status === 401) {
        alert("Sign in to validate and unlock your Founder Validations.")
        setLoading(false)
        setStatus("")
        return
      }
      const creditData = await creditRes.json()
      const remaining =
        typeof creditData.credits === "number" ? creditData.credits : 0
      setCredits(remaining)

      if (remaining < 1 && !paymentEnabled) {
        setLoading(false)
        setStatus("")
        return
      }

      if (remaining < 1 && paymentEnabled && !skipPayment) {
        const { analysis, score, verdict, confidence, validationId } =
          await runAnalysisAndSave()

        setStatus("Opening secure checkout…")
        const orderRes = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea: idea.trim(),
            score,
            verdict,
            confidence,
          }),
        })
        const orderData = await orderRes.json()
        if (!orderData.orderId) {
          throw new Error(
            orderData.error ||
              "Checkout is temporarily unavailable. Try again or contact the founder."
          )
        }

        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
          throw new Error(
            "Checkout is temporarily unavailable. Try again shortly."
          )
        }

        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "LaunchLens",
          description: "Builder Pass · Founder Validations",
          order_id: orderData.orderId,
          prefill: { email: userEmail },
          handler: async function (rzpResponse: {
            razorpay_order_id: string
            razorpay_payment_id: string
            razorpay_signature: string
          }) {
            try {
              setStatus("Confirming payment…")
              await verifyPayment(rzpResponse)
              try {
                await useCredit()
              } catch {
                /* balance may already reflect webhook grant */
              }
              unlockGuides()
              goToResult(analysis, score, verdict, confidence, validationId)
            } catch (err: any) {
              console.error(err)
              alert(
                err.message ||
                  "Payment could not be confirmed. Contact the founder with your payment id."
              )
              setLoading(false)
              setStatus("")
            }
          },
          theme: { color: "#7c3aed" },
          modal: {
            ondismiss: function () {
              setLoading(false)
              setStatus("")
            },
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
        return
      }

      if (remaining > 0) {
        setStatus("Using 1 Founder Validation…")
        await useCredit()
      }

      const { analysis, score, verdict, confidence, validationId } =
        await runAnalysisAndSave()

      unlockGuides()
      setStatus("Opening your report…")
      goToResult(analysis, score, verdict, confidence, validationId)
    } catch (err: any) {
      console.error(err)
      const msg = String(err?.message || "")
      if (/order failed|razorpay|payment/i.test(msg) && !paymentEnabled) {
        alert(
          "Builder Pass is coming soon. You've used your Founder Validations — join the priority list on this page."
        )
      } else {
        alert(msg || "Something went wrong. Please try again.")
      }
      setLoading(false)
      setStatus("")
    }
  }

  const exhausted = credits !== null && credits < 1 && !paymentEnabled

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-medium tracking-tight">
            Validate an idea
          </h1>
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
        <p className="text-[15px] text-zinc-500 leading-relaxed mb-4">
          Early Founder Beta — describe your idea and use a Founder Validation
          for a full Brain report.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-2">
          <div className="glass rounded-2xl px-4 py-3 inline-flex items-center gap-3">
            <span className="text-[16px] font-medium">₹799</span>
            <span className="text-[11px] text-zinc-400">
              Builder Pass · Coming Soon
            </span>
          </div>
          {credits !== null && (
            <div className="text-[12px] text-zinc-400">
              Founder Validations remaining:{" "}
              <span className="text-white font-medium">{credits}</span>
            </div>
          )}
        </div>

        {brainMsg && !brainOk && (
          <p className="text-[13px] text-red-400/90 mt-2">{brainMsg}</p>
        )}
        {!paymentEnabled && (
          <p className="text-[12px] text-violet-400/90 mt-2">
            Early Founder Beta · 3 free Founder Validations · no payment required
          </p>
        )}
      </div>

      {exhausted ? (
        <UpgradePanel email={email} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[13px] text-zinc-400 mb-2.5">
              Email (for Founder Validations)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 text-[15px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition"
            />
          </div>

          <div>
            <label className="block text-[13px] text-zinc-400 mb-2.5">
              Your idea
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe the product clearly — problem, who it is for, and why now..."
              rows={7}
              required
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-[15px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] text-zinc-600">
              {credits && credits > 0
                ? "Uses 1 Founder Validation · free during Beta"
                : paymentEnabled
                  ? "Builder Pass unlocks more validations"
                  : "Sign in to load your Founder Validations"}
            </p>
            <button
              type="submit"
              disabled={loading || !idea.trim() || brainOk === false}
              className="shrink-0 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {status || "Working on it…"}
                </span>
              ) : credits && credits > 0 ? (
                "Validate Free"
              ) : paymentEnabled ? (
                "Continue"
              ) : (
                "Use 1 Founder Validation"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
