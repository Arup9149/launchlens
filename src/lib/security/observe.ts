/**
 * Lightweight observability hooks — ready for Sentry / OpenTelemetry wiring
 * without requiring those packages at build time.
 */

import { safeLog } from "./log"

export function trackLatency(
  route: string,
  startedAt: number,
  extra?: Record<string, unknown>
) {
  const ms = Date.now() - startedAt
  const level = ms > 15_000 ? "warn" : "info"
  safeLog(level as "info" | "warn", "perf.latency", {
    route,
    ms,
    slow: ms > 15_000,
    ...(extra || {}),
  })
  return ms
}

export function captureException(err: unknown, context?: Record<string, unknown>) {
  safeLog("error", "error.captured", {
    error: err instanceof Error ? err.message : String(err),
    ...(context || {}),
  })
}
