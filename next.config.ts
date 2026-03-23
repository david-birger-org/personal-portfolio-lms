import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import {
  getPostHogAssetHost,
  getPostHogHost,
  isPostHogEnabled,
} from "./src/lib/posthog-config";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const posthogEnabled = isPostHogEnabled();
const posthogAssetHost = getPostHogAssetHost();
const posthogHost = getPostHogHost();

const nextConfig: NextConfig = {
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    if (!posthogEnabled) {
      return [];
    }

    return [
      {
        source: "/ingest/static/:path*",
        destination: `${posthogAssetHost}/static/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `${posthogHost}/:path*`,
      },
    ];
  },
  allowedDevOrigins: ["192.168.8.186"],
  headers: async () => [
    {
      // Cache static assets (fonts, images, svgs) aggressively
      source: "/:path*.(otf|woff2|woff|ttf|svg|jpg|jpeg|png|webp|ico)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default withNextIntl(nextConfig);
