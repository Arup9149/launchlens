import type { MetadataRoute } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://launchlens.ai"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/signout"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
