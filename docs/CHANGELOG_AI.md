# LaunchLens — AI Changelog

Record of AI/agent-assisted work on this repository.  
Newest entries first.

---

## 2026-08-04 — Global payment abstraction (Razorpay IN + Stripe ROW)

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** Payment domain layer + APIs + docs (Stripe charge path not implemented)

### Actions

1. Added `src/lib/payments/`:
   - `types.ts` — `PaymentProvider`, quotes, orders  
   - `catalog.ts` — Early Bird / plans in INR·USD·EUR·GBP minor units  
   - `region.ts` — country → currency + provider (IN→Razorpay, else→Stripe)  
   - `providers/razorpay.ts` — live adapter  
   - `providers/stripe.ts` — registered stub (`PROVIDER_NOT_CONFIGURED` / `NOT_IMPLEMENTED`)  
   - `providers/registry.ts` — extensible registry  
   - `index.ts` — `getQuote()`, `createPaymentOrder()`  
2. Added `GET /api/payments/quote` and `POST /api/payments/order`.  
3. Refactored `POST /api/razorpay/order` to call `createPaymentOrder` (INR forced).  
4. Documented strategy in ARCHITECTURE, API_REFERENCE, ROADMAP, PROJECT_STATUS.

### Application code

- **Added:** payment domain + payments API routes  
- **Modified:** legacy Razorpay order route (behavior preserved for IN)  
- **Not done:** Stripe PaymentIntent, webhooks, validate UI currency wiring

### Notes

- Product/business logic must not import gateway SDKs; use `@/lib/payments`.  
- Next cycle: Stripe implementation behind the same interface + webhook fulfillment.

---

## 2026-08-04 — LaunchLens-branded authentication UI

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** User-facing auth branding only

### Actions

- Login/signup LaunchLens copy + Logo; forgot-password + verify-email pages  
- Friendly errors; no provider names in UI  

### Application code

- Modified auth pages; added forgot-password + verify-email  

---

## 2026-08-03 — Architect docs suite + full repository index

Documentation pack under `docs/` (status, architecture, inventory, handoff, tasks, engineering rules, API, database, deployment, roadmap). Initial index of application code; no app logic changes in the docs-only commits.

---

## Template for future entries

```markdown
## YYYY-MM-DD — Short title

**Agent:** …
**Scope:** …

### Actions
- …

### Application code
- Modified: … / Not modified

### Notes
- …
```
