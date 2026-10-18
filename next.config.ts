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
  // The playground is a dev-only workbench: send production visitors to the gallery.
  async redirects() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      { source: "/playground", destination: "/components", permanent: false },
      { source: "/playground/:path*", destination: "/components", permanent: false },
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
