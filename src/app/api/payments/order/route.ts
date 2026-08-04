import { NextResponse } from "next/server"
import { createPaymentOrder } from "@/lib/payments"
import type { ProductId } from "@/lib/payments/types"
import { createClient } from "@/lib/supabase/server"
import { normalizeCountry } from "@/lib/payments/region"

const PRODUCTS: ProductId[] = [
  "early_bird",
  "builder_pass",
  "pro_launch",
  "architecture_guide",
]

/**
 * Provider-agnostic order create.
 * Requires authenticated user so order notes bind user_id for webhook fulfillment.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const productId = (body.productId || "early_bird") as ProductId
    if (!PRODUCTS.includes(productId)) {
      return NextResponse.json({ error: "Unknown product" }, { status: 400 })
    }

    const email = (user.email || body.email || "").trim().toLowerCase()
    const creditsForProduct =
      productId === "early_bird"
        ? 2
        : productId === "builder_pass"
          ? 3
          : productId === "pro_launch"
            ? 5
            : 0

    const country =
      normalizeCountry(body.country) ||
      normalizeCountry(request.headers.get("x-vercel-ip-country")) ||
      normalizeCountry(request.headers.get("cf-ipcountry")) ||
      undefined

    const result = await createPaymentOrder({
      productId,
      customerEmail: email || undefined,
      ctx: { country },
      metadata: {
        user_id: user.id,
        email,
        product: productId,
        plan: productId,
        credits: String(creditsForProduct),
      },
    })

    return NextResponse.json({
      provider: result.provider,
      orderId: result.orderId,
      amount: result.amount,
      currency: result.currency,
      key: result.client.key,
      clientSecret: result.client.clientSecret,
      publishableKey: result.client.publishableKey,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Order failed"
    const status =
      /not configured|not implemented/i.test(message) ? 503 : 500
    return NextResponse.json(
      {
        error: message,
        code: /not configured/i.test(message)
          ? "PROVIDER_NOT_CONFIGURED"
          : /not implemented/i.test(message)
            ? "PROVIDER_NOT_IMPLEMENTED"
            : undefined,
      },
      { status }
    )
  }
}
