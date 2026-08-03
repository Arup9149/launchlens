# LaunchLens — Database

**Provider:** Supabase (Postgres)  
**Access from app:** `@supabase/supabase-js` / `@supabase/ssr`  
**Last reviewed:** 2026-08-03  

No migration files exist in the repository. Schema below is **inferred from application inserts/selects**. Apply equivalent SQL in the Supabase project and enable RLS for production.

---

## 1. Tables

### `waitlist`

| Column | Type (inferred) | Notes |
|--------|-----------------|--------|
| `email` | text | Inserted from waitlist form |
| (others) | — | May include `id`, `created_at` if defined in project |

**Used by:** `POST /api/waitlist`

---

### `validations`

| Column | Type (inferred) | Notes |
|--------|-----------------|--------|
| `id` | uuid | Returned after insert; used in result URLs |
| `idea` | text | Required |
| `score` | number \| null | 0–100 |
| `verdict` | text \| null | `Go` \| `Pivot` \| `Kill` |
| `confidence` | number \| null | |
| `analysis` | jsonb \| null | Full normalized analysis object |
| `created_at` | timestamptz | Order by desc on list |

**Used by:**  
- `POST /api/validations`  
- `GET /api/validations/list` (limit 20)  
- `GET /api/validations/[id]`  

**Gap:** No `user_id` column in code paths—rows are global to the anon key’s visibility.

---

### `founder_credits`

| Column | Type (inferred) | Notes |
|--------|-----------------|--------|
| `email` | text | Primary lookup key (lowercased in API) |
| `credits` | integer | Remaining validation credits |
| `plan` | text \| null | e.g. `early_bird` |
| `updated_at` | timestamptz | Set on update |

**Used by:** `GET/POST /api/credits`

**Gap:** Not tied to `auth.users.id`.

---

## 2. Suggested production SQL (reference)

> Run in Supabase SQL editor after review. Adjust types/constraints to match existing project if tables already exist.

```sql
-- waitlist
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists waitlist_email_idx on public.waitlist (lower(email));

-- validations
create table if not exists public.validations (
  id uuid primary key default gen_random_uuid(),
  idea text not null,
  score numeric,
  verdict text,
  confidence numeric,
  analysis jsonb,
  user_id uuid references auth.users (id),
  created_at timestamptz not null default now()
);
create index if not exists validations_created_at_idx on public.validations (created_at desc);

-- founder_credits
create table if not exists public.founder_credits (
  email text primary key,
  credits integer not null default 0,
  plan text,
  user_id uuid references auth.users (id),
  updated_at timestamptz not null default now()
);
```

---

## 3. RLS guidance (target state)

Until RLS is enforced, anon key routes can read/write broadly—**unacceptable for production**.

Target policies (conceptual):

- `validations`: select/insert where `user_id = auth.uid()` (after code binds user).  
- `founder_credits`: select/update where `user_id = auth.uid()` or email matches verified user email.  
- `waitlist`: insert for anon; select restricted to service role / admin.

Service role key: **server-only** (webhooks, admin)—never `NEXT_PUBLIC_`.

---

## 4. Client factories

| File | Role |
|------|------|
| `src/lib/supabase/client.ts` | Browser client (`createBrowserClient`) |
| `src/lib/supabase/server.ts` | Server Components / route handlers with cookies |
| `src/lib/supabase/middleware.ts` | Session refresh in middleware |

Several API routes currently instantiate `createClient(url, anonKey)` **without** user context—prefer the cookie-bound server client once authz is implemented.

---

## 5. Change process

1. Update this document with column changes.  
2. Apply SQL in Supabase.  
3. Update TypeScript call sites.  
4. Note in `CHANGELOG_AI.md` / release notes.
