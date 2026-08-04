import { NextResponse } from "next/server"
import crypto from "crypto"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"
import { grantCreditsIdempotent } from "@/lib/credits/server"

export const runtime = "nodejs"

/**
 * Razorpay webhook — payment.captured / order.paid
 * Signature: HMAC-SHA256 of raw body with RAZORPAY_WEBHOOK_SECRET
 * Fulfillment is idempotent via payment_events.payment_id
 */
export async function POST(request: Request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim()
    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 })
    }
    if (!isAdminConfigured()) {
      console.error("Supabase service role not configured")
      return NextResponse.json({ error: "Admin not configured" }, { status: 503 })
    }

    const rawBody = await request.text()
    const signature = request.headers.get("x-razorpay-signature") || ""

    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex")

    if (!signature || !timingSafeEqual(expected, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(rawBody) as {
      event?: string
      payload?: {
        payment?: {
          entity?: {
            id?: string
            order_id?: string
            email?: string
            notes?: Record<string, string>
            status?: string
          }
        }
        order?: {
          entity?: {
            id?: string
            notes?: Record<string, string>
          }
        }
      }
    }

    const eventName = event.event || ""
    if (
      eventName !== "payment.captured" &&
      eventName !== "order.paid" &&
      eventName !== "payment.authorized"
    ) {
      return NextResponse.json({ ok: true, ignored: eventName })
    }

    const payment = event.payload?.payment?.entity
    const order = event.payload?.order?.entity
    const paymentId = payment?.id
    const orderId = payment?.order_id || order?.id
    const notes = {
      ...(order?.notes || {}),
      ...(payment?.notes || {}),
    }

    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment id" }, { status: 400 })
    }

    const userId = notes.user_id || notes.userId
    const email = (notes.email || payment?.email || "").trim().toLowerCase()

    if (!userId || !email.includes("@")) {
      console.error("Webhook missing user_id/email in notes", { paymentId, notes })
      return NextResponse.json({
        ok: false,
        error: "Missing user binding on order notes",
      })
    }

    const creditAmount = Number(notes.credits || notes.credit_amount || 2)
    const plan = notes.product || notes.plan || "early_bird"

    const db = createAdminClient()
    const result = await grantCreditsIdempotent(db, {
      userId,
      email,
      amount: Number.isFinite(creditAmount) ? creditAmount : 2,
      plan,
      paymentId,
      orderId: orderId || undefined,
      provider: "razorpay",
      rawEvent: event,
    })

    return NextResponse.json({
      ok: true,
      alreadyProcessed: result.alreadyProcessed,
      credits: result.credits,
    })
  } catch (err) {
    console.error("Razorpay webhook error", err)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
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
