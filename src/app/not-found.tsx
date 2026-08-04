import Link from "next/link"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 safe-px text-center">
      <Logo href="/" size="md" className="mb-10" />
      <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400/80 mb-3">
        404
      </p>
      <h1 className="text-2xl sm:text-3xl font-medium tracking-tight mb-3">
        This page isn&apos;t on the map
      </h1>
      <p className="text-[15px] text-zinc-500 max-w-md mb-8 leading-relaxed">
        The link may be outdated, or the page moved. Head home or open your
        founder workspace.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
        <Link
          href="/"
          className="touch-target inline-flex items-center justify-center bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition"
        >
          Back to home
        </Link>
        <Link
          href="/dashboard"
          className="touch-target inline-flex items-center justify-center text-[14px] font-medium px-7 py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
        >
          Open dashboard
        </Link>
      </div>
    </div>
  )
}
