import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"

export type AuthOk = { user: User; supabase: Awaited<ReturnType<typeof createClient>> }
export type AuthFail = { response: NextResponse }

/**
 * Require an authenticated Supabase user for API routes.
 * Returns 401 JSON when missing — does not leak session internals.
 */
export async function requireUser(): Promise<AuthOk | AuthFail> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        response: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ),
      }
    }

    return { user, supabase }
  } catch {
    return {
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    }
  }
}

export function isAuthOk(result: AuthOk | AuthFail): result is AuthOk {
  return "user" in result
}
