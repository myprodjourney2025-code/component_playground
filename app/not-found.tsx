import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, galleryComponents } from "@/registry";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-16">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-3 max-w-md text-muted">
          The link may be old or mistyped. Here is what is available:
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {galleryComponents.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/components/${item.slug}`}
                className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-foreground/40"
              >
                <span className="text-xs uppercase tracking-wider text-muted">
                  {CATEGORIES[item.category]}
                </span>
                <span className="mt-1 block font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/components"
          className="mt-8 w-fit rounded-md bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90"
        >
          Browse all components
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
