"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CodeBlock } from "./code-block";

export type Variant = {
  name: string;
  /** Source of this variant's example, shown under the preview. */
  code: string;
  fileName: string;
  /** Pre-rendered live preview. */
  preview: ReactNode;
};

/** One window: variant tabs, live preview, and that variant's code. */
export function VariantViewer({ variants }: { variants: Variant[] }) {
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const variant = variants[active] ?? variants[0];

  if (!variant) return null;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-2">
          <div role="tablist" aria-label="Variants" className="flex overflow-x-auto">
            {variants.map((v, i) => (
              <button
                key={v.name}
                role="tab"
                type="button"
                id={`variant-tab-${i}`}
                aria-selected={i === active}
                aria-controls="variant-panel"
                onClick={() => setActive(i)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors",
                  i === active
                    ? "border-foreground font-medium"
                    : "border-transparent text-muted hover:text-foreground",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs transition-colors hover:bg-foreground/5"
          >
            ↻ Replay
          </button>
        </div>

        <div
          role="tabpanel"
          id="variant-panel"
          aria-labelledby={`variant-tab-${active}`}
          className="flex min-h-80 items-center justify-center bg-white p-8 text-zinc-900"
        >
          <div key={`${active}-${run}`}>{variant.preview}</div>
        </div>
      </div>

      <CodeBlock code={variant.code} title={variant.fileName} />
    </div>
  );
}
