import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-6 text-sm text-muted">
        <p>
          © 2026 {SITE.author.name}. Free to use
          under the {SITE.license} license.
        </p>
        <nav aria-label="Footer" className="flex gap-4">
          <Link href="/license" className="hover:text-foreground">
            License
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="hover:text-foreground"
          >
            Contact
          </a>
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
