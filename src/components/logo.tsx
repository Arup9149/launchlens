import Link from "next/link"
import Image from "next/image"

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
 * Tagline: "See Opportunities. Build What Matters." — permanent identity, secondary to the mark.
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
  const imgPx = size === "sm" ? 28 : size === "lg" ? 40 : 32
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
      aria-label="LaunchLens — See Opportunities. Build What Matters."
    >
      <span
        className={`${box} relative shrink-0 overflow-hidden`}
        aria-hidden
      >
        <Image
          src="/logo-icon.png"
          alt=""
          width={imgPx}
          height={imgPx}
          className="w-full h-full object-contain"
          priority
        />
      </span>

      {showWordmark && (
        <span className="flex flex-col min-w-0 leading-none">
          <span
            className={`${text} font-semibold tracking-tight text-white group-hover:text-zinc-100 transition`}
          >
            Launch<span className="text-[#2563EB]">Lens</span>
          </span>
          {showTagline && (
            <span
              className={`${taglineSize} mt-1 text-zinc-500 group-hover:text-zinc-400 transition font-normal max-[360px]:hidden`}
            >
              See Opportunities. Build What Matters.
            </span>
          )}
        </span>
      )}
    </Link>
  )
}
