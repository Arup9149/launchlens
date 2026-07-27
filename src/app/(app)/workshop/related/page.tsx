"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

type RelatedIdea = {
  title: string
  description: string
  angle: string
  scope: string
  upside: string
}

function RelatedIdeasPageInner() {
  const searchParams = useSearchParams()
  const [idea, setIdea] = useState("")
  const [ideas, setIdeas] = useState<RelatedIdea[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = searchParams.get("idea")
    if (q) setIdea(q)
  }, [searchParams])

  const handleGenerate = async () => {
    if (!idea.trim() || loading) return
    setLoading(true)
    setIdeas([])

    try {
      const res = await fetch("/api/related", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Generation failed")

      setIdeas(data.ideas || [])
    } catch (err: any) {
      alert(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <Link
          href="/workshop"
          className="text-[13px] text-zinc-500 hover:text-white transition mb-4 inline-block"
        >
          ← Back to Workshop
        </Link>
        <h1 className="text-3xl font-medium tracking-tight mb-2">
          Related Idea Generator
        </h1>
        <p className="text-[15px] text-zinc-400">
          Discover broader and adjacent opportunities based on your core idea.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <label className="block text-[13px] text-zinc-400 mb-2">
          Your core idea
        </label>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Paste the idea you want to expand..."
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
              Brain is expanding...
            </span>
          ) : (
            "Generate related ideas"
          )}
        </button>
      </div>

      {ideas.length > 0 && (
        <div className="space-y-4">
          <p className="text-[13px] text-zinc-500 mb-2">
            Expanded opportunities
          </p>
          {ideas.map((item, idx) => (
            <div key={idx} className="glass rounded-2xl p-5">
              <h3 className="text-[15px] font-medium mb-1.5">{item.title}</h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
                <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                  <p className="text-zinc-500 mb-0.5">Angle</p>
                  <p className="text-zinc-300">{item.angle}</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                  <p className="text-zinc-500 mb-0.5">Scope</p>
                  <p className="text-zinc-300">{item.scope}</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                  <p className="text-zinc-500 mb-0.5">Upside</p>
                  <p className="text-violet-300">{item.upside}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RelatedIdeasPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-zinc-500">Loading...</div>
      }
    >
      <RelatedIdeasPageInner />
    </Suspense>
  )
}