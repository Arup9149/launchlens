import { Navbar } from "@/components/landing/navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07070a]">
      <Navbar />

      {/* ====================== HERO ====================== */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-24 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[12px] text-zinc-400 mb-10 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Private beta · Limited seats
          </div>

          <h1 className="text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] font-medium tracking-[-0.03em] leading-[1.08] mb-7">
            Know before
            <br className="hidden sm:block" />
            <span className="gradient-text italic"> you build.</span>
          </h1>

          <p className="text-[17px] sm:text-[18px] text-zinc-400 max-w-xl mx-auto leading-relaxed mb-12 font-light">
            LaunchLens validates SaaS ideas with real market evidence, helps you refine them with an Intelligent Brain, and lets you test a demo in the Workshop — before a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
            <a
              href="#waitlist"
              className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition-all duration-300 shadow-lg shadow-violet-500/25"
            >
              Join the waitlist
            </a>
            <a
              href="#product"
              className="text-[14px] font-medium px-7 py-3 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              See how it works
            </a>
          </div>

          <div className="flex items-center justify-center gap-3 text-[13px] text-zinc-500">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500/80 to-violet-700 border border-[#07070a]" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500/80 to-pink-600 border border-[#07070a]" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/80 to-blue-600 border border-[#07070a]" />
            </div>
            <span>480+ founders already waiting</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ====================== PRODUCT ====================== */}
      <section id="product" className="py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mb-20">
            <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400/80 mb-4">
              Product
            </p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
              Evidence first.
              <br />
              <span className="text-zinc-500">Everything else second.</span>
            </h2>
          </div>

          <div className="space-y-0">
            <div className="py-12 border-t border-white/[0.05] flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
              <div className="md:w-48 shrink-0">
                <p className="text-[13px] text-zinc-500 tracking-wide">01 — Research</p>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-3">Real market signals</h3>
                <p className="text-[15px] text-zinc-400 leading-relaxed max-w-xl">
                  Multi-agent research pulls live demand from Reddit, G2, Product Hunt, competitors and trends. Every claim is source-linked. No generic LLM opinions.
                </p>
              </div>
            </div>

            <div className="py-12 border-t border-white/[0.05] flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
              <div className="md:w-48 shrink-0">
                <p className="text-[13px] text-zinc-500 tracking-wide">02 — Brain</p>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-3">Intelligent Brain</h3>
                <p className="text-[15px] text-zinc-400 leading-relaxed max-w-xl">
                  A context-aware co-pilot that remembers your idea, challenges weak assumptions, and helps you sharpen the ICP, wedge and pricing in real time.
                </p>
              </div>
            </div>

            <div className="py-12 border-t border-b border-white/[0.05] flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
              <div className="md:w-48 shrink-0">
                <p className="text-[13px] text-zinc-500 tracking-wide">03 — Verdict</p>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-3">Clear Go / Pivot / Kill</h3>
                <p className="text-[15px] text-zinc-400 leading-relaxed max-w-xl">
                  Transparent score with full reasoning. Realistic indie-scale revenue lens ($5k–20k MRR). A decision you can actually act on.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== WORKSHOP ====================== */}
      <section id="workshop" className="py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-strong rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 sm:p-14 flex flex-col justify-center">
                <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400/80 mb-4">
                  Pro
                </p>
                <h2 className="text-3xl font-medium tracking-tight mb-5 leading-tight">
                  The Workshop
                </h2>
                <p className="text-[15px] text-zinc-400 leading-relaxed mb-8">
                  A calm space to refine the idea with the Brain. Adjust problem, ICP, pricing and wedge. Generate a demo landing page. Preview early market response — all before you invest weeks of building.
                </p>

                <div className="space-y-4 text-[14px] text-zinc-300">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-violet-400" />
                    Side-by-side original vs polished idea
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-violet-400" />
                    One-click demo landing generation
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-violet-400" />
                    Simulated early results preview
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-violet-400" />
                    Export PRD for Cursor, v0 or Lovable
                  </div>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-violet-950/40 via-transparent to-fuchsia-950/20 p-10 sm:p-14 flex items-center justify-center min-h-[340px]">
                <div className="w-full max-w-sm">
                  <div className="glass rounded-2xl p-5 shadow-2xl">
                    <div className="flex items-center gap-1.5 mb-5">
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <span className="text-[11px] text-zinc-500 ml-2 tracking-wide">
                        Workshop
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-3.5">
                        <p className="text-[11px] text-zinc-500 mb-1 tracking-wide">
                          Original
                        </p>
                        <p className="text-[13px] text-zinc-300 leading-snug">
                          AI tool that validates SaaS ideas
                        </p>
                      </div>
                      <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3.5">
                        <p className="text-[11px] text-violet-400 mb-1 tracking-wide">
                          Polished wedge
                        </p>
                        <p className="text-[13px] text-zinc-200 leading-snug">
                          Evidence-first validation + Workshop for solo founders
                        </p>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/[0.05] py-2 text-center">
                          <p className="text-[11px] text-zinc-500">Score</p>
                          <p className="text-[15px] font-medium text-zinc-200">84</p>
                        </div>
                        <div className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-2 text-center">
                          <p className="text-[11px] text-emerald-400/80">Verdict</p>
                          <p className="text-[15px] font-medium text-emerald-400">Go</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== PRICING ====================== */}
      <section id="pricing" className="py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400/80 mb-4">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
              Simple. Transparent.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Free */}
            <div className="glass rounded-2xl p-8 flex flex-col">
              <p className="text-[13px] text-zinc-400 mb-1">Starter</p>
              <p className="text-3xl font-medium tracking-tight mb-6">Free</p>
              <ul className="space-y-3 text-[13px] text-zinc-400 mb-10 flex-1">
                <li>1 limited validation</li>
                <li>Basic score & verdict</li>
                <li>Watermarked report</li>
              </ul>
              <a
                href="#waitlist"
                className="text-center text-[13px] font-medium py-2.5 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
              >
                Get started
              </a>
            </div>

            {/* Core */}
            <div className="relative glass-strong rounded-2xl p-8 flex flex-col border-violet-500/20">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-violet-600 text-[11px] font-medium tracking-wide">
                Popular
              </div>
              <p className="text-[13px] text-zinc-400 mb-1">Validation</p>
              <p className="text-3xl font-medium tracking-tight mb-1">₹5,999</p>
              <p className="text-[12px] text-zinc-500 mb-6">per idea</p>
              <ul className="space-y-3 text-[13px] text-zinc-300 mb-10 flex-1">
                <li>Full multi-agent research</li>
                <li>Source-linked evidence</li>
                <li>PDF report export</li>
                <li>Intelligent Brain access</li>
                <li>Indie revenue estimate</li>
              </ul>
              <a
                href="#waitlist"
                className="bg-gradient-to-r from-violet-500 to-violet-600 text-center text-[13px] font-medium py-2.5 rounded-full text-white hover:from-violet-400 hover:to-violet-500 transition"
              >
                Get early access
              </a>
            </div>

            {/* Pro */}
            <div className="glass rounded-2xl p-8 flex flex-col">
              <p className="text-[13px] text-zinc-400 mb-1">Workshop Pro</p>
              <p className="text-3xl font-medium tracking-tight mb-1">₹19,999</p>
              <p className="text-[12px] text-zinc-500 mb-6">per year</p>
              <ul className="space-y-3 text-[13px] text-zinc-400 mb-10 flex-1">
                <li>Everything in Validation</li>
                <li>Unlimited validations*</li>
                <li>Full Workshop access</li>
                <li>Demo landing generation</li>
                <li>PRD export</li>
              </ul>
              <a
                href="#waitlist"
                className="text-center text-[13px] font-medium py-2.5 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
              >
                Join waitlist
              </a>
            </div>
          </div>
          <p className="text-center text-[12px] text-zinc-600 mt-8">
            *Fair use applies. Early access pricing may change after public launch.
          </p>
        </div>
      </section>

      {/* ====================== WAITLIST ====================== */}
      <section id="waitlist" className="py-28">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-4">
            Stop guessing.
          </h2>
          <p className="text-[15px] text-zinc-400 mb-10 leading-relaxed">
            Join the private beta. Get founding-member pricing and help shape the product.
          </p>

          <form className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-full px-5 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-violet-500 to-violet-600 px-7 py-3 rounded-full text-[14px] font-medium text-white whitespace-nowrap hover:from-violet-400 hover:to-violet-500 transition"
            >
              Join waitlist
            </button>
          </form>
          <p className="text-[12px] text-zinc-600 mt-5">No spam. Ever.</p>
        </div>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6h8M6 2v8"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[13px] font-medium">LaunchLens</span>
          </div>
          <p className="text-[12px] text-zinc-600">
            © 2026 LaunchLens. Built for founders who value evidence.
          </p>
        </div>
      </footer>
    </main>
  )
}