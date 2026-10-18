import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Legacy route, replaced by /components. Remove together with app/gallery.
  async redirects() {
    return [
      { source: "/gallery", destination: "/components", permanent: false },
      { source: "/gallery/:slug", destination: "/components/:slug", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
