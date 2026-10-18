import { readGallerySource } from "@/lib/gallery/read-source";
import { SITE, absoluteUrl } from "@/lib/site";
import { galleryComponents } from "@/registry";

// llms-full.txt: every component's complete source and props in one markdown file.
export async function GET() {
  const sections = await Promise.all(
    galleryComponents.map(async (item) => {
      if (!item.gallery) return "";
      const { gallery } = item;
      const source = await readGallerySource({ ...item, gallery });
      const props = (gallery.props ?? [])
        .map(
          (p) =>
            `- \`${p.name}\` (\`${p.type}\`${p.default ? `, default ${p.default}` : ""}): ${p.description}`,
        )
        .join("\n");
      const install = gallery.dependencies?.length
        ? `Install: \`npm install ${gallery.dependencies.join(" ")}\`\n\n`
        : "";
      return [
        `## ${item.title}`,
        "",
        `${item.description ?? ""}`,
        `Page: ${absoluteUrl(`/components/${item.slug}`)}`,
        "",
        install +
          `Save as \`${gallery.importPath.replace(/^@\//, "")}.tsx\`:`,
        "",
        "```tsx",
        source.component.trimEnd(),
        "```",
        "",
        props && `### Props\n\n${props}\n`,
      ].join("\n");
    }),
  );

  const body = [
    `# ${SITE.name}: full source`,
    "",
    `> ${SITE.description}`,
    `> Licensed ${SITE.license}.`,
    "",
    ...sections,
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
