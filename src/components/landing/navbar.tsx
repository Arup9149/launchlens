import Link from "next/link"
import { Logo } from "@/components/logo"

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-black/40 safe-pt">
      <div className="max-w-5xl mx-auto safe-px h-16 flex items-center justify-between gap-3">
        <Logo href="/" size="md" />

        <nav
          className="flex items-center gap-1 sm:gap-2 shrink-0"
          aria-label="Primary"
        >
          <Link
            href="/validate"
            className="text-[13px] text-zinc-400 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition hidden sm:inline-flex min-h-11 items-center"
          >
            Validate
          </Link>
          <Link
            href="/workshop"
            className="text-[13px] text-zinc-400 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition hidden sm:inline-flex min-h-11 items-center"
          >
            Workshop
          </Link>
          <Link
            href="/validate"
            className="text-[12px] sm:text-[13px] font-medium px-3.5 sm:px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white transition min-h-11 inline-flex items-center"
          >
            <span className="sm:hidden">Early Bird</span>
            <span className="hidden sm:inline">Early Bird · ₹799</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
