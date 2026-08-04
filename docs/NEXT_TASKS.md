# LaunchLens — Next Tasks

Prioritized backlog. Last updated 2026-08-04 (P0 Security).

---

## P0 — Correctness & security

| ID | Task | Status |
|----|------|--------|
| P0-1 | Razorpay **webhook** + server-side credit grant | **Done** (apply SQL + set secrets) |
| P0-2 | Scope validations/credits to auth user + RLS | **Done** (SQL must be applied) |
| P0-3 | Fix or remove `/api/razorpay/guide` | Open |
| P0-4 | Rate-limit LLM routes | Open |
| P0-5 | **Stripe PaymentIntent + webhook** behind `PaymentProvider` | Open |

---

## P1 — Product consistency

| ID | Task | Status |
|----|------|--------|
| P1-0 | Point validate + landing at `/api/payments/quote` | Open |
| P1-1 | Unify Brain provider for architecture + related | Open |
| P1-2 | Server-side guide entitlement | Open |
| P1-3 | Fix sign-out redirect → `/auth/login` | **Done** |
| P1-4 | Gate `(app)` routes or document public access | Open |
| P1-5 | Bind credits to `auth.users` | **Done** (code + migration) |

---

## Ops (required after this sprint)

| Task | Notes |
|------|--------|
| Run `docs/migrations/001_p0_security.sql` | Supabase SQL editor |
| Set `SUPABASE_SERVICE_ROLE_KEY` | Vercel + local |
| Set `RAZORPAY_WEBHOOK_SECRET` | Razorpay dashboard → webhook URL |
| Point webhook URL | `https://<domain>/api/payments/webhooks/razorpay` |

---

## Done recently

| ID | Task |
|----|------|
| — | P0 Security: webhook, verify, auth-scoped data, RLS SQL |
| — | Sprint 2 C/D/E responsive / SEO / a11y |
