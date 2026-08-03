# LaunchLens — Project Status

**Repository:** [Arup9149/launchlens](https://github.com/Arup9149/launchlens)  
**Last status update:** 2026-08-04  
**Branch:** `main`  
**Version (package.json):** `0.1.0`  
**Status:** Early-stage MVP / pre-product-market-fit product surface

---

## 1. What the product is

**LaunchLens** is a founder workspace that walks indie builders through:

1. **Validate** — AI “Brain” produces Go / Pivot / Kill report with score, demand, competition, risks, next steps  
2. **Polish** — refine problem, ICP, wedge, pricing  
3. **Expand** — generate related / adjacent ideas  
4. **Architect** — MVP modules, tech stack, system flow, 30-day plan  

Monetization centers on an **Early Bird** pack (₹799 / ~$9 / ~€9): 2 validation credits + starter guides + Workshop access. Optional local **Ollama** brain or cloud **OpenRouter**.

---

## 2. Tech stack (as implemented)

| Layer | Choice |
|--------|--------|
| Framework | Next.js **16.2.11** (App Router) |
| UI | React **19.2.4**, Tailwind CSS **v4**, shadcn/ui (radix-nova style) |
| Auth / DB | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) — **not shown in product UI** |
| Payments | Razorpay (primary); Stripe listed in deps but not wired in routes reviewed |
| AI | OpenRouter (default cloud) + Ollama `qwen2.5:7b` (local / fallback) |
| Validation | Zod in deps (light usage in app code) |
| Motion / icons | framer-motion, lucide-react |

**Env vars expected (inferred):**

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENROUTER_API_KEY`, optional `OPENROUTER_MODEL`, `BRAIN_PROVIDER` (`auto` \| `openrouter` \| `ollama`)
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_SKIP_PAYMENT` (dev bypass)

**Supabase tables referenced:** `waitlist`, `validations`, `founder_credits`

---

## 3. Completeness snapshot

| Area | State | Notes |
|------|--------|--------|
| Landing + pricing / region detection | Working UI | Region via language/timezone; prices hardcoded |
| Waitlist | Implemented | Inserts into Supabase `waitlist` |
| Auth (login / signup / signout) | **Branded** | LaunchLens Logo + copy; no provider names in UI |
| Forgot password | Implemented | `/auth/forgot-password` |
| Email verification screen | Implemented | `/auth/verify-email` |
| Validate flow + payment gate | Implemented | Razorpay ₹799; credits grant/use; sessionStorage + DB save |
| Validation report | Implemented | Expandable sections, print-to-PDF, handoff to Workshop |
| Dashboard | Implemented | Credits panel, recent validations, brain health |
| Workshop hub | Implemented | Links to polish / related / architecture / timer |
| Polish Garage | Implemented | Brain polish API |
| Related ideas | Implemented | Ollama-only API in current code |
| Architecture Brain | Implemented | Ollama-only; rich blueprint UI |
| Builder Timer | Implemented | Client-only Pomodoro-style timer |
| Early Bird guides | Static content | Starter + Do’s & Don’ts; unlock flag in localStorage |
| Credits system | Implemented | Email-keyed, not auth-user-keyed |
| Brain health | Implemented | OpenRouter + Ollama probe |
| README | **Stale** | Still default create-next-app boilerplate |
| CI / tests | **None observed** | No test scripts beyond `lint` |
| Production auth gating | **Weak** | Middleware only refreshes session; does not enforce login |

---

## 4. Repository hygiene issues

- **`.next` build output committed** under `launchlens/.next/` (and related chunks).  
- **`src1.zip`** committed at repo root.  
- **Duplicate / dead API tree:** `src/api/...`  
- Sign-out redirects to `/login` but login lives at `/auth/login`.  
- Architecture page calls **`/api/razorpay/guide`** — route missing.  
- Stripe dependency unused in routes reviewed.  
- Navbar hardcodes “Early Bird · ₹799”.

---

## 5. Security / correctness risks (high level)

- Many API routes use **anon Supabase client** with **no auth check**.  
- Credits identified by **email**, not session user.  
- Payment success grants credits in **client handler** (no webhook).  
- AI routes have no rate limiting or auth in code reviewed.

---

## 6. Recommended next engineering priorities

1. Remove committed `.next`, `src1.zip`, and dead `src/api/**` tree.  
2. Document real setup in README.  
3. RLS + authenticated server clients; bind credits to `auth.users`.  
4. Razorpay webhook + signature verification.  
5. Unify Brain provider for architecture/related.  
6. Implement or remove `/api/razorpay/guide`.  
7. Protect `(app)` routes behind auth.  
8. Fix sign-out redirect to `/auth/login`.  
9. Minimal tests for analyze + credits + payment.

---

## 7. Overall assessment

MVP product surface is largely built. Auth UI now presents **LaunchLens-only** branding. Remaining gaps are production readiness (authz, payment verification, repo hygiene) rather than primary founder-facing flows.
