import { NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { idea, score, verdict, confidence } = body

    const options = {
      amount: 599900, // ₹5,999 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        idea: idea?.slice(0, 400) || "",
        score: String(score),
        verdict: verdict || "",
        confidence: String(confidence),
      },
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      idea,
      score,
      verdict,
      confidence,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}