/**
 * Founder Playbook PDF generator (jsPDF).
 * Structured application data → Blob. No DOM scraping, no print dialog.
 */

import { jsPDF } from "jspdf"
import type { FounderPdfContext } from "./types"

function resolveName(ctx: FounderPdfContext): string {
  const n = (ctx.startupName || "").trim()
  if (n) return n
  const idea = (ctx.idea || "").trim()
  if (idea) return idea.slice(0, 72) + (idea.length > 72 ? "…" : "")
  return "Your Startup"
}

const MARGIN = 18
const PAGE_W = 210
const PAGE_H = 297
const CONTENT_W = PAGE_W - MARGIN * 2

function ensureSpace(doc: jsPDF, y: number, need: number): number {
  if (y + need > PAGE_H - MARGIN) {
    doc.addPage()
    return MARGIN
  }
  return y
}

function drawFooter(doc: jsPDF, name: string) {
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(120)
    doc.text(
      `LaunchLens · Founder Playbook · ${name}`,
      MARGIN,
      PAGE_H - 10
    )
    doc.text(String(i), PAGE_W - MARGIN, PAGE_H - 10, { align: "right" })
  }
}

export function getFounderPlaybookFilename(): string {
  return "LaunchLens-Founder-Playbook.pdf"
}

export function generateFounderPlaybookPdf(ctx: FounderPdfContext = {}): Blob {
  const name = resolveName(ctx)
  const idea = (ctx.idea || "").trim()
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  // Cover
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text("LaunchLens · Early Founder", PAGE_W / 2, 60, { align: "center" })
  doc.setFontSize(24)
  doc.setTextColor(20)
  doc.text("Founder Playbook", PAGE_W / 2, 80, { align: "center" })
  doc.setFontSize(12)
  doc.setTextColor(80)
  doc.text(`for ${name}`, PAGE_W / 2, 95, { align: "center" })
  doc.setFontSize(11)
  doc.text("See Opportunities. Build What Matters.", PAGE_W / 2, 115, { align: "center" })

  doc.addPage()
  let y = MARGIN

  const section = (title: string) => {
    y = ensureSpace(doc, y, 16)
    doc.setFontSize(13)
    doc.setTextColor(20)
    doc.text(title, MARGIN, y)
    y += 3
    doc.setDrawColor(200)
    doc.line(MARGIN, y, PAGE_W - MARGIN, y)
    y += 8
  }

  const para = (text: string) => {
    doc.setFontSize(10)
    doc.setTextColor(40)
    const lines = doc.splitTextToSize(text, CONTENT_W)
    y = ensureSpace(doc, y, lines.length * 5 + 4)
    doc.text(lines, MARGIN, y)
    y += lines.length * 5 + 4
  }

  const bullets = (items: string[]) => {
    doc.setFontSize(10)
    doc.setTextColor(40)
    for (const item of items) {
      const lines = doc.splitTextToSize(`•  ${item}`, CONTENT_W)
      y = ensureSpace(doc, y, lines.length * 5 + 2)
      doc.text(lines, MARGIN, y)
      y += lines.length * 5 + 2
    }
    y += 2
  }

  section("1. Your idea (as captured)")
  para(
    idea ||
      "Add your idea on Validate, then re-download for a fully personalized playbook."
  )

  section("2. Validation checklist")
  bullets([
    "Write the problem in one sentence a stranger understands.",
    "Name 10 ideal users and how you will reach them this week.",
    "List 5 current workarounds (including “do nothing”).",
    "Message 5 people; log replies, not opinions.",
    "Test willingness to pay with a concrete offer.",
    "Decide Go / Pivot / Kill with a date on the calendar.",
  ])

  section(`3. ICP snapshot for ${name}`)
  bullets([
    "Who hurts most? ________________________________",
    "Where do they already complain? ____________________",
    "What do they pay today? ____________________________",
  ])

  section("4. Wedge & MVP")
  bullets([
    "One wedge outcome in under 10 minutes of product use.",
    "Ship the smallest path that proves that outcome.",
    "Cut every feature that does not serve the wedge.",
  ])

  section("5. Pricing probes")
  bullets([
    "Anchor: what would make this a no-brainer monthly?",
    "Ask for a pre-order, deposit, or LOI — not “would you use this?”",
  ])

  section("6. Weekly operating rhythm")
  bullets([
    "Mon: ship one user-visible improvement.",
    "Wed: 3 customer conversations.",
    "Fri: score metrics; decide keep / cut / double-down.",
  ])

  section("7. Decision log")
  para(
    "Record major calls (scope, pricing, channel) with date and reason so you can reverse them deliberately."
  )

  drawFooter(doc, name)
  return doc.output("blob")
}
