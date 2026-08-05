"use client"

import { useState } from "react"
import { QrCode } from "lucide-react"
import { QrHandoffModal } from "./qr-modal"

/** Minimal QR icon for the app header \u2014 opens secure device handoff. */
export function QrHandoffButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-zinc-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition min-h-11 min-w-11 inline-flex items-center justify-center"
        aria-label="Continue on another device"
        title="Continue on phone or tablet"
      >
        <QrCode className="w-4 h-4" strokeWidth={1.75} />
      </button>
      <QrHandoffModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
