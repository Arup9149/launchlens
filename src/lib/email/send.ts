import { getEmailConfig } from "./config"
import { getEmailProvider } from "./providers/registry"
import type { SendEmailInput, SendEmailResult } from "./types"

const MAX_ATTEMPTS = 3
const BASE_DELAY_MS = 400

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Send transactional email with retry + structured logging.
 * Throws only after all attempts fail — callers may catch for graceful degradation.
 */
export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  const cfg = getEmailConfig()
  const provider = getEmailProvider(cfg.provider)

  if (!provider.isConfigured()) {
    const err = new Error(
      `Email provider "${cfg.provider}" is not configured (missing API key or EMAIL_FROM_ADDRESS)`
    ) as Error & { code?: string }
    err.code = "EMAIL_NOT_CONFIGURED"
    throw err
  }

  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await provider.send(input)
      console.info(
        JSON.stringify({
          level: "info",
          msg: "email.sent",
          provider: result.provider,
          id: result.id,
          to: input.to,
          subject: input.subject,
          attempt,
        })
      )
      return result
    } catch (err) {
      lastError = err
      console.error(
        JSON.stringify({
          level: "error",
          msg: "email.send_failed",
          provider: cfg.provider,
          to: input.to,
          subject: input.subject,
          attempt,
          error: err instanceof Error ? err.message : String(err),
        })
      )
      if (attempt < MAX_ATTEMPTS) {
        await sleep(BASE_DELAY_MS * Math.pow(2, attempt - 1))
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Email send failed after retries")
}
