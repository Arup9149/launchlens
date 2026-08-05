"use client"

import type { RoadmapStep } from "@/lib/revenue"

export function RevenueRoadmap({ steps }: { steps: RoadmapStep[] }) {
  return (
    <ol className="space-y-2.5">
      {steps.map((s) => (
        <li key={s.week} className="flex gap-2.5">
          <div className="shrink-0 w-12 text-[10px] uppercase tracking-wide text-violet-400 pt-0.5">
            Wk {s.week}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-zinc-200">{s.title}</p>
            <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">
              {s.action}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
