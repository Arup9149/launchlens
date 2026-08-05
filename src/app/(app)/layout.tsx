import Link from "next/link"
import { Logo } from "@/components/logo"
import { QrHandoffButton } from "@/components/handoff/qr-button"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col">
      <header className="border-b border-white/[0.06] sticky top-0 z-40 backdrop-blur-xl bg-black/40 safe-pt">
        <div className="max-w-6xl mx-auto safe-px h-16 flex items-center justify-between gap-2">
          <Logo href="/dashboard" size="md" />

          <nav
            className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto max-w-[70%] sm:max-w-none scrollbar-none"
            aria-label="Workspace"
          >
            <Link
              href="/dashboard"
              className="text-[12px] sm:text-[13px] text-zinc-400 hover:text-white px-2.5 sm:px-3 py-2 rounded-full hover:bg-white/5 transition whitespace-nowrap min-h-11 inline-flex items-center"
            >
              Dashboard
            </Link>
            <Link
              href="/validate"
              className="text-[12px] sm:text-[13px] text-zinc-400 hover:text-white px-2.5 sm:px-3 py-2 rounded-full hover:bg-white/5 transition whitespace-nowrap min-h-11 inline-flex items-center"
            >
              Validate
            </Link>
            <Link
              href="/workshop"
              className="text-[12px] sm:text-[13px] text-zinc-400 hover:text-white px-2.5 sm:px-3 py-2 rounded-full hover:bg-white/5 transition whitespace-nowrap min-h-11 inline-flex items-center"
            >
              Workshop
            </Link>
            <Link
              href="/"
              className="text-[12px] sm:text-[13px] text-zinc-500 hover:text-zinc-300 px-2.5 sm:px-3 py-2 rounded-full transition whitespace-nowrap hidden md:inline-flex min-h-11 items-center"
            >
              Home
            </Link>
            <QrHandoffButton />
            <form action="/auth/signout" method="post" className="inline-flex">
              <button
                type="submit"
                className="text-[12px] sm:text-[13px] text-zinc-500 hover:text-zinc-300 px-2.5 sm:px-3 py-2 rounded-full hover:bg-white/5 transition whitespace-nowrap min-h-11 inline-flex items-center"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="flex-1 safe-pb">{children}</main>
    </div>
  )
}
