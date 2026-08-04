import { NextResponse } from "next/server"
import {
  createPaymentOrder,
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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const productId = (body.productId || body.product || "early_bird") as ProductId

    if (!PRODUCTS.includes(productId)) {
      return NextResponse.json({ error: "Unknown product" }, { status: 400 })
    }

    const headerCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-country-code")

    const country =
      normalizeCountry(body.country) ||
      inferCountryFromHints({
        acceptLanguage: request.headers.get("accept-language"),
        headerCountry,
      })

    const result = await createPaymentOrder({
      productId,
      customerEmail: body.email ? String(body.email) : undefined,
      ctx: {
        country,
        preferredCurrency: body.currency as SupportedCurrency | undefined,
        preferredProvider: body.provider || undefined,
      },
      metadata: {
        idea: body.idea ? String(body.idea).slice(0, 200) : "",
        score: body.score != null ? String(body.score) : "",
        verdict: body.verdict != null ? String(body.verdict) : "",
        confidence: body.confidence != null ? String(body.confidence) : "",
      },
    })

    return NextResponse.json({
      provider: result.provider,
      orderId: result.orderId,
      amount: result.amount,
      currency: result.currency,
      productLabel: result.productLabel,
      client: result.client,
      // Backward-compatible fields for existing Razorpay client code
      key: result.client.key,
    })
  } catch (err: unknown) {
    const e = err as Error & { code?: string; quote?: unknown }
    console.error("[payments/order]", err)
    const status =
      e.code === "PROVIDER_NOT_CONFIGURED" || e.code === "PROVIDER_NOT_IMPLEMENTED"
        ? 503
        : 500
    return NextResponse.json(
      {
        error: e.message || "Order failed",
        code: e.code,
        quote: e.quote,
      },
      { status }
    )
  }
}
