import { CATEGORIES, galleryComponents } from "@/registry";
import { SITE, absoluteUrl } from "@/lib/site";

// llms.txt: a plain-markdown map of the site for AI assistants and answer engines.
export function GET() {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `Every component is MIT licensed. Copy the code from its page into your project; there is no package to install except the listed dependencies.`,
    "",
    "## Components",
    "",
    ...galleryComponents.map(
      (c) =>
        `- [${c.title}](${absoluteUrl(`/components/${c.slug}`)}): ${CATEGORIES[c.category]}. ${c.description ?? ""}`.trim(),
    ),
    "",
    "## Optional",
    "",
    `- [Full source of every component](${absoluteUrl("/llms-full.txt")})`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    `- [License](${absoluteUrl("/license")})`,
    `- [Source repository](${SITE.repo})`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
