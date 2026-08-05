"use client"

import type { RevenueIntelligence } from "@/lib/revenue"
import { formatUsd } from "@/lib/revenue"

export function MarketOpportunity({
  market,
}: {
  market: RevenueIntelligence["market"]
}) {
  const rows = [
    { label: "Global TAM", value: market.tam, pct: 100 },
    {
      label: "Serviceable",
      value: market.sam,
      pct: Math.round((market.sam / market.tam) * 100),
    },
    {
      label: "Beachhead",
      value: market.beachhead,
      pct: Math.round((market.beachhead / market.tam) * 100),
    },
  ]

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-zinc-400">{r.label}</span>
            <span className="text-zinc-200 font-medium">
              {formatUsd(r.value)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${Math.max(6, r.pct)}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-zinc-600 leading-relaxed">
        Market bands are scenario estimates derived from validation signals —
        not measured market research.
      </p>
    </div>
  )
}
