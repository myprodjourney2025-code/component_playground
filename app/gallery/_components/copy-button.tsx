"use client";

import { useEffect, useState } from "react";

export function CopyButton({
  text,
  label = "Copy code",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); stay silent.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className="rounded-md border border-white/15 px-2.5 py-1 text-xs text-zinc-200 transition-colors hover:bg-white/10"
    >
      <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
    </button>
  );
}
