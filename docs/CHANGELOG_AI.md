# LaunchLens — AI Changelog

Newest entries first.

---

## 2026-08-04 — Launch Readiness Sprint (Authentication UX)

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** Clear authentication entry for new visitors; protect product routes  
**Architecture:** Frozen (middleware route guards + presentation wiring only; existing Supabase auth pages/APIs unchanged)

### Entry points
- Navbar: **Sign In** (`/auth/login`) + **Start Free** (`/auth/signup`) — desktop and mobile
- Landing primary CTAs → **Start Free** → existing signup flow
- No landing redesign; no pricing/Founder economy/payment changes

### Route protection
- `src/lib/supabase/middleware.ts`: unauthenticated users on `/dashboard`, `/validate`, `/workshop`, `/guides` → `/auth/login?next=…`
- Signed-in users on login/signup → dashboard (or safe relative `next`)
- Login page honors `next` after password sign-in (Suspense + `useSearchParams`)

### Session
- App shell **Sign out** form → POST `/auth/signout` (existing route)
- Session refresh path unchanged; product identity still via existing Supabase clients

### Verification
- `npm run build` — TypeScript clean, routes intact

---
