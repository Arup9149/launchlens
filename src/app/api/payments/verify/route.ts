import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"
import { grantCreditsIdempotent } from "@/lib/credits/server"

export const runtime = "nodejs"

/**
 * Client calls this after Razorpay Checkout success with:
 * { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Verifies payment signature with RAZORPAY_KEY_SECRET,
 * then grants credits server-side (idempotent on payment_id).
 */
export async function POST(request: Request) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim()
    if (!keySecret) {
      return NextResponse.json(
        { error: "Payments not configured" },
        { status: 503 }
      )
    }
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Admin not configured" },
        { status: 503 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const orderId = String(body.razorpay_order_id || "").trim()
    const paymentId = String(body.razorpay_payment_id || "").trim()
    const signature = String(body.razorpay_signature || "").trim()

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "order_id, payment_id, and signature required" },
        { status: 400 }
      )
    }

    const payload = `${orderId}|${paymentId}`
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex")

    if (!timingSafeEqual(expected, signature)) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    const email = (user.email || "").trim().toLowerCase()
    if (!email.includes("@")) {
      return NextResponse.json({ error: "User email required" }, { status: 400 })
    }

    const amount = 2
    const plan = "early_bird"

    const admin = createAdminClient()
    const result = await grantCreditsIdempotent(admin, {
      userId: user.id,
      email,
      amount,
      plan,
      paymentId,
      orderId,
      provider: "razorpay",
      rawEvent: { source: "client_verify", orderId, paymentId },
    })

    return NextResponse.json({
      ok: true,
      credits: result.credits,
      plan: result.plan,
      alreadyProcessed: result.alreadyProcessed,
    })
  } catch (err) {
    console.error("Payment verify error", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a)
    const bb = Buffer.from(b)
    if (ba.length !== bb.length) return false
    return crypto.timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}
