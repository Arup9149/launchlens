/**
 * Short-window request deduplication to stop accidental double-submit
 * and simple replay of identical AI payloads.
 */

import crypto from "crypto"

type Entry = { expires: number; bodyHash: string }

const recent = new Map<string, Entry>()
const TTL_MS = 15_000
const MAX = 10_000

function prune(now: number) {
  if (recent.size < MAX) return
  for (const [k, v] of recent) {
    if (v.expires < now) recent.delete(k)
  }
  if (recent.size >= MAX) {
    let n = 0
    for (const k of recent.keys()) {
      recent.delete(k)
      if (++n > 1000) break
    }
  }
}

export function hashPayload(parts: string[]): string {
  return crypto.createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 32)
}

export function isDuplicateRequest(key: string, bodyHash: string): boolean {
  const now = Date.now()
  prune(now)
  const existing = recent.get(key)
  if (existing && existing.expires > now && existing.bodyHash === bodyHash) {
    return true
  }
  recent.set(key, { expires: now + TTL_MS, bodyHash })
  return false
}
