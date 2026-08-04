import type { ProviderId, ResolveContext, SupportedCurrency } from "./types"

/**
 * Country → default checkout currency.
 * India stays on INR; major English/EU markets map to local major currency;
 * everything else defaults to USD for Stripe-era international checkout.
 */
const COUNTRY_CURRENCY: Record<string, SupportedCurrency> = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  UK: "GBP",
  // Eurozone (non-exhaustive; expand as needed)
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  IE: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  LU: "EUR",
  SK: "EUR",
  SI: "EUR",
  EE: "EUR",
  LV: "EUR",
  LT: "EUR",
  CY: "EUR",
  MT: "EUR",
}

/**
 * Provider routing policy:
 * - India → Razorpay (local rails, UPI, cards)
 * - Rest of world → Stripe (default international)
 * Future: PayPal / Lemon Squeezy / Paddle register here without touching product UI.
 */
export function resolveProviderId(ctx: ResolveContext = {}): ProviderId {
  if (ctx.preferredProvider) return ctx.preferredProvider
  const country = normalizeCountry(ctx.country)
  if (country === "IN") return "razorpay"
  return "stripe"
}

export function resolveCurrency(ctx: ResolveContext = {}): SupportedCurrency {
  if (ctx.preferredCurrency) return ctx.preferredCurrency
  const country = normalizeCountry(ctx.country)
  if (country && COUNTRY_CURRENCY[country]) {
    return COUNTRY_CURRENCY[country]
  }
  return "USD"
}

export function normalizeCountry(code?: string | null): string | null {
  if (!code) return null
  const c = code.trim().toUpperCase()
  if (c === "UK") return "GB"
  if (c.length === 2) return c
  return null
}

/**
 * Best-effort client/server region hints (language + timezone).
 * Prefer explicit country from CDN headers (cf-ipcountry, x-vercel-ip-country) when available.
 */
export function inferCountryFromHints(hints: {
  acceptLanguage?: string | null
  timeZone?: string | null
  headerCountry?: string | null
}): string | null {
  const fromHeader = normalizeCountry(hints.headerCountry)
  if (fromHeader) return fromHeader

  const lang = (hints.acceptLanguage || "").toLowerCase()
  const tz = hints.timeZone || ""

  if (lang.includes("en-in") || tz.includes("Kolkata") || tz.includes("Calcutta")) {
    return "IN"
  }
  if (lang.startsWith("en-gb") || tz.includes("London")) return "GB"
  if (lang.startsWith("en-us") || tz.includes("America/")) return "US"
  if (
    tz.includes("Europe/") ||
    lang.startsWith("de") ||
    lang.startsWith("fr") ||
    lang.startsWith("es") ||
    lang.startsWith("it") ||
    lang.startsWith("nl")
  ) {
    // Default EU hint → Germany as EUR proxy when country unknown
    return "DE"
  }
  return null
}
