import type { EmailProvider, EmailProviderId } from "../types"
import { resendProvider } from "./resend"

/**
 * Register additional providers (Postmark, SendGrid) here without
 * changing waitlist or other business logic.
 */
const providers: Partial<Record<EmailProviderId, EmailProvider>> = {
  resend: resendProvider,
  postmark: undefined,
  sendgrid: undefined,
}

export function getEmailProvider(id: EmailProviderId): EmailProvider {
  const p = providers[id]
  if (!p) {
    throw new Error(
      `Email provider "${id}" is not registered. Supported: resend (postmark/sendgrid adapters pending).`
    )
  }
  return p
}
