"use client"

import type { RevenueScenario } from "@/lib/revenue"
import { formatUsd } from "@/lib/revenue"

const accent: Record<string, string> = {
  conservative: "from-zinc-500/20 to-zinc-600/5 border-zinc-500/20",
  expected: "from-violet-500/20 to-violet-600/5 border-violet-500/30",
  best: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/25",
}

export function RevenueBreakdown({
  scenarios,
}: {
  scenarios: RevenueScenario[]
}) {
  return (
    <div className="grid gap-2">
      {scenarios.map((s) => (
        <div
          key={s.key}
          className={`rounded-xl border bg-gradient-to-br p-3 ${accent[s.key] || accent.expected}`}
        >
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <p className="text-[12px] font-medium text-zinc-200">{s.label}</p>
            <p className="text-[14px] font-medium tracking-tight">
              {formatUsd(s.arr)}
              <span className="text-[10px] text-zinc-500 font-normal ml-1">
                ARR
              </span>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] text-zinc-500">
            <p>
              <span className="text-zinc-400">{formatUsd(s.monthly)}</span>
              /mo
            </p>
            <p>
              <span className="text-zinc-400">
                ~{s.customers.toLocaleString()}
              </span>{" "}
              customers
            </p>
            <p className="text-right">
              <span className="text-zinc-400">${s.avgPriceMonthly}</span>/mo avg
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
