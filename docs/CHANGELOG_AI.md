# LaunchLens — AI Changelog

Newest entries first.

---

## 2026-08-04 — Launch Readiness Sprint (MVP Email Branding)

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** Transactional email From identity + waitlist delivery reliability  
**Architecture:** Frozen (email config + waitlist send path only; no auth/payment/API redesign)

### Root cause (waitlist welcome not arriving)
- `EMAIL_FROM_ADDRESS` defaulted to empty string → `isConfigured()` false → `EMAIL_NOT_CONFIGURED` → email silently skipped while waitlist insert still succeeded.

### Fix
- Default `EMAIL_FROM_ADDRESS` to Resend MVP sender `onboarding@resend.dev` (overridable via env)
- Defaults: `EMAIL_PROVIDER=resend`, `EMAIL_FROM_NAME=LaunchLens`
- `.env.example` ships with MVP From filled in
- Waitlist: skip welcome on duplicate signup; clearer warn log when API key missing

### Sender contract
- All LaunchLens app emails use `sendEmail` → `formatFromHeader` → `LaunchLens <onboarding@resend.dev>` unless env overrides
- Supabase Auth mail unchanged

### Verification
- `npm run build` — TypeScript clean
- Config unit checks for defaults
- Live Resend delivery requires `RESEND_API_KEY` on the host

---

## 2026-08-04 — Launch Readiness Sprint (Authentication UX)

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** Clear authentication entry for new visitors; protect product routes  
**Architecture:** Frozen (middleware route guards + presentation wiring only)

### Entry points
- Navbar: **Sign In** + **Start Free** → `/auth/signup`
- Protected product routes → login with `next`

---
