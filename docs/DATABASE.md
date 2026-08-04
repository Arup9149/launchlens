# LaunchLens — Database

**Provider:** Supabase (Postgres)  
**Last reviewed:** 2026-08-04 (P0 Security)

Apply **`docs/migrations/001_p0_security.sql`** in the Supabase SQL editor for production.

## Identity

- Credits and validations use **`auth.uid()`** (`user_id` column).
- Credit **grants** only via service role (webhook / verify), never client `action=grant`.
- Idempotency table: `payment_events` with unique `payment_id`.

## Tables

### validations
`id`, `idea`, `score`, `verdict`, `confidence`, `analysis`, **`user_id`**, `created_at`  
RLS: select/insert where `user_id = auth.uid()`.

### founder_credits
`email`, **`user_id`**, `credits`, `plan`, `updated_at`  
RLS: select/update own; inserts via service role.

### payment_events
`payment_id` (unique), `provider`, `order_id`, `user_id`, `email`, `product_id`, `amount_credits`, `status`, `raw`, `created_at`  
RLS: no client policies.

### waitlist
Insert allowed for anon; no client select.

## Clients

| File | Role |
|------|------|
| `src/lib/supabase/server.ts` | Session (cookie) |
| `src/lib/supabase/admin.ts` | Service role — webhooks/verify |
