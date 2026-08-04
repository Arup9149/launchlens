# LaunchLens — Next Tasks

Prioritized backlog. Last updated 2026-08-04 (Early Founder Experience).

---

## P0 — Correctness & security

| ID | Task | Status |
|----|------|--------|
| P0-1 | Razorpay webhook + server-side credit grant | **Done** (apply SQL + set secrets) |
| P0-2 | Scope validations/credits to auth user + RLS | **Done** (SQL must be applied) |
| P0-3 | Fix or remove `/api/razorpay/guide` | Open |
| P0-4 | Rate-limit LLM routes | Open |
| P0-5 | Stripe PaymentIntent + webhook | Open |

---

## P1 — Product consistency

| ID | Task | Status |
|----|------|--------|
| P1-0 | Point validate + landing at `/api/payments/quote` | Open |
| P1-1 | Unify Brain provider for architecture + related | Open |
| P1-2 | Server-side guide entitlement | Open |
| P1-4 | Gate `(app)` routes or document public access | Open |

---

## Ops

| Task | Notes |
|------|--------|
| Run `docs/migrations/001_p0_security.sql` | Supabase |
| Set service role + webhook secret | Vercel |
| Point Razorpay webhook URL | Production domain |

---

## Done recently

| Task |
|------|
| Early Founder onboarding, Founder Validations copy, upgrade panel, playbook PDFs |
| P0 Security code path |
| Sprint 2 responsive / SEO / a11y |
