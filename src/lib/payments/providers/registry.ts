import type { PaymentProvider, ProviderId } from "../types"
import { razorpayProvider } from "./razorpay"
import { stripeProvider } from "./stripe"

/**
 * Registry of payment providers.
 * Add PayPal / Lemon Squeezy / Paddle by implementing PaymentProvider
 * and registering here — product flows stay unchanged.
 */
const providers: Record<ProviderId, PaymentProvider | undefined> = {
  razorpay: razorpayProvider,
  stripe: stripeProvider,
  paypal: undefined,
  lemon_squeezy: undefined,
  paddle: undefined,
}

export function getProvider(id: ProviderId): PaymentProvider {
  const p = providers[id]
  if (!p) {
    throw new Error(`Payment provider "${id}" is not registered`)
  }
  return p
}

export function listRegisteredProviders(): ProviderId[] {
  return (Object.keys(providers) as ProviderId[]).filter((id) => !!providers[id])
}
