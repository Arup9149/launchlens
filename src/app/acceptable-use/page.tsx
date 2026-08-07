import type { Metadata } from "next"
import { LegalShell } from "../legal-layout"

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: "Rules for acceptable use of LaunchLens.",
}

export default function AUPPage() {
  return (
    <LegalShell title="Acceptable Use Policy">
      <section>
        <h2 className="text-lg font-medium text-white mb-2">Prohibited</h2>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li>Attempting to access other users&apos; data or accounts.</li>
          <li>Bypassing authentication, rate limits, credits, or payment gates.</li>
          <li>Automated scraping or bulk abuse of AI endpoints.</li>
          <li>Submitting malware, illegal content, or content that exploits minors.</li>
          <li>Using the service to generate content for fraud, phishing, or harassment.</li>
          <li>Reverse engineering or attacking infrastructure.</li>
          <li>Sharing API secrets or admin credentials.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-medium text-white mb-2">Enforcement</h2>
        <p>
          Violations may result in rate limiting, credit revocation, account
          suspension, or referral to law enforcement where required.
        </p>
      </section>
    </LegalShell>
  )
}
