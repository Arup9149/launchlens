import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "LaunchLens",
  description: "Validate → Polish → Expand → Architect",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased min-h-screen text-zinc-100 bg-[#05050a]`}
      >
        {/* Fixed atmosphere — always visible */}
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

        {children}
      </body>
    </html>
  )
}