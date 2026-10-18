import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SITE, absoluteUrl } from "@/lib/site";
import { CATEGORIES, galleryComponents } from "@/registry";
import { JsonLd } from "../_components/json-ld";
import { ShareLinks } from "./_components/share-links";
import { CardPreviewSkeleton } from "./_components/skeletons";

export const metadata: Metadata = {
  title: "Free copy-paste React components with motion",
  description: SITE.description,
  alternates: { canonical: "/components" },
  openGraph: { url: "/components", title: SITE.name, description: SITE.description },
};

export default function ComponentsIndex() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE.name,
              url: absoluteUrl("/components"),
              description: SITE.description,
              inLanguage: "en",
              author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
            },
            {
              "@type": "ItemList",
              name: "Components",
              itemListElement: galleryComponents.map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: c.title,
                url: absoluteUrl(`/components/${c.slug}`),
              })),
            },
          ],
        }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">
        Free copy-paste React components
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        Animated components you can use in any React project. Pick one,
        preview its variants, copy the code. MIT licensed, no sign-up.
      </p>
      <div className="mt-4">
        <ShareLinks
          url={absoluteUrl("/components")}
          text="Free copy-paste React components with motion"
        />
      </div>

      {galleryComponents.length === 0 && (
        <p className="mt-10 rounded-xl border border-dashed border-border p-8 text-muted">
          Nothing published yet. Add a <code>gallery</code> config to an
          experiment&apos;s <code>meta.ts</code>.
        </p>
      )}

      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {galleryComponents.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/components/${item.slug}`}
              className="group block h-full overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-foreground/40"
            >
              <Suspense fallback={<CardPreviewSkeleton />}>
                <CardPreview load={item.gallery?.examples[0]?.load} />
              </Suspense>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-muted">
                  {CATEGORIES[item.category]}
                </p>
                <h2 className="mt-1 font-medium">{item.title}</h2>
                {item.description && (
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Live preview of a component's first example, as the card header. */
async function CardPreview({
  load,
}: {
  load?: () => Promise<{ default: React.ComponentType }>;
}) {
  if (!load) return null;
  const { default: Example } = await load();

  return (
    // Decorative: `inert` makes it unclickable and unfocusable (no button or
    // status role nested inside the link) and hides it from assistive tech.
    <div
      inert
      className="flex h-72 items-center justify-center overflow-hidden border-b border-border bg-white text-zinc-900"
    >
      <Example />
    </div>
  );
}
