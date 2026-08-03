# LaunchLens — Architecture

**Repository:** Arup9149/launchlens  
**Document generated from full recursive index of `main` (2026-08-03)**

---

## 1. System overview

```
┌────────────────────────────────────────────────────────────────┐
│                         Browser (client)                         │
│  Landing · Auth · Dashboard · Validate · Report · Workshop       │
│  localStorage: ll_email, ll_guides_unlocked                      │
│  sessionStorage: ll_analysis                                     │
└─────────────┬───────────────────────────────────┬──────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐    ┌──────────────────────────────────┐
│   Next.js App Router     │    │ External services                 │
│   src/app/**             │    │  • Supabase (Auth + Postgres)     │
│   API routes under       │    │  • OpenRouter (LLM cloud)         │
│   src/app/api/**         │    │  • Ollama localhost:11434         │
│   Middleware: session    │    │  • Razorpay checkout              │
└────────────┬────────────┘    └──────────────────────────────────┘
              │
              ▼
         Node.js / Next server
```

**Primary runtime:** Node.js server (Next.js) talking to Supabase and LLM providers. Optional local Ollama for private / zero-API-cost inference.

---

## 2. Directory map (source of truth)

```
/
├── package.json, package-lock.json
├── next.config.ts          # empty options object
├── tsconfig.json           # @/* → ./src/*
├── postcss.config.mjs      # Tailwind v4 PostCSS
├── eslint.config.mjs
├── components.json         # shadcn config (radix-nova)
├── README.md               # default template (stale)
├── AGENTS.md / CLAUDE.md   # Next.js agent rules note
├── .gitignore
├── public/                 # default SVGs
├── src1.zip                # archive artifact (should not be in git)
├── launchlens/.next/       # committed build output (should not be in git)
└── src/
    ├── middleware.ts       # Supabase session refresh
    ├── app/
    │   ├── layout.tsx      # root dark theme + atmosphere
    │   ├── page.tsx        # marketing landing
    │   ├── globals.css     # glass utilities + Tailwind import
    │   ├── auth/
    │   │   ├── login/page.tsx
    │   │   ├── signup/page.tsx
    │   │   └── signout/route.ts
    │   ├── (app)/          # product shell (header nav)
    │   │   ├── layout.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── validate/page.tsx
    │   │   ├── validate/result/page.tsx
    │   │   ├── workshop/page.tsx
    │   │   ├── workshop/polish|related|architecture|timer/page.tsx
    │   │   └── guides/starter|dos-donts/page.tsx
    │   └── api/
    │       ├── analyze/route.ts
    │       ├── polish/route.ts
    │       ├── architecture/route.ts
    │       ├── related/route.ts
    │       ├── brain/health/route.ts
    │       ├── credits/route.ts
    │       ├── validations/route.ts
    │       ├── validations/list/route.ts
    │       ├── validations/[id]/route.ts
    │       ├── waitlist/route.ts
    │       └── razorpay/order/route.ts
    ├── components/
    │   ├── logo.tsx
    │   ├── landing/navbar.tsx, waitlist-form.tsx
    │   └── ui/ (button, card, badge, input, separator)
    ├── lib/
    │   ├── utils.ts (cn)
    │   └── supabase/client.ts, server.ts, middleware.ts
    └── api/   # DEAD / legacy duplicate handlers — not App Router
```

---

## 3. Application layers

### 3.1 Presentation

- **Marketing:** `src/app/page.tsx` — region-aware pricing, funnel CTAs, waitlist.
- **Auth UI:** client forms calling Supabase browser client.
- **App shell:** `src/app/(app)/layout.tsx` — sticky header with Dashboard / Validate / Workshop.
- **Feature pages:** mostly `"use client"` with fetch to `/api/*`.
- **Design system:** dark zinc/violet glass UI; shadcn primitives present but many pages use raw Tailwind classes instead of `Button`/`Card`.

### 3.2 Middleware

`src/middleware.ts` → `updateSession` in `src/lib/supabase/middleware.ts`:

- Creates server Supabase client from cookies.
- Calls `supabase.auth.getUser()` to refresh session.
- **Does not** redirect unauthenticated users away from `/dashboard`, `/validate`, etc.

### 3.3 API routes (App Router)

| Route | Method | Role |
|-------|--------|------|
| `/api/analyze` | POST | Validation Brain (OpenRouter ↔ Ollama) |
| `/api/polish` | POST | Polish Brain (same dual provider) |
| `/api/architecture` | POST | MVP blueprint (**Ollama only** today) |
| `/api/related` | POST | Related ideas (**Ollama only** today) |
| `/api/brain/health` | GET | Provider availability |
| `/api/credits` | GET/POST | Email-based credit balance / grant / use |
| `/api/validations` | POST | Persist validation |
| `/api/validations/list` | GET | Recent validations |
| `/api/validations/[id]` | GET | Single validation |
| `/api/waitlist` | POST | Email capture |
| `/api/razorpay/order` | POST | Create ₹799 Early Bird order |

**Missing but referenced by UI:** `/api/razorpay/guide` (Architecture page micro-guide purchase).

### 3.4 Data model (inferred from code)

```
waitlist(email, ...)
validations(id, idea, score, verdict, confidence, analysis jsonb, created_at)
founder_credits(email, credits, plan, updated_at)
```

No SQL migrations or schema files live in the repo.

### 3.5 AI (“Brain”) subsystem

**Shared pattern (analyze + polish):**

1. Build long structured prompt requiring JSON output.  
2. `BRAIN_PROVIDER`:
   - `openrouter` → OpenRouter chat completions  
   - `ollama` → `http://127.0.0.1:11434/api/generate` model `qwen2.5:7b`  
   - `auto` → OpenRouter if key present, else Ollama; OpenRouter failure falls back to Ollama  
3. Parse JSON (with brace-extract fallback).  
4. Normalize/clamp scores and return `{ analysis|result, engine }`.

**Architecture + related:** hard-coded Ollama only — inconsistency with analyze/polish.

**Health:** prefers OpenRouter if configured; otherwise probes Ollama tags for qwen2.5.

---

## 4. Critical user flows

### 4.1 Validate + pay (happy path)

1. User enters email + idea on `/validate`.  
2. Client checks `/api/credits?email=…`.  
3. **If credits > 0:** decrement credit → `/api/analyze` → save `/api/validations` → result page.  
4. **If no credits:** run analyze first → save validation → create Razorpay order → open checkout → on success client `grant` 2 credits, `use` 1, unlock guides in localStorage → result page.  
5. Result loads from `?id=` (DB) or `sessionStorage.ll_analysis`.

### 4.2 Workshop continuity

Result links pass `?idea=` into polish / related / architecture so the founder does not retype.

### 4.3 Auth (optional for product paths)

Signup/login establish Supabase session, but product APIs and pages do not require it today; identity for billing is **email string**.

---

## 5. Security architecture (current)

| Concern | Current approach | Gap |
|---------|------------------|-----|
| Session | Cookie-based Supabase SSR | App routes not gated |
| Data access | Anon key from server routes | No user-scoped filters; list endpoints return global data |
| Credits | Email key | Spoofable without auth |
| Payments | Client success handler | No webhook / signature verification observed |
| Secrets | Env vars | Standard; `.env*` gitignored |
| AI | Server-side keys | Good; no browser LLM keys |

---

## 6. Deployment assumptions

- Next.js host (e.g. Vercel) for web + API routes.  
- Supabase project with tables + (ideally) RLS.  
- For local Brain: machine running Ollama with `qwen2.5:7b`, or OpenRouter key for cloud-only.  
- Razorpay account for INR Early Bird orders.

---

## 7. Architectural inconsistencies / debt hotspots

1. **Dual Brain strategies** — analyze/polish multi-provider vs architecture/related Ollama-only.  
2. **Dead `src/api` tree** — confuses readers; not served by App Router.  
3. **Auth vs email identity** — two parallel identity models.  
4. **Client-side payment fulfillment** without server confirmation path.  
5. **No domain module layer** — prompts, clamps, and fetch logic duplicated across route files.  
6. **UI component library underused** — shadcn installed; feature pages largely custom markup.  
7. **Committed build artifacts** — `launchlens/.next`, `src1.zip`.

---

## 8. Suggested target architecture (evolutionary)

```
src/
  domain/
    brain/          # provider interface, prompts, normalize
    credits/        # grant/use with auth.uid
    validations/    # CRUD with RLS
    billing/        # Razorpay order + webhook
  app/api/...       # thin route handlers
```

Introduce:

- Authenticated Supabase server client with service role only for webhooks.  
- Shared `runBrain(prompt, options)` used by all AI routes.  
- Webhook route for payment confirmation before credit grant.
