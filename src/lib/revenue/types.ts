export type RevenueScenarioKey = "conservative" | "expected" | "best"

export type RevenueScenario = {
  key: RevenueScenarioKey
  label: string
  arr: number
  monthly: number
  customers: number
  avgPriceMonthly: number
}

export type MarketBands = {
  tam: number
  sam: number
  beachhead: number
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

export type RevenueIntelligence = {
  rangeLow: number
  rangeHigh: number
  scenarios: RevenueScenario[]
  market: MarketBands
  geography: GeographyRank[]
  riskRegions: RiskRegion[]
  roadmap: RoadmapStep[]
  monetization: MonetizationIdea[]
  pricing: PricingTier
  competition: { level: CompetitionLevel; reason: string }
  confidence: { level: ConfidenceLevel; reason: string }
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
