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

export function getEmailConfig(): EmailConfig {
  const provider = (
    process.env.EMAIL_PROVIDER || "resend"
  ).toLowerCase() as EmailProviderId

  return {
    provider:
      provider === "postmark" || provider === "sendgrid" ? provider : "resend",
    fromName: process.env.EMAIL_FROM_NAME || "LaunchLens",
    fromAddress: process.env.EMAIL_FROM_ADDRESS || "",
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
    resendApiKey: process.env.RESEND_API_KEY,
    postmarkServerToken: process.env.POSTMARK_SERVER_TOKEN,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  }
}

export function formatFromHeader(cfg: EmailConfig): string {
  const name = cfg.fromName.trim()
  const address = cfg.fromAddress.trim()
  if (!address) {
    throw new Error(
      "EMAIL_FROM_ADDRESS is not set. Configure a verified sender (see .env.example)."
    )
  }
  return name ? `${name} <${address}>` : address
}
