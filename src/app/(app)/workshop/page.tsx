import Link from "next/link"

export default function WorkshopPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400/80 mb-3">
          Pro Feature
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight mb-3">
          The Workshop
        </h1>
        <p className="text-[16px] text-zinc-400 max-w-2xl leading-relaxed">
          A full intelligent workspace to polish your idea, increase its score,
          explore adjacent opportunities, and design the MVP architecture —
          before you write production code.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {/* 1. Idea Polishing Garage */}
        <Link
          href="/workshop/polish"
          className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition block"
        >
          <h3 className="text-[15px] font-medium mb-2">Idea Polishing Garage</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Refine problem, ICP, wedge and pricing. Watch your score and market parameters improve in real time.
          </p>
        </Link>

        {/* 2. Related Idea Generator */}
        <Link
          href="/workshop/related"
          className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition block"
        >
          <h3 className="text-[15px] font-medium mb-2">Related Idea Generator</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Discover broader and adjacent ideas with clearer scope and stronger upside.
          </p>
        </Link>

        {/* 3. MVP Architecture Brain */}
        <Link
          href="/workshop/architecture"
          className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition block"
        >
          <h3 className="text-[15px] font-medium mb-2">MVP Architecture Brain</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Generate system maps, feature blueprints, and a clear build order for your MVP.
          </p>
        </Link>

        {/* Coming soon */}
        <div className="glass rounded-2xl p-6 opacity-60">
          <h3 className="text-[15px] font-medium mb-2">Deeper Market Research</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Extra layers of demand signals, SEO opportunity, and competitor teardown.
          </p>
        </div>
        <Link
  href="/workshop/timer"
  className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition block"
>
  <h3 className="text-[15px] font-medium mb-2">Builder Timer</h3>
  <p className="text-[13px] text-zinc-500 leading-relaxed">
    Focus sessions and intentional breaks so you actually ship instead of switching tasks.
  </p>
</Link>

        <div className="glass rounded-2xl p-6 opacity-60">
          <h3 className="text-[15px] font-medium mb-2">Templates Library</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Proven structures for landing pages, pricing, onboarding, and launch sequences.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 opacity-60">
          <h3 className="text-[15px] font-medium mb-2">Score Improvement Loop</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Iterate on the idea until the validation score crosses your target threshold.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="glass-strong rounded-2xl p-8 text-center">
        <h2 className="text-xl font-medium mb-2">More tools coming soon</h2>
        <p className="text-[14px] text-zinc-400 mb-6 max-w-md mx-auto">
          We’re building the full intelligent workhouse. Start with any of the live tools above.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/workshop/polish"
            className="inline-flex bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition"
          >
            Open Polishing Garage →
          </Link>
          <Link
            href="/validate"
            className="inline-flex text-[14px] font-medium px-7 py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
          >
            Run Validation
          </Link>
        </div>
      </div>
    </div>
  )
}