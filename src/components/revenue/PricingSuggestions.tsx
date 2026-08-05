"use client"

import type { RevenueIntelligence } from "@/lib/revenue"

export function PricingSuggestions({
  pricing,
}: {
  pricing: RevenueIntelligence["pricing"]
}) {
  const tiers = [
    { name: "Starter", ...pricing.starter },
    { name: "Pro", ...pricing.pro },
    { name: "Business", ...pricing.business },
    {
      name: "Enterprise",
      price: pricing.enterprise.price,
      reason: pricing.enterprise.reason,
    },
  ]

  return (
    <div className="space-y-2">
      {tiers.map((t) => (
        <div
          key={t.name}
          className="flex items-start justify-between gap-2 rounded-lg bg-white/[0.02] border border-white/[0.05] px-2.5 py-2"
        >
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-zinc-200">{t.name}</p>
            <p className="text-[10px] text-zinc-500 leading-snug">{t.reason}</p>
          </div>
          <p className="text-[12px] font-medium text-violet-300 shrink-0">
            {t.price == null ? "Custom" : `$${t.price}/mo`}
          </p>
        </div>
      ))}
    </div>
  )
}
