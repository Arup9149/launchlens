/**
 * LaunchLens transactional email design tokens.
 * All templates should compose through renderEmailShell() for brand consistency.
 */

export const EMAIL_BRAND = {
  productName: "LaunchLens",
  tagline: "See Opportunities. Build What Matters.",
  /** Displayed in HTML mark; real From is always from env via getEmailConfig(). */
  teamLabel: "Team LaunchLens",
  colors: {
    pageBg: "#0a0a0b",
    cardBg: "#111113",
    border: "rgba(255,255,255,0.08)",
    borderSubtle: "rgba(255,255,255,0.06)",
    text: "#d4d4d8",
    textStrong: "#fafafa",
    textMuted: "#a1a1aa",
    textFaint: "#71717a",
    accent: "#60a5fa",
    markFrom: "#3b82f6",
    markMid: "#2563eb",
    markTo: "#1d4ed8",
  },
  fontStack:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  maxWidth: 560,
} as const

export type EmailShellContent = {
  /** Hidden preheader for inbox preview */
  preheader: string
  /** Main body HTML (inner content only) */
  bodyHtml: string
  /** Footer note under signature */
  footerNote?: string
}

/**
 * Shared responsive shell: mark, wordmark, tagline, card, footer.
 */
export function renderEmailShell(content: EmailShellContent): string {
  const c = EMAIL_BRAND.colors
  const footer =
    content.footerNote ||
    "You're receiving this because you interacted with LaunchLens."

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${EMAIL_BRAND.productName}</title>
  <!--[if mso]><style>body,table,td{font-family:Arial,Helvetica,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${c.pageBg};color:${c.text};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeEmailHtml(content.preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${c.pageBg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:${EMAIL_BRAND.maxWidth}px;background-color:${c.cardBg};border:1px solid ${c.border};border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:36px 32px 24px;text-align:center;border-bottom:1px solid ${c.borderSubtle};">
              <div style="display:inline-block;width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,${c.markFrom},${c.markMid},${c.markTo});line-height:40px;text-align:center;margin-bottom:12px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 8px rgba(255,255,255,0.8);vertical-align:middle;"></span>
              </div>
              <div style="font-family:${EMAIL_BRAND.fontStack};font-size:18px;font-weight:500;letter-spacing:-0.02em;color:#ffffff;">
                Launch<span style="color:#3b82f6;">Lens</span>
              </div>
              <div style="font-family:${EMAIL_BRAND.fontStack};font-size:12px;letter-spacing:0.04em;color:${c.textMuted};margin-top:6px;">
                ${escapeEmailHtml(EMAIL_BRAND.tagline)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;font-family:${EMAIL_BRAND.fontStack};font-size:15px;line-height:1.65;color:${c.text};">
              ${content.bodyHtml}
              <p style="margin:24px 0 0;color:${c.textMuted};font-size:13px;">
                —<br/>
                ${escapeEmailHtml(EMAIL_BRAND.teamLabel)}<br/>
                <span style="color:${c.textFaint};">${escapeEmailHtml(EMAIL_BRAND.tagline)}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;font-family:${EMAIL_BRAND.fontStack};font-size:12px;line-height:1.5;color:${c.textFaint};border-top:1px solid ${c.borderSubtle};">
              ${escapeEmailHtml(footer)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function escapeEmailHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
