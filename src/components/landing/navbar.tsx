import Link from "next/link"
import { Logo } from "@/components/logo"

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-black/40">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo href="/" size="md" />

        <nav className="flex items-center gap-2">
          <Link
            href="/validate"
            className="text-[13px] text-zinc-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition hidden sm:inline"
          >
            Validate
          </Link>
          <Link
            href="/workshop"
            className="text-[13px] text-zinc-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition hidden sm:inline"
          >
            Workshop
          </Link>
          <Link
            href="/validate"
            className="text-[13px] font-medium px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white transition"
          >
            Early Bird · ₹799
          </Link>
        </nav>
      </div>
    </header>
  )
}
