# LaunchLens — Database

**Provider:** Supabase (Postgres)  
**Last reviewed:** 2026-08-05 (P0 Production Email)

Apply migrations in order in the Supabase SQL editor for production:

1. **`docs/migrations/001_p0_security.sql`**
2. **`docs/migrations/002_email_events.sql`**

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

### email_events
`id`, `email`, `type`, `status`, `provider`, `provider_message_id`, `error`, `created_at`, `sent_at`  
RLS: enabled, **no client policies** (service role only).  
Types: `waitlist_welcome` | `notify_me` | `signup_verification` | `password_reset` | `purchase_receipt` | `other`.  
Statuses: `pending` | `sent` | `failed` | `skipped`.

## Clients

| File | Role |
|------|------|
| `src/lib/supabase/server.ts` | Session (cookie) |
| `src/lib/supabase/admin.ts` | Service role — webhooks/verify/email_events |
