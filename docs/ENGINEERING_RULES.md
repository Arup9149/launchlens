# LaunchLens — Engineering Rules

**Status:** Binding for all contributors and agents  
**Last updated:** 2026-08-03  
**Authority:** Lead Software Architect; architecture changes require explicit approval

The repository is the source of truth. These rules govern how code is written, reviewed, and merged.

---

## 1. Coding conventions

- **Language:** TypeScript only for app and API code. `strict: true` in `tsconfig.json`.
- **Runtime:** Next.js App Router (`src/app/**`). Do not introduce Pages Router routes.
- **Imports:** Prefer path alias `@/*` → `./src/*`. No deep relative `../../../` chains when `@/` works.
- **Components:** Server Components by default; add `"use client"` only when hooks, browser APIs, or interactivity require it.
- **Formatting:** Match existing file style (2-space indent; stay consistent within a file).
- **No `any` without justification:** Prefer typed payloads; narrow with Zod or explicit interfaces at API boundaries.

---

## 2. Folder ownership

| Path | Owns | Must not |
|------|------|----------|
| `src/app/(app)/**` | Authenticated-product UI (dashboard, validate, workshop, guides) | Business logic for payments/LLM |
| `src/app/auth/**` | Auth pages + signout route | Product features |
| `src/app/api/**` | HTTP handlers only (thin) | Large prompt/UI strings if extractable |
| `src/app/page.tsx` | Marketing landing | App shell concerns |
| `src/components/ui/**` | shadcn primitives | Feature-specific product copy |
| `src/components/landing/**` | Marketing components | App dashboard widgets |
| `src/lib/supabase/**` | Supabase client factories | Feature domain rules |
| `src/lib/**` | Shared pure helpers | Route handlers |
| `src/api/**` | **Deprecated / dead** — do not extend | New endpoints |
| `docs/**` | Project memory for humans/agents | Runtime secrets |

---

## 3. Module responsibilities

- **API routes:** Validate input → call domain/helper → return `NextResponse.json`. No JSX.
- **Brain (LLM):** Prompt build, provider call, JSON parse, normalize/clamp. Prefer a shared helper when extending (see `ARCHITECTURE.md` target `domain/brain`).
- **Credits / billing:** Server is authority. Client must not be the sole grant path.
- **UI pages:** Compose layout + fetch; keep presentation and side effects separable.
- **Middleware:** Session refresh only unless an approved change adds route guards.

---

## 4. API design patterns

- Routes live under `src/app/api/<resource>/route.ts` (and nested segments).
- **Methods:** `GET` for reads, `POST` for creates/actions. Avoid overloading GET with mutations.
- **Body:** JSON; reject with `400` when required fields missing or too short (e.g. idea length).
- **Success:** `{ ...data }` or `{ success: true, id }`.
- **Errors:** `{ error: string }` with appropriate status (`400`, `402`, `500`, `504`).
- **LLM routes:** Return normalized domain objects + optional `engine` field; never stream secrets.
- **Do not** invent parallel handlers under `src/api/` (legacy dead tree).

---

## 5. Error handling standards

- Catch at route boundary; log with `console.error` (upgrade to structured logger when introduced).
- Map known cases: `AbortError` → `504`; missing Brain → clear message about Ollama/OpenRouter.
- Never leak stack traces or API keys to the client.
- Client UI: surface `error` string via alert or inline message; do not fail silently on payment/credit.

---

## 6. Naming conventions

- **Files:** `kebab-case` for routes folders; `page.tsx` / `route.ts` as Next requires; components match neighbors.
- **Functions:** `camelCase` (`runBrain`, `createClient`).
- **Types:** `PascalCase` (`Validation`, `RelatedIdea`).
- **Env vars:** `SCREAMING_SNAKE`; public browser vars must use `NEXT_PUBLIC_` prefix.
- **localStorage keys:** prefix `ll_` (e.g. `ll_email`, `ll_guides_unlocked`).

---

## 7. UI / UX design system

- **Theme:** Dark by default (`className="dark"` on `<html>`). Background atmosphere defined in root layout.
- **Surfaces:** Prefer existing `.glass` / `.glass-strong` utilities in `globals.css`.
- **Accent:** Violet / fuchsia gradients for primary CTAs; emerald for success; red/amber for Kill/Pivot.
- **Typography:** Inter via `next/font`; tracking-tight headings; zinc scale for secondary text.
- **Components:** Reuse `src/components/ui/*` when building new controls; do not fork Button styles ad hoc without reason.
- **Print:** Feature reports may use `@media print` + `window.print()`; keep print CSS local to the page.
- **Motion:** framer-motion is available; use sparingly; do not block critical flows on animation.

---

## 8. State management rules

- **Server state:** Supabase tables via API routes; no global client store required for MVP.
- **Client state:** React `useState` / `useEffect` on feature pages is the norm.
- **Ephemeral report payload:** `sessionStorage.ll_analysis`.
- **Identity for credits (current):** `localStorage.ll_email` — treat as transitional; prefer `auth.uid` when implementing P1-5.
- **Do not** introduce Redux/Zustand unless a documented need is approved.

---

## 9. Database conventions

- Tables in use: `waitlist`, `validations`, `founder_credits` (see `DATABASE.md`).
- Prefer explicit column lists in `select()`.
- Assume **RLS should be strict** in production; do not rely on “open anon” as a feature.
- Schema changes: document in `docs/DATABASE.md` and ship SQL/migration notes with the change.
- No ORM required; `@supabase/supabase-js` is the access layer.

---

## 10. Testing requirements

- Current baseline: `npm run lint` only.
- When adding critical paths (credits, payment webhook, analyze): add at least one automated test or a documented manual verification script in the PR/commit notes.
- Agents must state a **verification plan** before implementing and execute it after (build/lint when environment allows).

---

## 11. Performance guidelines

- LLM calls are slow (up to ~90–150s timeouts). Never block the entire app shell on Brain; keep loading UI local to the action.
- Prefer `cache: "no-store"` only where freshness is required (e.g. brain health).
- Do not commit `.next` or large binaries.
- Avoid huge client bundles on marketing page; keep heavy workshop tools on their routes.

---

## 12. Security requirements

- Secrets only in env (never commit `.env*`).
- Razorpay key secret and OpenRouter key: **server-only**.
- Payment fulfillment must move to **verified server path** (webhook); client handler is insufficient alone.
- Do not expose service-role Supabase keys to the browser.
- Validate and bound user-provided idea text length before LLM calls.
- Treat email-based credit APIs as sensitive until auth-scoped.

---

## 13. Logging strategy

- Use `console.error` for failures in API routes today.
- Log provider fallback (OpenRouter → Ollama) for operability.
- Do not log full prompts/responses in production if they may contain user PII beyond operational need; prefer error summaries.
- Future: structured JSON logs + request id — document before introducing.

---

## 14. Documentation standards

- Required tree under `docs/` (see AI_HANDOFF). Agents update docs after each completed feature.
- **Repository > chat history** as permanent memory.
- Every implementation proposal must include: what / why / files / risks / verification.
- Do not leave stale README create-next-app text when touching onboarding (P2-3).

---

## 15. Git workflow

- Default branch: `main`.
- Prefer small, focused commits with imperative messages (`docs: …`, `fix: …`, `feat: …`).
- Do not force-push `main`.
- Do not commit secrets, `.next`, or `node_modules`.
- Agents: push docs and code only when asked or as part of an approved task; never rewrite unrelated history.

---

## 16. Refactoring policy

- Prefer incremental improvement over rewrites.
- Extract shared Brain helpers when touching a second copy of the same logic.
- Delete dead `src/api/**` only as an explicit hygiene task with verification that App Router routes remain.
- No drive-by renames across the app in feature PRs.

---

## 17. Architecture governance

- **Architecture is frozen** unless explicitly approved by the product owner / Lead Architect session instruction.
- Working flows (validate → pay → report → workshop handoff) must remain backward compatible unless a migration plan is documented.
- New providers (Stripe, etc.) extend billing module patterns; do not fork a second credit system.
- Target modular layout (`domain/brain`, `domain/billing`, …) is evolutionary guidance—not a mandate to restructure everything in one PR.

---

## 18. Agent-specific rules

1. Read required `docs/*` at session start.  
2. Inspect real files before coding; never guess paths.  
3. One production-quality feature per cycle.  
4. Update `PROJECT_STATUS`, `NEXT_TASKS`, `FEATURE_INVENTORY`, `CHANGELOG_AI` after completion.  
5. No application code changes when the task is documentation-only.
