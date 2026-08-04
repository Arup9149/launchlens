import { formatFromHeader, getEmailConfig } from "../config"
import type { EmailProvider, SendEmailInput, SendEmailResult } from "../types"

export const resendProvider: EmailProvider = {
  id: "resend",

  isConfigured() {
    const cfg = getEmailConfig()
    return !!(cfg.resendApiKey && cfg.fromAddress)
  },

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const cfg = getEmailConfig()
    if (!cfg.resendApiKey) {
      throw new Error("RESEND_API_KEY is not set")
    }

    const from = formatFromHeader(cfg)
    const body: Record<string, unknown> = {
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }
    if (input.replyTo || cfg.replyTo) {
      body.reply_to = input.replyTo || cfg.replyTo
    }
    if (input.tags) {
      body.tags = Object.entries(input.tags).map(([name, value]) => ({
        name,
        value,
      }))
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${cfg.resendApiKey}`,
      "Content-Type": "application/json",
    }
    if (input.idempotencyKey) {
      headers["Idempotency-Key"] = input.idempotencyKey
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = (await res.json().catch(() => ({}))) as {
      id?: string
      message?: string
      name?: string
    }

    if (!res.ok) {
      const msg = data.message || data.name || `Resend HTTP ${res.status}`
      throw new Error(msg)
    }

    return {
      provider: "resend",
      id: data.id || "unknown",
      success: true,
    }
  },
}
