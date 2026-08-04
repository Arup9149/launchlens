-- LaunchLens P0 Security migration
-- Run in Supabase SQL editor (production). Review before applying.
-- Idempotent where practical (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS patterns).

-- ---------------------------------------------------------------------------
-- 1. Schema: bind identity to auth.users
-- ---------------------------------------------------------------------------

alter table public.validations
  add column if not exists user_id uuid references auth.users (id);

create index if not exists validations_user_id_idx
  on public.validations (user_id);

alter table public.founder_credits
  add column if not exists user_id uuid references auth.users (id);

-- Prefer unique user_id for new rows; keep email for display/migration
create unique index if not exists founder_credits_user_id_uidx
  on public.founder_credits (user_id)
  where user_id is not null;

-- ---------------------------------------------------------------------------
-- 2. payment_events — webhook / verify idempotency
-- ---------------------------------------------------------------------------

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id text not null,
  provider text not null default 'razorpay',
  order_id text,
  user_id uuid references auth.users (id),
  email text,
  product_id text,
  amount_credits integer not null default 0,
  status text not null default 'processed',
  raw jsonb,
  created_at timestamptz not null default now(),
  constraint payment_events_payment_id_unique unique (payment_id)
);

create index if not exists payment_events_user_id_idx
  on public.payment_events (user_id);

-- ---------------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.validations enable row level security;
alter table public.founder_credits enable row level security;
alter table public.payment_events enable row level security;
alter table public.waitlist enable row level security;

-- validations: owner only
drop policy if exists validations_select_own on public.validations;
create policy validations_select_own on public.validations
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists validations_insert_own on public.validations;
create policy validations_insert_own on public.validations
  for insert to authenticated
  with check (user_id = auth.uid());

-- founder_credits: owner only (grants use service role, which bypasses RLS)
drop policy if exists founder_credits_select_own on public.founder_credits;
create policy founder_credits_select_own on public.founder_credits
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists founder_credits_update_own on public.founder_credits;
create policy founder_credits_update_own on public.founder_credits
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- payment_events: no client access (service role only)
-- intentional: no policies for authenticated/anon → denied under RLS

-- waitlist: anon insert only; no select for clients
drop policy if exists waitlist_insert_anon on public.waitlist;
create policy waitlist_insert_anon on public.waitlist
  for insert to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- 4. Optional backfill (run only if you have matching emails in auth.users)
-- ---------------------------------------------------------------------------
-- update public.founder_credits fc
-- set user_id = u.id
-- from auth.users u
-- where fc.user_id is null and lower(fc.email) = lower(u.email);
