import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Dashboard</h1>
        <p className="text-[15px] text-zinc-500">Your idea validation workspace</p>
      </div>

      <div className="glass rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-xl font-medium mb-2">No ideas yet</h2>
        <p className="text-[14px] text-zinc-500 mb-8 max-w-sm mx-auto">
          Start by validating your first SaaS idea with real market evidence.
        </p>
        <Link
          href="/validate"
          className="inline-flex bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-6 py-2.5 rounded-full text-white transition"
        >
          Validate an idea
        </Link>
      </div>
    </div>
  )
}