"use client"

import Link from "next/link"

export default function DosDontsPage() {
  const handlePrint = () => window.print()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8 print:hidden">
        <Link
          href="/dashboard"
          className="text-[13px] text-zinc-500 hover:text-white transition mb-4 inline-block"
        >
          ← Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.15em] text-violet-400 mb-2">
              Early Bird guide
            </p>
            <h1 className="text-3xl font-medium tracking-tight">
              Do’s & Don’ts
            </h1>
            <p className="text-[14px] text-zinc-500 mt-2">
              Stay alert while building. This page is your completion checklist
              before you expand scope.
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="text-[13px] font-medium px-5 py-2.5 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <section className="glass rounded-2xl p-6 border border-emerald-500/20">
          <h2 className="text-[15px] font-medium text-emerald-400 mb-4">Do</h2>
          <ul className="text-[13px] text-zinc-400 space-y-3 leading-relaxed">
            <li>• Write the problem in one sentence before coding</li>
            <li>• Talk to 5 target users in the first week</li>
            <li>• Build the smallest path that proves the wedge</li>
            <li>• Keep a daily 60–90 min focused build block</li>
            <li>• Log assumptions and mark which are untested</li>
            <li>• Ship a rough demo before polishing UI</li>
            <li>• Use Architecture Brain output as the build order</li>
            <li>• Stop and re-validate if the ICP keeps shifting</li>
          </ul>
        </section>

        <section className="glass rounded-2xl p-6 border border-red-500/20">
          <h2 className="text-[15px] font-medium text-red-400 mb-4">Don’t</h2>
          <ul className="text-[13px] text-zinc-400 space-y-3 leading-relaxed">
            <li>• Don’t add 10 features before one paying workflow</li>
            <li>• Don’t redesign the landing every day</li>
            <li>• Don’t hide from user conversations</li>
            <li>• Don’t copy a big competitor feature-for-feature</li>
            <li>• Don’t treat a Brain score as guaranteed demand</li>
            <li>• Don’t skip env safety and backups</li>
            <li>• Don’t expand to mobile/desktop until core works</li>
            <li>• Don’t price at zero “until it’s perfect”</li>
          </ul>
        </section>
      </div>

      <section className="glass-strong rounded-2xl p-6 border border-violet-500/20">
        <h2 className="text-[15px] font-medium mb-3">Completion feel</h2>
        <p className="text-[14px] text-zinc-400 leading-relaxed mb-4">
          You are “set up” when: idea is validated, stack is chosen, starter
          install works, and you know the single workflow you will build next.
          Everything else waits.
        </p>
        <p className="text-[14px] text-zinc-400 leading-relaxed">
          If you feel lost, return to Validate → Polish → Architecture, then
          only implement the first module in the build order.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3 print:hidden">
        <Link
          href="/guides/starter"
          className="text-[14px] font-medium px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
        >
          ← Starter guide
        </Link>
        <Link
          href="/workshop"
          className="text-[14px] font-medium px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white transition"
        >
          Back to Workshop
        </Link>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: #111 !important;
          }
          .glass,
          .glass-strong {
            background: white !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  )
}