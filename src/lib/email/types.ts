/**
 * Provider-agnostic transactional email types.
 * Application code depends on these — never on Resend/Postmark/SendGrid SDKs.
 */

export type EmailProviderId = "resend" | "postmark" | "sendgrid"

export type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
  /** Optional reply-to override */
  replyTo?: string
  /** Idempotency / dedupe key when provider supports it */
  idempotencyKey?: string
  tags?: Record<string, string>
}

export type SendEmailResult = {
  provider: EmailProviderId
  id: string
  success: true
}

export type EmailProvider = {
  readonly id: EmailProviderId
  isConfigured(): boolean
  send(input: SendEmailInput): Promise<SendEmailResult>
}

export type WaitlistWelcomeContext = {
  email: string
  /** Optional display / signup name */
  name?: string | null
}
