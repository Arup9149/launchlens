/**
 * 20-Day Builder Program PDF generator (jsPDF).
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

const DAYS: [string, string][] = [
  ["Problem clarity", "One-sentence problem a stranger understands."],
  ["ICP shortlist", "List 20 ideal users with a path to contact them."],
  ["Channel map", "Where they already hang out; pick one primary channel."],
  ["Interview scripts", "5 questions that reveal pain, budget, and urgency."],
  ["First 5 chats", "Complete 5 interviews; log quotes, not summaries."],
  ["Willingness to pay", "Make a concrete offer; record yes / no / not now."],
  ["Wedge definition", "Single outcome you can prove in under 2 weeks."],
  ["MVP scope freeze", "Write must-have vs later; freeze scope for 10 days."],
  ["Architecture sketch", "Box diagram of 5 modules max for the wedge."],
  ["Data model", "Tables or collections needed for the first happy path."],
  ["Auth & empty states", "Ship sign-in and empty screens with clear next actions."],
  ["Core happy path", "Implement the single path that proves the wedge."],
  ["Instrument basics", "Add 3 events: activated, returned, paid-or-intent."],
  ["Internal dogfood", "Use the product yourself for a real task end-to-end."],
  ["Second cohort chats", "5 more interviews against the live MVP."],
  ["Pricing page draft", "One plan, one CTA, one FAQ that addresses top objection."],
  ["Onboarding pass", "Cut steps; first value under 5 minutes."],
  ["Stability & polish", "Fix top 5 friction points from dogfood + chats."],
  ["Launch checklist", "Domain, analytics, support email, refund policy."],
  ["Ship & learn", "Publish; book 5 post-launch conversations within 7 days."],
]

const MARGIN = 16
const PAGE_W = 210
const PAGE_H = 297
const CONTENT_W = PAGE_W - MARGIN * 2

function ensureSpace(doc: jsPDF, y: number, need: number): number {
  if (y + need > PAGE_H - MARGIN - 8) {
    doc.addPage()
    return MARGIN
  }
  return y
}

export function getBuilderProgramFilename(): string {
  return "LaunchLens-20-Day-Builder.pdf"
}

export function generateBuilderProgramPdf(ctx: FounderPdfContext = {}): Blob {
  const name = resolveName(ctx)
  const idea = (ctx.idea || "").trim()
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text("LaunchLens \u00b7 Early Founder", PAGE_W / 2, 55, { align: "center" })
  doc.setFontSize(22)
  doc.setTextColor(20)
  doc.text("Launch Your Startup in 20 Days", PAGE_W / 2, 75, {
    align: "center",
  })
  doc.setFontSize(12)
  doc.setTextColor(80)
  doc.text(`for ${name}`, PAGE_W / 2, 90, { align: "center" })
  if (idea) {
    const lines = doc.splitTextToSize(idea.slice(0, 200), CONTENT_W * 0.85)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(lines, PAGE_W / 2, 110, { align: "center" })
  } else {
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("Personalized to your project after validation.", PAGE_W / 2, 110, {
      align: "center",
    })
  }

  doc.addPage()
  let y = MARGIN
  const ideaSnippet = (idea || name).slice(0, 120)

  for (let i = 0; i < DAYS.length; i++) {
    const [title, objective] = DAYS[i]
    const blockH = 52
    y = ensureSpace(doc, y, blockH)

    doc.setDrawColor(210)
    doc.setFillColor(250, 250, 252)
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, blockH - 4, 2, 2, "FD")

    doc.setFontSize(8)
    doc.setTextColor(120)
    doc.text(`Day ${i + 1} \u00b7 ${name}`, MARGIN + 4, y + 2)

    doc.setFontSize(12)
    doc.setTextColor(20)
    doc.text(title, MARGIN + 4, y + 10)

    doc.setFontSize(9)
    doc.setTextColor(50)
    doc.text(`Objective: ${objective}`, MARGIN + 4, y + 17)
    doc.text("Time: 60\u201390 minutes", MARGIN + 4, y + 23)

    doc.text("Checklist:", MARGIN + 4, y + 30)
    doc.text(
      "\u2610 Complete the objective   \u2610 Capture one insight   \u2610 Plan tomorrow\u2019s first 15 min",
      MARGIN + 4,
      y + 35
    )

    const prompt = `AI prompt: \u201cGiven my idea (${ideaSnippet}), challenge my assumptions on: ${title}.\u201d`
    const promptLines = doc.splitTextToSize(prompt, CONTENT_W - 8)
    doc.setTextColor(80)
    doc.text(promptLines, MARGIN + 4, y + 42)

    y += blockH + 2
  }

  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(120)
    doc.text(
      `LaunchLens \u00b7 20-Day Builder Program \u00b7 ${name}`,
      MARGIN,
      PAGE_H - 8
    )
    doc.text(String(i), PAGE_W - MARGIN, PAGE_H - 8, { align: "right" })
  }

  return doc.output("blob")
}
