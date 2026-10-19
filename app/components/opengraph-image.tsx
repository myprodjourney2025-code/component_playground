import { OG_SIZE, OG_TYPE, ogGalleryCard, ogImage } from "@/lib/og";
import { ogPreview } from "@/lib/og-previews";
import { SITE } from "@/lib/site";
import { CATEGORIES, galleryComponents } from "@/registry";

export const alt = SITE.name;
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  const items = galleryComponents
    .filter((c) => ogPreview(c.slug))
    .map((c) => ({ slug: c.slug, category: CATEGORIES[c.category], title: c.title }));

  if (items.length === 0) {
    return ogImage({
      eyebrow: SITE.author.name,
      title: "Copy-paste React components with motion",
      subtitle: "Loaders, switches and more. Open, copy, ship.",
    });
  }
  return ogGalleryCard(items);
}
