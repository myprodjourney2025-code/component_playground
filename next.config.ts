import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // The gallery reads component source from disk at request time; make sure
  // those files ship with the serverless output.
  outputFileTracingIncludes: {
    "/components/*": ["./experiments/**/*.tsx"],
    "/llms-full.txt": ["./experiments/**/*.tsx"],
  },
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
