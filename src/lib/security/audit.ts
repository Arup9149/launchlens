/**
 * Production-safe audit logging.
 * Never logs passwords, tokens, API keys, or full secrets.
 */

import { safeLog } from "./log"

export type AuditAction =
  | "auth.login"
  | "auth.logout"
  | "auth.signup"
  | "auth.password_reset"
  | "auth.email_verify"
  | "ai.request"
  | "ai.denied"
  | "credits.use"
  | "credits.grant"
  | "billing.order"
  | "billing.verify"
  | "billing.webhook"
  | "admin.access"
  | "admin.denied"
  | "account.export"
  | "account.delete"
  | "waitlist.join"
  | "abuse.flag"
  | "rate_limit.hit"

export type AuditEvent = {
  action: AuditAction
  userId?: string
  outcome: "ok" | "denied" | "error"
  meta?: Record<string, unknown>
}

export function audit(event: AuditEvent) {
  safeLog(event.outcome === "error" ? "error" : "info", `audit.${event.action}`, {
    action: event.action,
    outcome: event.outcome,
    userId: event.userId ? event.userId.slice(0, 8) : undefined,
    ...(event.meta || {}),
  })
}
