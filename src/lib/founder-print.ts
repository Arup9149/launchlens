/**
 * Client-side print-to-PDF workbooks (no extra dependencies).
 * Opens a print-optimized window; user chooses "Save as PDF".
 */

export type FounderPrintContext = {
  startupName?: string | null
  idea?: string | null
  founderName?: string | null
}

function esc(s: string) {
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """)
}

function openPrintWindow(title: string, bodyHtml: string) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=700")
  if (!w) {
    alert("Allow pop-ups to download the Founder workbook (Print → Save as PDF).")
    return
  }
  w.document.write(`<!DOCTYPE html><html><head><meta charset=\"utf-8\"/>
<title>${esc(title)}</title>
<style>
  @page { margin: 18mm; }
  body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; color: #111; line-height: 1.55; font-size: 12.5px; }
  h1 { font-size: 22px; margin: 0 0 6px; }
  h2 { font-size: 15px; margin: 22px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  h3 { font-size: 13px; margin: 14px 0 6px; }
  .muted { color: #555; }
  .cover { text-align: center; padding: 48px 12px 36px; page-break-after: always; }
  .day, .section { page-break-inside: avoid; margin-bottom: 16px; }
  ul { margin: 6px 0 10px 18px; }
  li { margin-bottom: 4px; }
  .box { border: 1px solid #ccc; border-radius: 8px; padding: 10px 12px; margin: 8px 0; }
  .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; }
  footer { margin-top: 28px; font-size: 11px; color: #777; }
</style></head><body>${bodyHtml}
<script>window.onload=function(){setTimeout(function(){window.print()},250)}</script>
</body></html>`)
  w.document.close()
}

function resolveName(ctx: FounderPrintContext) {
  const n = (ctx.startupName || "").trim()
  if (n) return n
  const idea = (ctx.idea || "").trim()
  if (idea) return idea.slice(0, 72) + (idea.length > 72 ? "…" : "")
  return "Your Startup"
}

export function printFounderPlaybook(ctx: FounderPrintContext = {}) {
  const name = resolveName(ctx)
  const idea = (ctx.idea || "").trim()
  const body = `
<div class="cover">
  <p class="label">LaunchLens · Early Founder</p>
  <h1>Founder Playbook</h1>
  <p class="muted">for <strong>${esc(name)}</strong></p>
  <p class="muted" style="margin-top:24px">Know before you build.</p>
</div>
<div class="section">
  <h2>1. Your idea (as captured)</h2>
  <div class="box">${esc(idea || "Add your idea on Validate, then re-download for a fully personalized playbook.")}</div>
</div>
<div class="section">
  <h2>2. Validation checklist</h2>
  <ul>
    <li>Write the problem in one sentence a stranger understands.</li>
    <li>Name 10 ideal users and how you will reach them this week.</li>
    <li>List 5 current workarounds (including “do nothing”).</li>
    <li>Message 5 people; log replies, not opinions.</li>
    <li>Test willingness to pay with a concrete offer.</li>
    <li>Decide Go / Pivot / Kill with a date on the calendar.</li>
  </ul>
</div>
<div class="section">
  <h2>3. ICP snapshot for ${esc(name)}</h2>
  <div class="box">
    <p><strong>Who hurts most?</strong> ________________________________</p>
    <p><strong>Where do they already complain?</strong> ____________________</p>
    <p><strong>What do they pay today?</strong> ____________________________</p>
  </div>
</div>
<div class="section">
  <h2>4. Wedge & MVP</h2>
  <ul>
    <li>One wedge outcome in under 10 minutes of product use.</li>
    <li>Ship the smallest path that proves that outcome.</li>
    <li>Cut every feature that does not serve the wedge.</li>
  </ul>
</div>
<div class="section">
  <h2>5. Pricing probes</h2>
  <ul>
    <li>Anchor: what would make this a no-brainer monthly?</li>
    <li>Ask for a pre-order, deposit, or LOI — not “would you use this?”</li>
  </ul>
</div>
<div class="section">
  <h2>6. Weekly founder system</h2>
  <ul>
    <li>Mon: outreach + interviews</li>
    <li>Tue–Thu: build only what interviews forced</li>
    <li>Fri: review metrics; decide keep / cut / change</li>
  </ul>
</div>
<footer>LaunchLens · Personalized Founder Playbook · ${esc(name)}</footer>`
  openPrintWindow(`Founder Playbook — ${name}`, body)
}

export function printBuilderProgram(ctx: FounderPrintContext = {}) {
  const name = resolveName(ctx)
  const idea = (ctx.idea || "").trim()
  const days = [
    ["Clarify the problem", "Write a one-sentence problem for your idea; share with one outsider."],
    ["Map the ICP", "List 10 real people or roles who feel this pain weekly."],
    ["Competition notes", "Capture 5 alternatives including spreadsheets and status quo."],
    ["Interview script", "Draft 6 open questions; no pitch until minute 15."],
    ["First 5 conversations", "Run outreach; log quotes and objections."],
    ["Willingness to pay", "Offer a concrete price or pilot; record yes/no/maybe."],
    ["Wedge definition", "Pick one outcome you can deliver in under 2 weeks."],
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

  const dayBlocks = days
    .map(
      ([title, objective], i) => `
<div class="day box">
  <p class="label">Day ${i + 1} · ${esc(name)}</p>
  <h3>${esc(title)}</h3>
  <p><strong>Objective:</strong> ${esc(objective)}</p>
  <p><strong>Time:</strong> 60–90 minutes</p>
  <p><strong>Checklist:</strong></p>
  <ul>
    <li>☐ Complete the objective for your project</li>
    <li>☐ Capture one insight in writing</li>
    <li>☐ Define tomorrow’s first 15 minutes</li>
  </ul>
  <p><strong>Deliverable:</strong> One artifact (note, screen, message log, or decision).</p>
  <p><strong>AI prompts:</strong> “Given my idea (${esc((idea || name).slice(0, 120))}), challenge my assumptions on: ${esc(title)}.”</p>
  <p><strong>Builder notes:</strong> _______________________________________________</p>
  <p><strong>Reflection:</strong> What changed my mind today? ____________________</p>
  <p><strong>Progress:</strong> ☐ Not started  ☐ In progress  ☐ Done</p>
</div>`
    )
    .join("")

  const body = `
<div class="cover">
  <p class="label">LaunchLens · Early Founder</p>
  <h1>Launch Your Startup in 20 Days</h1>
  <p class="muted">for <strong>${esc(name)}</strong></p>
  <p class="muted" style="margin-top:16px">${esc(idea ? idea.slice(0, 200) : "Personalized to your project after validation.")}</p>
</div>
${dayBlocks}
<footer>LaunchLens · 20-Day Builder Program · ${esc(name)}</footer>`
  openPrintWindow(`Launch in 20 Days — ${name}`, body)
}
