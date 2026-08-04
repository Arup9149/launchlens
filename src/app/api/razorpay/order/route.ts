import { NextResponse } from "next/server"
import { createPaymentOrder } from "@/lib/payments"

/**
 * Legacy Early Bird order endpoint (INR / Razorpay).
 * Prefer POST /api/payments/order for new clients.
 * Kept for backward compatibility with existing validate flow.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { idea, score, verdict, confidence, email } = body

    const result = await createPaymentOrder({
      productId: "early_bird",
      customerEmail: email ? String(email) : undefined,
      ctx: {
        country: "IN",
        preferredCurrency: "INR",
        preferredProvider: "razorpay",
      },
      metadata: {
        idea: idea ? String(idea).slice(0, 200) : "",
        score: score != null ? String(score) : "",
        verdict: verdict != null ? String(verdict) : "",
        confidence: confidence != null ? String(confidence) : "",
      },
    })

    return NextResponse.json({
      orderId: result.orderId,
      amount: result.amount,
      currency: result.currency,
      key: result.client.key,
      provider: result.provider,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Order failed"
    console.error("[razorpay/order]", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
