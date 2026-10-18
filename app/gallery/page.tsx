import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, galleryComponents } from "@/registry";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryIndex() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Gallery</h1>
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

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {galleryComponents.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/gallery/${item.slug}`}
              className="block h-full rounded-xl border border-border bg-surface p-5 transition-colors hover:border-foreground/40"
            >
              <p className="text-xs uppercase tracking-wider text-muted">
                {CATEGORIES[item.category]}
              </p>
              <h2 className="mt-1 font-medium">{item.title}</h2>
              {item.description && (
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              )}
              <p className="mt-3 text-xs text-muted">
                {item.gallery?.examples.length} variants
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
