/**
 * Abuse detection and cost-protection counters (in-memory).
 * Survives within a single serverless instance; pair with rate limits + auth.
 * For multi-region scale, swap store for Redis without changing call sites.
 */

import { clientIp } from "./rate-limit"
import { safeLog } from "./log"

type Counter = { count: number; windowStart: number; flags: string[] }

const store = new Map<string, Counter>()
const MAX_KEYS = 30_000
const DAY_MS = 24 * 60 * 60 * 1000

function prune() {
  if (store.size <= MAX_KEYS) return
  let i = 0
  const excess = store.size - MAX_KEYS
  for (const k of store.keys()) {
    store.delete(k)
    if (++i >= excess) break
  }
}

function bucket(key: string, windowMs: number): Counter {
  const now = Date.now()
  let c = store.get(key)
  if (!c || now - c.windowStart > windowMs) {
    c = { count: 0, windowStart: now, flags: [] }
    store.set(key, c)
    prune()
  }
  return c
}

export type AbuseCheck = {
  allowed: boolean
  reason?: string
  remaining?: number
  flags: string[]
}

/** Per-user daily AI request quota (cost protection). */
export function checkDailyAiQuota(
  userId: string,
  dailyLimit = 50
): AbuseCheck {
  const c = bucket(`ai:day:${userId}`, DAY_MS)
  if (c.count >= dailyLimit) {
    c.flags.push("daily_ai_quota")
    safeLog("warn", "abuse.daily_ai_quota", { userId: userId.slice(0, 8) })
    return {
      allowed: false,
      reason: "Daily AI usage limit reached. Try again tomorrow.",
      remaining: 0,
      flags: c.flags,
    }
  }
  c.count += 1
  return {
    allowed: true,
    remaining: Math.max(0, dailyLimit - c.count),
    flags: c.flags,
  }
}

/** Detect rapid parallel AI bursts from same IP. */
export function checkAiBurst(ip: string, limit = 20, windowMs = 60_000): AbuseCheck {
  const c = bucket(`ai:burst:${ip}`, windowMs)
  c.count += 1
  if (c.count > limit) {
    c.flags.push("ai_burst")
    safeLog("warn", "abuse.ai_burst", { ip: ip.slice(0, 32) })
    return {
      allowed: false,
      reason: "Too many AI requests from this network. Slow down.",
      flags: c.flags,
    }
  }
  return { allowed: true, flags: c.flags }
}

/** Waitlist / email abuse: same IP flooding signups. */
export function checkEmailFlood(ip: string, limit = 10, windowMs = 3_600_000): AbuseCheck {
  const c = bucket(`email:flood:${ip}`, windowMs)
  c.count += 1
  if (c.count > limit) {
    c.flags.push("email_flood")
    safeLog("warn", "abuse.email_flood", { ip: ip.slice(0, 32) })
    return {
      allowed: false,
      reason: "Too many signup attempts. Try again later.",
      flags: c.flags,
    }
  }
  return { allowed: true, flags: c.flags }
}

const DISPOSABLE = new Set(
  [
    "mailinator.com",
    "guerrillamail.com",
    "tempmail.com",
    "throwaway.email",
    "yopmail.com",
    "10minutemail.com",
    "trashmail.com",
    "getnada.com",
    "temp-mail.org",
    "fakeinbox.com",
    "sharklasers.com",
    "guerrillamailblock.com",
    "discard.email",
    "maildrop.cc",
  ].map((d) => d.toLowerCase())
)

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim()
  if (!domain) return true
  return DISPOSABLE.has(domain)
}

export function requestFingerprint(request: Request): {
  ip: string
  ua: string
  path: string
} {
  return {
    ip: clientIp(request),
    ua: (request.headers.get("user-agent") || "unknown").slice(0, 120),
    path: new URL(request.url).pathname,
  }
}
