import {
  EMAIL_BRAND,
  escapeEmailHtml,
  renderEmailShell,
} from "../brand"
import { resolveUserGreetingName } from "../personalize"
import type { WaitlistWelcomeContext } from "../types"

export type RenderedEmail = {
  subject: string
  preheader: string
  html: string
  text: string
}

export function renderWaitlistWelcome(
  ctx: WaitlistWelcomeContext
): RenderedEmail {
  const userName = resolveUserGreetingName({
    displayName: ctx.name,
    signupName: ctx.name,
    email: ctx.email,
  })

  const subject = "🚀 Welcome to LaunchLens Early Access"
  const preheader = "You're officially on the LaunchLens Early Access list."
  const tagline = EMAIL_BRAND.tagline

  const text = [
    `Hi ${userName},`,
    "",
    "Thank you for joining LaunchLens Early Access.",
    "You're officially on the list.",
    "",
    "Here's what you can expect:",
    "• Early Founder access",
    "• New AI capabilities",
    "• Product improvements",
    "• Founder pricing announcements",
    "• Important LaunchLens updates",
    "",
    "We'll notify you before every major milestone.",
    "",
    "Our mission is simple.",
    tagline,
    "",
    "We're excited to help founders validate ideas, reduce risk and build with confidence.",
    "",
    "Thank you for joining LaunchLens.",
    "",
    "—",
    EMAIL_BRAND.teamLabel,
    tagline,
    "",
    "Questions? Simply reply to this email.",
  ].join("\n")

  const bodyHtml = `
              <p style="margin:0 0 16px;font-size:16px;color:${EMAIL_BRAND.colors.textStrong};">Hi ${escapeEmailHtml(userName)},</p>
              <p style="margin:0 0 12px;">Thank you for joining LaunchLens Early Access.</p>
              <p style="margin:0 0 20px;">You're officially on the list.</p>
              <p style="margin:0 0 8px;color:${EMAIL_BRAND.colors.textMuted};font-size:13px;text-transform:uppercase;letter-spacing:0.08em;">What to expect</p>
              <ul style="margin:0 0 24px;padding:0 0 0 18px;color:${EMAIL_BRAND.colors.text};">
                <li style="margin-bottom:6px;">Early Founder access</li>
                <li style="margin-bottom:6px;">New AI capabilities</li>
                <li style="margin-bottom:6px;">Product improvements</li>
                <li style="margin-bottom:6px;">Founder pricing announcements</li>
                <li style="margin-bottom:6px;">Important LaunchLens updates</li>
              </ul>
              <p style="margin:0 0 12px;">We'll notify you before every major milestone.</p>
              <p style="margin:0 0 4px;">Our mission is simple.</p>
              <p style="margin:0 0 20px;color:${EMAIL_BRAND.colors.accent};font-weight:500;">${escapeEmailHtml(tagline)}</p>
              <p style="margin:0 0 20px;">We're excited to help founders validate ideas, reduce risk and build with confidence.</p>
              <p style="margin:0 0 8px;">Thank you for joining LaunchLens.</p>
              <p style="margin:16px 0 0;font-size:13px;color:${EMAIL_BRAND.colors.textMuted};">Questions? Simply reply to this email.</p>
`

  const html = renderEmailShell({
    preheader,
    bodyHtml,
    footerNote:
      "You're receiving this because you joined the LaunchLens Early Access waitlist.",
  })

  return { subject, preheader, html, text }
}
