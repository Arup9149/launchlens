import type { EmailProviderId } from "./types"

export type EmailConfig = {
  provider: EmailProviderId
  fromName: string
  fromAddress: string
  replyTo?: string
  resendApiKey?: string
  postmarkServerToken?: string
  sendgridApiKey?: string
}

/**
 * All sender identity comes from environment variables.
 * Production target (after domain verify): EMAIL_FROM_NAME=LaunchLens,
 * EMAIL_FROM_ADDRESS=team@launchlens.ai — never hardcode the address in source.
 */
export function getEmailConfig(): EmailConfig {
  const provider = (
    process.env.EMAIL_PROVIDER || "resend"
  ).toLowerCase() as EmailProviderId

  return {
    provider:
      provider === "postmark" || provider === "sendgrid" ? provider : "resend",
    fromName: (process.env.EMAIL_FROM_NAME || "LaunchLens").trim(),
    fromAddress: (process.env.EMAIL_FROM_ADDRESS || "").trim(),
    replyTo: process.env.EMAIL_REPLY_TO?.trim() || undefined,
    resendApiKey: process.env.RESEND_API_KEY,
    postmarkServerToken: process.env.POSTMARK_SERVER_TOKEN,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  }
}

export function formatFromHeader(cfg: EmailConfig): string {
  const name = cfg.fromName
  const address = cfg.fromAddress
  if (!address) {
    throw new Error(
      "EMAIL_FROM_ADDRESS is not set. Configure a verified sender (see .env.example). Production target: team@launchlens.ai after DNS verify."
    )
  }
  return name ? `${name} <${address}>` : address
}

/** True when From can be assembled for outbound mail. */
export function isEmailSenderConfigured(): boolean {
  const cfg = getEmailConfig()
  if (!cfg.fromAddress) return false
  if (cfg.provider === "resend") return !!cfg.resendApiKey
  if (cfg.provider === "postmark") return !!cfg.postmarkServerToken
  if (cfg.provider === "sendgrid") return !!cfg.sendgridApiKey
  return false
}
