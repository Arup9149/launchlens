import { NextResponse } from "next/server"
import { createPaymentOrder } from "@/lib/payments"
import { createClient } from "@/lib/supabase/server"

/**
 * Legacy Early Bird order endpoint (INR / Razorpay).
 * Prefer POST /api/payments/order for new clients.
 * Requires auth; binds user_id into Razorpay order notes for webhook.
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
    const email = (user.email || body.email || "").trim().toLowerCase()

    const result = await createPaymentOrder({
      productId: "early_bird",
      customerEmail: email || undefined,
      ctx: { country: "IN" },
      metadata: {
        user_id: user.id,
        email,
        product: "early_bird",
        plan: "early_bird",
        credits: "2",
        idea: body.idea ? String(body.idea).slice(0, 120) : "",
      },
    })

    return NextResponse.json({
      orderId: result.orderId,
      amount: result.amount,
      currency: result.currency,
      key: result.client.key,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Order failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
