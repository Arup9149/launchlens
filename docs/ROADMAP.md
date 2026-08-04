# LaunchLens — Roadmap

**Last updated:** 2026-08-04  
**Product north star:** One founder workspace — Validate → Polish → Expand → Architect — with trustworthy **global** payments and private/cloud Brain options.

Detailed engineering backlog: `docs/NEXT_TASKS.md`.  
Status snapshot: `docs/PROJECT_STATUS.md`.

---

## Horizon A — Stabilize production MVP (now)

**Goal:** Safe to charge real customers without obvious integrity holes.

- Server-verified payment fulfillment (Razorpay webhook first; Stripe webhook when live)  
- Auth-scoped validations & credits (RLS + `user_id`)  
- Fix or remove broken `/api/razorpay/guide` CTA  
- Rate limits on LLM routes  
- Repo hygiene (no committed `.next` / zip; dead `src/api` removed)  
- Real README + `.env.example`  
- Brain provider parity for architecture + related  
- **Wire validate + landing to `/api/payments/quote` for display currency**  

**Exit criteria:** Paid Early Bird works end-to-end with server-side entitlement in India; quotes show correct local currency worldwide.

---

## Horizon A+ — Global checkout (active track)

**Goal:** Same product SKUs, correct provider by country.

| Step | Status |
|------|--------|
| Payment `PaymentProvider` interface + registry | **Done** |
| Catalog (INR/USD/EUR/GBP) | **Done** |
| Region → provider (Razorpay IN, Stripe ROW) | **Done** |
| `GET /api/payments/quote` | **Done** |
| `POST /api/payments/order` | **Done** |
| Razorpay adapter (live) | **Done** |
| Stripe adapter (PaymentIntent + Elements) | **Next** |
| Stripe webhook → credit grant | **Next** |
| Razorpay webhook → credit grant | **Next** |
| Optional PayPal / Lemon Squeezy / Paddle | Later (registry only) |

**Exit criteria:** Non-IN founders can pay in USD/EUR/GBP via Stripe; India remains Razorpay; product code unchanged when adding a third provider.

---

## Horizon B — Coherent product identity

- Bind credits to `auth.users`; optional require login for `(app)`  
- Server-side guide entitlement  
- Fix sign-out redirect; polish auth UX  
- Extract shared `runBrain` module  
- Schema migrations in-repo  

---

## Horizon C — Plans & quality

- Builder Pass / Pro Launch live checkout (multi-provider via same abstraction)  
- Minimal automated tests + CI  
- Persist polish/architecture outputs  
- Accessibility pass  

---

## Horizon D — Platform (future)

- Team workspaces  
- Prompt versioning / eval harness  
- Mobile — out of scope until web MVP stable  

---

## Non-goals (current)

- Hard-coding amounts in UI or route handlers (use catalog)  
- Product pages importing Razorpay/Stripe SDKs  
- Replacing Supabase without a migration plan  

---

## How items move

1. Track in `NEXT_TASKS.md`.  
2. One production-quality slice per cycle.  
3. Update FEATURE_INVENTORY, PROJECT_STATUS, CHANGELOG_AI.  
4. Architecture changes beyond registry routing need explicit approval.
