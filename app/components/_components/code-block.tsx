import { cn } from "@/lib/cn";
import { CopyButton } from "./copy-button";

/** A titled, scrollable code window with a one-click copy of the whole text. */
export function CodeBlock({
  code,
  title,
  className,
}: {
  code: string;
  title: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "m-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-950",
        className,
      )}
    >
      <figcaption className="flex items-center justify-between border-b border-white/10 py-1.5 pl-4 pr-2">
        <span className="font-mono text-xs text-zinc-400">{title}</span>
        <CopyButton text={code} label={`Copy ${title}`} />
      </figcaption>
      {/* Focusable so keyboard users can scroll long code with the arrow keys. */}
      <pre
        tabIndex={0}
        role="region"
        aria-label={`${title} source code`}
        className="max-h-[28rem] overflow-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-100 outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-violet-400"
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
