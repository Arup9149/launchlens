import crypto from "crypto"

/** Constant-time string compare for secrets (Bearer tokens, webhook signatures). */
export function timingSafeEqualString(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a)
    const bb = Buffer.from(b)
    if (ba.length !== bb.length) {
      crypto.timingSafeEqual(ba, ba)
      return false
    }
    return crypto.timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}
