# LaunchLens — Feature Inventory

**Last updated:** 2026-08-04 (P0 Security)

### Platform

| Feature | Status |
|---------|--------|
| SEO metadata / OG / Twitter | **Done** |
| robots.txt / sitemap.xml | **Done** |
| Custom 404 | **Done** |
| Skip link + focus-visible | **Done** |
| Sign-out → `/auth/login` | **Done** |
| Profile page | **Missing** |

### Security / billing

| Feature | Status |
|---------|--------|
| Razorpay order create (auth-bound notes) | **Done** |
| Razorpay payment verify (signature) | **Done** |
| Razorpay webhook + idempotent grant | **Done** (env + SQL required) |
| Client credit grant | **Removed** (403) |
| Credits by `auth.uid()` | **Done** |
| Validations by `auth.uid()` | **Done** |
| RLS policies | **SQL shipped** — apply in Supabase |
| Stripe live checkout | **Stub** |
