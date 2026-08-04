# LaunchLens — Launch Checklist

**Last updated:** 2026-08-04 (Sprint 2)

---

## 1. Brand & founder experience

- [x] Logo tagline **Know before you build.** (hidden &lt;360px to avoid clip)
- [x] Waitlist premium success / duplicate states
- [x] Validate founder-focused loading copy
- [x] Auth UI without provider names

---

## 2. Responsive & a11y (Sprint C/E)

- [x] Safe-area / overflow-x / touch targets on primary navs
- [x] Skip link + focus-visible
- [x] Custom 404
- [ ] Manual device matrix sign-off (desktop / tablet / mobile / landscape) on production URL
- [ ] Screen-reader pass on waitlist + validate (human)

---

## 3. SEO (Sprint E)

- [x] Title / description / OG / Twitter metadata
- [x] `robots.ts` + `sitemap.ts`
- [x] Favicon present (`src/app/favicon.ico`)
- [ ] Confirm `NEXT_PUBLIC_APP_URL` matches production domain (canonical)

---

## 4. Environment

- [ ] `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `OPENROUTER_API_KEY` (prod Brain)
- [ ] Razorpay pair if charging IN
- [ ] `RESEND_API_KEY` + `EMAIL_FROM_*`
- [ ] `NEXT_PUBLIC_SKIP_PAYMENT=false` in production

---

## 5. Functional smoke

- [ ] Landing → waitlist → email (Resend)
- [ ] Signup → login → dashboard
- [ ] Validate (credit or pay path)
- [ ] Workshop polish
- [ ] Logout → login again
- [ ] Payment failure / dismiss path
- [ ] Slow network (throttle) — pages remain usable

---

## 6. Known blockers before public launch

| Item | Severity | Notes |
|------|----------|--------|
| Razorpay webhook / server credit grant | **P0** | Client-only grant is spoofable |
| Auth-scoped validations & credits + RLS | **P0** | Email-keyed identity |
| Stripe international checkout | **P1** | Stub only; do not market as live |
| `/api/razorpay/guide` missing | **P1** | Architecture UI may reference it |
| Profile / account settings | **N/A** | Not shipped — out of scope |
| Architecture/related Ollama-only | **P1** | Cloud-only deploys limited |

---

## 7. Post-DNS (ops)

Set `EMAIL_FROM_ADDRESS=team@launchlens.ai` after Resend domain verify — no code change.
