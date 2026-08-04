/**
 * Payment feature flag for Beta.
 * Default: false (Early Founder Beta — no Razorpay).
 * Enable later with NEXT_PUBLIC_PAYMENT_ENABLED=true + Razorpay keys.
 */
export function isPaymentEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PAYMENT_ENABLED === "true"
}

/** Contact for priority list / founder outreach during Beta. */
export function founderContactEmail(): string {
  return (
    process.env.NEXT_PUBLIC_FOUNDER_CONTACT_EMAIL?.trim() ||
    "shortlistready@gmail.com"
  )
}
