"use client"

import { useCallback, useEffect, useState } from "react"
import { QrCode, Smartphone, X, RefreshCw } from "lucide-react"

type HandoffPayload = {
  url: string
  expiresAt: number
}

/**
 * Cross-device continuation modal.
 * QR encodes a short-lived Supabase magic-link handoff URL — no JWTs or secrets.
 */
export function QrHandoffModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [payload, setPayload] = useState<HandoffPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)

  const fetchHandoff = useCallback(async () => {
    setLoading(true)
    setError(null)
    setExpired(false)
    try {
      const res = await fetch("/api/handoff/create", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not create QR")
      setPayload({ url: data.url, expiresAt: data.expiresAt })
    } catch (err: unknown) {
      setPayload(null)
      setError(err instanceof Error ? err.message : "Could not create QR")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    void fetchHandoff()
  }, [open, fetchHandoff])

  useEffect(() => {
    if (!payload?.expiresAt || !open) return
    const ms = Math.max(0, payload.expiresAt - Date.now())
    const t = setTimeout(() => setExpired(true), ms || 0)
    return () => clearTimeout(t)
  }, [payload, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const qrSrc =
    payload && !expired
      ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(payload.url)}`
      : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-handoff-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="glass-strong rounded-2xl border border-white/10 max-w-sm w-full p-6 relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-violet-300" />
          </div>

          <h2 id="qr-handoff-title" className="text-[16px] font-medium mb-1">
            Continue on your phone
          </h2>
          <p className="text-[13px] text-zinc-500 mb-5 leading-relaxed">
            Scan this QR code using your phone or tablet camera to continue
            your session.
          </p>

          <div className="w-[220px] h-[220px] rounded-xl bg-white flex items-center justify-center mb-4 overflow-hidden">
            {loading && (
              <p className="text-[12px] text-zinc-500 px-4">
                Preparing secure QR…
              </p>
            )}
            {!loading && error && (
              <p className="text-[12px] text-red-500/90 px-4">{error}</p>
            )}
            {!loading && !error && expired && (
              <div className="px-4">
                <p className="text-[12px] text-zinc-600 mb-2">QR expired</p>
                <button
                  type="button"
                  onClick={() => void fetchHandoff()}
                  className="inline-flex items-center gap-1.5 text-[12px] text-violet-600 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Generate fresh code
                </button>
              </div>
            )}
            {!loading && !error && !expired && qrSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrSrc}
                alt="QR code to continue on another device"
                width={220}
                height={220}
                className="w-full h-full object-contain"
              />
            )}
            {!loading && !error && !expired && !qrSrc && (
              <QrCode className="w-10 h-10 text-zinc-300" />
            )}
          </div>

          {!expired && payload && (
            <p className="text-[11px] text-zinc-600">
              Expires automatically for security
            </p>
          )}

          {(error || expired) && !loading && (
            <button
              type="button"
              onClick={() => void fetchHandoff()}
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-violet-300 hover:text-violet-200 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh QR
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
