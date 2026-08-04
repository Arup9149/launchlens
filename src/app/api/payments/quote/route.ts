import { NextResponse } from "next/server"
import {
  getQuote,
  inferCountryFromHints,
  normalizeCountry,
  type ProductId,
  type SupportedCurrency,
} from "@/lib/payments"

const PRODUCTS: ProductId[] = [
  "early_bird",
  "builder_pass",
  "pro_launch",
  "architecture_guide",
]

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const product = (url.searchParams.get("product") || "early_bird") as ProductId
    if (!PRODUCTS.includes(product)) {
      return NextResponse.json({ error: "Unknown product" }, { status: 400 })
    }

    const headerCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-country-code")

    const countryParam = url.searchParams.get("country")
    const currencyParam = url.searchParams.get("currency") as SupportedCurrency | null

    const country =
      normalizeCountry(countryParam) ||
      inferCountryFromHints({
        acceptLanguage: request.headers.get("accept-language"),
        headerCountry,
      })

    const quote = getQuote(product, {
      country,
      preferredCurrency: currencyParam || undefined,
    })

    return NextResponse.json({
      ...quote,
      /** Hint for clients that still hardcode display */
      message:
        quote.provider === "stripe" && !quote.providerReady
          ? "Price shown in local currency. International card checkout (Stripe) ships next."
          : undefined,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Quote failed"
    console.error("[payments/quote]", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
