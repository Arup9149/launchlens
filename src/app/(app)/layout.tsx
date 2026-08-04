import Link from "next/link"
import { Logo } from "@/components/logo"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/[0.06] sticky top-0 z-40 backdrop-blur-xl bg-black/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/dashboard" size="md" />

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/dashboard"
              className="text-[13px] text-zinc-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/validate"
              className="text-[13px] text-zinc-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition"
            >
              Validate
            </Link>
            <Link
              href="/workshop"
              className="text-[13px] text-zinc-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition"
            >
              Workshop
            </Link>
            <Link
              href="/"
              className="text-[13px] text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-full transition hidden sm:inline"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
