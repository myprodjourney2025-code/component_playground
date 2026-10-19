import { notFound } from "next/navigation";
import { OG_SIZE, OG_TYPE, ogComponentCard, ogImage } from "@/lib/og";
import { ogPreview } from "@/lib/og-previews";
import { SITE } from "@/lib/site";
import { CATEGORIES, galleryComponents } from "@/registry";

export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return galleryComponents.map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = galleryComponents.find((e) => e.slug === slug);
  if (!item) notFound();

  if (ogPreview(item.slug)) {
    return ogComponentCard({
      slug: item.slug,
      category: CATEGORIES[item.category],
      title: item.title,
      description: item.description,
    });
  }

  return ogImage({
    eyebrow: `${CATEGORIES[item.category]} · ${SITE.shortName}`,
    title: item.title,
    subtitle: item.description,
  });
}
