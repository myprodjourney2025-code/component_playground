import { CopyLinkButton } from "./copy-link-button";

/** Share on LinkedIn or X, or copy the link. Plain links: no third-party scripts, no tracking. */
export function ShareLinks({ url, text }: { url: string; text: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  const linkClass =
    "rounded-md border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-foreground/5";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted">Share</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        X
      </a>
      <CopyLinkButton url={url} className={linkClass} />
    </div>
  );
}
