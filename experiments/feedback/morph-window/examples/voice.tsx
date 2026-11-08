"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { MorphWindow } from "../component";

type Message = { id: number; from: "bot" | "me"; text: string };

const SEED: Message[] = [
  { id: 0, from: "bot", text: "Hi, I'm Sparky. Ask me anything." },
  { id: 1, from: "me", text: "Can I use this on my site?" },
  { id: 2, from: "bot", text: "Yes, it's MIT. Just copy it. Try the mic too!" },
];

// --- Voice input ------------------------------------------------------------
// The Web Speech API. lib.dom has the result types but not the recognizer, so
// the small part we use is typed here. Support: Chromium browsers and Safari;
// Firefox has none. In Chrome the audio is sent to a speech service, so say so
// to your users before you ship this.
type SpeechResultEvent = { results: SpeechRecognitionResultList };
type Recognizer = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type RecognizerConstructor = new () => Recognizer;

function getRecognizerConstructor(): RecognizerConstructor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: RecognizerConstructor;
    webkitSpeechRecognition?: RecognizerConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const noSubscribe = () => () => {};

/** Dictation into a text field. `onText` receives the full text so far. */
function useSpeechInput(onText: (text: string) => void) {
  // False on the server and during hydration, then the real answer.
  const supported = useSyncExternalStore(
    noSubscribe,
    () => Boolean(getRecognizerConstructor()),
    () => false,
  );
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognizer = useRef<Recognizer | null>(null);

  // Stop listening but keep the words recognised so far.
  const stop = useCallback(() => recognizer.current?.stop(), []);

  // Stop listening and throw away anything still on its way. Use this when the
  // text is being sent: stop() would let the last words arrive afterwards and
  // fill the cleared input again.
  const cancel = useCallback(() => {
    const r = recognizer.current;
    recognizer.current = null;
    r?.abort();
    setListening(false);
  }, []);

  const start = useCallback(
    (existingText: string) => {
      const Recognition = getRecognizerConstructor();
      if (!Recognition) return;
      const r = new Recognition();
      r.continuous = false;
      r.interimResults = true;
      r.lang = navigator.language;
      r.onresult = (event) => {
        // A cancelled session must not write into the input any more.
        if (recognizer.current !== r) return;
        const spoken = Array.from(event.results, (res) => res[0].transcript)
          .join("")
          .trim();
        onText([existingText.trim(), spoken].filter(Boolean).join(" "));
      };
      r.onerror = (event) => {
        // "no-speech" and "aborted" are normal; anything else is worth saying.
        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          setError(
            "Microphone access is blocked. Allow it in your browser settings.",
          );
        } else if (event.error !== "no-speech" && event.error !== "aborted") {
          setError("Voice input stopped. Please try again.");
        }
      };
      r.onend = () => {
        if (recognizer.current !== r) return; // cancelled: already handled
        setListening(false);
        recognizer.current = null;
      };
      setError(null);
      recognizer.current = r;
      try {
        r.start();
        setListening(true);
      } catch {
        recognizer.current = null;
        setError("Voice input could not start. Please try again.");
      }
    },
    [onText],
  );

  // Never leave a microphone open behind an unmounted component.
  useEffect(() => () => recognizer.current?.abort(), []);

  return { supported, listening, error, start, stop, cancel };
}

// --- Voice shortcut ---------------------------------------------------------
// A key starts and stops voice input while the window is open, wherever focus
// is (even in the text field). Developers: change the default below; `code` is
// a KeyboardEvent.code ("KeyM", "KeyV", "F2"...). Users: right-click the
// microphone (or press the Menu key / Shift+F10 on it), then press the keys
// they want. It is remembered in that browser.
//
// Allowed: Alt + a key, or a key that types nothing (F2, Insert...). A plain
// letter is not, because it could not be typed any more.
type Shortcut = { code: string; alt: boolean; key: string };

const DEFAULT_SHORTCUT: Shortcut = { code: "KeyM", alt: true, key: "M" };
const SHORTCUT_STORAGE_KEY = "morph-window:voice-shortcut";
/** Keys that must keep their normal job. */
const RESERVED_CODES = new Set([
  "Escape",
  "Tab",
  "Enter",
  "NumpadEnter",
  "Backspace",
]);
const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta"]);

function readStoredShortcut(): Shortcut {
  try {
    const raw = localStorage.getItem(SHORTCUT_STORAGE_KEY);
    if (raw) {
      const v = JSON.parse(raw) as Partial<Shortcut>;
      if (
        typeof v.code === "string" &&
        typeof v.key === "string" &&
        typeof v.alt === "boolean"
      ) {
        return { code: v.code, alt: v.alt, key: v.key };
      }
    }
  } catch {
    // Storage blocked or corrupt: fall back to the default.
  }
  return DEFAULT_SHORTCUT;
}

/** The key's name from its position, not its character (Option+M types "µ" on a Mac). */
function keyName(event: KeyboardEvent) {
  if (event.code === "Space") return "Space";
  if (event.code.startsWith("Key")) return event.code.slice(3);
  if (event.code.startsWith("Digit")) return event.code.slice(5);
  return event.key;
}

function isMac() {
  return /Mac|iPhone|iPad/.test(navigator.userAgent);
}

function useVoiceShortcut({
  active,
  onTrigger,
}: {
  /** Only react to the key while this is true (the window is open). */
  active: boolean;
  onTrigger: () => void;
}) {
  const [shortcut, setShortcut] = useState<Shortcut>(() =>
    typeof window === "undefined" ? DEFAULT_SHORTCUT : readStoredShortcut(),
  );
  const [rebinding, setRebinding] = useState(false);
  const [note, setNote] = useState("");
  const noteTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // The key handler stays attached; it must always call the latest trigger.
  const onTriggerRef = useRef(onTrigger);
  useEffect(() => {
    onTriggerRef.current = onTrigger;
  });
  useEffect(() => () => clearTimeout(noteTimer.current), []);

  const say = useCallback((text: string, forMs?: number) => {
    clearTimeout(noteTimer.current);
    setNote(text);
    if (forMs) noteTimer.current = setTimeout(() => setNote(""), forMs);
  }, []);

  const capturing = rebinding && active;

  // Press the keys to start or stop.
  useEffect(() => {
    if (!active || capturing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.code !== shortcut.code) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.altKey !== shortcut.alt) return;
      event.preventDefault();
      onTriggerRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, capturing, shortcut]);

  // Choosing new keys. Capture phase, so the window's own Escape handling
  // does not also run.
  useEffect(() => {
    if (!capturing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (MODIFIER_KEYS.has(event.key)) return; // wait for the real key
      event.preventDefault();
      event.stopPropagation();
      if (event.code === "Escape") {
        setRebinding(false);
        say("");
        return;
      }
      if (RESERVED_CODES.has(event.code)) {
        say(`${keyName(event)} can't be used. Try another key.`);
        return;
      }
      const typesACharacter = event.key.length === 1 || event.code === "Space";
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        (typesACharacter && !event.altKey)
      ) {
        say("Hold Alt and press a key, like Alt+M. Or press a key like F2.");
        return;
      }
      const next: Shortcut = {
        code: event.code,
        alt: event.altKey,
        key: keyName(event),
      };
      setShortcut(next);
      try {
        localStorage.setItem(SHORTCUT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Not remembered, but it still works until the page is closed.
      }
      setRebinding(false);
      say(`Voice shortcut is now ${shortcutText(next)}.`, 2500);
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [capturing, say]);

  return {
    /** For display: "Alt+M", or "⌥M" on a Mac. */
    hint: shortcutText(shortcut),
    /** For aria-keyshortcuts. */
    aria: shortcut.alt ? `Alt+${shortcut.key}` : shortcut.key,
    capturing,
    note,
    startRebinding: () => {
      setRebinding(true);
      say("Press the keys you want for voice input, or Esc to cancel.");
    },
    cancelRebinding: () => {
      setRebinding(false);
      say("");
    },
  };
}

function shortcutText(shortcut: Shortcut) {
  if (!shortcut.alt) return shortcut.key;
  return typeof navigator !== "undefined" && isMac()
    ? `⌥${shortcut.key}`
    : `Alt+${shortcut.key}`;
}

const REPLIES = [
  "Happy to help! Could you tell me a little more?",
  "Good question. Here is the short version: copy the component, then pass your content as children.",
  "I'm only a demo bot, but a real model could answer here.",
];

// The demo frame is narrower than a phone screen, so the window is sized to it.
// Pinned to the page (the default), none of this is needed.
const FIT_FRAME = { "--mw-width": "min(22rem, calc(100vw - 8.5rem))" } as const;

/**
 * The canvas for this component: a mock browser window with the component
 * pinned inside it ("absolute" in a "relative" box), and a small chat as its
 * content. The component itself knows nothing about chat; the chat is just
 * `children` and `footer`.
 */
export default function Demo() {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(SEED.length);
  const replyIndex = useRef(0);
  const replyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Scroll the list itself. scrollIntoView would also scroll every ancestor,
    // including this page's overflow-hidden mock window.
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  const voice = useSpeechInput(setDraft);
  const [windowOpen, setWindowOpen] = useState(false);

  const toggleVoice = () => {
    if (voice.listening) voice.stop();
    else voice.start(draft);
    // Clicking the mic moves focus onto it, and then Enter would press the mic
    // again instead of sending. Keep focus in the input so Enter sends.
    inputRef.current?.focus();
  };
  const voiceKey = useVoiceShortcut({
    active: windowOpen && voice.supported,
    onTrigger: toggleVoice,
  });

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    voice.cancel();
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
        title="Chat with Sparky"
        position="absolute right-4 bottom-4"
        style={FIT_FRAME}
        bodyClassName="p-0"
        // Opened by click, tap or keyboard: the cursor is ready in the input.
        initialFocus="input"
        // The microphone must not stay on once the window is hidden.
        onOpenChange={(open) => {
          setWindowOpen(open);
          if (!open) {
            voice.stop();
            voiceKey.cancelRebinding();
          }
        }}
        footer={
          <>
            <form
              onSubmit={send}
              className="flex items-center gap-2 border-t border-black/10 p-3 dark:border-white/10"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={voice.listening ? "Listening…" : "Type a message"}
                aria-label="Message"
                className="min-w-0 flex-1 rounded-full bg-zinc-100 px-4 py-2 text-base outline-none focus-visible:ring-2 sm:text-sm focus-visible:ring-indigo-500 dark:bg-zinc-800"
              />
              {voice.supported && (
                <button
                  type="button"
                  aria-pressed={voice.listening}
                  aria-label={
                    voice.listening ? "Stop voice input" : "Start voice input"
                  }
                  aria-keyshortcuts={voiceKey.aria}
                  onClick={toggleVoice}
                  // Right-click, or the Menu key / Shift+F10: choose a new key.
                  onContextMenu={(event) => {
                    event.preventDefault();
                    voiceKey.startRebinding();
                  }}
                  className={`group relative grid size-10 shrink-0 place-items-center rounded-full outline-offset-2 transition-colors ${
                    voice.listening
                      ? "bg-red-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {voice.listening && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 animate-ping rounded-full bg-red-500/50 motion-reduce:animate-none"
                    />
                  )}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative size-[18px]"
                  >
                    <rect x="9" y="3" width="6" height="11" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                  </svg>
                  {/* Hint on hover and keyboard focus. Decorative: the
                        button's label and aria-keyshortcuts say the same. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 bottom-full mb-2 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity delay-300 group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    <kbd className="font-mono text-[11px]">
                      {voiceKey.capturing ? "Press keys…" : voiceKey.hint}
                    </kbd>
                  </span>
                </button>
              )}
              <button
                type="submit"
                disabled={!draft.trim() || typing}
                className="rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white outline-offset-2 disabled:opacity-40"
              >
                Send
              </button>
            </form>
            {voice.error && (
              <p
                role="alert"
                className="px-4 pb-3 text-xs text-red-600 dark:text-red-400"
              >
                {voice.error}
              </p>
            )}
            {voiceKey.note && (
              <p
                role="status"
                className="px-4 pb-3 text-xs text-zinc-500 dark:text-zinc-400"
              >
                {voiceKey.note}
              </p>
            )}
            <span role="status" className="sr-only">
              {voice.listening ? "Listening" : ""}
            </span>
          </>
        }
      >
        <div
          ref={listRef}
          className="mw-scroll h-[min(18rem,calc(100dvh_-_16rem))] space-y-3 overflow-y-auto p-4"
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
        </div>
      </MorphWindow>
    </div>
  );
}
