import type { Metadata } from "next"
import { LegalShell } from "../legal-layout"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact LaunchLens.",
}

export default function ContactPage() {
  return (
    <LegalShell title="Contact">
      <section>
        <p>
          For product, privacy, security, or billing questions, email{" "}
          <a
            className="text-violet-300 underline"
            href="mailto:shortlistready@gmail.com"
          >
            shortlistready@gmail.com
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-lg font-medium text-white mb-2">Security reports</h2>
        <p>
          If you believe you have found a vulnerability, email the same address
          with details and steps to reproduce. Please allow reasonable time for
          remediation before public disclosure. See{" "}
          <a className="text-violet-300 underline" href="/.well-known/security.txt">
            security.txt
          </a>
          .
        </p>
      </section>
    </LegalShell>
  )
}
