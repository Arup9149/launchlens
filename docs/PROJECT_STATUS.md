# LaunchLens — Project Status

**Last status update:** 2026-08-04 (Launch Readiness — MVP Email Branding)  
**Branch:** `main`  
**Status:** Transactional email sender standardized for MVP (Resend onboarding@resend.dev); ops still required for P0 SQL/secrets before open monetization

### This sprint (MVP Email Branding)

- Defaults: `EMAIL_PROVIDER=resend`, `EMAIL_FROM_NAME=LaunchLens`, `EMAIL_FROM_ADDRESS=onboarding@resend.dev`
- Environment overrides still respected
- Waitlist welcome: send only on new insert; skip on duplicate; clearer skip logs when `RESEND_API_KEY` missing
- All app emails go through `sendEmail` → `formatFromHeader` (no hardcoded From)
- Supabase Auth emails unchanged

### Still open (ops / P0 leftovers)

- Apply `docs/migrations/001_p0_security.sql` in Supabase
- Live webhook + service role on Vercel
- Set `RESEND_API_KEY` (+ optional From overrides) on Vercel for waitlist mail
- Point Razorpay webhook URL to production

See `docs/LAUNCH_CHECKLIST.md` and `docs/NEXT_TASKS.md`.
