"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Gauge,
  Rocket,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react"
import {
  buildRevenueIntelligence,
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
  | "scenarios"
  | "killer"
  | "fastest"
  | "milestones"
  | "market"
  | "geo"
  | "risks"
  | "roadmap"
  | "monetization"
  | "pricing"
  | "confidence"

const levelColor: Record<string, string> = {
  Low: "text-red-400 border-red-500/30 bg-red-500/10",
  Medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  High: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
}

/**
 * Founder Revenue Intelligence Panel (polished)
 * Scenario explorer only — never a single revenue prediction.
 */
export function RevenueSidebar({ input }: { input: RevenueInput }) {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState<SectionId | null>("scenarios")
  const intel = useMemo(() => buildRevenueIntelligence(input), [input])

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 600)
    return () => clearTimeout(t)
  }, [])

  const toggleSection = (id: SectionId) =>
    setSection((s) => (s === id ? null : id))

  const axes = [
    { key: "market", label: "Market", data: intel.confidenceAxes.market },
    { key: "pricing", label: "Pricing", data: intel.confidenceAxes.pricing },
    {
      key: "competition",
      label: "Competition",
      data: intel.confidenceAxes.competition,
    },
    {
      key: "monetization",
      label: "Monetization",
      data: intel.confidenceAxes.monetization,
    },
  ] as const

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
          <p className="text-[13px] font-medium text-zinc-100">
            Scenario explorer
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
            AI estimates — not forecasts or guarantees.
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
        <RevenueCard title="Three scenarios · not a prediction">
          <p className="text-[10px] text-zinc-500 mb-2 leading-snug">
            Conservative · Expected · Aggressive. Numbers are scenario
            estimates from your validation signals.
          </p>
          <RevenueBreakdown scenarios={intel.scenarios} />
        </RevenueCard>

        <Section
          id="killer"
          title="Biggest revenue killer"
          open={section === "killer"}
          onToggle={toggleSection}
          icon={<AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
        >
          <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <p className="text-[12px] font-medium text-zinc-100">
                {intel.revenueKiller.title}
              </p>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${levelColor[intel.revenueKiller.severity] || levelColor.Medium}`}
              >
                {intel.revenueKiller.severity}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-snug">
              <span className="text-zinc-400 font-medium">Why · </span>
              {intel.revenueKiller.why}
            </p>
          </div>
        </Section>

        <Section
          id="fastest"
          title="Fastest path to revenue"
          open={section === "fastest"}
          onToggle={toggleSection}
          icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
        >
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-[12px] font-medium text-zinc-100 mb-2">
              {intel.fastestPath.title}
            </p>
            <ol className="space-y-1.5 mb-2">
              {intel.fastestPath.steps.map((step, i) => (
                <li key={step} className="flex gap-2 text-[11px] text-zinc-300">
                  <span className="text-amber-400/90 shrink-0 font-medium">
                    {i + 1}.
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
            <p className="text-[10px] text-zinc-500 leading-snug border-t border-white/[0.06] pt-2">
              <span className="text-zinc-400 font-medium">Why · </span>
              {intel.fastestPath.why}
            </p>
          </div>
        </Section>

        <Section
          id="milestones"
          title="Milestone journey"
          open={section === "milestones"}
          onToggle={toggleSection}
          icon={<Target className="w-3.5 h-3.5 text-violet-400" />}
        >
          <ol className="space-y-0">
            {intel.milestones.map((m, i) => (
              <li key={m.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-500/80 ring-2 ring-violet-500/20 shrink-0" />
                  {i < intel.milestones.length - 1 && (
                    <div className="w-px flex-1 min-h-[18px] bg-white/10" />
                  )}
                </div>
                <div className="pb-3 min-w-0">
                  <p className="text-[12px] font-medium text-zinc-200 leading-none">
                    {m.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">{m.hint}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-[10px] text-zinc-600 leading-snug">
            Journey markers for thinking — not promised timelines or revenue.
          </p>
        </Section>

        <Section
          id="market"
          title="Market opportunity"
          open={section === "market"}
          onToggle={toggleSection}
        >
          <MarketOpportunity market={intel.market} />
        </Section>

        <Section
          id="geo"
          title="Geographic traction"
          open={section === "geo"}
          onToggle={toggleSection}
        >
          <GeographyRanking items={intel.geography} />
        </Section>

        <Section
          id="risks"
          title="Higher-risk regions"
          open={section === "risks"}
          onToggle={toggleSection}
        >
          <ul className="space-y-2">
            {intel.riskRegions.map((r) => (
              <li
                key={r.region}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2"
              >
                <p className="text-[11px] text-zinc-300 font-medium">
                  {r.region}
                </p>
                <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">
                  {r.reason}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="roadmap"
          title="Revenue roadmap"
          open={section === "roadmap"}
          onToggle={toggleSection}
          icon={<Rocket className="w-3.5 h-3.5 text-violet-400" />}
        >
          <RevenueRoadmap steps={intel.roadmap} />
        </Section>

        <Section
          id="monetization"
          title="Monetization ideas"
          open={section === "monetization"}
          onToggle={toggleSection}
        >
          <ul className="space-y-2">
            {intel.monetization.map((m) => (
              <li key={m.model}>
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-[12px] text-zinc-200">{m.model}</p>
                  <span className="text-[10px] text-violet-300 tabular-nums">
                    {m.suitability}%
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden mb-0.5">
                  <div
                    className="h-full rounded-full bg-violet-500/80"
                    style={{ width: `${m.suitability}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500">{m.note}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="pricing"
          title="Pricing suggestions"
          open={section === "pricing"}
          onToggle={toggleSection}
        >
          <PricingSuggestions pricing={intel.pricing} />
        </Section>

        <Section
          id="confidence"
          title="Confidence by axis"
          open={section === "confidence"}
          onToggle={toggleSection}
          icon={<Gauge className="w-3.5 h-3.5 text-sky-400" />}
        >
          <div className="space-y-3">
            {axes.map((a) => (
              <div key={a.key}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[11px] text-zinc-400">{a.label}</p>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${levelColor[a.data.level] || levelColor.Medium}`}
                  >
                    {a.data.level}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full bg-sky-500/70 transition-all duration-500"
                    style={{ width: `${a.data.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500 leading-snug">
                  <span className="text-zinc-400 font-medium">Why · </span>
                  {a.data.why}
                </p>
              </div>
            ))}
            <div className="pt-1 border-t border-white/[0.06]">
              <CompetitionIndicator
                level={intel.competition.level}
                reason={intel.competition.reason}
                label="Competition pressure"
              />
            </div>
          </div>
        </Section>

        <p className="text-[9px] text-zinc-600 leading-relaxed pb-4">
          {intel.disclaimer}
        </p>
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
          <span
            className="text-[10px] font-medium text-zinc-300 tracking-wide"
            style={{ writingMode: "vertical-rl" }}
          >
            Revenue
          </span>
        </button>
      )}

      <aside
        className={`hidden md:flex fixed right-3 top-20 bottom-3 z-30 w-[320px] max-w-[calc(100vw-1.5rem)] flex-col rounded-2xl border border-white/10 bg-black/75 backdrop-blur-2xl shadow-2xl transition-all duration-300 ease-out ${
          open
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-4 pointer-events-none"
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
          <span className="text-[12px] font-medium text-zinc-200">
            Revenue Intelligence
          </span>
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
  icon,
}: {
  id: SectionId
  title: string
  open: boolean
  onToggle: (id: SectionId) => void
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-white/[0.02] transition gap-2"
      >
        <span className="flex items-center gap-2 min-w-0">
          {icon}
          <span className="text-[12px] font-medium text-zinc-200">{title}</span>
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        )}
      </button>
      {open && <div className="px-3.5 pb-3.5">{children}</div>}
    </div>
  )
}
