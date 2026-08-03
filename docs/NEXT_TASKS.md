# LaunchLens — Next Tasks

Prioritized backlog derived from full repo index (2026-08-03).  
Does **not** change application code by itself — tracking only.

---

## P0 — Correctness & security

| ID | Task | Why | Acceptance criteria |
|----|------|-----|---------------------|
| P0-1 | Add Razorpay **webhook** (or verified server callback) and grant credits only after signature verification | Credits currently granted in client `handler` after checkout | Server verifies payment; client cannot grant credits alone |
| P0-2 | Scope `validations` + `founder_credits` to authenticated user (or strict RLS) | List/insert/mutate use anon client; global leakage risk | Unauthenticated cannot list others’ validations or burn others’ credits |
| P0-3 | Fix or remove Architecture **₹200 guide** checkout | UI calls `/api/razorpay/guide` which **does not exist** | Either working route + flow, or UI CTA removed/disabled |
| P0-4 | Rate-limit `/api/analyze`, `/api/polish`, architecture, related | No auth/rate limit on expensive LLM routes | Abuse limited per IP or user |

---

## P1 — Product consistency

| ID | Task | Why | Acceptance criteria |
|----|------|-----|---------------------|
| P1-1 | Unify Brain provider for `/api/architecture` and `/api/related` with analyze/polish pattern | Ollama-only today; fails when only OpenRouter is configured | Same `BRAIN_PROVIDER` / auto fallback behavior |
| P1-2 | Server-side guide entitlement (not only `localStorage`) | Guides unlock is client flag only | Purchase/credit plan controls access |
| P1-3 | Fix sign-out redirect to `/auth/login` | Currently redirects to `/login` | Sign-out lands on real login page |
| P1-4 | Optional: protect `(app)` routes behind auth **or** document intentional public access | Middleware refreshes session but does not enforce | Explicit product decision implemented |
| P1-5 | Bind credits to `auth.users` id (email as display only) | Email-keyed credits are shareable/spoofable | Logged-in user owns balance |

---

## P2 — Maintainability & hygiene

| ID | Task | Why | Acceptance criteria |
|----|------|-----|---------------------|
| P2-1 | Remove committed `launchlens/.next/**` and `src1.zip` from git; ensure `.gitignore` covers them | Bloat; violates standard Next ignores | Paths gone from tree; ignore works |
| P2-2 | Delete dead `src/api/**` tree | Not App Router; confuses agents and humans | Only `src/app/api/**` remains for HTTP handlers |
| P2-3 | Replace root `README.md` with real setup (env, Ollama, Supabase tables, Razorpay, skip payment) | Current README is create-next-app template | New contributor can run locally from README |
| P2-4 | Add `.env.example` (no secrets) | No env template in repo | Example lists all required vars |
| P2-5 | Extract shared Brain helpers (`runBrain`, `parseJson`, clamp, prompts module) | Duplicated across analyze/polish (and should cover architecture/related) | Single module; routes thin |
| P2-6 | Document Supabase schema (SQL or migration notes) in `docs/` | Tables only implied by inserts | Schema doc matches code |

---

## P3 — Growth & quality

| ID | Task | Why | Acceptance criteria |
|----|------|-----|---------------------|
| P3-1 | Multi-currency / Stripe path for US-EU | Landing shows $ / € but order is always INR 79900 | Non-IN checkout works or pricing UI matches reality |
| P3-2 | Builder Pass / Pro Launch real checkout | Marketing cards only | Plans grant correct credit amounts |
| P3-3 | Minimal tests (API analyze mock + credits grant/use) | No test suite | CI or local `npm test` covers core |
| P3-4 | GitHub Actions lint + typecheck | No CI observed | PR runs lint/tsc |
| P3-5 | Persist polish / architecture outputs (optional) | Client-only today | Saved against validation or user |
| P3-6 | Navbar region-aware Early Bird CTA | Hardcoded ₹799 | Matches selected region |

---

## Suggested sequence for next coding session

1. **P2-1, P2-2** — hygiene (safe, no behavior change if careful)  
2. **P0-3** — stop broken guide CTA or implement route  
3. **P1-3** — one-line redirect fix  
4. **P1-1** — Brain provider parity  
5. **P0-1, P0-2** — payment + authz (largest product risk)  
6. **P2-3, P2-4, P2-6** — docs for humans  

---

## Out of scope until asked

- Redesign of landing or brand  
- New AI product features beyond fixing provider parity  
- Mobile native apps  
- Changing Early Bird price without product decision  

---

## Tracking

When completing a task, append a short note to `CHANGELOG_AI.md` and strike or move the row here.
