"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function ValidatePage() {
  const [idea, setIdea] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim() || loading) return

    setLoading(true)

    // Mock scoring
    const length = idea.trim().length
    const score = Math.min(92, Math.max(48, Math.floor(55 + length / 12 + Math.random() * 15)))
    const confidence = Math.min(95, Math.max(60, score - 5 + Math.floor(Math.random() * 12)))
    const verdict = score >= 75 ? "Go" : score >= 55 ? "Pivot" : "Kill"

    try {
      // Save to database first
      await fetch("/api/validations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), score, verdict, confidence }),
      })

      // Create Razorpay order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), score, verdict, confidence }),
      })

      const orderData = await orderRes.json()

      if (!orderData.orderId) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Load Razorpay
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert("Failed to load payment gateway")
        setLoading(false)
        return
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LaunchLens",
        description: "Full Validation Report",
        order_id: orderData.orderId,
        handler: function (response: any) {
          // Payment successful → go to result
          const params = new URLSearchParams({
            idea: idea.trim(),
            score: String(score),
            verdict,
            confidence: String(confidence),
            paid: "1",
          })
          router.push(`/validate/result?${params.toString()}`)
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight mb-2">
          Validate an idea
        </h1>
        <p className="text-[15px] text-zinc-500 leading-relaxed">
          Describe your SaaS idea clearly. We’ll research real market signals and give you a transparent Go / Pivot / Kill verdict.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[13px] text-zinc-400 mb-2.5">
            Your idea
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: An AI workspace that helps solo founders validate SaaS ideas with real demand data from Reddit, G2 and Product Hunt, then polish the idea in a Workshop before writing code..."
            rows={7}
            required
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-[15px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-[13px] text-zinc-600">
            ₹5,999 · Full evidence report
          </p>
          <button
            type="submit"
            disabled={loading || !idea.trim()}
            className="shrink-0 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              "Validate idea · ₹5,999"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}