import {
  formatMoney,
  getAmountMinor,
  PRODUCT_LABELS,
  PRODUCT_LIST_PRICES,
} from "./catalog"
import { getProvider } from "./providers/registry"
import { resolveCurrency, resolveProviderId } from "./region"
import type {
  CreateOrderResult,
  PriceQuote,
  ProductId,
  ResolveContext,
} from "./types"

export * from "./types"
export * from "./catalog"
export * from "./region"
export { getProvider, listRegisteredProviders } from "./providers/registry"

export function getQuote(
  productId: ProductId,
  ctx: ResolveContext = {}
): PriceQuote {
  const country = (ctx.country || "").toUpperCase() || "XX"
  const currency = resolveCurrency(ctx)
  const provider = resolveProviderId(ctx)
  const amountMinor = getAmountMinor(productId, currency)
  const listMinor = PRODUCT_LIST_PRICES[productId]?.[currency]
  const providerInstance = getProvider(provider)

  return {
    productId,
    country,
    currency,
    amountMinor,
    display: formatMoney(amountMinor, currency),
    listDisplay: listMinor != null ? formatMoney(listMinor, currency) : undefined,
    provider,
    providerReady: providerInstance.isConfigured(),
  }
}

export async function createPaymentOrder(options: {
  productId: ProductId
  ctx?: ResolveContext
  customerEmail?: string
  metadata?: Record<string, string>
}): Promise<CreateOrderResult & { productLabel: string }> {
  const ctx = options.ctx || {}
  const quote = getQuote(options.productId, ctx)
  const provider = getProvider(quote.provider)

  if (!provider.isConfigured()) {
    const err = new Error(
      quote.provider === "stripe"
        ? "International checkout is not available yet. Stripe will power card payments outside India soon."
        : `Payment provider ${quote.provider} is not configured`
    ) as Error & { code?: string; quote?: PriceQuote }
    err.code = "PROVIDER_NOT_CONFIGURED"
    err.quote = quote
    throw err
  }

  const result = await provider.createOrder({
    productId: options.productId,
    currency: quote.currency,
    amountMinor: quote.amountMinor,
    customerEmail: options.customerEmail,
    metadata: {
      product: options.productId,
      country: quote.country,
      ...(options.metadata || {}),
    },
    receipt: `ll_${options.productId}_${Date.now()}`,
  })

  return {
    ...result,
    productLabel: PRODUCT_LABELS[options.productId],
  }
}
