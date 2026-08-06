import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://launchlens.ai"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LaunchLens — See Opportunities. Build What Matters.",
    template: "%s · LaunchLens",
  },
  description:
    "Validate startup ideas with AI, then polish, expand, and architect your MVP in one founder workspace.",
  applicationName: "LaunchLens",
  keywords: [
    "startup validation",
    "idea validation",
    "founder tools",
    "MVP architecture",
    "LaunchLens",
  ],
  authors: [{ name: "LaunchLens" }],
  creator: "LaunchLens",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "LaunchLens",
    title: "LaunchLens — See Opportunities. Build What Matters.",
    description:
      "Validate → Polish → Expand → Architect. AI-powered founder workspace for early-stage builders.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchLens — See Opportunities. Build What Matters.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchLens — See Opportunities. Build What Matters.",
    description:
      "Validate startup ideas with AI, then polish, expand, and architect your MVP.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05050a" },
    { media: "(prefers-color-scheme: light)", color: "#05050a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen text-zinc-100 bg-[#05050a] overflow-x-hidden`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 100% 70% at 50% -30%, rgba(139, 92, 246, 0.55), transparent 55%),
              radial-gradient(ellipse 70% 50% at 100% 10%, rgba(217, 70, 239, 0.25), transparent 50%),
              radial-gradient(ellipse 60% 45% at 0% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
              radial-gradient(ellipse 50% 40% at 90% 90%, rgba(124, 58, 237, 0.18), transparent 55%),
              linear-gradient(180deg, #12101c 0%, #0a0912 35%, #07070b 70%, #050508 100%)
            `,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 70%)",
          }}
        />

        <div id="main-content">{children}</div>
      </body>
    </html>
  )
}
