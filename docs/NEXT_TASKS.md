# LaunchLens — Next Tasks

Prioritized backlog. Last updated 2026-08-04.

---

## P0 — Correctness & security

| ID | Task | Status |
|----|------|--------|
| P0-1 | Razorpay **webhook** + server-side credit grant | Open |
| P0-2 | Scope validations/credits to auth user + RLS | Open |
| P0-3 | Fix or remove `/api/razorpay/guide` | Open |
| P0-4 | Rate-limit LLM routes | Open |
| P0-5 | **Stripe PaymentIntent + webhook** behind `PaymentProvider` | Open (architecture ready) |

---

## P1 — Product consistency

| ID | Task | Status |
|----|------|--------|
| P1-0 | Point validate + landing at `/api/payments/quote` (or shared catalog) for display | Open |
| P1-1 | Unify Brain provider for architecture + related | Open |
| P1-2 | Server-side guide entitlement | Open |
| P1-3 | Fix sign-out redirect → `/auth/login` | Open |
| P1-4 | Gate `(app)` routes or document public access | Open |
| P1-5 | Bind credits to `auth.users` | Open |

---

## P2 — Maintainability

| ID | Task | Status |
|----|------|--------|
| P2-1 | Remove `.next` / `src1.zip` from git; fix gitignore | Open |
| P2-2 | Delete dead `src/api/**` | Open |
| P2-3 | Real README | Open |
| P2-4 | `.env.example` (include Stripe placeholders) | Open |
| P2-5 | Shared Brain helpers | Open |
| P2-6 | Schema doc / migrations | Open |

---

## P3 — Growth

| ID | Task | Status |
|----|------|--------|
| P3-1 | Builder / Pro live checkout via payments abstraction | Open |
| P3-2 | Optional PayPal / Lemon Squeezy / Paddle adapters | Open |
| P3-3 | Tests + CI | Open |

---

## Done recently

| ID | Task |
|----|------|
| — | Payment provider interface, catalog, region routing |
| — | `GET /api/payments/quote`, `POST /api/payments/order` |
| — | Razorpay adapter + legacy route wrap |
| — | Stripe provider **stub** registered |
| — | Auth UI LaunchLens branding |

---

## Suggested next coding session

1. **P0-5** Stripe `createOrder` (PaymentIntent) using existing `stripe` package + env keys  
2. **P0-1** Razorpay webhook verification  
3. **P1-0** Validate page: fetch quote, show `display`, call `/api/payments/order`, branch checkout UI on `provider` only  
