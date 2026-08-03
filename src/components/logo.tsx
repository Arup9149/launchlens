import Link from "next/link"

type LogoProps = {
  href?: string
  size?: "sm" | "md" | "lg"
  showWordmark?: boolean
}

export function Logo({
  href = "/",
  size = "md",
  showWordmark = true,
}: LogoProps) {
  const box =
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
  const text =
    size === "sm" ? "text-[14px]" : size === "lg" ? "text-[18px]" : "text-[15px]"

  return (
    <Link href={href} className="inline-flex items-center gap-2.5 group">
      {/* Mark: stacked lens / focus aperture */}
      <span
        className={`${box} relative rounded-xl overflow-hidden shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_8px_24px_rgba(124,58,237,0.25)]`}
        aria-hidden
      >
        <span className="absolute inset-0 bg-gradient-to-br from-violet-400 via-violet-600 to-fuchsia-700" />
        <span className="absolute inset-[3px] rounded-lg bg-black/25 backdrop-blur-[1px]" />
        {/* Outer ring */}
        <span className="absolute inset-[5px] rounded-full border border-white/35" />
        {/* Inner focus */}
        <span className="absolute inset-[9px] rounded-full border border-white/20" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        {/* Accent cut */}
        <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-fuchsia-400/40 blur-[6px]" />
      </span>

      {showWordmark && (
        <span
          className={`${text} font-medium tracking-tight text-white group-hover:text-violet-100 transition`}
        >
          Launch<span className="text-violet-300">Lens</span>
        </span>
      )}
    </Link>
  )
}