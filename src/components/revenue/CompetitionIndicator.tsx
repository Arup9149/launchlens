"use client"

import type { ConfidenceLevel, CompetitionLevel } from "@/lib/revenue/types"

const levelColor: Record<string, string> = {
  Low: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  Medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  High: "text-red-400 border-red-500/30 bg-red-500/10",
}

export function CompetitionIndicator({
  level,
  reason,
  label = "Competition pressure",
}: {
  level: CompetitionLevel | ConfidenceLevel
  reason: string
  label?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-[11px] text-zinc-500">{label}</p>
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${levelColor[level] || levelColor.Medium}`}
        >
          {level}
        </span>
      </div>
      <p className="text-[10px] text-zinc-500 leading-relaxed">{reason}</p>
    </div>
  )
}
