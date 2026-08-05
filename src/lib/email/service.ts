/**
 * EmailService — single entry point for all transactional email.
 * Architecture frozen: every app-originated send goes through here.
 *
 * Auth (signup verification / password reset) is delivered by Supabase Auth
 * (configure custom SMTP → Resend in the Supabase dashboard). This service
 * owns waitlist, notify_me, future purchase receipts, and any custom app mail.
 */

import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"
import { getEmailConfig } from "./config"
import { getEmailProvider } from "./providers/registry"
import type {
  EmailEventType,
  EmailProviderId,
  SendEmailInput,
  SendEmailResult,
} from "./types"

const MAX_ATTEMPTS = 3
const BASE_DELAY_MS = 400

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Classify provider/network errors for retry policy. */
export function isTransientEmailError(err: unknown): boolean {
  if (!(err instanceof Error)) return true
  const msg = (err.message || "").toLowerCase()
  const code =
    "code" in err && typeof (err as { code?: unknown }).code === "string"
      ? String((err as { code: string }).code).toLowerCase()
      : ""

  // Permanent: not configured, validation, auth to provider, hard bounce semantics
  if (code === "email_not_configured") return false
  if (
    msg.includes("not configured") ||
    msg.includes("invalid") ||
    msg.includes("validation") ||
    msg.includes("unauthorized") ||
    msg.includes("forbidden") ||
    msg.includes("api key") ||
    msg.includes("does not exist") ||
    msg.includes("unsubscribed") ||
    msg.includes("blocked")
  ) {
    return false
  }

  // Explicit HTTP-ish permanent
  if (/\b4(0[0-3]|22|29)\b/.test(msg) && !msg.includes("429")) {
    // 400-403, 422 permanent; 429 handled as transient below
    if (msg.includes("429") || msg.includes("rate limit") || msg.includes("too many")) {
      return true
    }
    return false
  }

  if (msg.includes("429") || msg.includes("rate limit") || msg.includes("timeout")) {
    return true
  }
  if (msg.includes("5") && (msg.includes("http") || msg.includes("status") || msg.includes("server"))) {
    return true
  }
  // Network / unknown → retry
  return true
}

type LogFields = {
  email: string
  type: EmailEventType
  provider?: string
  messageId?: string | null
  status: string
  error?: string | null
  attempt?: number
}

function structuredLog(
  level: "info" | "error" | "warn",
  msg: string,
  fields: LogFields
) {
  const line = JSON.stringify({
    level,
    msg,
    email: fields.email,
    type: fields.type,
    provider: fields.provider,
    message_id: fields.messageId ?? undefined,
    status: fields.status,
    error: fields.error ?? undefined,
    attempt: fields.attempt,
  })
  if (level === "error") console.error(line)
  else if (level === "warn") console.warn(line)
  else console.info(line)
}

async function insertEvent(row: {
  email: string
  type: EmailEventType
  status: string
  provider?: string | null
  provider_message_id?: string | null
  error?: string | null
  sent_at?: string | null
}): Promise<void> {
  if (!isAdminConfigured()) {
    structuredLog("warn", "email.event_persist_skipped", {
      email: row.email,
      type: row.type,
      status: row.status,
      error: "SUPABASE_SERVICE_ROLE_KEY not configured",
    })
    return
  }
  try {
    const admin = createAdminClient()
    const { error } = await admin.from("email_events").insert([
      {
        email: row.email,
        type: row.type,
        status: row.status,
        provider: row.provider ?? null,
        provider_message_id: row.provider_message_id ?? null,
        error: row.error ?? null,
        sent_at: row.sent_at ?? null,
      },
    ])
    if (error) {
      structuredLog("error", "email.event_persist_failed", {
        email: row.email,
        type: row.type,
        status: row.status,
        error: error.message,
      })
    }
  } catch (err) {
    structuredLog("error", "email.event_persist_failed", {
      email: row.email,
      type: row.type,
      status: row.status,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

export type EmailServiceSendOptions = SendEmailInput & {
  type: EmailEventType
}

export class EmailService {
  /**
   * Send transactional email with:
   * - max 3 attempts on transient failures only
   * - structured logs (never swallowed)
   * - email_events row (best-effort when service role available)
   */
  async send(input: EmailServiceSendOptions): Promise<SendEmailResult> {
    const type = input.type
    const to = input.to.trim().toLowerCase()
    const cfg = getEmailConfig()
    const provider = getEmailProvider(cfg.provider)

    if (!provider.isConfigured()) {
      const err = new Error(
        `Email provider "${cfg.provider}" is not configured (missing API key or EMAIL_FROM_ADDRESS)`
      ) as Error & { code?: string }
      err.code = "EMAIL_NOT_CONFIGURED"
      structuredLog("error", "email.not_configured", {
        email: to,
        type,
        provider: cfg.provider,
        status: "failed",
        error: err.message,
      })
      await insertEvent({
        email: to,
        type,
        status: "failed",
        provider: cfg.provider,
        error: err.message,
      })
      throw err
    }

    let lastError: unknown
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const result = await provider.send({ ...input, to })
        structuredLog("info", "email.sent", {
          email: to,
          type,
          provider: result.provider,
          messageId: result.id,
          status: "sent",
          attempt,
        })
        await insertEvent({
          email: to,
          type,
          status: "sent",
          provider: result.provider,
          provider_message_id: result.id,
          sent_at: new Date().toISOString(),
        })
        return result
      } catch (err) {
        lastError = err
        const message = err instanceof Error ? err.message : String(err)
        const transient = isTransientEmailError(err)
        structuredLog("error", "email.send_failed", {
          email: to,
          type,
          provider: cfg.provider,
          status: "failed",
          error: message,
          attempt,
        })

        if (!transient || attempt >= MAX_ATTEMPTS) {
          await insertEvent({
            email: to,
            type,
            status: "failed",
            provider: cfg.provider,
            error: message,
          })
          throw err instanceof Error ? err : new Error(message)
        }

        await sleep(BASE_DELAY_MS * Math.pow(2, attempt - 1))
      }
    }

    const fallback =
      lastError instanceof Error
        ? lastError
        : new Error("Email send failed after retries")
    throw fallback
  }

  /** Latest events for admin diagnostics (service role). */
  async listRecent(limit = 50) {
    if (!isAdminConfigured()) {
      throw new Error("Admin client not configured")
    }
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("email_events")
      .select(
        "id, email, type, status, provider, provider_message_id, error, created_at, sent_at"
      )
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 200))

    if (error) throw new Error(error.message)
    return data ?? []
  }
}

/** Singleton used by all product paths. */
export const emailService = new EmailService()

/**
 * Backward-compatible helper: routes through EmailService.
 * Prefer emailService.send({ ..., type }) at call sites.
 */
export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  const type: EmailEventType =
    (input.type as EmailEventType | undefined) ||
    (input.tags?.category as EmailEventType | undefined) ||
    "other"
  return emailService.send({ ...input, type })
}
