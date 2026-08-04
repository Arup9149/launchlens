# LaunchLens — Feature Inventory

**Last updated:** 2026-08-04 (Sprint A/B)

Legend: **Done** · **Partial** · **Missing** · **Broken**

---

## Marketing & waitlist

| Feature | Status | Notes |
|---------|--------|--------|
| Landing + region pricing UI | **Done** | Client detect |
| Waitlist form | **Done** | Premium success / duplicate / loading |
| Waitlist API + Supabase insert | **Done** | Duplicate-safe |
| Waitlist confirmation email | **Done** | Resend via abstraction; best-effort |
| Email design system | **Done** | `EMAIL_BRAND` + `renderEmailShell` |
| Logo tagline | **Done** | Know before you build. |

## Auth

| Feature | Status | Notes |
|---------|--------|--------|
| Login / signup / forgot / verify UI | **Done** | LaunchLens branded |
| App route auth gate | **Missing** | Middleware refreshes only |

## Payments

| Feature | Status | Notes |
|---------|--------|--------|
| Payment abstraction | **Done** | `src/lib/payments` |
| Razorpay India | **Done** | Live |
| Stripe international | **Partial** | Stub / 503 |
| Webhooks | **Missing** | P0 |

## Validate & Workshop

| Feature | Status | Notes |
|---------|--------|--------|
| Validate + report | **Done** | Founder status copy (Sprint A) |
| Workshop tools | **Done** | Architecture/related Ollama-only |

### Sprint A/B delta (2026-08-04)

- Waitlist: premium success / duplicate / loading states  
- Email: shared `EMAIL_BRAND` shell for transactional templates  
- Docs: `LAUNCH_CHECKLIST.md`  
