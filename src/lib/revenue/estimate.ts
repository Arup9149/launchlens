/**
 * Founder Revenue Intelligence — scenario estimator.
 * Deterministic heuristics for exploration only. Not forecasts.
 */

import type {
  ConfidenceLevel,
  CompetitionLevel,
  RevenueInput,
  RevenueIntelligence,
  RevenueScenario,
} from "./types"

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
function roundTo(n: number, step: number) {
  return Math.round(n / step) * step
}
function formatIdeaHint(idea?: string | null): string {
  return (idea || "").toLowerCase()
}
function detectB2B(idea: string): boolean {
  return /b2b|saas|enterprise|api|platform|crm|hr|devops|compliance|invoice|payroll/.test(idea)
}
function detectConsumer(idea: string): boolean {
  return /consumer|app|social|fitness|dating|game|creator|marketplace|food|travel/.test(idea)
}
function baseArpuMonthly(idea: string, monetizationScore: number): number {
  if (detectB2B(idea)) return clamp(29 + monetizationScore * 0.9, 19, 199)
  if (detectConsumer(idea)) return clamp(6 + monetizationScore * 0.18, 4, 29)
  return clamp(12 + monetizationScore * 0.35, 8, 79)
}
function customerBase(score: number, demand: number, multiplier: number): number {
  return Math.max(40, Math.round((score / 100) * (demand / 100) * 1800 * multiplier))
}
function buildScenarios(arpu: number, score: number, demand: number): RevenueScenario[] {
  const defs: { key: RevenueScenario["key"]; label: string; mult: number }[] = [
    { key: "conservative", label: "Conservative", mult: 0.45 },
    { key: "expected", label: "Expected", mult: 1 },
    { key: "best", label: "Best Case", mult: 2.1 },
  ]
  return defs.map((d) => {
    const customers = customerBase(score, demand, d.mult)
    const monthly = customers * arpu
    const arr = monthly * 12
    return {
      key: d.key,
      label: d.label,
      arr: roundTo(arr, arr > 500_000 ? 10_000 : 1000),
      monthly: roundTo(monthly, monthly > 20_000 ? 500 : 50),
      customers: roundTo(customers, customers > 500 ? 10 : 5),
      avgPriceMonthly: Math.round(arpu),
    }
  })
}
function competitionLevel(gap: number): { level: CompetitionLevel; reason: string } {
  if (gap >= 72) return { level: "Low", reason: "Competition-gap signals suggest room to differentiate; still validate against local incumbents." }
  if (gap >= 48) return { level: "Medium", reason: "Moderate competitive pressure. Differentiation and wedge focus matter more than broad feature parity." }
  return { level: "High", reason: "Crowded signals. Expect price pressure and faster copycats — lean on a narrow beachhead first." }
}
function confidenceLevel(conf: number, score: number): { level: ConfidenceLevel; reason: string } {
  const blended = conf * 0.6 + score * 0.4
  if (blended >= 75) return { level: "High", reason: "Validation confidence and score are relatively strong for scenario planning — still not a forecast." }
  if (blended >= 55) return { level: "Medium", reason: "Mixed signal strength. Treat ranges as directional and re-run after more customer interviews." }
  return { level: "Low", reason: "Limited or conflicting signals. These scenarios are exploratory only; gather more primary data." }
}

export function buildRevenueIntelligence(input: RevenueInput = {}): RevenueIntelligence {
  const idea = formatIdeaHint(input.idea)
  const score = clamp(Number(input.score ?? 70), 20, 98)
  const conf = clamp(Number(input.confidence ?? 70), 20, 98)
  const b = input.breakdown || {}
  const demand = clamp(Number(b.marketDemand ?? score), 15, 98)
  const gap = clamp(Number(b.competitionGap ?? score - 5), 10, 98)
  const feasibility = clamp(Number(b.feasibility ?? score), 15, 98)
  const monetizationScore = clamp(Number(b.monetization ?? score - 8), 10, 98)
  const arpu = baseArpuMonthly(idea, monetizationScore)
  const scenarios = buildScenarios(arpu, score, demand)
  const expected = scenarios.find((s) => s.key === "expected")!
  const conservative = scenarios.find((s) => s.key === "conservative")!
  const best = scenarios.find((s) => s.key === "best")!
  const tam = roundTo(expected.arr * (12 + demand / 8), 100_000)
  const sam = roundTo(tam * (0.12 + feasibility / 400), 50_000)
  const beachhead = roundTo(sam * (0.08 + gap / 500), 10_000)
  const isB2b = detectB2B(idea)

  const geography = isB2b
    ? [
        { country: "USA", flag: "🇺🇸", score: 92, stars: 5, note: "Strong purchasing power · SaaS density" },
        { country: "Germany", flag: "🇩🇪", score: 84, stars: 4, note: "High B2B demand · compliance-aware buyers" },
        { country: "United Kingdom", flag: "🇬🇧", score: 82, stars: 4, note: "Mature software budgets · English-first GTM" },
        { country: "Canada", flag: "🇨🇦", score: 78, stars: 4, note: "Similar buyer profile to US · smaller scale" },
        { country: "India", flag: "🇮🇳", score: 68, stars: 3, note: "Large market · lower ARPU · volume plays" },
        { country: "Singapore", flag: "🇸🇬", score: 74, stars: 4, note: "Regional hub · strong willingness to pay" },
      ]
    : [
        { country: "USA", flag: "🇺🇸", score: 90, stars: 5, note: "Strong purchasing power · distribution channels" },
        { country: "United Kingdom", flag: "🇬🇧", score: 80, stars: 4, note: "English-first GTM · solid mobile adoption" },
        { country: "India", flag: "🇮🇳", score: 76, stars: 4, note: "Large market · lower ARPU · scale potential" },
        { country: "Brazil", flag: "🇧🇷", score: 70, stars: 3, note: "Growing digital spend · localization needed" },
        { country: "Germany", flag: "🇩🇪", score: 72, stars: 3, note: "Quality-focused users · slower viral loops" },
        { country: "Indonesia", flag: "🇮🇩", score: 64, stars: 3, note: "Mobile-first · price-sensitive segments" },
      ]

  const riskRegions = [
    { region: "Low-ARPU mass markets (without a volume wedge)", reason: "Low willingness to pay can break unit economics early." },
    { region: "Heavy-regulation verticals without local counsel", reason: "Regulatory barriers slow launch and raise fixed costs." },
    { region: "Markets dominated by free incumbents", reason: "Weak PMF signals if the only alternative is “free enough.”" },
    { region: "Ultra-niche geographies under ~1M addressable users", reason: "Small niche limits compounding distribution." },
  ]

  const roadmap = [
    { week: 1, title: "Validate pricing", action: "Run 5 offer conversations with a concrete price, not interest surveys." },
    { week: 2, title: "Acquire first users", action: "Target 15–25 design partners from your beachhead channel." },
    { week: 3, title: "Improve retention", action: "Instrument activation; fix the top 3 drop-off reasons." },
    { week: 4, title: "Launch paid plan", action: "Ship one paid tier with a clear upgrade moment from free value." },
    { week: 6, title: "Tighten wedge", action: "Cut features that do not serve the paid outcome." },
    { week: 8, title: "Expand channel", action: "Double down on the single channel that produced paid intent." },
  ]

  const monetizationIdeas = [
    { model: "Subscription", suitability: isB2b ? 92 : 78, note: "Predictable ARR if retention holds." },
    { model: "Freemium", suitability: isB2b ? 70 : 88, note: "Works when free tier drives a clear paid moment." },
    { model: "Enterprise", suitability: isB2b ? 86 : 40, note: "Higher ACV; longer sales cycles." },
    { model: "API / usage", suitability: /api|platform|data|ai|model/.test(idea) ? 84 : 45, note: "Aligns cost with value for infrastructure-like products." },
    { model: "Marketplace", suitability: /market|two.?sided|commission/.test(idea) ? 80 : 35, note: "Requires liquidity on both sides before take-rate matters." },
    { model: "Licensing", suitability: isB2b ? 55 : 30, note: "Useful for IP-heavy or white-label plays." },
    { model: "Affiliate", suitability: detectConsumer(idea) ? 60 : 28, note: "Secondary revenue; rarely the core model." },
    { model: "Ads", suitability: detectConsumer(idea) && score > 70 ? 50 : 18, note: "Needs large free traffic; conflicts with premium UX." },
    { model: "Consulting", suitability: 48, note: "Cashflow bridge while product matures — not scalable core." },
  ].sort((a, b) => b.suitability - a.suitability)

  const pricing = {
    starter: { price: Math.max(5, Math.round(arpu * 0.45)), reason: "Low-friction entry for early adopters and solo users." },
    pro: { price: Math.round(arpu), reason: "Primary paid tier aligned with expected willingness to pay." },
    business: { price: Math.round(arpu * (isB2b ? 2.4 : 1.8)), reason: "Team or power-user tier with collaboration / limits uplift." },
    enterprise: {
      price: isB2b ? Math.round(arpu * 6) : null,
      reason: isB2b
        ? "Custom seats, SSO, and procurement — quote-based above list."
        : "Usually unnecessary until B2B expansion; prefer Pro/Business first.",
    },
  }

  return {
    rangeLow: conservative.arr,
    rangeHigh: best.arr,
    scenarios,
    market: { tam, sam, beachhead },
    geography,
    riskRegions,
    roadmap,
    monetization: monetizationIdeas,
    pricing,
    competition: competitionLevel(gap),
    confidence: confidenceLevel(conf, score),
    disclaimer:
      "All figures are AI-generated scenario estimates based on your idea signals and market assumptions — not financial advice, forecasts, or guarantees.",
  }
}

export function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`
  if (n >= 10_000) return `$${Math.round(n / 1000)}K`
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`
  return `$${Math.round(n)}`
}
