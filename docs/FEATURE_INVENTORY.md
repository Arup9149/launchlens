# LaunchLens — Feature Inventory

**Last updated:** 2026-08-04 (Launch Readiness — MVP Email Branding)

### Platform

| Feature | Status |
|---------|--------|
| SEO metadata / OG / Twitter | **Done** |
| robots.txt / sitemap.xml | **Done** |
| Custom 404 | **Done** |
| Skip link + focus-visible | **Done** |
| Sign-out → `/auth/login` | **Done** |
| Navbar Sign In + Start Free | **Done** |
| Protected product routes (middleware) | **Done** |
| Login `next` redirect | **Done** |
| Profile page | **Missing** |

### Early Founder experience

| Feature | Status |
|---------|--------|
| First-login onboarding modal | **Done** |
| Founder Validations copy (UI) | **Done** |
| Landing free CTAs (no pre-value ₹799) | **Done** |
| Upgrade panel (allocation exhausted) | **Done** |
| Validation complete message | **Done** |
| Personalized Founder Playbook (print/PDF) | **Done** (`src/lib/founder-print.ts`) |
| Personalized 20-Day Builder Program | **Done** (`src/lib/founder-print.ts`) |
| Playbook access on result + dashboard | **Done** |

### Security / billing

| Feature | Status |
|---------|--------|
| Razorpay webhook + verify | **Done** (env + SQL required) |
| Client credit grant | **Removed** (403) |
| Credits / validations by `auth.uid()` | **Done** |
| RLS SQL | **Shipped** — apply in Supabase |
| Stripe live checkout | **Stub** |
| Transactional From (MVP Resend) | **Done** (`onboarding@resend.dev`) |
| Waitlist welcome email | **Done** (requires RESEND_API_KEY on host) |
