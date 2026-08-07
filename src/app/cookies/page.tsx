import type { Metadata } from "next"
import { LegalShell } from "../legal-layout"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How LaunchLens uses cookies and similar technologies.",
}

export default function CookiesPage() {
  return (
    <LegalShell title="Cookie Policy">
      <section>
        <h2 className="text-lg font-medium text-white mb-2">1. What we use</h2>
        <p>
          LaunchLens uses essential cookies and similar storage to keep you signed
          in (Supabase Auth session cookies) and to remember limited client
          preferences (for example local onboarding flags).
        </p>
      </section>
      <section>
        <h2 className="text-lg font-medium text-white mb-2">2. Essential only</h2>
        <p>
          We do not use third-party advertising cookies. Analytics, if introduced
          later, will be disclosed here and configured to respect applicable
          consent requirements.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-medium text-white mb-2">3. Control</h2>
        <p>
          You can clear site data in your browser. Disabling essential cookies
          will prevent sign-in and core product features from working.
        </p>
      </section>
    </LegalShell>
  )
}
