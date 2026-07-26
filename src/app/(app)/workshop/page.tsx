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

      {/* Coming soon grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {[
          {
            title: "Idea Polishing Garage",
            desc: "Refine problem, ICP, wedge and pricing. Watch your score improve in real time.",
          },
          {
            title: "Deeper Market Research",
            desc: "Extra layers of demand signals, SEO opportunity, and competitor teardown.",
          },
          {
            title: "Related Idea Generator",
            desc: "Discover broader and adjacent ideas with higher potential based on your original concept.",
          },
          {
            title: "MVP Architecture Brain",
            desc: "Generate system maps, feature blueprints, and downloadable PRDs ready for Cursor / v0.",
          },
          {
            title: "Templates Library",
            desc: "Proven structures for landing pages, pricing, onboarding, and launch sequences.",
          },
          {
            title: "Score Improvement Loop",
            desc: "Iterate on the idea until the validation score crosses your target threshold.",
          },
        ].map((item) => (
          <div key={item.title} className="glass rounded-2xl p-6">
            <h3 className="text-[15px] font-medium mb-2">{item.title}</h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="glass-strong rounded-2xl p-8 text-center">
        <h2 className="text-xl font-medium mb-2">Workshop is under construction</h2>
        <p className="text-[14px] text-zinc-400 mb-6 max-w-md mx-auto">
          We’re building the full intelligent workhouse. For now, start with a Validation Report.
        </p>
        <Link
          href="/validate"
          className="inline-flex bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition"
        >
          Run a Validation →
        </Link>
      </div>
    </div>
  )
}