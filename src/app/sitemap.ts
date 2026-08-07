import type { MetadataRoute } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://launchlens.ai"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/auth/login",
    "/auth/signup",
    "/validate",
    "/workshop",
    "/dashboard",
    "/guides/starter",
    "/guides/dos-donts",
    "/privacy",
    "/terms",
    "/cookies",
    "/acceptable-use",
    "/ai-disclaimer",
    "/contact",
  ]

  return routes.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/privacy") || path.startsWith("/terms") ? 0.4 : 0.7,
  }))
}
