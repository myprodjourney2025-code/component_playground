import type { MetadataRoute } from "next";
import { galleryComponents } from "@/registry";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const newest = galleryComponents[0]?.createdAt;
  return [
    {
      url: absoluteUrl("/components"),
      lastModified: newest ? new Date(newest) : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...galleryComponents.map((item) => ({
      url: absoluteUrl(`/components/${item.slug}`),
      lastModified: new Date(item.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/license"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
