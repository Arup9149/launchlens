"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

type Mode = "focus" | "break"

export default function TimerPage() {
  const [mode, setMode] = useState<Mode>("focus")
  const [minutes, setMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          // Simple browser notification
          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification(
                mode === "focus" ? "Focus session complete!" : "Break over — back to building"
              )
            }
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, mode])

  const start = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(minutes * 60)
    }
    setIsRunning(true)

    // Ask for notification permission once
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }
    }
  }

  const pause = () => setIsRunning(false)

  const reset = () => {
    setIsRunning(false)
    setSecondsLeft(minutes * 60)
  }

  const switchMode = (newMode: Mode) => {
    setIsRunning(false)
    setMode(newMode)
    const defaultMins = newMode === "focus" ? 25 : 10
    setMinutes(defaultMins)
    setSecondsLeft(defaultMins * 60)
  }

  const setPreset = (mins: number) => {
    setIsRunning(false)
    setMinutes(mins)
    setSecondsLeft(mins * 60)
  }

  const displayMinutes = Math.floor(secondsLeft / 60)
  const displaySeconds = secondsLeft % 60

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <div className="mb-10">
        <Link
          href="/workshop"
          className="text-[13px] text-zinc-500 hover:text-white transition mb-4 inline-block"
        >
          ← Back to Workshop
        </Link>
        <h1 className="text-3xl font-medium tracking-tight mb-2">
          Builder Timer
        </h1>
        <p className="text-[15px] text-zinc-400">
          Stay in deep work. Protect your focus. Take intentional breaks.
        </p>
      </div>

      {/* Mode switch */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => switchMode("focus")}
          className={`flex-1 py-2.5 rounded-full text-[13px] font-medium transition ${
            mode === "focus"
              ? "bg-violet-600 text-white"
              : "bg-white/[0.04] text-zinc-400 hover:text-white"
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`flex-1 py-2.5 rounded-full text-[13px] font-medium transition ${
            mode === "break"
              ? "bg-emerald-600 text-white"
              : "bg-white/[0.04] text-zinc-400 hover:text-white"
          }`}
        >
          Break
        </button>
      </div>

      {/* Timer display */}
      <div className="glass rounded-3xl p-10 text-center mb-8">
        <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500 mb-6">
          {mode === "focus" ? "Deep Work" : "Recovery"}
        </p>
        <p className="text-6xl font-medium tracking-tight tabular-nums mb-2">
          {String(displayMinutes).padStart(2, "0")}:
          {String(displaySeconds).padStart(2, "0")}
        </p>
        <p className="text-[13px] text-zinc-500">
          {isRunning
            ? mode === "focus"
              ? "Stay with the problem"
              : "Step away. Come back sharper."
            : "Ready when you are"}
        </p>
      </div>

      {/* Presets */}
      <div className="flex gap-2 mb-8 justify-center">
        {(mode === "focus" ? [25, 50, 90] : [5, 10, 15]).map((m) => (
          <button
            key={m}
            onClick={() => setPreset(m)}
            className={`px-4 py-1.5 rounded-full text-[12px] transition ${
              minutes === m
                ? "bg-white/10 text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            {m}m
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <button
            onClick={start}
            className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-8 py-3 rounded-full text-white transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="bg-white/10 hover:bg-white/15 text-[14px] font-medium px-8 py-3 rounded-full text-white transition"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="text-[14px] font-medium px-6 py-3 rounded-full text-zinc-400 hover:text-white transition"
        >
          Reset
        </button>
      </div>
    </div>
  )
}