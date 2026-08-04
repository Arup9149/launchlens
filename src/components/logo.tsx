import Link from "next/link"

type LogoProps = {
  href?: string
  size?: "sm" | "md" | "lg"
  showWordmark?: boolean
  /** Official tagline under the mark + wordmark. Default true. */
  showTagline?: boolean
  className?: string
}

/**
 * LaunchLens primary mark.
 * Tagline: "Know before you build." — permanent identity, secondary to the mark.
 */
export function Logo({
  href = "/",
  size = "md",
  showWordmark = true,
  showTagline = true,
  className = "",
}: LogoProps) {
  const box =
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
  const text =
    size === "sm" ? "text-[14px]" : size === "lg" ? "text-[18px]" : "text-[15px]"
  const taglineSize =
    size === "sm"
      ? "text-[9px] tracking-[0.06em]"
      : size === "lg"
        ? "text-[11px] tracking-[0.08em]"
        : "text-[10px] tracking-[0.07em]"

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 group ${className}`.trim()}
      aria-label="LaunchLens — Know before you build."
    >
      <span
        className={`${box} relative shrink-0 rounded-xl overflow-hidden shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_8px_24px_rgba(124,58,237,0.25)]`}
        aria-hidden
      >
        <span className="absolute inset-0 bg-gradient-to-br from-violet-400 via-violet-600 to-fuchsia-700" />
        <span className="absolute inset-[3px] rounded-lg bg-black/25 backdrop-blur-[1px]" />
        <span className="absolute inset-[5px] rounded-full border border-white/35" />
        <span className="absolute inset-[9px] rounded-full border border-white/20" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-fuchsia-400/40 blur-[6px]" />
      </span>

      {showWordmark && (
        <span className="flex flex-col min-w-0 leading-none">
          <span
            className={`${text} font-medium tracking-tight text-white group-hover:text-violet-100 transition`}
          >
            Launch<span className="text-violet-300">Lens</span>
          </span>
          {showTagline && (
            <span
              className={`${taglineSize} mt-1 text-zinc-500 group-hover:text-zinc-400 transition font-normal max-[360px]:hidden`}
            >
              Know before you build.
            </span>
          )}
        </span>
      )}
    </Link>
  )
}
