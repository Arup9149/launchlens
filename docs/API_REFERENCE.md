# LaunchLens — API Reference

**Source of truth:** `src/app/api/**` on `main`  
**Last reviewed:** 2026-08-03  
**Note:** Handlers under `src/api/**` are **not** live App Router endpoints—ignore them.

All routes return JSON unless noted. Base URL is the deployed origin (local: `http://localhost:3000`).

---

## Health & Brain

### `GET /api/brain/health`

Checks OpenRouter configuration and/or local Ollama availability.

**Response (200):**
```json
{
  "ok": true,
  "engine": "openrouter" | "ollama" | "none",
  "message": "string",
  "hasQwen": true
}
```
(`hasQwen` optional when Ollama probed.)

---

## Analysis & Workshop Brain

### `POST /api/analyze`

Full idea validation (Go / Pivot / Kill).

**Body:**
```json
{ "idea": "string (min ~10 chars)" }
```

**Success (200):**
```json
{
  "analysis": {
    "score": 0,
    "verdict": "Go" | "Pivot" | "Kill",
    "confidence": 0,
    "verdictNote": "string",
    "demand": "string",
    "competition": "string",
    "risks": "string",
    "nextSteps": "string",
    "builderTips": ["string"],
    "breakdown": {
      "marketDemand": 0,
      "competitionGap": 0,
      "feasibility": 0,
      "timing": 0,
      "monetization": 0
    }
  },
  "engine": "openrouter" | "ollama" | "ollama-fallback"
}
```

**Errors:** `400` idea too short; `504` timeout; `500` Brain offline / parse failure.

**Providers:** `BRAIN_PROVIDER` = `auto` | `openrouter` | `ollama` (see env in `DEPLOYMENT.md`).

---

### `POST /api/polish`

Polishes problem / ICP / wedge / pricing and returns scores.

**Body:**
```json
{
  "original": "string (required)",
  "problem": "string",
  "icp": "string",
  "wedge": "string",
  "pricing": "string"
}
```

**Success (200):** polished fields, `summary`, `score`, `confidence`, `tips[]`, `breakdown`, `engine`.

**Providers:** Same dual provider as analyze.

---

### `POST /api/architecture`

MVP architecture blueprint.

**Body:** `{ "idea": "string" }`

**Success (200):**
```json
{
  "potentialScore": 0,
  "flowSteps": [{ "title": "", "desc": "" }],
  "modules": [{ "name": "", "detail": "", "tip": "" }],
  "techStack": [{ "name": "", "type": "", "why": "", "url": "" }],
  "buildOrder": ["string"],
  "risks": ["string"],
  "metrics": ["string"],
  "thirtyDayPlan": [{ "week": "", "focus": "" }]
}
```

**Provider today:** **Ollama only** (`qwen2.5:7b`). Missing OpenRouter parity is tracked as P1-1.

---

### `POST /api/related`

Adjacent / expanded ideas.

**Body:** `{ "idea": "string" }`

**Success (200):**
```json
{
  "ideas": [
    {
      "title": "",
      "description": "",
      "angle": "",
      "scope": "",
      "upside": ""
    }
  ]
}
```

**Provider today:** **Ollama only**.

---

## Credits

### `GET /api/credits?email=`

**Query:** `email` (required)

**Success (200):**
```json
{ "email": "", "credits": 0, "plan": "early_bird" | null }
```

### `POST /api/credits`

**Body:**
```json
{
  "email": "string",
  "action": "grant" | "use",
  "amount": 2,
  "plan": "early_bird"
}
```

- `grant`: add credits (default amount 2 if omitted/invalid).  
- `use`: decrement by 1; `402` if none remaining.

**Auth note:** Currently email-keyed with anon Supabase client—not session-bound (P0-2 / P1-5).

---

## Validations

### `POST /api/validations`

**Body:**
```json
{
  "idea": "string",
  "score": 0,
  "verdict": "string",
  "confidence": 0,
  "analysis": {}
}
```

**Success:** `{ "success": true, "id": "uuid" }`

### `GET /api/validations/list`

**Success:** `{ "data": [ /* up to 20 rows, newest first */ ] }`

### `GET /api/validations/[id]`

**Success:** `{ "data": { /* row including analysis */ } }`

---

## Waitlist

### `POST /api/waitlist`

**Body:** `{ "email": "string" }`

**Success:** `{ "success": true }`  
**Errors:** `400` invalid email; `500` Supabase error.

---

## Payments (Razorpay)

### `POST /api/razorpay/order`

Creates Early Bird order (amount **79900** paise = ₹799, currency **INR**).

**Body (optional notes):** `{ "idea", "score", "verdict", "confidence" }`

**Success:**
```json
{
  "orderId": "string",
  "amount": 79900,
  "currency": "INR",
  "key": "NEXT_PUBLIC_RAZORPAY_KEY_ID"
}
```

### `POST /api/razorpay/guide`

**Status:** **Not implemented** — Architecture UI still references this path (P0-3).

**Webhook:** Not implemented (P0-1). Client-side checkout `handler` currently grants credits.

---

## Auth-related routes

### `POST /auth/signout`

Server route: Supabase signOut then `redirect("/login")` — **bug:** login page is `/auth/login` (P1-3).

Login/signup are **pages**, not JSON APIs (`/auth/login`, `/auth/signup`).

---

## Conventions for new endpoints

1. Add under `src/app/api/`.  
2. Document here in the same PR/commit cycle.  
3. Return `{ error }` on failure.  
4. Do not trust the client for entitlement grants.
