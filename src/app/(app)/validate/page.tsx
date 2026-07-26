"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ValidatePage() {
  const [idea, setIdea] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim() || loading) return

    setLoading(true)

    // Simulate research time
    await new Promise((resolve) => setTimeout(resolve, 2200))

    // For now we pass the idea via query (later we’ll save to DB)
    const encoded = encodeURIComponent(idea.trim())
    router.push(`/validate/result?idea=${encoded}`)
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
            Tip: Mention the problem, who it’s for, and what makes it different.
          </p>
          <button
            type="submit"
            disabled={loading || !idea.trim()}
            className="shrink-0 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Researching...
              </span>
            ) : (
              "Validate idea"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}