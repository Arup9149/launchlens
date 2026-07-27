import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { WaitlistForm } from "@/components/landing/waitlist-form"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">
        <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400/80 mb-6">
          Know before you build
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-6">
          Validate indie ideas
          <br />
          <span className="text-zinc-500">with a real product Brain</span>
        </h1>
        <p className="text-[17px] text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
          LaunchLens scores your SaaS idea, explains demand and competition,
          then helps you polish, expand, and design the MVP architecture —
          before you write production code.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/validate"
            className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition"
          >
            Validate an idea
          </Link>
          <Link
            href="/workshop"
            className="text-[14px] font-medium px-7 py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
          >
            Open Workshop
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500 mb-8 text-center">
          How it works
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Validate",
              desc: "Describe the idea. The Brain returns score, Go/Pivot/Kill, demand, competition, risks, and next steps.",
            },
            {
              step: "02",
              title: "Polish & expand",
              desc: "Sharpen problem, ICP, and wedge. Generate adjacent opportunities with clearer scope and upside.",
            },
            {
              step: "03",
              title: "Architect",
              desc: "Get modules, tech stack, system flow, and a 30-day build plan you can actually execute.",
            },
          ].map((item) => (
            <div key={item.step} className="glass rounded-2xl p-6">
              <p className="text-[12px] text-violet-400 mb-3">{item.step}</p>
              <h3 className="text-[16px] font-medium mb-2">{item.title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Local Brain",
              desc: "Runs on your machine via Ollama for private, zero-cost analysis while you build.",
            },
            {
              title: "Evidence-style report",
              desc: "Score breakdown, verdict, confidence, demand, competition, risks, and recommended actions.",
            },
            {
              title: "Workshop tools",
              desc: "Polish Garage, Related Idea Generator, and MVP Architecture Brain in one workspace.",
            },
            {
              title: "Builder handoff",
              desc: "Jump from a report into polish, expansion, or architecture with the idea already loaded.",
            },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <h3 className="text-[15px] font-medium mb-2">{f.title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="glass-strong rounded-3xl p-10 border border-violet-500/20">
          <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400 mb-4">
            Full report
          </p>
          <h2 className="text-3xl font-medium tracking-tight mb-3">
            ₹5,999 per validation
          </h2>
          <p className="text-[15px] text-zinc-400 mb-8 max-w-md mx-auto">
            One focused analysis for founders who want clarity before committing
            weeks of build time. Workshop tools included in the product.
          </p>
          <Link
            href="/validate"
            className="inline-flex bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-8 py-3 rounded-full text-white transition"
          >
            Start validation
          </Link>
        </div>
      </section>

      {/* Waitlist */}
      <section className="max-w-xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-medium tracking-tight mb-3">
          Get early updates
        </h2>
        <p className="text-[14px] text-zinc-500 mb-8">
          Join the waitlist for product updates and new Workshop tools.
        </p>
        <WaitlistForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 text-center">
        <p className="text-[13px] text-zinc-600">
          LaunchLens · Know before you build
        </p>
      </footer>
    </main>
  )
}