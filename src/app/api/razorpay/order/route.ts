import { NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { idea, score, verdict, confidence } = body

    const options = {
      amount: 79900, // ₹799
      currency: "INR",
      receipt: `ll_eb_${Date.now()}`,
      notes: {
        product: "early_bird_2_validations",
        idea: idea ? String(idea).slice(0, 200) : "",
        score: score ?? "",
        verdict: verdict ?? "",
        confidence: confidence ?? "",
      },
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}