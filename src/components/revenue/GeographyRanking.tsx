"use client"

import type { GeographyRank } from "@/lib/revenue"

function Stars({ n }: { n: number }) {
  return (
    <span
      className="text-[10px] tracking-tight text-amber-400/90"
      aria-label={`${n} of 5`}
    >
      {"★".repeat(n)}
      <span className="text-zinc-600">{"★".repeat(Math.max(0, 5 - n))}</span>
    </span>
  )
}

export function GeographyRanking({ items }: { items: GeographyRank[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((g, i) => (
        <li
          key={g.country}
          className="flex items-start gap-2.5 pb-2.5 border-b border-white/[0.05] last:border-0 last:pb-0"
        >
          <span className="text-[11px] text-zinc-600 w-3 shrink-0 pt-0.5">
            {i + 1}
          </span>
          <span className="text-[16px] leading-none pt-0.5" aria-hidden>
            {g.flag}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-medium text-zinc-200">
                {g.country}
              </p>
              <Stars n={g.stars} />
            </div>
            <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">
              {g.note}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
