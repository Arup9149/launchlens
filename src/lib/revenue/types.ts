export type RevenueScenarioKey = "conservative" | "expected" | "aggressive"

export type RevenueScenario = {
  key: RevenueScenarioKey
  label: string
  arr: number
  monthly: number
  customers: number
  avgPriceMonthly: number
  /** Why this scenario was estimated */
  why: string
}

export type MarketBands = {
  tam: number
  sam: number
  beachhead: number
  why: string
}

export type GeographyRank = {
  country: string
  flag: string
  score: number
  stars: number
  note: string
}

export type RiskRegion = {
  region: string
  reason: string
}

export type RoadmapStep = {
  week: number
  title: string
  action: string
}

export type MonetizationIdea = {
  model: string
  suitability: number
  note: string
}

export type PricingTier = {
  starter: { price: number; reason: string }
  pro: { price: number; reason: string }
  business: { price: number; reason: string }
  enterprise: { price: number | null; reason: string }
}

export type CompetitionLevel = "Low" | "Medium" | "High"

export type ConfidenceLevel = "Low" | "Medium" | "High"

export type ConfidenceAxes = {
  market: { level: ConfidenceLevel; score: number; why: string }
  pricing: { level: ConfidenceLevel; score: number; why: string }
  competition: { level: ConfidenceLevel; score: number; why: string }
  monetization: { level: ConfidenceLevel; score: number; why: string }
}

export type RevenueKiller = {
  title: string
  severity: "High" | "Medium" | "Low"
  why: string
}

export type FastestPath = {
  title: string
  steps: string[]
  why: string
}

export type Milestone = {
  id: string
  label: string
  hint: string
}

export type RevenueIntelligence = {
  scenarios: RevenueScenario[]
  market: MarketBands
  geography: GeographyRank[]
  riskRegions: RiskRegion[]
  roadmap: RoadmapStep[]
  monetization: MonetizationIdea[]
  pricing: PricingTier
  competition: { level: CompetitionLevel; reason: string }
  confidenceAxes: ConfidenceAxes
  revenueKiller: RevenueKiller
  fastestPath: FastestPath
  milestones: Milestone[]
  disclaimer: string
}

export type RevenueInput = {
  idea?: string | null
  score?: number | null
  confidence?: number | null
  verdict?: string | null
  breakdown?: {
    marketDemand?: number
    competitionGap?: number
    feasibility?: number
    timing?: number
    monetization?: number
  } | null
}
