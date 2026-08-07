import type { Metadata } from "next"
import { LegalShell } from "../legal-layout"

export const metadata: Metadata = {
  title: "AI Disclaimer",
  description: "Important limitations of LaunchLens AI outputs.",
}

export default function AIDisclaimerPage() {
  return (
    <LegalShell title="AI Disclaimer">
      <section>
        <p>
          LaunchLens uses machine learning models to generate idea analysis,
          polish suggestions, architecture outlines, and related content.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-medium text-white mb-2">Not advice</h2>
        <p>
          Outputs are probabilistic and may be incomplete, biased, or wrong. They
          are not legal, tax, financial, investment, or professional advice. Do
          not rely on them as the sole basis for material decisions.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-medium text-white mb-2">Your responsibility</h2>
        <p>
          You are responsible for validating outputs, complying with law, and
          protecting confidential information. Do not paste secrets, credentials,
          or personal data of others into prompts.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-medium text-white mb-2">Third-party models</h2>
        <p>
          Inference may be performed by third-party providers under their terms.
          Availability and behavior of models can change without notice.
        </p>
      </section>
    </LegalShell>
  )
}
