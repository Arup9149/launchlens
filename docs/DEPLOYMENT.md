# LaunchLens — Deployment

**Last reviewed:** 2026-08-04  
**App:** Next.js 16 App Router (`launchlens`)  
**Node:** >= 20 (`package.json` engines)

---

## 1. Prerequisites

- Node.js **20+**
- npm (lockfile: `package-lock.json`)
- Supabase project (URL + anon key)
- Razorpay account for INR Early Bird (India)
- Optional: OpenRouter API key (required on Vercel for Brain without Ollama)
- Optional later: Stripe keys for international checkout

---

## 2. Environment variables

Template file: **`.env.example`** (copy to `.env.local` locally; set the same keys in Vercel).

| Variable | Required for | Notes |
|----------|--------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Auth, waitlist, validations, credits | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same | Public anon key |
| `NEXT_PUBLIC_APP_URL` | Redirects / absolute links | e.g. `https://your-app.vercel.app` |
| `BRAIN_PROVIDER` | Brain routing | `auto` \| `openrouter` \| `ollama` |
| `OPENROUTER_API_KEY` | Cloud Brain on Vercel | Strongly recommended in production |
| `OPENROUTER_MODEL` | Optional | Default `deepseek/deepseek-chat` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | India checkout | Public |
| `RAZORPAY_KEY_SECRET` | India order create | **Secret** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Future international | Reserved |
| `STRIPE_SECRET_KEY` | Future international | Reserved **secret** |
| `NEXT_PUBLIC_SKIP_PAYMENT` | Local only | `"true"` skips pay gate |

**Build note:** `npm run build` succeeds **without** secrets. Middleware no longer crashes when Supabase env is absent (request pass-through). Runtime data features require Supabase vars in the host.

**Production minimum (working MVP on Vercel):**

1. `NEXT_PUBLIC_SUPABASE_URL`  
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
3. `NEXT_PUBLIC_APP_URL`  
4. `OPENROUTER_API_KEY` (unless a separate Brain worker exists)  
5. `NEXT_PUBLIC_RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` if charging in India  

---

## 3. Local development

```bash
cp .env.example .env.local
# fill values
npm install
npm run dev
```

```bash
npm run build   # must succeed before merge / deploy
npm run start
```

---

## 4. Vercel

1. Import `Arup9149/launchlens` (root of repo — not nested `launchlens/`).  
2. Framework: Next.js (auto).  
3. Build command: `npm run build`.  
4. Set env vars from the table above (Production + Preview as needed).  
5. Deploy.  

Do **not** rely on committed `launchlens/.next` artifacts; Vercel builds from source.

---

## 5. Brain modes on Vercel

| Mode | Setup |
|------|--------|
| Cloud | `OPENROUTER_API_KEY` + `BRAIN_PROVIDER=auto` or `openrouter` |
| Local Ollama | Not available on Vercel serverless — use OpenRouter |

`/api/architecture` and `/api/related` are still Ollama-only in code (P1) — prefer OpenRouter-capable routes or complete provider parity before relying on those tools in production.

---

## 6. Smoke checklist

- [ ] `npm run build` green locally  
- [ ] `/` loads  
- [ ] `GET /api/brain/health` shows expected engine  
- [ ] Auth signup/login with Supabase  
- [ ] Waitlist / validate with keys set  
- [ ] Razorpay order in test mode (India keys)  

---

## 7. Common deploy blockers

| Symptom | Cause | Fix |
|---------|--------|-----|
| Auth/middleware errors | Missing Supabase public env | Set `NEXT_PUBLIC_SUPABASE_*` |
| Order 500 / not configured | Missing Razorpay secrets | Set Razorpay pair |
| International order 503 | Stripe stub | Expected until Stripe adapter ships |
| Brain offline on Vercel | No OpenRouter key | Set `OPENROUTER_API_KEY` |
