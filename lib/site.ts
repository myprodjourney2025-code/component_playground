/** Single source of truth for site-wide identity. Used by metadata, sitemap, JSON-LD and llms.txt. */
export const SITE = {
  name: "Samiran Setua · Components",
  shortName: "Components",
  url: "https://components.samiransetua.in",
  description:
    "Free, copy-paste React components with motion: loaders, switches and more. Open the page, copy the code, ship it. Built with Next.js, Tailwind CSS and Motion.",
  repo: "https://github.com/myprodjourney2025-code/component_playground",
  author: { name: "Samiran Setua", url: "https://samiransetua.in" },
  /** Public contact for questions and takedown requests. */
  contactEmail: "samiransetua26@gmail.com",
  license: "MIT",
  licenseUrl: "https://opensource.org/license/mit",
  keywords: [
    "React components",
    "copy paste components",
    "animated components",
    "Motion",
    "Tailwind CSS",
    "Next.js",
    "UI components",
    "loader",
    "toggle switch",
  ],
} as const;

/** Absolute URL for a path on this site. */
export const absoluteUrl = (path = "/") => new URL(path, SITE.url).toString();
