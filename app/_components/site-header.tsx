import Link from "next/link";
import { ThemeSwitch } from "@/experiments/switches/theme-switch/component";
import { isProduction } from "@/lib/env";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 text-sm"
      >
        <Link href="/components" className="font-semibold tracking-tight">
          {SITE.shortName}
        </Link>
        <div className="flex items-center gap-4 text-muted">
          {!isProduction && (
            <Link href="/playground" className="hover:text-foreground">
              Playground
            </Link>
          )}
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-foreground transition-colors hover:bg-foreground/5"
          >
            <StarIcon />
            <span>Star on GitHub</span>
          </a>
          <ThemeSwitch />
        </div>
      </nav>
    </header>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-4 fill-amber-400"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}
