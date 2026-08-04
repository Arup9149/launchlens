import Razorpay from "razorpay"
import type {
  CreateOrderInput,
  CreateOrderResult,
  PaymentProvider,
} from "../types"

function client() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_id || !key_secret) {
    throw new Error("Razorpay is not configured")
  }
  return {
    sdk: new Razorpay({ key_id, key_secret }),
    key_id,
  }
}

export const razorpayProvider: PaymentProvider = {
  id: "razorpay",

  isConfigured() {
    return !!(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  },

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    if (input.currency !== "INR") {
      throw new Error("Razorpay provider currently supports INR only")
    }

    const { sdk, key_id } = client()
    const order = await sdk.orders.create({
      amount: input.amountMinor,
      currency: "INR",
      receipt: input.receipt || `ll_${input.productId}_${Date.now()}`,
      notes: {
        product: input.productId,
        ...(input.metadata || {}),
      },
    })

    return {
      provider: "razorpay",
      orderId: String(order.id),
      amount: Number(order.amount),
      currency: "INR",
      client: {
        key: key_id,
      },
    }
  },
}
