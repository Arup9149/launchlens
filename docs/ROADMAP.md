# LaunchLens — Roadmap

**Last updated:** 2026-08-03  
**Product north star:** One founder workspace — Validate → Polish → Expand → Architect — with trustworthy payments and private/cloud Brain options.

Detailed engineering backlog: `docs/NEXT_TASKS.md`.  
Status snapshot: `docs/PROJECT_STATUS.md`.

---

## Horizon A — Stabilize production MVP (now)

**Goal:** Safe to charge real customers without obvious integrity holes.

- Server-verified Razorpay fulfillment (webhook) + credit grant  
- Auth-scoped validations & credits (RLS + `user_id`)  
- Fix or remove broken `/api/razorpay/guide` CTA  
- Rate limits on LLM routes  
- Repo hygiene (no committed `.next` / zip; dead `src/api` removed)  
- Real README + `.env.example`  
- Brain provider parity for architecture + related (OpenRouter path)

**Exit criteria:** Paid Early Bird path works end-to-end with server-side entitlement; other users cannot read or burn credits.

---

## Horizon B — Coherent product identity (next)

**Goal:** One identity model; guides and plans match marketing.

- Bind credits to `auth.users`; optional require login for `(app)`  
- Server-side guide entitlement  
- Fix sign-out redirect; polish auth UX  
- Extract shared `runBrain` module  
- Document schema with migrations in-repo  
- Multi-currency or honest INR-only pricing UI  

**Exit criteria:** Logged-in founder sees only their data; marketing claims match checkout reality.

---

## Horizon C — Plans & quality (later)

**Goal:** Expand monetization and confidence.

- Builder Pass / Pro Launch live checkout and credit packs  
- Stripe (or Razorpay international) for US/EU  
- Minimal automated tests + CI (lint, typecheck, critical API tests)  
- Persist polish/architecture outputs to DB  
- Optional streaming Brain responses  
- Accessibility pass on core flows  

**Exit criteria:** CI green on `main`; more than one paid SKU live.

---

## Horizon D — Platform (future, uncommitted)

- Team workspaces / shared validations  
- Prompt versioning and eval harness for Brain quality  
- Native mobile — **out of scope** until web MVP is stable  
- Marketplace of guides — only after entitlement system is solid  

Architecture changes in this horizon require explicit approval (see `ENGINEERING_RULES.md`).

---

## Non-goals (current)

- Rewriting the App Router structure without cause  
- Replacing Supabase without a migration plan  
- Building a second parallel credit system  
- Committing large model weights or `.next` build trees  

---

## How roadmap items move

1. Enter as rows in `NEXT_TASKS.md` with priority.  
2. Implement one production-quality item per cycle.  
3. Update `FEATURE_INVENTORY`, `PROJECT_STATUS`, `CHANGELOG_AI`.  
4. Promote themes here when a horizon’s exit criteria are met.
