"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronUp, Sparkles, X } from "lucide-react"
import {
  buildRevenueIntelligence,
  formatUsd,
  type RevenueInput,
} from "@/lib/revenue"
import { RevenueCard } from "./RevenueCard"
import { RevenueBreakdown } from "./RevenueBreakdown"
import { MarketOpportunity } from "./MarketOpportunity"
import { GeographyRanking } from "./GeographyRanking"
import { RevenueRoadmap } from "./RevenueRoadmap"
import { PricingSuggestions } from "./PricingSuggestions"
import { CompetitionIndicator } from "./CompetitionIndicator"

type SectionId =
  | "breakdown"
  | "market"
  | "geo"
  | "risks"
  | "roadmap"
  | "monetization"
  | "pricing"
  | "competition"

export function RevenueSidebar({ input }: { input: RevenueInput }) {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState<SectionId | null>("breakdown")
  const intel = useMemo(() => buildRevenueIntelligence(input), [input])

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 600)
    return () => clearTimeout(t)
  }, [])

  const toggleSection = (id: SectionId) =>
    setSection((s) => (s === id ? null : id))

  const panelBody = (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <p className="text-[11px] uppercase tracking-[0.14em] text-violet-400">
              Revenue Intelligence
            </p>
          </div>
          <p className="text-[13px] font-medium text-zinc-100">Scenario explorer</p>
          <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
            Estimates from your idea signals — not forecasts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition shrink-0"
          aria-label="Collapse panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-none">
        <RevenueCard title="Revenue opportunity">
          <p className="text-[10px] text-zinc-500 mb-1">
            Potential annual revenue · estimated range
          </p>
          <p className="text-[22px] font-medium tracking-tight text-white">
            {formatUsd(intel.rangeLow)}
            <span className="text-zinc-500 font-normal mx-1.5">–</span>
            {formatUsd(intel.rangeHigh)}
          </p>
          <p className="text-[10px] text-zinc-600 mt-1.5 leading-relaxed">
            Scenario-based. Depends on execution, pricing, and retention.
          </p>
        </RevenueCard>

        <Section id="breakdown" title="Revenue breakdown" open={section === "breakdown"} onToggle={toggleSection}>
          <RevenueBreakdown scenarios={intel.scenarios} />
        </Section>
        <Section id="market" title="Market opportunity" open={section === "market"} onToggle={toggleSection}>
          <MarketOpportunity market={intel.market} />
        </Section>
        <Section id="geo" title="Geographic traction ranking" open={section === "geo"} onToggle={toggleSection}>
          <GeographyRanking items={intel.geography} />
        </Section>
        <Section id="risks" title="Higher-risk regions" open={section === "risks"} onToggle={toggleSection}>
          <ul className="space-y-2">
            {intel.riskRegions.map((r) => (
              <li key={r.region} className="text-[11px]">
                <p className="text-zinc-300 font-medium">{r.region}</p>
                <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">{r.reason}</p>
              </li>
            ))}
          </ul>
        </Section>
        <Section id="roadmap" title="Revenue roadmap" open={section === "roadmap"} onToggle={toggleSection}>
          <RevenueRoadmap steps={intel.roadmap} />
        </Section>
        <Section id="monetization" title="Monetization ideas" open={section === "monetization"} onToggle={toggleSection}>
          <ul className="space-y-2">
            {intel.monetization.map((m) => (
              <li key={m.model}>
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-[12px] text-zinc-200">{m.model}</p>
                  <p className="text-[10px] text-violet-300">{m.suitability}%</p>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden mb-0.5">
                  <div className="h-full rounded-full bg-violet-500/80" style={{ width: `${m.suitability}%` }} />
                </div>
                <p className="text-[10px] text-zinc-500">{m.note}</p>
              </li>
            ))}
          </ul>
        </Section>
        <Section id="pricing" title="Pricing suggestions" open={section === "pricing"} onToggle={toggleSection}>
          <PricingSuggestions pricing={intel.pricing} />
        </Section>
        <Section id="competition" title="Signals" open={section === "competition"} onToggle={toggleSection}>
          <div className="space-y-3">
            <CompetitionIndicator level={intel.competition.level} reason={intel.competition.reason} label="Competition pressure" />
            <CompetitionIndicator level={intel.confidence.level} reason={intel.confidence.reason} label="AI confidence" />
          </div>
        </Section>
        <p className="text-[9px] text-zinc-600 leading-relaxed pb-4">{intel.disclaimer}</p>
      </div>
    </div>
  )

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-2 rounded-2xl border border-violet-500/30 bg-black/70 backdrop-blur-xl px-2.5 py-4 shadow-xl hover:border-violet-400/50 transition"
          aria-label="Open Revenue Intelligence"
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-[10px] font-medium text-zinc-300 tracking-wide" style={{ writingMode: "vertical-rl" }}>
            Revenue
          </span>
        </button>
      )}

      <aside
        className={`hidden md:flex fixed right-3 top-20 bottom-3 z-30 w-[320px] max-w-[calc(100vw-1.5rem)] flex-col rounded-2xl border border-white/10 bg-black/75 backdrop-blur-2xl shadow-2xl transition-all duration-300 ease-out ${
          open ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {panelBody}
      </aside>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 rounded-full border border-violet-500/35 bg-black/80 backdrop-blur-xl px-4 py-2.5 shadow-xl"
          aria-label="Open Revenue Intelligence"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[12px] font-medium text-zinc-200">Revenue Intelligence</span>
        </button>
      )}

      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!open}
      >
        <div className="mx-auto max-w-lg rounded-t-2xl border border-white/10 border-b-0 bg-black/90 backdrop-blur-2xl shadow-2xl max-h-[85dvh] flex flex-col">
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/15" />
          </div>
          {panelBody}
        </div>
      </div>

      {open && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
          aria-label="Close overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}

function Section({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: SectionId
  title: string
  open: boolean
  onToggle: (id: SectionId) => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-white/[0.02] transition"
      >
        <span className="text-[12px] font-medium text-zinc-200">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
      </button>
      {open && <div className="px-3.5 pb-3.5">{children}</div>}
    </div>
  )
}
