import type {
  CreateOrderInput,
  CreateOrderResult,
  PaymentProvider,
} from "../types"

/**
 * Stripe adapter (stub).
 * Package `stripe` is already in dependencies; full PaymentIntent + webhook
 * flow is intentionally not implemented yet. Routing and quotes still resolve
 * to this provider for non-IN countries so the product can display USD/EUR/GBP.
 */
export const stripeProvider: PaymentProvider = {
  id: "stripe",

  isConfigured() {
    return !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  },

  async createOrder(_input: CreateOrderInput): Promise<CreateOrderResult> {
    if (!this.isConfigured()) {
      const err = new Error(
        "International checkout is not available yet. Stripe will power USD, EUR, and GBP payments soon."
      ) as Error & { code?: string }
      err.code = "PROVIDER_NOT_CONFIGURED"
      throw err
    }

    // Placeholder for future PaymentIntent creation — do not ship partial charges.
    const err = new Error(
      "Stripe checkout is not implemented yet. Provider is registered for routing only."
    ) as Error & { code?: string }
    err.code = "PROVIDER_NOT_IMPLEMENTED"
    throw err
  },
}
