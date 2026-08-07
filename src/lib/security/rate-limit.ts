/**
 * In-memory sliding-window rate limiter for serverless / single-region deploys.
 * For multi-region scale, swap the store for Redis / Upstash without changing call sites.
 */

type Bucket = { timestamps: number[] }

const globalStore = new Map<string, Bucket>()

const MAX_KEYS = 20_000

function pruneIfNeeded() {
  if (globalStore.size <= MAX_KEYS) return
  const excess = globalStore.size - MAX_KEYS
  let i = 0
  for (const key of globalStore.keys()) {
    globalStore.delete(key)
    if (++i >= excess) break
  }
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSec: number
  limit: number
}

/**
 * @param key   Stable identifier (e.g. `ai:ip:1.2.3.4` or `waitlist:email:a@b.c`)
 * @param limit Max requests in the window
 * @param windowMs Window length in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const cutoff = now - windowMs
  let bucket = globalStore.get(key)
  if (!bucket) {
    bucket = { timestamps: [] }
    globalStore.set(key, bucket)
    pruneIfNeeded()
  }
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff)

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000))
    return { allowed: false, remaining: 0, retryAfterSec, limit }
  }

  bucket.timestamps.push(now)
  return {
    allowed: true,
    remaining: Math.max(0, limit - bucket.timestamps.length),
    retryAfterSec: 0,
    limit,
  }
}

/** Extract client IP from common proxy headers (Vercel / Cloudflare). */
export function clientIp(request: Request): string {
  const h = request.headers
  const forwarded = h.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first.slice(0, 64)
  }
  const real = h.get("x-real-ip")?.trim()
  if (real) return real.slice(0, 64)
  const cf = h.get("cf-connecting-ip")?.trim()
  if (cf) return cf.slice(0, 64)
  return "unknown"
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
  }
  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSec)
  }
  return headers
}

/** Presets used across the app */
export const RATE_LIMITS = {
  /** AI brain endpoints — costly */
  ai: { limit: 10, windowMs: 60_000 },
  /** Waitlist / email */
  waitlist: { limit: 5, windowMs: 60_000 },
  /** Auth-adjacent public POSTs */
  auth: { limit: 20, windowMs: 60_000 },
  /** General authenticated API */
  api: { limit: 60, windowMs: 60_000 },
  /** Admin diagnostics */
  admin: { limit: 30, windowMs: 60_000 },
} as const
