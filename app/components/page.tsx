import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CATEGORIES, galleryComponents } from "@/registry";

export const metadata: Metadata = { title: "Components" };

export default function ComponentsIndex() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
      <p className="mt-2 max-w-xl text-muted">
        Copy-paste components. Pick one, preview its variants, then copy the
        code into your project.
      </p>

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
              <Suspense fallback={<div className="h-72 border-b border-border" />}>
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
