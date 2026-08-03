"use client"

import Link from "next/link"

export default function StarterGuidePage() {
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
              Starter setup guide
            </h1>
            <p className="text-[14px] text-zinc-500 mt-2">
              Install and finish base setup for a typical LaunchLens-recommended
              stack. After Architecture Brain, align tools to your idea.
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

      <div className="space-y-6">
        <section className="glass rounded-2xl p-6">
          <h2 className="text-[16px] font-medium mb-3">1. What you need</h2>
          <ul className="text-[14px] text-zinc-400 space-y-2 leading-relaxed">
            <li>• Node.js 20+ LTS from nodejs.org</li>
            <li>• VS Code (or Cursor)</li>
            <li>• Git</li>
            <li>• A free Supabase project (when your idea needs auth/data)</li>
            <li>• Razorpay test keys only if you charge in India first</li>
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-[16px] font-medium mb-3">2. Create the app</h2>
          <p className="text-[13px] text-zinc-500 mb-3">
            PowerShell / terminal — copy one block at a time:
          </p>
          <pre className="text-[12px] bg-black/40 border border-white/10 rounded-xl p-4 overflow-x-auto text-zinc-300 leading-relaxed">{`npx create-next-app@latest my-idea --typescript --tailwind --eslint --app --src-dir
cd my-idea
npm run dev`}</pre>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-[16px] font-medium mb-3">3. Project baseline</h2>
          <ul className="text-[14px] text-zinc-400 space-y-2 leading-relaxed">
            <li>• Keep `/` as marketing or simple landing</li>
            <li>• Put product UI under a clear route group</li>
            <li>• Add `.env.local` for keys — never commit secrets</li>
            <li>• Ship a thin vertical slice before extra pages</li>
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-[16px] font-medium mb-3">4. Stack alignment</h2>
          <p className="text-[14px] text-zinc-400 leading-relaxed mb-3">
            Run <strong className="text-zinc-200">Architecture Brain</strong> on
            your polished idea. Use the recommended stack there as source of
            truth. Common indie default:
          </p>
          <ul className="text-[14px] text-zinc-400 space-y-2">
            <li>• Next.js App Router</li>
            <li>• Tailwind</li>
            <li>• Supabase (auth + DB)</li>
            <li>• Razorpay or Stripe for payments</li>
            <li>• Vercel for deploy</li>
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-[16px] font-medium mb-3">5. Done means</h2>
          <ul className="text-[14px] text-zinc-400 space-y-2">
            <li>• `npm run dev` works</li>
            <li>• One real user flow works end-to-end</li>
            <li>• Env vars documented for yourself</li>
            <li>• Next step is Do’s & Don’ts — then build only the core wedge</li>
          </ul>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 print:hidden">
        <Link
          href="/guides/dos-donts"
          className="text-[14px] font-medium px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white transition"
        >
          Open Do’s & Don’ts →
        </Link>
        <Link
          href="/workshop/architecture"
          className="text-[14px] font-medium px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
        >
          Architecture Brain
        </Link>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: #111 !important;
          }
          .glass {
            background: white !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  )
}