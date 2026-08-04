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
| P1-0 | Point validate + landing at `/api/payments/quote` | Open |
| P1-1 | Unify Brain provider for architecture + related | Open |
| P1-2 | Server-side guide entitlement | Open |
| P1-3 | Fix sign-out redirect → `/auth/login` | Open |
| P1-4 | Gate `(app)` routes or document public access | Open |
| P1-5 | Bind credits to `auth.users` | Open |

---

## P2 — Maintainability

| ID | Task | Status |
|----|------|--------|
| P2-1 | Remove `.next` / zip from git | Open |
| P2-2 | Delete dead `src/api/**` | Open |
| P2-3 | Real README | Open |
| P2-4 | `.env.example` maintained | **Done** |
| P2-5 | Shared Brain helpers | Open |
| P2-6 | Schema doc / migrations | Open |

---

## P3 — Growth

| ID | Task | Status |
|----|------|--------|
| P3-1 | Builder / Pro live checkout | Open |
| P3-2 | Optional PayPal / Lemon Squeezy / Paddle | Open |
| P3-3 | Tests + CI | Open |

---

## Done recently

| ID | Task |
|----|------|
| — | Sprint A: waitlist + validate founder messaging |
| — | Sprint B: email design system + LAUNCH_CHECKLIST |
| — | Waitlist welcome email (Resend + abstraction) |
| — | Logo tagline “Know before you build.” |
| — | Payment provider interface + quote/order APIs |
| — | Auth UI LaunchLens branding |
| — | Deploy env hardening |
