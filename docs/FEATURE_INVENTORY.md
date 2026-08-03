# LaunchLens — Feature Inventory

**Repository:** Arup9149/launchlens  
**Last updated:** 2026-08-04

Legend: **Done** · **Partial** · **Missing** · **Broken** · **Dead code**

---

## 1. Marketing & acquisition

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Landing page hero + value prop | **Done** | `src/app/page.tsx` |
| Region-based pricing (IN/US/EU) | **Done** | Client detect + manual switch |
| Pricing cards (Early Bird / Builder / Pro) | **Partial** | UI only; Builder/Pro no checkout |
| Waitlist form | **Done** | `WaitlistForm` → `POST /api/waitlist` |
| Landing navbar CTAs | **Done** | Hardcoded ₹799 CTA |
| Product README / docs site | **Missing** | README is create-next-app default |

---

## 2. Authentication

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Email/password signup | **Done** | `/auth/signup` — LaunchLens branded |
| Email/password login | **Done** | `/auth/login` — LaunchLens branded |
| Forgot password | **Done** | `/auth/forgot-password` |
| Email verification screen | **Done** | `/auth/verify-email` |
| LaunchLens Logo on auth pages | **Done** | Uses `Logo` component |
| Provider names hidden in UI | **Done** | Friendly error mapping; no Supabase copy |
| Sign out | **Partial** | `POST /auth/signout` redirects to `/login` (should be `/auth/login`) |
| Session refresh middleware | **Done** | `src/middleware.ts` |
| Require auth for app pages | **Missing** | `(app)` routes are public |
| OAuth providers | **Missing** | Not implemented |
| Profile / account settings | **Missing** | — |

---

## 3. Credits & monetization

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Early Bird Razorpay order (₹799) | **Done** | `POST /api/razorpay/order` |
| Checkout UI on validate | **Done** | Loads Razorpay.js |
| Grant credits after payment | **Partial** | Client handler only; no webhook |
| Use credit per validation | **Done** | `POST /api/credits` action `use` |
| Credit balance by email | **Done** | Dashboard + validate panel |
| Dev skip payment | **Done** | `NEXT_PUBLIC_SKIP_PAYMENT=true` |
| Multi-currency checkout | **Missing** | Order always INR 79900 |
| Stripe integration | **Missing** | Package present, no routes |
| Builder / Pro plans | **Missing** | Marketing only |
| Architecture micro-guide ₹200 | **Broken** | UI calls `/api/razorpay/guide` — route absent |
| Invoice / receipt | **Missing** | — |

---

## 4. Validation (core)

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Idea input + email | **Done** | `/validate` |
| Brain health badge | **Done** | `/api/brain/health` |
| Full Go/Pivot/Kill analysis | **Done** | `/api/analyze` |
| Score breakdown (5 dimensions) | **Done** | In report UI |
| Persist validation | **Done** | `POST /api/validations` |
| Result page | **Done** | `/validate/result` |
| Print / Download PDF | **Done** | `window.print()` |
| Handoff links to Workshop | **Done** | Query `idea=` |
| Rate limiting | **Missing** | — |
| Auth-scoped validation history | **Missing** | List is global via anon client |

---

## 5–13

(Unchanged from prior inventory: Dashboard, Workshop, Guides, Brain, UI system, Platform/ops, dead code, debt priorities — see git history for full prior tables. Auth section above is the 2026-08-04 delta.)

### Technical debt summary (priority)

**P0** — Open validations/credits APIs; client-only payment grant; missing guide API  
**P1** — Brain provider parity; guide entitlement; fix signout redirect  
**P2** — Hygiene, shared Brain helpers, README  
**P3** — Stripe, plans, tests, CI  
