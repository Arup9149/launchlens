# LaunchLens — AI Changelog

Newest entries first.

---

## 2026-08-04 — Deploy hardening (env + build)

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** Production deploy blockers

### Root causes analyzed

1. **Environment (primary runtime blocker):** `@supabase/ssr` throws if URL/anon key missing when a client is created. Middleware previously always constructed a client → every request could fail on a misconfigured Vercel project.  
2. **Code hygiene:** `.gitignore` used `.env*` which blocked committing `.env.example`. Nested `launchlens/.next` remains in git history as noise (now ignored for future).  
3. **Build:** Current `main` **does compile** with `npm run build` / webpack **without** secrets after payment refactor (no module-level Razorpay init).  

### Fixes

- `src/lib/supabase/env.ts` + guarded client/server/middleware  
- `.env.example` with full variable list  
- `.gitignore` allows `.env.example`; ignores `/launchlens/`  
- `engines.node >= 20`; tsconfig excludes dead `src/api` and `launchlens`  
- `docs/DEPLOYMENT.md` updated  

### Verification

- `npm run build` — success (Turbopack default)  
- `npx next build --webpack` — success  

---

## 2026-08-04 — Global payment abstraction

Payment domain layer (Razorpay IN live, Stripe ROW stub), quote/order APIs, docs.

---

## 2026-08-04 — LaunchLens-branded authentication UI

Auth pages Logo + copy; forgot-password + verify-email.

---

## 2026-08-03 — Docs suite + repository index

Initial documentation under `docs/`.
