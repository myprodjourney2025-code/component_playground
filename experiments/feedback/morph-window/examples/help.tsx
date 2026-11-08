import { MorphWindow } from "../component";

const FAQ = [
  {
    q: "Is it free?",
    a: "Yes. It is MIT licensed, so use it in any project.",
  },
  {
    q: "Can I change the colours?",
    a: "Set --mw-from and --mw-to with the style prop, as this example does.",
  },
  {
    q: "Does it work on phones?",
    a: "Yes. A tap opens it, and a tap outside closes it.",
  },
];

// The demo frame is narrower than a phone screen, so the window is sized to it.
// Pinned to the page (the default), none of this is needed.
const FIT_FRAME = { "--mw-width": "min(22rem, calc(100vw - 8.5rem))" } as const;

/**
 * Not a chat: a help panel, with its own colours and no hover opening.
 * Colours are CSS variables, so any CSS colour works, and so does a custom
 * mascot (see the `mascot` prop).
 */
export default function Help() {
  return (
    <div className="relative h-[34rem] w-[min(44rem,calc(100vw_-_6rem))] overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
      <div className="flex h-9 items-center gap-1.5 border-b border-black/10 bg-zinc-100 px-3 dark:border-white/10 dark:bg-zinc-800">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-amber-400" />
        <span className="size-2.5 rounded-full bg-green-400" />
      </div>

      {/* A stand-in page, so the window has something to float over. */}
      <div aria-hidden="true" className="space-y-4 p-6">
        <div className="h-6 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-11/12 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-4/5 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>

      <MorphWindow
        title="Help"
        position="absolute right-4 bottom-4"
        openOnHover={false}
        style={{
          ...FIT_FRAME,
          "--mw-from": "#059669",
          "--mw-to": "#0891b2",
          "--mw-ring": "#059669",
        }}
        footer={
          <div className="border-t border-black/10 p-3 dark:border-white/10">
            <a
              href="mailto:you@example.com"
              className="block rounded-full bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white outline-offset-2"
            >
              Contact support
            </a>
          </div>
        }
      >
        <ul className="space-y-3">
          {FAQ.map((item) => (
            <li key={item.q}>
              <p className="font-medium">{item.q}</p>
              <p className="text-zinc-600 dark:text-zinc-400">{item.a}</p>
            </li>
          ))}
        </ul>
      </MorphWindow>
    </div>
  );
}
