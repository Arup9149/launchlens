import Link from "next/link"

export default function WorkshopPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400/80 mb-3">
          Workspace
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight mb-3">
          The Workshop
        </h1>
        <p className="text-[16px] text-zinc-400 max-w-2xl leading-relaxed">
          Polish the idea, expand opportunities, and design the MVP architecture
          with the same Brain that powers validation.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <Link
          href="/workshop/polish"
          className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition block"
        >
          <h3 className="text-[15px] font-medium mb-2">Idea Polishing Garage</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Refine problem, ICP, wedge and pricing. Run Brain Polish for sharper
            wording and updated scores.
          </p>
        </Link>

        <Link
          href="/workshop/related"
          className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition block"
        >
          <h3 className="text-[15px] font-medium mb-2">Related Idea Generator</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Discover broader and adjacent ideas with clearer scope and stronger
            upside.
          </p>
        </Link>

        <Link
          href="/workshop/architecture"
          className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition block"
        >
          <h3 className="text-[15px] font-medium mb-2">MVP Architecture Brain</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Generate system flow, modules, tech stack, risks, metrics, and a
            30-day build plan.
          </p>
        </Link>

        <Link
          href="/workshop/timer"
          className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition block"
        >
          <h3 className="text-[15px] font-medium mb-2">Builder Timer</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Focus sessions and intentional breaks so you stay in builder mode.
          </p>
        </Link>
      </div>

      <div className="glass-strong rounded-2xl p-8 text-center">
        <h2 className="text-xl font-medium mb-2">Start from a report</h2>
        <p className="text-[14px] text-zinc-400 mb-6 max-w-md mx-auto">
          Validate first, then continue into Workshop with the idea already
          loaded.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/validate"
            className="inline-flex bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition"
          >
            Validate an idea →
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex text-[14px] font-medium px-7 py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}