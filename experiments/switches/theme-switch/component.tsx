"use client";

import {
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
} from "react";

const STORAGE_KEY = "theme";
/** How long the circular theme reveal takes. */
const REVEAL_MS = 700;

// Runs before first paint. A saved choice wins; with none saved the page
// follows the system, including live changes (e.g. sunset auto-dark).
const THEME_SCRIPT = `(function(){var r=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)");function g(){try{return localStorage.getItem(${JSON.stringify(STORAGE_KEY)})}catch(e){return null}}function a(){var t=g();r.classList.toggle("dark",t?t==="dark":m.matches)}a();m.addEventListener("change",a)})()`;

/**
 * Put this inside <head> of your root layout so the theme is set before the
 * first paint (no flash). On the client React would only warn about a <script>,
 * so it is rendered inert there; suppressHydrationWarning covers the difference.
 */
export function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  );
}

// The site theme is the `dark` class on <html>. Subscribing to it keeps the
// switch's accessibility state correct no matter who changed the class.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

// Springy overshoot on the knob, gentle fade everywhere else.
const SPRING = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

/**
 * Animated light / dark switch.
 *
 * Every visual is driven by one CSS variable, `--on` (0 = light, 1 = dark):
 * - Site mode (no `checked` prop): `--on` follows the `dark` class on <html>
 *   through CSS, so the first paint is correct and nothing flashes. Clicking
 *   changes the site theme and remembers a deliberate override.
 * - Controlled mode (`checked` given): `--on` comes from your state. The
 *   switch never touches the document, so it can live inside previews.
 */
export function ThemeSwitch({
  checked,
  onCheckedChange,
  className = "",
  label = "Dark mode",
}: {
  /** Controlled state. Omit it and the switch drives the site theme. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Extra classes for the switch button. */
  className?: string;
  /** Accessible name. */
  label?: string;
}) {
  const siteDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const isControlled = checked !== undefined;
  const isDark = isControlled ? checked : siteDark;

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    if (isControlled) {
      onCheckedChange?.(!checked);
      return;
    }
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
    try {
      // Picking what the system already has means "follow the system" again,
      // so save nothing. Only a deliberate override is remembered.
      if (next === system) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Storage can be blocked; the theme still switches for this visit.
    }

    const apply = () => root.classList.toggle("dark", next);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !document.startViewTransition) {
      apply();
      return;
    }

    // The new theme grows as a circle out of the switch.
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Turn off the browser's default cross-fade; we animate the reveal ourselves.
    const style = document.createElement("style");
    style.textContent =
      "::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}";
    document.head.append(style);

    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() =>
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: REVEAL_MS,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
      .catch(() => {});
    transition.finished.finally(() => style.remove());
  }

  return (
    // No border: the carved shading inside the track defines its edge, so the
    // switch looks the same on light, dark and tinted backgrounds.
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      onClick={toggle}
      style={
        isControlled ? ({ "--on": checked ? 1 : 0 } as CSSProperties) : undefined
      }
      className={`group relative block h-8 w-16 shrink-0 cursor-pointer rounded-full outline-offset-2 [--on:0] focus-visible:outline-2 focus-visible:outline-violet-500 dark:[--on:1] ${className}`}
    >
      <span className="relative block size-full overflow-hidden rounded-full">
        {/* Sky: day gradient fades out, night gradient fades in */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-100 opacity-[calc(1_-_var(--on))] transition-opacity duration-500 motion-reduce:transition-none"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950 opacity-[var(--on)] transition-opacity duration-500 motion-reduce:transition-none"
        />

        {/* Clouds (day) */}
        <span
          aria-hidden
          className="absolute right-2 top-2 h-2 w-5 rounded-full bg-white/85 opacity-[calc(1_-_var(--on))] blur-[1px] transition-opacity duration-500 motion-reduce:transition-none"
        />
        <span
          aria-hidden
          className="absolute right-4 top-4 h-1.5 w-4 rounded-full bg-white/60 opacity-[calc(1_-_var(--on))] blur-[1px] transition-opacity duration-500 motion-reduce:transition-none"
        />

        {/* Stars (night) */}
        <span
          aria-hidden
          className="absolute left-2.5 top-2 size-0.5 rounded-full bg-white opacity-[calc(var(--on)*0.9)] transition-opacity delay-200 duration-500 motion-reduce:transition-none"
        />
        <span
          aria-hidden
          className="absolute left-5 top-4 size-[3px] rounded-full bg-white opacity-[calc(var(--on)*0.7)] transition-opacity delay-300 duration-500 motion-reduce:transition-none"
        />
        <span
          aria-hidden
          className="absolute left-3.5 top-5 size-0.5 rounded-full bg-indigo-200 opacity-[calc(var(--on)*0.8)] transition-opacity delay-100 duration-500 motion-reduce:transition-none"
        />

        {/* Depth: the track is carved into the surface. A soft shadow falls from
            the top edge, a faint one from the sides, and a thin light catches the
            bottom lip. The night layer deepens the shadow as the sky darkens. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_2px_3px_rgba(0,0,0,0.28),inset_0_0_7px_rgba(0,0,0,0.14),inset_0_-1px_1px_rgba(255,255,255,0.4)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-[var(--on)] shadow-[inset_0_3px_5px_rgba(0,0,0,0.5),inset_0_0_9px_rgba(0,0,0,0.35)] transition-opacity duration-500 motion-reduce:transition-none"
        />

        {/* Knob: slides, spins, and morphs sun to crescent moon. It sits above the
            shadows and casts its own, so it reads as raised inside the groove. */}
        <span
          aria-hidden
          className={`absolute left-1 top-1 block size-6 translate-x-[calc(var(--on)*32px)] rounded-full drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.4)] transition-transform duration-500 group-active:scale-90 motion-reduce:transition-none ${SPRING}`}
        >
          <span className="absolute inset-0 rotate-[calc(var(--on)*360deg)] transition-transform duration-700 motion-reduce:transition-none">
            {/* Sun: glowing core with a ring of rays */}
            <span className="absolute inset-0 opacity-[calc(1_-_var(--on))] drop-shadow-[0_0_5px_rgba(251,191,36,0.7)] transition-opacity duration-500 motion-reduce:transition-none">
              <svg
                viewBox="0 0 28 28"
                className="absolute inset-0 size-full text-amber-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M22.5 14H26M14 22.5V26M5.5 14H2M14 5.5V2" />
                <path d="M20 20l2.5 2.5M8 20l-2.5 2.5M8 8L5.5 5.5M20 8l2.5-2.5" />
              </svg>
              <span className="absolute inset-0 m-auto size-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fffbe0,#fcd34d_55%,#f59e0b)]" />
            </span>
            {/* Moon: crescent, glowing */}
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 m-auto size-5 text-slate-100 opacity-[var(--on)] drop-shadow-[0_0_4px_rgba(199,210,254,0.8)] transition-opacity duration-500 motion-reduce:transition-none"
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
              />
            </svg>
          </span>
        </span>
      </span>
    </button>
  );
}
