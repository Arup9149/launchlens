"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { WaitlistForm } from "@/components/landing/waitlist-form"

type Region = "IN" | "US" | "EU" | "OTHER"

function detectRegion(): Region {
  if (typeof window === "undefined") return "OTHER"
  const lang = (navigator.language || "").toLowerCase()
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""

  if (lang.includes("en-in") || tz.includes("Kolkata") || tz.includes("Calcutta")) {
    return "IN"
  }
  if (
    tz.includes("Europe/") ||
    lang.startsWith("de") ||
    lang.startsWith("fr") ||
    lang.startsWith("es") ||
    lang.startsWith("it") ||
    lang.startsWith("nl") ||
    lang.startsWith("en-gb")
  ) {
    return "EU"
  }
  if (
    lang.startsWith("en-us") ||
    tz.includes("America/")
  ) {
    return "US"
  }
  return "OTHER"
}

const PRICE = {
  IN: { label: "₹799", list: "₹5,999", builder: "₹1,700", pro: "₹2,999" },
  US: { label: "$9", list: "$69", builder: "$19", pro: "$35" },
  EU: { label: "€9", list: "€65", builder: "€19", pro: "€35" },
  OTHER: { label: "$9", list: "$69", builder: "$19", pro: "$35" },
}

export default function Home() {
  const [region, setRegion] = useState<Region>("OTHER")

  useEffect(() => {
    setRegion(detectRegion())
  }, [])

  const price = PRICE[region]

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 pt-28 pb-16 text-center">
        <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400/80 mb-6">
          Early Bird · First 50 founders
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-6">
          Validate → Polish → Expand → Architect
          <br />
          <span className="text-zinc-500">in one founder workspace</span>
        </h1>
        <p className="text-[17px] text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-6">
          Get Go / Pivot / Kill reports, then continue into Workshop with the
          idea already loaded — polish, expand, and design the MVP blueprint.
        </p>

        <div className="inline-flex flex-col items-center gap-1 mb-4">
          <div className="flex items-baseline gap-3">
            <span className="text-[15px] text-zinc-500 line-through">
              {price.list}
            </span>
            <span className="text-3xl font-medium tracking-tight">
              {price.label}
            </span>
          </div>
          <p className="text-[12px] text-emerald-400/90">
            Early Bird · 2 validations + starter guides
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {(
            [
              ["IN", "₹ INR"],
              ["US", "$ USD"],
              ["EU", "€ EUR"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setRegion(key)}
              className={`text-[11px] px-3 py-1 rounded-full border transition ${
                region === key
                  ? "border-violet-500/50 text-violet-300 bg-violet-500/10"
                  : "border-white/10 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/validate"
            className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-7 py-3 rounded-full text-white transition"
          >
            Claim Early Bird · {price.label}
          </Link>
          <Link
            href="/workshop"
            className="text-[14px] font-medium px-7 py-3 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 transition"
          >
            Open Workshop
          </Link>
        </div>
        <p className="text-[12px] text-zinc-600 mt-5">
          Secure checkout · Private local Brain option · Workshop included
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500 mb-8 text-center">
          The path
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              step: "01",
              title: "Validate",
              desc: "Score, verdict, demand, competition, risks, and next steps from the Brain.",
            },
            {
              step: "02",
              title: "Polish",
              desc: "Sharpen problem, ICP, wedge, and pricing with Brain-assisted refinement.",
            },
            {
              step: "03",
              title: "Expand",
              desc: "Generate adjacent opportunities with clearer scope and upside.",
            },
            {
              step: "04",
              title: "Architect",
              desc: "Modules, tech stack, system flow, risks, metrics, and a 30-day plan.",
            },
          ].map((item) => (
            <div key={item.step} className="glass rounded-2xl p-5">
              <p className="text-[12px] text-violet-400 mb-2">{item.step}</p>
              <h3 className="text-[15px] font-medium mb-2">{item.title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500 mb-8 text-center">
          Why founders use it
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Builder outputs, not only a score",
              desc: "Modules, recommended stack, system flow, and a 30-day execution plan — so you know what to build next.",
            },
            {
              title: "Simple checkout",
              desc: "Pay once for Early Bird access. No subscription required to start validating.",
            },
            {
              title: "Private local Brain option",
              desc: "Run analysis through Ollama on your machine when you want zero per-query API cost and private processing.",
            },
            {
              title: "Idea handoff without retyping",
              desc: "From the report, jump into Polish, Related Ideas, or Architecture with the idea already loaded.",
            },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <h3 className="text-[15px] font-medium mb-2">{f.title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500 mb-8 text-center">
          Pricing
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Early Bird */}
          <div className="glass-strong rounded-2xl p-6 border border-violet-500/30">
            <p className="text-[12px] text-violet-400 mb-2">Early Bird</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[13px] text-zinc-500 line-through">
                {price.list}
              </span>
              <span className="text-3xl font-medium">{price.label}</span>
            </div>
            <p className="text-[12px] text-emerald-400 mb-4">First 50 founders</p>
            <ul className="text-[13px] text-zinc-400 space-y-2 mb-6">
              <li>• 2 full validations</li>
              <li>• Full Workshop access</li>
              <li>• Starter setup guide (stack-aware)</li>
              <li>• Do’s & Don’ts completion page</li>
              <li>• Report → blueprint path</li>
            </ul>
            <Link
              href="/validate"
              className="block text-center bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[13px] font-medium px-5 py-2.5 rounded-full text-white transition"
            >
              Start · {price.label}
            </Link>
          </div>

          {/* Builder */}
          <div className="glass rounded-2xl p-6">
            <p className="text-[12px] text-zinc-400 mb-2">Builder Pass</p>
            <p className="text-3xl font-medium mb-1">{price.builder}</p>
            <p className="text-[12px] text-zinc-500 mb-4">Best for iterating</p>
            <ul className="text-[13px] text-zinc-400 space-y-2 mb-6">
              <li>• 3 full validations</li>
              <li>• Everything in Early Bird</li>
              <li>• Launch setup (copy-paste commands)</li>
              <li>• 4-page building ethics guide</li>
              <li>• Stronger coding assistance notes</li>
            </ul>
            <p className="text-[12px] text-zinc-600">Opens after Early Bird</p>
          </div>

          {/* Pro */}
          <div className="glass rounded-2xl p-6">
            <p className="text-[12px] text-zinc-400 mb-2">Pro Launch</p>
            <p className="text-3xl font-medium mb-1">{price.pro}</p>
            <p className="text-[12px] text-zinc-500 mb-4">Serious builders</p>
            <ul className="text-[13px] text-zinc-400 space-y-2 mb-6">
              <li>• 5 full validations</li>
              <li>• Everything in Builder</li>
              <li>• Full first-to-ship playbook</li>
              <li>• Setup → build → ship path</li>
              <li>• Priority Workshop guidance</li>
            </ul>
            <p className="text-[12px] text-zinc-600">Opens after Early Bird</p>
          </div>
        </div>
        <p className="text-[12px] text-zinc-600 text-center mt-6">
          Secure checkout. Global card support is expanding.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="glass-strong rounded-3xl p-10 border border-violet-500/20">
          <p className="text-[12px] uppercase tracking-[0.2em] text-violet-400 mb-4">
            Early Bird
          </p>
          <div className="flex items-baseline justify-center gap-3 mb-2">
            <span className="text-[16px] text-zinc-500 line-through">
              {price.list}
            </span>
            <span className="text-4xl font-medium tracking-tight">
              {price.label}
            </span>
          </div>
          <p className="text-[13px] text-emerald-400 mb-6">
            2 validations + starter guides + Workshop · first 50 seats
          </p>
          <Link
            href="/validate"
            className="inline-flex bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-[14px] font-medium px-8 py-3 rounded-full text-white transition"
          >
            Claim Early Bird · {price.label}
          </Link>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-medium tracking-tight mb-3">
          Get product updates
        </h2>
        <p className="text-[14px] text-zinc-500 mb-8">
          Join the list for seat openings and Workshop releases.
        </p>
        <WaitlistForm />
      </section>

      <footer className="border-t border-white/[0.06] py-10 text-center">
        <p className="text-[13px] text-zinc-600">
          LaunchLens · Know before you build
        </p>
      </footer>
    </main>
  )
}