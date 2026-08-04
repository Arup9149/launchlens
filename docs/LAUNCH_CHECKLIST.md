# LaunchLens — Launch Checklist

**Purpose:** Pre-flight list for a public Early Access / Early Bird launch.  
**Scope:** Product readiness, messaging, email, payments, and host config.  
**Out of scope here:** Production DNS cutover steps (document only; do not block on DNS).

Last updated: 2026-08-04

---

## 1. Brand & founder experience

- [ ] Logo shows tagline **Know before you build.** on marketing, app shell, and auth
- [ ] Waitlist success state is premium (not a generic button label)
- [ ] Validate loading / error copy is founder-focused
- [ ] Auth UI has no provider names (Supabase hidden)

---

## 2. Environment (Vercel / host)

### Always required for data features

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` = production URL

### Brain (cloud)

- [ ] `OPENROUTER_API_KEY` (Vercel cannot reach local Ollama)
- [ ] `BRAIN_PROVIDER=auto` or `openrouter`

### India payments (if charging)

- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`
- [ ] Test mode order creates successfully

### Email (waitlist welcome)

- [ ] `EMAIL_PROVIDER=resend`
- [ ] `EMAIL_FROM_NAME=LaunchLens`
- [ ] `EMAIL_FROM_ADDRESS` set to a **currently verified** sender  
  - Local / pre-DNS: `onboarding@resend.dev` (or domain already verified in Resend)  
  - Post-DNS (later): `team@launchlens.ai` — **env-only change, no code change**
- [ ] `RESEND_API_KEY`
- [ ] Optional: `EMAIL_REPLY_TO`

**Note:** Do **not** hardcode `team@launchlens.ai` in the repo. DNS verification is a separate ops step; the app is ready to use that address via env when DNS is done.

---

## 3. Functional smoke (production URL)

- [ ] `/` loads; Early Access form works
- [ ] Waitlist insert appears in Supabase `waitlist`
- [ ] Welcome email appears in Resend dashboard (Delivered)
- [ ] `GET /api/brain/health` reports expected engine
- [ ] `/auth/signup` + `/auth/login` work
- [ ] `/validate` with credits or skip-payment path produces a report
- [ ] `/workshop` pages load

---

## 4. Payments honesty

- [ ] India: Razorpay checkout opens with catalog amount
- [ ] International: quote shows local currency; Stripe charge path still stub (503) until P0-5
- [ ] Do not advertise “global card checkout live” until Stripe adapter ships

---

## 5. Security (pre-scale)

- [ ] RLS planned / applied for `validations` and `founder_credits` (see DATABASE.md)
- [ ] Known gap: client-side credit grant after Razorpay — webhook is P0-1
- [ ] `NEXT_PUBLIC_SKIP_PAYMENT` is **false** in production

---

## 6. Build & deploy

- [ ] `npm run build` green on CI / local
- [ ] Vercel project root = repo root (not nested `launchlens/`)
- [ ] Node 20+
- [ ] Redeploy after any env change to `NEXT_PUBLIC_*`

---

## 7. Post-DNS (ops only — not required for this sprint)

When `launchlens.ai` is verified in Resend:

1. Set `EMAIL_FROM_ADDRESS=team@launchlens.ai`
2. Set `EMAIL_FROM_NAME=LaunchLens`
3. Redeploy
4. Send one test waitlist signup to a real inbox

No application code change required.
