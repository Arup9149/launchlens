/**
 * Production-safe structured logging. Never log secrets, tokens, or full PII.
 */

const REDACT_KEYS =
  /^(password|secret|token|authorization|api[_-]?key|service[_-]?role|cookie|set-cookie|refresh_token|access_token)$/i

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi

function redactString(s: string): string {
  return s.replace(EMAIL_RE, "[email]").slice(0, 500)
}

function redactValue(key: string, value: unknown): unknown {
  if (REDACT_KEYS.test(key)) return "[redacted]"
  if (typeof value === "string") return redactString(value)
  if (value instanceof Error) {
    return { name: value.name, message: redactString(value.message) }
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = redactValue(k, v)
    }
    return out
  }
  return value
}

export function safeLog(
  level: "info" | "warn" | "error",
  msg: string,
  extra?: Record<string, unknown>
) {
  const payload: Record<string, unknown> = {
    level,
    msg,
    ts: new Date().toISOString(),
  }
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      payload[k] = redactValue(k, v)
    }
  }
  const line = JSON.stringify(payload)
  if (level === "error") console.error(line)
  else if (level === "warn") console.warn(line)
  else console.info(line)
}

/** Client-safe error message — never pass through raw Error.message from infra */
export function publicError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "status" in err) {
    const e = err as Error & { status?: number }
    if (e.status === 402 && e.message) return e.message
  }
  return fallback
}
