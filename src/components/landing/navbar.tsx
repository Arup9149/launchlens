import Link from "next/link"

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.04] bg-[#07070a]/70 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6h8M6 2v8"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[15px] font-medium tracking-tight">
            LaunchLens
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-8 text-[13px] text-zinc-400">
          <a href="#product" className="hover:text-white transition-colors">
            Product
          </a>
          <a href="#workshop" className="hover:text-white transition-colors">
            Workshop
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
        </div>

        <a
          href="#waitlist"
          className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors"
        >
          Get access →
        </a>
      </div>
    </nav>
  )
}