/**
 * Provider-agnostic payment types.
 * Application / product code should depend on these — not on Razorpay or Stripe SDKs.
 */

export type ProviderId =
  | "razorpay"
  | "stripe"
  | "paypal"
  | "lemon_squeezy"
  | "paddle"

export type SupportedCurrency = "INR" | "USD" | "EUR" | "GBP"

export type ProductId = "early_bird" | "builder_pass" | "pro_launch" | "architecture_guide"

/** Amount in minor units (paise / cents). */
export type AmountMinor = number

export type CreateOrderInput = {
  productId: ProductId
  currency: SupportedCurrency
  amountMinor: AmountMinor
  customerEmail?: string
  metadata?: Record<string, string>
  receipt?: string
}

/** Opaque client payload for opening checkout in the browser. */
export type CheckoutClientPayload = {
  /** Razorpay Key ID */
  key?: string
  /** Stripe publishable key (future) */
  publishableKey?: string
  /** Stripe PaymentIntent client_secret (future) */
  clientSecret?: string
  /** Extra provider-specific fields without breaking the contract */
  extra?: Record<string, unknown>
}

export type CreateOrderResult = {
  provider: ProviderId
  orderId: string
  amount: AmountMinor
  currency: SupportedCurrency
  client: CheckoutClientPayload
}

export type PaymentProvider = {
  readonly id: ProviderId
  /** True when env credentials required for live checkout are present. */
  isConfigured(): boolean
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>
}

export type PriceQuote = {
  productId: ProductId
  country: string
  currency: SupportedCurrency
  amountMinor: AmountMinor
  /** Human display e.g. "₹799", "$9" */
  display: string
  /** List / strikethrough price if any */
  listDisplay?: string
  provider: ProviderId
  providerReady: boolean
}

export type ResolveContext = {
  /** ISO 3166-1 alpha-2 when known */
  country?: string | null
  /** Explicit override from client */
  preferredCurrency?: SupportedCurrency | null
  /** Explicit provider override (admin/tests only) */
  preferredProvider?: ProviderId | null
}
