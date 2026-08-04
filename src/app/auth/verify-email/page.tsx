"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Logo } from "@/components/logo"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center px-6 py-10 safe-px safe-pb">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo href="/" size="md" />
        </div>

        <div className="glass rounded-2xl p-8 text-center sm:text-left">
          <h1 className="text-2xl font-medium tracking-tight mb-2">
            Verify your email
          </h1>
          <p className="text-[14px] text-zinc-500 mb-6 leading-relaxed">
            Confirm your email address to activate your LaunchLens workspace.
          </p>

          {email ? (
            <p className="text-[14px] text-zinc-300 mb-6 leading-relaxed">
              We sent a confirmation link to{" "}
              <span className="text-violet-300 font-medium">{email}</span>.
              Open it to finish setting up your account.
            </p>
          ) : (
            <p className="text-[14px] text-zinc-300 mb-6 leading-relaxed">
              Check your inbox for a confirmation link from LaunchLens. Open it
              to finish setting up your account.
            </p>
          )}

          <ul className="text-[13px] text-zinc-500 space-y-2 mb-8 list-disc list-inside">
            <li>The link may take a minute to arrive</li>
            <li>Check spam or promotions if you don't see it</li>
            <li>After confirming, return here to sign in</li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/auth/login"
              className="flex-1 text-center bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium py-3 rounded-full text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="flex-1 text-center text-[14px] font-medium py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
            >
              Use a different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen min-h-[100dvh] flex items-center justify-center text-zinc-500 safe-px">
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
