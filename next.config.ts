import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    // Default Server Action limit is 1MB — gallery uploads need more.
    serverActions: {
      bodySizeLimit: "15mb",
    },
    // Proxy buffers admin POSTs; default 10MB truncates larger images.
    proxyClientMaxBodySize: "15mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
