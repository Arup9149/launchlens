# LaunchLens — Project Status

**Repository:** [Arup9149/launchlens](https://github.com/Arup9149/launchlens)  
**Last status update:** 2026-08-04  
**Branch:** `main`  
**Version (package.json):** `0.1.0`  
**Status:** Early-stage MVP — global payment **architecture** in place; India checkout live via Razorpay; international Stripe **not yet charging**

---

## 1. What the product is

**LaunchLens** is a founder workspace: Validate → Polish → Expand → Architect, with an LLM Brain and Early Bird monetization.

**Pricing (catalog):** Early Bird ≈ ₹799 / $9 / €9 / £9 · 2 validation credits + guides + Workshop.

---

## 2. Tech stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js 16 App Router |
| UI | React 19, Tailwind v4, shadcn |
| Auth / DB | Supabase (hidden in product UI) |
| **Payments** | **Abstraction in `src/lib/payments`** — Razorpay (IN, live), Stripe (ROW, stub) |
| AI | OpenRouter + Ollama |

**Payment env (current + reserved):**

- `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`  
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (reserved; not required until Stripe ships)

---

## 3. Completeness snapshot

| Area | State | Notes |
|------|--------|--------|
| Landing region price labels | Working UI | Client detect; should adopt shared catalog/quote |
| Auth UI | Branded | LaunchLens-only copy |
| Validate + Razorpay (IN) | Live path | Still client-side credit grant |
| **Payment domain layer** | **Done** | types, catalog, region, registry |
| **Quote / order APIs** | **Done** | `/api/payments/quote`, `/api/payments/order` |
| Stripe checkout | **Stub** | Routes to Stripe; returns 503 until implemented |
| Payment webhooks | **Missing** | P0 |
| Workshop / Brain | Implemented | Architecture/related Ollama-only |
| Credits | Email-keyed | Not auth-user-keyed |
| README | Stale | — |

---

## 4. Global payments strategy (summary)

- **India → Razorpay / INR**  
- **International → Stripe / USD·EUR·GBP** (display + routing ready; charge flow next)  
- Additional providers plug into `providers/registry.ts` without changing validate/business rules  
- Legacy `/api/razorpay/order` remains as a thin wrapper  

---

## 5. Risks (high level)

- Client-only payment fulfillment  
- Open validations/credits APIs without strong RLS  
- International users see price but cannot complete Stripe checkout yet  
- Validate CTA still emphasizes ₹ in several strings  

---

## 6. Next engineering priorities

1. Implement Stripe `createOrder` (PaymentIntent) + webhook credit grant  
2. Razorpay webhook; stop relying on client grant alone  
3. Point validate + landing at `/api/payments/quote` for display  
4. RLS + auth-bound credits  
5. Repo hygiene + README  
6. Brain provider parity  

---

## 7. Assessment

Product surface remains an end-to-end founder MVP. Payment **architecture is global-first**; **India can charge today**; **rest-of-world is quote-ready and charge-blocked** until Stripe is implemented behind the same interface.
