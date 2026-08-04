# LaunchLens — AI Changelog

Newest entries first.

---

## 2026-08-04 — Early Founder Experience (FINAL)

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** Premium Early Founder onboarding, Founder Validations language, upgrade panel, completion message, playbook PDFs  
**Architecture:** Frozen (presentation + assets only)

### Part 1 — Onboarding
- First-login modal: 🎉 Welcome to LaunchLens, Early Founder Cohort benefits, primary CTA “Start My First Validation”, secondary “Maybe Later”
- Gate via `localStorage.ll_onboarding_seen` (no schema change)

### Part 2 — Founder Validations language
- UI never exposes the word “Credits” to users
- Labels: “N Founder Validations remaining”, validate page status/button/alerts, dashboard copy
- Backend still uses credits field/API unchanged

### Part 3 — Upgrade experience
- `UpgradePanel` when allocation is 0: “You’re ready for the next stage”, unlock list, ₹799, “Become an Early Founder” / “Continue with Waitlist”

### Part 4–6 — Premium PDFs
- `public/founder/launchlens-founder-playbook.pdf` (16 pp) — consulting-style handbook
- `public/founder/launch-in-20-days.pdf` (21 pp) — day-by-day execution workbook
- Linked from dashboard as Founder resources

### Part 7 — Result completion
- After every validation: “Excellent work. You’ve completed another Founder Validation.” + remaining count when available

### Verification
- `npm run build` required before commit
- No architecture, schema, payment, or auth flow changes

---

## 2026-08-04 — Launch Readiness Sprint 2 (C/D/E) — responsive QA pass

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** Full responsive audit + polish across all user-facing pages; a11y touch targets; safe-area consistency  
**Architecture:** Frozen

### Sprint C — Responsive QA & polish (this pass)

- Auth shells unified: signup / forgot-password / verify-email now use `min-h-[100dvh]` + `safe-px` / `safe-pb` (match login)
- All primary page containers (landing sections, dashboard, validate, result, workshop + sub-tools, guides) use `safe-px` instead of fixed `px-6` for notched devices
- Primary CTAs on dashboard, guides, workshop tools, landing Early Bird: `min-h-11` / flex centering for ≥44px touch targets
- Result loading state centered with safe padding
- `.scrollbar-none` utility added (workspace nav horizontal scroll)

### Sprint D — Performance (prior + retained)

- Inter `display: swap` + preload
- `next.config`: `compress`, `poweredByHeader: false`, strict mode
- `prefers-reduced-motion` respected
- No unused image pipeline; no framer-motion imports in app code

### Sprint E / SEO / a11y (prior + this pass)

- Metadata, robots, sitemap, skip link, focus-visible (retained)
- Sign-out → `/auth/login` (retained)
- Touch targets and safe-area extended to remaining auth + product surfaces

### Not changed

- Payment/auth architecture, Brain providers, Stripe stub, RLS, webhooks

---

## 2026-08-04 — Launch Readiness Sprint 2 (C/D/E) initial

**Agent:** Grok (xAI) — Lead Software Architect  
**Scope:** Responsive polish, performance defaults, SEO/a11y, launch audit fixes  
**Architecture:** Frozen

### Sprint C — Responsive
- Safe-area padding helpers; overflow-x containment
- Navbar/app nav touch targets (~44px), mobile CTA label, scrollable workspace nav
- Logo tagline hidden below 360px width to prevent header clip
- Auth screens: full viewport height + safe padding (login first)
- Production `not-found` page

### Sprint D — Performance
- Inter `display: swap` + preload
- `next.config`: `compress`, `poweredByHeader: false`, strict mode
- `prefers-reduced-motion` respect in CSS

### Sprint E / SEO / a11y
- Metadata: title template, description, OG, Twitter, robots, canonical via `metadataBase`
- `src/app/robots.ts`, `src/app/sitemap.ts`
- Skip-to-content link; `:focus-visible` rings; nav `aria-label`s
- Sign-out redirect fixed → `/auth/login`

### Not changed
- Payment/auth architecture, Brain providers, Stripe stub

---

## 2026-08-04 — Sprint A/B

Founder waitlist UX, email design system, LAUNCH_CHECKLIST.

---

## Prior

Waitlist email, payments abstraction, auth branding, deploy hardening.
