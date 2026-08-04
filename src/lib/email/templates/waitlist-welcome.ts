import { resolveUserGreetingName } from "../personalize"
import type { WaitlistWelcomeContext } from "../types"

export type RenderedEmail = {
  subject: string
  preheader: string
  html: string
  text: string
}

const TAGLINE = "Know before you build."

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
    TAGLINE,
    "",
    "We're excited to help founders validate ideas, reduce risk and build with confidence.",
    "",
    "Thank you for joining LaunchLens.",
    "",
    "—",
    "Team LaunchLens",
    TAGLINE,
    "",
    "Questions? Simply reply to this email.",
  ].join("\n")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]><style>body,table,td{font-family:Arial,Helvetica,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0a0a0b;color:#e4e4e7;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0b;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#111113;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:36px 32px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="display:inline-block;width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#a78bfa,#7c3aed,#a21caf);line-height:40px;text-align:center;margin-bottom:12px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 8px rgba(255,255,255,0.8);vertical-align:middle;"></span>
              </div>
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:18px;font-weight:500;letter-spacing:-0.02em;color:#ffffff;">
                Launch<span style="color:#c4b5fd;">Lens</span>
              </div>
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.04em;color:#a1a1aa;margin-top:6px;">
                ${escapeHtml(TAGLINE)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#d4d4d8;">
              <p style="margin:0 0 16px;font-size:16px;color:#fafafa;">Hi ${escapeHtml(userName)},</p>
              <p style="margin:0 0 12px;">Thank you for joining LaunchLens Early Access.</p>
              <p style="margin:0 0 20px;">You're officially on the list.</p>
              <p style="margin:0 0 8px;color:#a1a1aa;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;">What to expect</p>
              <ul style="margin:0 0 24px;padding:0 0 0 18px;color:#d4d4d8;">
                <li style="margin-bottom:6px;">Early Founder access</li>
                <li style="margin-bottom:6px;">New AI capabilities</li>
                <li style="margin-bottom:6px;">Product improvements</li>
                <li style="margin-bottom:6px;">Founder pricing announcements</li>
                <li style="margin-bottom:6px;">Important LaunchLens updates</li>
              </ul>
              <p style="margin:0 0 12px;">We'll notify you before every major milestone.</p>
              <p style="margin:0 0 4px;">Our mission is simple.</p>
              <p style="margin:0 0 20px;color:#c4b5fd;font-weight:500;">${escapeHtml(TAGLINE)}</p>
              <p style="margin:0 0 20px;">We're excited to help founders validate ideas, reduce risk and build with confidence.</p>
              <p style="margin:0 0 8px;">Thank you for joining LaunchLens.</p>
              <p style="margin:24px 0 0;color:#a1a1aa;font-size:13px;">
                —<br/>
                Team LaunchLens<br/>
                <span style="color:#71717a;">${escapeHtml(TAGLINE)}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#71717a;border-top:1px solid rgba(255,255,255,0.06);">
              Questions? Simply reply to this email.<br/>
              You're receiving this because you joined the LaunchLens Early Access waitlist.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, preheader, html, text }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
