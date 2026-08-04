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

/** Resend’s shared verified sender for MVP (no custom domain required). */
export const MVP_RESEND_FROM_ADDRESS = "onboarding@resend.dev"

/**
 * All sender identity comes from environment variables.
 * Defaults (MVP): EMAIL_PROVIDER=resend, EMAIL_FROM_NAME=LaunchLens,
 * EMAIL_FROM_ADDRESS=onboarding@resend.dev.
 * Production override after domain verify: EMAIL_FROM_ADDRESS=team@launchlens.ai
 * — never hardcode a production-only address in call sites.
 */
export function getEmailConfig(): EmailConfig {
  const provider = (
    process.env.EMAIL_PROVIDER || "resend"
  ).toLowerCase() as EmailProviderId

  const fromAddress = (
    process.env.EMAIL_FROM_ADDRESS || MVP_RESEND_FROM_ADDRESS
  ).trim()

  return {
    provider:
      provider === "postmark" || provider === "sendgrid" ? provider : "resend",
    fromName: (process.env.EMAIL_FROM_NAME || "LaunchLens").trim(),
    fromAddress,
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
      "EMAIL_FROM_ADDRESS resolved empty. Set EMAIL_FROM_ADDRESS or rely on the MVP default onboarding@resend.dev."
    )
  }
  return name ? `${name} <${address}>` : address
}

/** True when From can be assembled and the active provider has credentials. */
export function isEmailSenderConfigured(): boolean {
  const cfg = getEmailConfig()
  if (!cfg.fromAddress) return false
  if (cfg.provider === "resend") return !!cfg.resendApiKey
  if (cfg.provider === "postmark") return !!cfg.postmarkServerToken
  if (cfg.provider === "sendgrid") return !!cfg.sendgridApiKey
  return false
}
