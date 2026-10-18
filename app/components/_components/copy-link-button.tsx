"use client";

import { useEffect, useState } from "react";

export function CopyLinkButton({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; stay silent.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy link to this page"
      className={className}
    >
      <span aria-live="polite">{copied ? "Link copied ✓" : "Copy link"}</span>
    </button>
  );
}
