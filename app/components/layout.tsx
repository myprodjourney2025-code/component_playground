import Link from "next/link";
import { isProduction } from "@/lib/env";

export default function ComponentsLayout({
  children,
}: LayoutProps<"/components">) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 text-sm">
          <Link href="/components" className="font-semibold tracking-tight">
            Components
          </Link>
          <div className="flex gap-4 text-muted">
            {!isProduction && (
              <Link href="/playground" className="hover:text-foreground">
                Playground
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">{children}</main>
    </div>
  );
}
