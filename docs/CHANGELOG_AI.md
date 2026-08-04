# LaunchLens — AI Changelog

Newest entries first.

---

## 2026-08-04 — Waitlist confirmation email + logo tagline

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** Waitlist email system + branding tagline

### Root cause
Waitlist API only inserted into Supabase — **no email path existed**.

### Actions
1. `src/lib/email/**` — provider interface, Resend adapter, retries, structured logs  
2. Premium HTML + text waitlist welcome template  
3. `POST /api/waitlist` sends email after insert; failures never block success; duplicate-safe  
4. Logo tagline **Know before you build.** under wordmark (navbar, app shell, auth)  
5. `.env.example` + DEPLOYMENT Resend guide  

### Application code
- Added: email domain layer  
- Modified: waitlist route, logo, navbar, app layout heights  

---

## 2026-08-04 — Deploy hardening (env + build)

Supabase env guards, `.env.example`, Node engines, tsconfig excludes.

---

## 2026-08-04 — Global payment abstraction

Payment domain layer (Razorpay IN live, Stripe ROW stub).

---

## 2026-08-04 — LaunchLens-branded authentication UI

Auth pages Logo + copy; forgot-password + verify-email.

---

## 2026-08-03 — Docs suite + repository index

Initial documentation under `docs/`.
