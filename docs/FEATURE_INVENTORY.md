# LaunchLens — Feature Inventory

**Repository:** Arup9149/launchlens  
**Indexed:** 2026-08-03 (full source pass)

Legend: **Done** · **Partial** · **Missing** · **Broken** · **Dead code**

---

## 1. Marketing & acquisition

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Landing page hero + value prop | **Done** | `src/app/page.tsx` |
| Region-based pricing (IN/US/EU) | **Done** | Client detect + manual switch |
| Pricing cards (Early Bird / Builder / Pro) | **Partial** | UI only; Builder/Pro “opens after Early Bird” — no checkout |
| Waitlist form | **Done** | `WaitlistForm` → `POST /api/waitlist` |
| Landing navbar CTAs | **Done** | Hardcoded ₹799 CTA (not region-aware) |
| Product README / docs site | **Missing** | README is create-next-app default |

---

## 2. Authentication

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Email/password signup | **Done** | `/auth/signup` |
| Email/password login | **Done** | `/auth/login` |
| Sign out | **Partial** | `POST /auth/signout` redirects to `/login` (route is `/auth/login`) |
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
| Architecture micro-guide ₹200 | **Broken** | UI calls `/api/razorpay/guide` — **route absent** |
| Invoice / receipt | **Missing** | — |

---

## 4. Validation (core)

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Idea input + email | **Done** | `/validate` |
| Brain health badge | **Done** | `/api/brain/health` |
| Full Go/Pivot/Kill analysis | **Done** | `/api/analyze` |
| Score breakdown (5 dimensions) | **Done** | In report UI |
| Long-form demand/competition/risks/steps | **Done** | Prompt + normalize |
| Builder tips | **Done** | Array on analysis |
| Persist validation | **Done** | `POST /api/validations` |
| Result page from id or session | **Done** | `/validate/result` |
| Print / “Download PDF” | **Done** | `window.print()` CSS |
| Handoff links to Workshop | **Done** | Query `idea=` |
| Rate limiting | **Missing** | — |
| Auth-scoped validation history | **Missing** | List is global via anon client |

---

## 5. Dashboard

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Recent validations list | **Done** | `/api/validations/list` |
| Link into result | **Done** | Query params |
| Credits panel + email entry | **Done** | localStorage `ll_email` |
| Brain online indicator | **Done** | — |
| Tool shortcuts (4 cards) | **Done** | Validate, Polish, Related, Architecture |
| Charts / analytics | **Missing** | — |
| Delete / archive validation | **Missing** | — |

---

## 6. Workshop

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Workshop hub | **Done** | `/workshop` |
| Idea Polishing Garage | **Done** | `/workshop/polish` + `/api/polish` |
| Live local score while typing | **Done** | Heuristic until Brain run |
| Related Idea Generator | **Done** | `/workshop/related` + `/api/related` |
| MVP Architecture Brain | **Done** | `/workshop/architecture` + `/api/architecture` |
| Architecture print PDF | **Done** | Print CSS |
| Builder Timer (focus/break) | **Done** | Client-only; notifications API |
| Preload idea from report | **Done** | `useSearchParams` |
| Shared Brain provider for all tools | **Partial** | Architecture/related Ollama-only |
| Save polish/architecture results to DB | **Missing** | Client state only |
| Export structured JSON | **Missing** | — |

---

## 7. Guides (Early Bird)

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Starter setup guide | **Done** | Static `/guides/starter` |
| Do’s & Don’ts | **Done** | Static `/guides/dos-donts` |
| Unlock after purchase | **Partial** | `localStorage.ll_guides_unlocked` only (no server entitlement) |
| Guide paywall enforcement | **Missing** | Pages are not gated server-side |
| Stack-aware dynamic guide | **Missing** | Marketing claim; content is generic |

---

## 8. AI Brain platform

| Feature | Status | Location / notes |
|---------|--------|------------------|
| OpenRouter provider | **Done** | analyze, polish, health |
| Ollama local provider | **Done** | analyze, polish, architecture, related, health |
| Auto provider + fallback | **Done** | analyze, polish |
| Configurable model env | **Partial** | `OPENROUTER_MODEL`; Ollama model hardcoded `qwen2.5:7b` |
| Structured JSON repair | **Done** | Brace extract fallback |
| Timeouts | **Done** | AbortController 90–150s |
| Streaming responses | **Missing** | Non-streaming only |
| Prompt library / versioning | **Missing** | Inline strings per route |
| Evaluation harness | **Missing** | — |

---

## 9. UI / design system

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Dark atmospheric layout | **Done** | Root layout gradients + grid |
| Logo component | **Done** | `src/components/logo.tsx` |
| Glass CSS utilities | **Done** | `globals.css` |
| shadcn Button/Card/Badge/Input/Separator | **Done** | Present under `components/ui` |
| Consistent use of shadcn across pages | **Partial** | Most feature pages use custom inputs/buttons |
| Framer Motion usage | **Partial** | Dependency present; not central in pages read |
| Responsive layouts | **Done** | Grid breakpoints used widely |
| Accessibility audit | **Missing** | — |
| i18n | **Missing** | English only |

---

## 10. Platform & ops

| Feature | Status | Location / notes |
|---------|--------|------------------|
| Next.js App Router app | **Done** | — |
| TypeScript strict | **Done** | tsconfig `strict: true` |
| ESLint | **Done** | eslint-config-next |
| Unit / integration tests | **Missing** | No test runner scripts |
| CI (GitHub Actions) | **Missing** | Not in tree |
| Env example file | **Missing** | No `.env.example` |
| Schema migrations | **Missing** | Supabase schema not in repo |
| Clean gitignore enforcement | **Broken** | `.next` and zip committed |

---

## 11. Dead / legacy / unfinished code

| Item | Classification |
|------|----------------|
| `src/api/**` (waitlist, brain health, validations list) | **Dead code** — not App Router paths |
| `src/api/waitlist/validations/route.ts` empty | **Dead code** |
| `launchlens/.next/**` | **Should not be versioned** |
| `src1.zip` | **Should not be versioned** |
| Stripe dependency | **Unfinished** (unused) |
| `/api/razorpay/guide` | **Missing** (UI unfinished) |
| Builder Pass / Pro Launch checkout | **Unfinished** marketing-only |
| Auth-bound product data model | **Unfinished** |

---

## 12. Technical debt summary (priority)

**P0 — Correctness / security**

- Open validations/credits APIs without auth or RLS-aware design  
- Payment success handled only in browser  
- Missing guide payment API still linked from UI  

**P1 — Product consistency**

- Unify Brain providers on architecture + related  
- Gate guides by server-side entitlement  
- Fix signout redirect path  

**P2 — Maintainability**

- Delete dead `src/api`, zip, committed `.next`  
- Extract shared Brain helpers  
- Replace stale README; add `.env.example` + schema notes  

**P3 — Growth features**

- Stripe / multi-currency  
- Builder & Pro plans  
- Tests + CI  

---

## 13. File count orientation (source)

Approximate **source** surface (excluding `.next` blobs):

- App pages: ~15 route modules  
- API routes: ~12 live App Router handlers  
- Components: logo, landing (2), ui (5)  
- Lib: utils + 3 Supabase helpers  
- Config: package, next, tsconfig, postcss, eslint, components.json  

Total git tree entries reported by recursive tree API: **133** (includes large committed build artifacts).
