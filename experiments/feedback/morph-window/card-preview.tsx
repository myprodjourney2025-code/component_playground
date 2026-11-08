import { MorphWindow } from "./component";

/**
 * Stand-in for the card on the gallery page (not a variant tab): the window,
 * already open, small enough to fit the card. It is also what the share image
 * is cut from.
 */
export default function CardPreview() {
  return (
    <div className="relative h-60 w-96 rounded-xl bg-zinc-50">
      <MorphWindow
        title="Chat with Sparky"
        position="absolute right-3 bottom-3"
        defaultOpen
        bodyClassName="h-24 space-y-2 p-3"
        footer={
          <div className="flex items-center gap-2 border-t border-black/10 p-2.5">
            <span className="flex-1 rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-500">
              Type a message
            </span>
            <span className="rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white">
              Send
            </span>
          </div>
        }
      >
        <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-zinc-100 px-3 py-1.5 text-xs">
          Hi, I&apos;m Sparky. Ask me anything.
        </p>
        <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-indigo-500 px-3 py-1.5 text-xs text-white">
          Can I use this on my site?
        </p>
      </MorphWindow>
    </div>
  );
}
