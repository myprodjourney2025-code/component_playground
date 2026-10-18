import { cn } from "@/lib/cn";

/** A pulsing placeholder block. Decorative; the pulse stops under reduced motion. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-foreground/10 motion-reduce:animate-none",
        className,
      )}
    />
  );
}

/** Same footprint as the live preview in a gallery card (h-72). */
export function CardPreviewSkeleton() {
  return <Skeleton className="h-72 rounded-none border-b border-border" />;
}

/** Mirrors the component page: header, preview window, install steps. */
export function ComponentPageSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-12">
      <span className="sr-only">Loading component</span>

      <div className="space-y-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-7 w-56" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Skeleton className="h-12 rounded-none" />
        <Skeleton className="h-72 rounded-none" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
