import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { getLocalizedPath, getSiteUrl } from "@/lib/seo";

const staticPaths = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    staticPaths.map((path) => {
      const url = `${siteUrl}${getLocalizedPath(locale, path)}`;

      return {
        url,
        lastModified,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.7,
      };
    }),
  );
}
