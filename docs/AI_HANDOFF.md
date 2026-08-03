# LaunchLens — AI Handoff

**Purpose:** Orient a new human or AI agent to the codebase without re-indexing from zero.  
**Based on:** Full recursive read of `Arup9149/launchlens` `main` on 2026-08-03.  
**App code modified in that session:** None (docs only).

---

## 1. One-sentence product

LaunchLens helps indie founders **Validate → Polish → Expand → Architect** ideas with an LLM “Brain,” gated by an Early Bird credit pack (Razorpay ₹799).

---

## 2. Where to look first

| Concern | Path |
|---------|------|
| Live API routes | `src/app/api/**` only |
| Product UI | `src/app/(app)/**` |
| Marketing | `src/app/page.tsx` |
| Auth UI | `src/app/auth/**` |
| Supabase clients | `src/lib/supabase/**` |
| Session middleware | `src/middleware.ts` |
| **Ignore** | `src/api/**` (dead duplicates), `launchlens/.next/**`, `src1.zip` |

Related docs in this folder:

- `PROJECT_STATUS.md` — completeness + risks  
- `ARCHITECTURE.md` — system design  
- `FEATURE_INVENTORY.md` — feature-by-feature status  
- `NEXT_TASKS.md` — prioritized work  
- `CHANGELOG_AI.md` — agent activity log  
- `ENGINEERING_RULES.md` — binding conventions and governance  
- `API_REFERENCE.md` — HTTP API contracts  
- `DATABASE.md` — schema and RLS guidance  
- `DEPLOYMENT.md` — env, local, production  
- `ROADMAP.md` — product horizons  

---

## 3. Runtime contracts

### Environment (inferred)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENROUTER_API_KEY          # optional if Ollama only
OPENROUTER_MODEL            # default deepseek/deepseek-chat
BRAIN_PROVIDER              # auto | openrouter | ollama
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_SKIP_PAYMENT    # "true" skips pay wall in validate
```

### Supabase tables referenced in code

- `waitlist` — email inserts  
- `validations` — idea, score, verdict, confidence, analysis (json), created_at  
- `founder_credits` — email, credits, plan, updated_at  

Schema SQL is **not** in the repo.

### Brain

- **analyze** (`/api/analyze`) and **polish** (`/api/polish`): dual provider (OpenRouter + Ollama, auto fallback).  
- **architecture** and **related**: **Ollama only** (`qwen2.5:7b` at `localhost:11434`).  
- Health: `/api/brain/health`.

### Client storage

- `localStorage.ll_email` — credit lookup email  
- `localStorage.ll_guides_unlocked` — `"1"` after purchase / skip  
- `sessionStorage.ll_analysis` — report payload before/without id  

---

## 4. Critical flows (do not break lightly)

1. **Validate without credits:** analyze → save validation → Razorpay order → client success → grant 2 credits + use 1 → unlock guides → result.  
2. **Validate with credits:** use 1 → analyze → save → result.  
3. **Result → Workshop:** `?idea=` query on polish / related / architecture.  
4. **Dashboard:** list validations + credit refresh by email.

---

## 5. Known landmines

1. **Identity split:** Supabase Auth exists, but product identity for credits/validations is **email string**, not `auth.uid`.  
2. **APIs mostly unauthenticated:** anon Supabase from server routes; list endpoints can return global data if RLS is open.  
3. **Payment:** credits granted in **browser** Razorpay handler — no webhook route observed.  
4. **Broken link:** Architecture UI posts to `/api/razorpay/guide` — **route does not exist**.  
5. **Sign-out:** redirects to `/login`; actual page is `/auth/login`.  
6. **Repo hygiene:** committed `.next` under `launchlens/`, `src1.zip`, dead `src/api/**`.  
7. **README** is still create-next-app boilerplate.

---

## 6. Conventions observed

- App Router + `"use client"` for interactive pages.  
- Path alias `@/*` → `./src/*`.  
- Dark glass UI (custom CSS classes `.glass`, `.glass-strong`); shadcn under `src/components/ui` underused by feature pages.  
- AI responses expected as **JSON only**; server clamps scores 0–100 and normalizes missing fields.  
- Print-to-PDF via `window.print()` + `@media print` styles.

---

## 7. Safe first actions for an agent

**Docs / hygiene (low risk):** update README, add `.env.example`, document schema, delete dead paths *after* explicit approval.  

**Do not** without explicit instruction:

- Change payment or credit logic  
- Change Brain prompts in production-facing way without review  
- Push secrets  
- Force-push `main`  

Prefer small PR-sized commits with clear messages.

---

## 8. Suggested coding order (see also NEXT_TASKS.md)

1. Repo hygiene (artifacts, ignore rules)  
2. Payment webhook + server-side credit grant  
3. Auth-scoped data access / RLS  
4. Unify Brain provider for architecture + related  
5. Implement or remove guide purchase API  
6. Fix sign-out redirect  
7. Tests for analyze + credits happy path  

---

## 9. Agent rules already in repo

- `AGENTS.md` / `CLAUDE.md` note that this Next.js version may differ from training data; check `node_modules/next/dist/docs/` when coding against Next APIs.

---

## 10. Session protocol (Lead Architect)

At session start: read all files under `docs/` listed in the required structure, list latest commits, compare docs to code, update docs before implementing features. Architecture is frozen unless explicitly approved. One production-quality feature per cycle with what/why/files/risks/verification before coding.
