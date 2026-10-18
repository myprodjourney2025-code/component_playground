import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Everything public is open to search engines and AI crawlers alike
// (GPTBot, ClaudeBot, PerplexityBot...): being quotable is the goal.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
