"use client";

import { useState, type ReactNode } from "react";
import { ThemeSwitch } from "@/experiments/switches/theme-switch/component";
import { cn } from "@/lib/cn";
import type { StageLayout } from "@/registry/types";

/**
 * The stage every experiment is rendered on.
 * Toolbar: site theme toggle, replay (remounts the demo).
 */
export function Canvas({
  children,
  layout = "card",
  title,
}: {
  children: ReactNode;
  layout?: StageLayout;
  title?: string;
}) {
  const [run, setRun] = useState(0);

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col",
        "bg-zinc-200 dark:bg-zinc-900",
      )}
    >
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-black/10 bg-background/80 px-4 text-sm backdrop-blur dark:border-white/10">
        <span className="font-medium text-foreground">{title}</span>
        <div className="flex gap-2">
          <ToolbarButton onClick={() => setRun((n) => n + 1)}>
            ↻ Replay
          </ToolbarButton>
          <ThemeSwitch />
        </div>
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-auto",
          layout === "card" && "flex items-center justify-center p-6",
        )}
      >
        {layout === "card" ? (
          <div
            key={run}
            className="flex h-96 w-96 items-center justify-center rounded-xl bg-white shadow-xl dark:bg-zinc-800"
          >
            {children}
          </div>
        ) : (
          <div
            key={run}
            className="min-h-full bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolbarButton(props: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className="rounded-md border border-border px-2.5 py-1 text-foreground transition-colors hover:bg-foreground/5"
      {...props}
    />
  );
}
