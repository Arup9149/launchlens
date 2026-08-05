-- LaunchLens P0 Production Email — email_events audit log
-- Run in Supabase SQL editor after 001_p0_security.sql.
-- Idempotent.

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  type text not null,
  status text not null,
  provider text,
  provider_message_id text,
  error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists email_events_created_at_idx
  on public.email_events (created_at desc);

create index if not exists email_events_email_idx
  on public.email_events (email);

create index if not exists email_events_type_status_idx
  on public.email_events (type, status);

-- Service role only — no client policies
alter table public.email_events enable row level security;

comment on table public.email_events is
  'Transactional email audit: waitlist, notify_me, auth-related app sends, receipts';
comment on column public.email_events.type is
  'waitlist_welcome | notify_me | signup_verification | password_reset | purchase_receipt | other';
comment on column public.email_events.status is
  'pending | sent | failed | skipped';
