"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MorphWindow } from "./component";

type Message = { id: number; from: "bot" | "me"; text: string };

const REPLIES = [
  "Happy to help! Could you tell me a little more?",
  "Good question. Here is the short version: copy the component, then pass your content as children.",
  "I'm only a demo bot, but a real model could answer here.",
];

/**
 * The canvas for this component: a mock browser window with the component
 * pinned inside it ("absolute" in a "relative" box), and a small chat as its
 * content. The component itself knows nothing about chat; the chat is just
 * `children` and `footer`.
 */
export default function Demo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: "Hi, I'm Sparky. Ask me anything." },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const replyIndex = useRef(0);
  const replyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, typing]);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    setMessages((all) => [...all, { id: nextId.current++, from: "me", text }]);
    setDraft("");
    setTyping(true);
    replyTimer.current = setTimeout(() => {
      const reply = REPLIES[replyIndex.current++ % REPLIES.length];
      setMessages((all) => [
        ...all,
        { id: nextId.current++, from: "bot", text: reply },
      ]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <div className="relative h-[34rem] w-full max-w-3xl overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
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
          title="Chat with Sparky"
          position="absolute right-4 bottom-4"
          bodyClassName="h-72 space-y-3 p-4"
          footer={
            <form
              onSubmit={send}
              className="flex items-center gap-2 border-t border-black/10 p-3 dark:border-white/10"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message"
                aria-label="Message"
                className="min-w-0 flex-1 rounded-full bg-zinc-100 px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-zinc-800"
              />
              <button
                type="submit"
                disabled={!draft.trim() || typing}
                className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white outline-offset-2 disabled:opacity-40"
              >
                Send
              </button>
            </form>
          }
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.from === "me" ? "flex justify-end" : "flex"}
            >
              <p
                className={
                  m.from === "me"
                    ? "max-w-[80%] rounded-2xl rounded-br-md bg-indigo-500 px-3.5 py-2 text-white"
                    : "max-w-[80%] rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-2 dark:bg-zinc-800"
                }
              >
                {m.text}
              </p>
            </div>
          ))}
          {typing && (
            <div role="status" className="flex">
              <span className="sr-only">Sparky is typing</span>
              <span
                aria-hidden="true"
                className="flex gap-1 rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-3 dark:bg-zinc-800"
              >
                <span className="size-1.5 animate-pulse rounded-full bg-zinc-400" />
                <span className="size-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:150ms]" />
                <span className="size-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:300ms]" />
              </span>
            </div>
          )}
          <div ref={endRef} />
        </MorphWindow>
      </div>
    </div>
  );
}
