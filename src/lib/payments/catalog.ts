import type { AmountMinor, ProductId, SupportedCurrency } from "./types"

/**
 * Canonical product catalog in minor units.
 * Single source of truth for server order creation and display helpers.
 *
 * Early Bird targets ~$9 / €9 / £9 / ₹799 parity (marketing, not FX-live).
 */
export const PRODUCT_PRICES: Record<
  ProductId,
  Partial<Record<SupportedCurrency, AmountMinor>>
> = {
  early_bird: {
    INR: 79900, // ₹799
    USD: 900, // $9.00
    EUR: 900, // €9.00
    GBP: 900, // £9.00
  },
  builder_pass: {
    INR: 170000,
    USD: 1900,
    EUR: 1900,
    GBP: 1900,
  },
  pro_launch: {
    INR: 299900,
    USD: 3500,
    EUR: 3500,
    GBP: 3500,
  },
  architecture_guide: {
    INR: 20000, // ₹200 micro-guide (legacy UI)
    USD: 300,
    EUR: 300,
    GBP: 300,
  },
}

/** Marketing list prices (strikethrough) in minor units. */
export const PRODUCT_LIST_PRICES: Partial<
  Record<ProductId, Partial<Record<SupportedCurrency, AmountMinor>>>
> = {
  early_bird: {
    INR: 599900,
    USD: 6900,
    EUR: 6500,
    GBP: 6500,
  },
}

export const PRODUCT_LABELS: Record<ProductId, string> = {
  early_bird: "Early Bird · 2 validations",
  builder_pass: "Builder Pass · 3 validations",
  pro_launch: "Pro Launch · 5 validations",
  architecture_guide: "Architecture micro-guide",
}

export function getAmountMinor(
  productId: ProductId,
  currency: SupportedCurrency
): AmountMinor {
  const amount = PRODUCT_PRICES[productId]?.[currency]
  if (amount == null) {
    throw new Error(`No price for product ${productId} in ${currency}`)
  }
  return amount
}

export function formatMoney(
  amountMinor: AmountMinor,
  currency: SupportedCurrency
): string {
  const major = amountMinor / 100
  switch (currency) {
    case "INR":
      return `₹${Math.round(major).toLocaleString("en-IN")}`
    case "USD":
      return `$${formatMajor(major)}`
    case "EUR":
      return `€${formatMajor(major)}`
    case "GBP":
      return `£${formatMajor(major)}`
    default:
      return `${major} ${currency}`
  }
}

function formatMajor(major: number): string {
  return Number.isInteger(major) ? String(major) : major.toFixed(2)
}
