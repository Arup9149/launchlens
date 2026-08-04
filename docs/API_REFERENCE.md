# LaunchLens — API Reference

**Source of truth:** `src/app/api/**` on `main`  
**Last reviewed:** 2026-08-04  
**Note:** Handlers under `src/api/**` are **not** live App Router endpoints—ignore them.

---

## Payments (global)

### `GET /api/payments/quote`

Returns localized price and which provider would handle checkout.

**Query**

| Param | Default | Description |
|-------|---------|-------------|
| `product` | `early_bird` | `early_bird` \| `builder_pass` \| `pro_launch` \| `architecture_guide` |
| `country` | inferred | ISO country (e.g. `IN`, `US`, `DE`) |
| `currency` | from country | Force `INR` \| `USD` \| `EUR` \| `GBP` |

Country also inferred from `x-vercel-ip-country` / `cf-ipcountry` / `Accept-Language`.

**Response (200)**
```json
{
  "productId": "early_bird",
  "country": "IN",
  "currency": "INR",
  "amountMinor": 79900,
  "display": "₹799",
  "listDisplay": "₹5,999",
  "provider": "razorpay",
  "providerReady": true,
  "message": null
}
```

For non-IN without Stripe configured, `provider` is `"stripe"`, `providerReady` is `false`, and `message` explains international checkout is upcoming.

---

### `POST /api/payments/order`

Creates a checkout order via the payment abstraction (`src/lib/payments`).

**Body**
```json
{
  "productId": "early_bird",
  "email": "founder@email.com",
  "country": "IN",
  "currency": "INR",
  "idea": "optional",
  "score": 0,
  "verdict": "",
  "confidence": 0
}
```

**Success (200)**
```json
{
  "provider": "razorpay",
  "orderId": "order_…",
  "amount": 79900,
  "currency": "INR",
  "productLabel": "Early Bird · 2 validations",
  "client": { "key": "rzp_…" },
  "key": "rzp_…"
}
```

**Errors**

| Status | Code | When |
|--------|------|------|
| 400 | — | Unknown product |
| 503 | `PROVIDER_NOT_CONFIGURED` | Stripe path, keys missing |
| 503 | `PROVIDER_NOT_IMPLEMENTED` | Stripe path, adapter stub |
| 500 | — | Provider/SDK failure |

**Routing policy:** `IN` → Razorpay; else → Stripe (stub until implemented).

---

### `POST /api/razorpay/order` (legacy)

Forces Early Bird + INR + Razorpay via the same domain layer. Prefer `/api/payments/order` for new clients.

**Body (optional notes):** `{ idea, score, verdict, confidence, email }`  
**Success:** `{ orderId, amount, currency, key, provider }`

### `POST /api/razorpay/guide`

**Status:** Not implemented (Architecture UI still references — P0-3).

---

## Health & Brain

### `GET /api/brain/health`

```json
{ "ok": true, "engine": "openrouter" | "ollama" | "none", "message": "string" }
```

### `POST /api/analyze`

**Body:** `{ "idea": "string" }` → `{ analysis, engine }`

### `POST /api/polish`

**Body:** `{ original, problem, icp, wedge, pricing }` → polished fields + scores + `engine`

### `POST /api/architecture` / `POST /api/related`

Ollama-only today. Body: `{ "idea": "string" }`.

---

## Credits

### `GET /api/credits?email=`

`{ email, credits, plan }`

### `POST /api/credits`

`{ email, action: "grant" | "use", amount?, plan? }`

---

## Validations & waitlist

- `POST /api/validations` — persist analysis  
- `GET /api/validations/list` — recent rows  
- `GET /api/validations/[id]` — one row  
- `POST /api/waitlist` — `{ email }`

---

## Conventions for new payment endpoints

1. Prefer `/api/payments/*` namespace.  
2. Never accept client-supplied **amount** — use catalog.  
3. Return `{ error, code? }` on failure.  
4. Webhooks (future) verify signatures server-side before granting credits.
