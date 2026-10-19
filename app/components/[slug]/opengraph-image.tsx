import { notFound } from "next/navigation";
import { OG_SIZE, OG_TYPE, ogComponentImage, ogImage } from "@/lib/og";
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

  const preview = ogPreview(item.slug);
  const eyebrow = `${CATEGORIES[item.category]} · ${SITE.shortName}`;

  if (preview) return ogComponentImage({ eyebrow, preview });
  return ogImage({ eyebrow, title: item.title, subtitle: item.description });
}
