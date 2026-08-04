# LaunchLens — Architecture

**Repository:** Arup9149/launchlens  
**Last updated:** 2026-08-04

---

## 1. System overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (client)                         │
│  Landing · Auth · Dashboard · Validate · Report · Workshop       │
│  localStorage: ll_email, ll_guides_unlocked                      │
│  sessionStorage: ll_analysis                                     │
└─────────────┬───────────────────────────────┬───────────────────┘
              │                               │
              ▼                               ▼
┌──────────────────────────┐    ┌─────────────────────────────────┐
│   Next.js App Router     │    │ External services                 │
│   src/app/**             │    │  • Supabase (Auth + Postgres)     │
│   API routes             │    │  • OpenRouter / Ollama (Brain)    │
│   Middleware: session    │    │  • Razorpay (India)               │
│                          │    │  • Stripe (international, stub)   │
└─────────────┬────────────┘    └─────────────────────────────────┘
              │
              ▼
     src/lib/payments  ← provider-agnostic billing domain
```

**Primary runtime:** Node.js (Next.js) + Supabase + LLM providers.  
**Payments:** Domain layer selects provider by country; product code never imports Razorpay/Stripe SDKs directly.

---

## 2. Directory map (payments focus)

```
src/lib/payments/
  types.ts                 # ProviderId, CreateOrderInput/Result, PriceQuote
  catalog.ts               # Product prices (INR/USD/EUR/GBP minor units)
  region.ts                # country → currency + provider policy
  index.ts                 # getQuote(), createPaymentOrder()
  providers/
    registry.ts            # Provider registry (extensible)
    razorpay.ts            # Live INR adapter
    stripe.ts              # Registered stub (not implemented)

src/app/api/payments/
  quote/route.ts           # GET  — display price + provider for region
  order/route.ts           # POST — create order via abstraction

src/app/api/razorpay/order/route.ts  # Legacy thin wrapper → createPaymentOrder
```

---

## 3. Global payment architecture

### 3.1 Principles

1. **Business logic is provider-independent** — credits, products, and validate flow talk to `createPaymentOrder` / `getQuote` only.  
2. **Razorpay = India** — INR, local methods.  
3. **Stripe = default international** — USD / EUR / GBP (implementation pending; routing + quotes live today).  
4. **Registry pattern** — PayPal, Lemon Squeezy, Paddle can implement `PaymentProvider` and register without changing product pages.  
5. **Catalog is the source of truth** for amounts (minor units), not hard-coded API route constants.

### 3.2 Provider interface

```ts
type PaymentProvider = {
  id: ProviderId
  isConfigured(): boolean
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>
}
```

`CreateOrderResult` returns a neutral `orderId`, `amount`, `currency`, and a small `client` payload (Razorpay `key`, future Stripe `clientSecret` / `publishableKey`).

### 3.3 Region routing

| Country | Currency | Provider |
|---------|----------|----------|
| IN | INR | `razorpay` |
| US | USD | `stripe` |
| GB | GBP | `stripe` |
| Eurozone (DE, FR, …) | EUR | `stripe` |
| Other / unknown | USD | `stripe` |

Country resolution order: explicit body/query → CDN headers (`x-vercel-ip-country`, `cf-ipcountry`) → Accept-Language / timezone hints.

### 3.4 Product catalog (Early Bird)

| Currency | Amount (minor) | Display |
|----------|----------------|---------|
| INR | 79900 | ₹799 |
| USD | 900 | $9 |
| EUR | 900 | €9 |
| GBP | 900 | £9 |

Builder Pass / Pro Launch / architecture guide amounts are defined in `catalog.ts` for future SKUs.

### 3.5 Current checkout reality

- **India:** `POST /api/payments/order` (or legacy `/api/razorpay/order`) creates a live Razorpay order; validate page still opens Razorpay.js and grants credits client-side (webhook still P0).  
- **International:** Quote returns local currency + `provider: "stripe"`. Order returns **503** `PROVIDER_NOT_CONFIGURED` / `PROVIDER_NOT_IMPLEMENTED` until Stripe is completed.  
- Landing page still uses client-side region labels; should migrate to `/api/payments/quote` or shared catalog import for consistency.

### 3.6 Adding a new provider (checklist)

1. Implement `PaymentProvider` in `src/lib/payments/providers/<name>.ts`.  
2. Register in `providers/registry.ts`.  
3. Extend `resolveProviderId` policy in `region.ts` if routing rules change.  
4. Add webhook route under `src/app/api/payments/webhooks/<name>/` (future).  
5. **Do not** branch product UI on provider name except for opening the correct checkout widget from `client` payload.

---

## 4. Other application layers

### 4.1 API routes (summary)

| Route | Role |
|-------|------|
| `/api/payments/quote` | Regional price + provider |
| `/api/payments/order` | Provider-agnostic order create |
| `/api/razorpay/order` | Legacy Early Bird INR |
| `/api/analyze`, `/api/polish`, … | Brain |
| `/api/credits`, `/api/validations`, … | Product data |

### 4.2 Auth & data

Unchanged: Supabase Auth (branded UI), email-keyed credits, validations tables. See `DATABASE.md`.

### 4.3 Brain

Dual provider for analyze/polish; architecture/related still Ollama-only (P1).

---

## 5. Security (payments)

| Concern | Current | Target |
|---------|---------|--------|
| Order creation | Server-side via abstraction | Same |
| Fulfillment | Client Razorpay handler grants credits | Webhook per provider → grant credits |
| Secrets | `RAZORPAY_*` server; Stripe keys reserved | Never expose secret keys |
| Amount trust | Catalog on server | Client never sets amount |

---

## 6. Deployment notes

- India production: Razorpay keys required.  
- International display works without Stripe keys; **charges** require Stripe implementation + `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.  
- Prefer setting CDN country headers on the edge for accurate routing.

---

## 7. Debt hotspots (still open)

1. Client-side credit grant after payment.  
2. Stripe checkout + webhook not implemented.  
3. Validate / navbar still hardcode ₹ in places.  
4. Auth vs email identity split.  
5. Dead `src/api/**`, committed build artifacts.
