import Link from "next/link"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TEMPORARY: Auth disabled so we can keep building
  // Remove this bypass later

  return (
    <div className="min-h-screen bg-[#07070a]">
      <header className="border-b border-white/[0.04] bg-[#07070a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-medium tracking-tight">LaunchLens</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6 text-[13px] text-zinc-400">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/validate" className="hover:text-white transition-colors">Validate</Link>
            </nav>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}