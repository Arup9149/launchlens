/**
 * Provider-agnostic transactional email types.
 * Application code depends on these — never on Resend/Postmark/SendGrid SDKs.
 */

export type EmailProviderId = "resend" | "postmark" | "sendgrid"

/** Canonical event types persisted in email_events.type */
export type EmailEventType =
  | "waitlist_welcome"
  | "notify_me"
  | "signup_verification"
  | "password_reset"
  | "purchase_receipt"
  | "other"

export type EmailEventStatus = "pending" | "sent" | "failed" | "skipped"

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
  /** Audit type — required when sending via EmailService */
  type?: EmailEventType
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

export type EmailEventRow = {
  id: string
  email: string
  type: string
  status: string
  provider: string | null
  provider_message_id: string | null
  error: string | null
  created_at: string
  sent_at: string | null
}
