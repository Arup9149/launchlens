# LaunchLens — Deployment

**Last reviewed:** 2026-08-03  
**App:** Next.js 16 App Router (`launchlens`)

---

## 1. Prerequisites

- Node.js **20+**
- npm (lockfile: `package-lock.json`)
- Supabase project (URL + anon key; service role only if adding webhooks later)
- Razorpay account (INR Early Bird)
- Optional: [OpenRouter](https://openrouter.ai) API key and/or local [Ollama](https://ollama.com) with `qwen2.5:7b`

---

## 2. Environment variables

Create `.env.local` (never commit):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Brain
BRAIN_PROVIDER=auto
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-chat

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Dev only — skips payment gate on validate
NEXT_PUBLIC_SKIP_PAYMENT=false
```

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_*` | Yes for data features | Browser + server |
| `OPENROUTER_API_KEY` | Recommended for cloud | Required if no Ollama |
| `BRAIN_PROVIDER` | No | `auto` \| `openrouter` \| `ollama` |
| `OPENROUTER_MODEL` | No | Default `deepseek/deepseek-chat` |
| Razorpay pair | Yes for real checkout | Order amount fixed ₹799 |
| `NEXT_PUBLIC_SKIP_PAYMENT` | No | `"true"` for local Brain testing without pay |

---

## 3. Local development

```bash
npm install
# Ensure Supabase tables exist (see docs/DATABASE.md)
# Optional: ollama serve && ollama pull qwen2.5:7b
npm run dev
```

Open `http://localhost:3000`.

**Scripts:**

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

---

## 4. Brain modes

| Mode | Setup |
|------|--------|
| Cloud only | Set `OPENROUTER_API_KEY`; `BRAIN_PROVIDER=openrouter` or `auto` |
| Local only | Ollama on `127.0.0.1:11434` with `qwen2.5:7b`; `BRAIN_PROVIDER=ollama` |
| Auto | Prefers OpenRouter if key present; falls back to Ollama on analyze/polish |

**Note:** `/api/architecture` and `/api/related` currently call **Ollama only**—cloud-only deploys need P1-1 before those tools work without a local model.

---

## 5. Production host (typical: Vercel)

1. Connect GitHub repo `Arup9149/launchlens`.  
2. Set env vars in the host dashboard (same as `.env.local`, with production `NEXT_PUBLIC_APP_URL`).  
3. Build command: `npm run build`.  
4. Output: Next default.  
5. Ensure Ollama is **not** assumed on the serverless host—use OpenRouter in production unless a separate Brain worker exists.

---

## 6. Supabase

1. Create tables per `docs/DATABASE.md`.  
2. Enable Email auth if using `/auth/signup` + `/auth/login`.  
3. Configure site URL + redirect URLs for the deployment domain.  
4. Turn on RLS before public traffic.

---

## 7. Razorpay

1. Use test keys in development.  
2. Checkout loads `https://checkout.razorpay.com/v1/checkout.js` on the client.  
3. **Production requirement:** implement webhook verification (P0-1); do not rely solely on client `handler` for credit grants.

---

## 8. Hygiene before deploy

- Do not deploy committed `launchlens/.next` artifacts as source of truth—build on CI/host.  
- Confirm `.gitignore` excludes `.next`, `.env*`, `node_modules`.  
- Remove or ignore `src1.zip` and dead `src/api/**` when executing P2 tasks.

---

## 9. Smoke checklist

- [ ] `/` loads landing  
- [ ] `GET /api/brain/health` returns expected engine  
- [ ] Waitlist POST inserts row  
- [ ] Validate with `NEXT_PUBLIC_SKIP_PAYMENT=true` produces report  
- [ ] Dashboard lists validations  
- [ ] Workshop polish/architecture respond (provider permitting)  
- [ ] Razorpay order creates in test mode (if keys set)
