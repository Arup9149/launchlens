# LaunchLens — Project Status

**Repository:** [Arup9149/launchlens](https://github.com/Arup9149/launchlens)  
**Indexed at:** 2026-08-03  
**Branch inspected:** `main`  
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
| Auth / DB | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
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
| Auth (login / signup / signout) | Basic | Email/password via Supabase; no route protection on app pages |
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

- **`.next` build output committed** under `launchlens/.next/` (and related chunks) — violates typical `.gitignore` intent; bloat and noise.
- **`src1.zip`** committed at repo root.
- **Duplicate / dead API tree:** `src/api/...` (Pages-Router-style paths) mirrors some App Router handlers; **not** the live Next App Router routes (`src/app/api/...` are the real ones).
- Empty file: `src/api/waitlist/validations/route.ts` (0 bytes).
- Sign-out redirects to `/login` but login lives at `/auth/login`.
- Architecture page calls **`/api/razorpay/guide`** — **no such route exists** in the tree.
- Stripe dependency unused in routes reviewed.
- Navbar hardcodes “Early Bird · ₹799” even when landing supports multi-currency display.

---

## 5. Security / correctness risks (high level)

- Many API routes use **anon Supabase client** with **no auth check** — list/get/insert validations and credit mutations are effectively open if RLS is not strict.
- Credits identified by **email query param / body**, not session user — easy to guess or share.
- Payment success grants credits in **client handler** after Razorpay checkout (no verified webhook path observed) — vulnerable to incomplete verification if not completed server-side.
- AI routes have no rate limiting or auth in code reviewed.

---

## 6. Recommended next engineering priorities

1. Remove committed `.next`, `src1.zip`, and dead `src/api/**` tree; enforce gitignore.  
2. Document real setup in README (env, Ollama, Supabase schema, Razorpay).  
3. Add RLS + authenticated server clients for validations/credits; bind credits to `auth.users`.  
4. Implement Razorpay webhook + signature verification; remove client-only credit grant as sole path.  
5. Unify Brain provider (OpenRouter + Ollama) for architecture/related the same way as analyze/polish.  
6. Implement or remove `/api/razorpay/guide`.  
7. Protect `(app)` routes behind auth (or explicit public marketing vs app split).  
8. Add minimal e2e or API tests for analyze + credits + payment happy path.

---

## 7. Overall assessment

The product **surface is largely built end-to-end as a founder-facing MVP**: landing, paid validation, report, workshop tools, and guides. The **Brain integration** is the core differentiator and is relatively mature for analyze/polish. Gaps are mainly **production readiness** (authz, payment verification, repo hygiene, docs, missing guide payment API) rather than missing primary UI features.
