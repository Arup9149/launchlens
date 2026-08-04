# LaunchLens — Deployment

**Last reviewed:** 2026-08-04  
**App:** Next.js 16 App Router  
**Node:** >= 20

See also: **`docs/LAUNCH_CHECKLIST.md`** for pre-launch smoke steps.

---

## 1. Environment variables

See **`.env.example`** for the full template.

### Core

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (data) | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (data) | Public |
| `NEXT_PUBLIC_APP_URL` | Recommended | Production URL |
| `OPENROUTER_API_KEY` | Prod Brain | No Ollama on Vercel |
| `BRAIN_PROVIDER` | No | `auto` / `openrouter` / `ollama` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | India pay | Public |
| `RAZORPAY_KEY_SECRET` | India pay | Secret |
| `NEXT_PUBLIC_STRIPE_*` / `STRIPE_*` | Later | Reserved |

### Transactional email (waitlist confirmation)

| Variable | Required | Notes |
|----------|----------|--------|
| `EMAIL_PROVIDER` | No | Default `resend` |
| `EMAIL_FROM_NAME` | No | Default `LaunchLens` |
| `EMAIL_FROM_ADDRESS` | No (MVP default) | Default `onboarding@resend.dev`; override after domain verify |
| `EMAIL_REPLY_TO` | No | Optional |
| `RESEND_API_KEY` | Yes for Resend | [resend.com/api-keys](https://resend.com/api-keys) |

**Behavior:** Waitlist **always** stores the email when Supabase succeeds. Confirmation email is best-effort: failures are logged and **never** return an error to the user.

**Sender identity:** 100% from env. MVP default From: `LaunchLens <onboarding@resend.dev>`. Production target after DNS verify:
`EMAIL_FROM_NAME=LaunchLens` + `EMAIL_FROM_ADDRESS=team@launchlens.ai`  
(no code change; DNS is an ops step outside this sprint).

---

## 2. Resend setup

### Local development

1. Create account at [resend.com](https://resend.com).  
2. Create an API key → `RESEND_API_KEY`.  
3. For testing without a domain:
   ```bash
   EMAIL_PROVIDER=resend
   EMAIL_FROM_NAME=LaunchLens
   EMAIL_FROM_ADDRESS=onboarding@resend.dev
   RESEND_API_KEY=re_xxxxxxxx
   ```
4. Copy `.env.example` → `.env.local` and fill values.  
5. `npm run dev` → submit waitlist form → check Resend **Emails** + inbox.

### Vercel

Set the same email vars → redeploy after changes to `NEXT_PUBLIC_*`.

### Production sender (`team@launchlens.ai`) — ops later

1. Verify `launchlens.ai` in Resend (SPF/DKIM).  
2. Set `EMAIL_FROM_ADDRESS=team@launchlens.ai` on Vercel.  
3. Redeploy. No application code change.

---

## 3. Build

```bash
cp .env.example .env.local
npm install
npm run build
npm run dev
```

---

## 4. Vercel notes

- Root directory: repository root (not a nested app folder).
- Framework preset: Next.js.
- Set `RESEND_API_KEY` for waitlist welcome delivery.
