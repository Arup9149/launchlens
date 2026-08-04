# LaunchLens — Deployment

**Last reviewed:** 2026-08-04  
**App:** Next.js 16 App Router  
**Node:** >= 20

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
| `EMAIL_FROM_ADDRESS` | Yes for email | Verified sender at provider |
| `EMAIL_REPLY_TO` | No | Optional |
| `RESEND_API_KEY` | Yes for Resend | [resend.com/api-keys](https://resend.com/api-keys) |

**Behavior:** Waitlist **always** stores the email when Supabase succeeds. Confirmation email is best-effort: failures are logged and **never** return an error to the user.

Production sender (when domain is verified): set  
`EMAIL_FROM_NAME=LaunchLens` and `EMAIL_FROM_ADDRESS=team@launchlens.ai`  
(do not hardcode in source).

---

## 2. Resend setup

### Local development

1. Create account at [resend.com](https://resend.com).  
2. Create an API key → `RESEND_API_KEY`.  
3. For testing without a domain, Resend allows:
   ```bash
   EMAIL_PROVIDER=resend
   EMAIL_FROM_NAME=LaunchLens
   EMAIL_FROM_ADDRESS=onboarding@resend.dev
   RESEND_API_KEY=re_xxxxxxxx
   ```
   (Can only send **to** your own Resend account email until a domain is verified.)  
4. Copy `.env.example` → `.env.local` and fill values.  
5. `npm run dev` → submit waitlist form → check Resend dashboard **Emails** + inbox.

### Vercel deployment

1. Project → Settings → Environment Variables.  
2. Add at least:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `RESEND_API_KEY`  
   - `EMAIL_PROVIDER=resend`  
   - `EMAIL_FROM_NAME=LaunchLens`  
   - `EMAIL_FROM_ADDRESS=<verified sender>`  
3. Redeploy after saving env vars.

### Production sender migration (`team@launchlens.ai`)

1. In Resend: **Domains** → add `launchlens.ai` → add DNS records (SPF/DKIM).  
2. Wait until domain status is **Verified**.  
3. Set on Vercel (Production):
   ```bash
   EMAIL_FROM_NAME=LaunchLens
   EMAIL_FROM_ADDRESS=team@launchlens.ai
   ```
4. Redeploy. No code change required.

### Switching providers later

Implement `EmailProvider` in `src/lib/email/providers/`, register in `registry.ts`, set `EMAIL_PROVIDER=postmark|sendgrid` and the matching API key env. Waitlist route stays unchanged.

---

## 3. Local / build

```bash
cp .env.example .env.local
npm install
npm run build   # must succeed before deploy
npm run dev
```

---

## 4. Vercel notes

- Root directory = repo root (not nested `launchlens/`).  
- Node 20+.  
- Build: `npm run build`.  
- Middleware passes through if Supabase env is missing.

---

## 5. Smoke checklist

- [ ] `npm run build`  
- [ ] Landing + tagline under logo  
- [ ] Waitlist insert succeeds  
- [ ] Resend shows delivered welcome email  
- [ ] `GET /api/brain/health`  
