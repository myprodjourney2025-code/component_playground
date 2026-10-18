"use client";

import { useSyncExternalStore, type CSSProperties } from "react";

const STORAGE_KEY = "theme";

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

  function toggle() {
    if (isControlled) {
      onCheckedChange?.(!checked);
      return;
    }
    const next = document.documentElement.classList.toggle("dark");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
    try {
      // Picking what the system already has means "follow the system" again,
      // so save nothing. Only a deliberate override is remembered.
      if (next === system) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Storage can be blocked; the theme still switches for this visit.
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      onClick={toggle}
      style={
        isControlled ? ({ "--on": checked ? 1 : 0 } as CSSProperties) : undefined
      }
      className={`group relative h-8 w-16 shrink-0 cursor-pointer overflow-hidden rounded-full border border-black/40 p-0.5 shadow-[0_1px_0_rgba(255,255,255,0.3)] outline-offset-2 [--on:0] focus-visible:outline-2 focus-visible:outline-violet-500 dark:[--on:1] ${className}`}
    >
      {/* Sky: day gradient fades out, night gradient fades in */}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100 opacity-[calc(1_-_var(--on))] transition-opacity duration-500 motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950 opacity-[var(--on)] transition-opacity duration-500 motion-reduce:transition-none"
      />

      {/* Clouds (day) */}
      <span
        aria-hidden
        className="absolute right-2 top-2.5 h-2 w-5 rounded-full bg-white/80 opacity-[calc(1_-_var(--on))] blur-[1px] transition-opacity duration-500 motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="absolute right-4 top-4.5 h-1.5 w-4 rounded-full bg-white/60 opacity-[calc(1_-_var(--on))] blur-[1px] transition-opacity duration-500 motion-reduce:transition-none"
      />

      {/* Stars (night) */}
      <span
        aria-hidden
        className="absolute left-2.5 top-2 size-0.5 rounded-full bg-white opacity-[calc(var(--on)*0.9)] transition-opacity delay-200 duration-500 motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="absolute left-5 top-4.5 size-[3px] rounded-full bg-white opacity-[calc(var(--on)*0.7)] transition-opacity delay-300 duration-500 motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="absolute left-3.5 top-5.5 size-0.5 rounded-full bg-indigo-200 opacity-[calc(var(--on)*0.8)] transition-opacity delay-100 duration-500 motion-reduce:transition-none"
      />

      {/* Carved-in track: shading painted over the sky, under the knob.
          Two layers (day / night) cross-fade. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-black/15 via-transparent to-white/10 opacity-[calc(1_-_var(--on))] shadow-[inset_0_2px_5px_rgba(0,0,0,0.3),inset_0_-1px_1px_rgba(255,255,255,0.35)] transition-opacity duration-500 motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-black/15 via-transparent to-white/10 opacity-[var(--on)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.65),inset_0_-1px_1px_rgba(255,255,255,0.1)] transition-opacity duration-500 motion-reduce:transition-none"
      />

      {/* Knob: slides, spins, and morphs sun → crescent moon */}
      <span
        aria-hidden
        className={`relative block size-7 translate-x-[calc(var(--on)*30px)] rounded-full drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] transition-transform duration-500 group-active:scale-90 motion-reduce:transition-none ${SPRING}`}
      >
        <span className="absolute inset-0 rotate-[calc(var(--on)*360deg)] transition-transform duration-700 motion-reduce:transition-none">
          {/* Sun: glowing core with a ring of rays */}
          <span className="absolute inset-0 opacity-[calc(1_-_var(--on))] drop-shadow-[0_0_6px_rgba(251,191,36,0.75)] transition-opacity duration-500 motion-reduce:transition-none">
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
            <span className="absolute inset-0 m-auto size-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fffbe0,#fcd34d_55%,#f59e0b)]" />
          </span>
          {/* Moon: crescent, glowing */}
          <svg
            viewBox="0 0 24 24"
            className="absolute inset-0 m-auto size-[22px] text-slate-100 opacity-[var(--on)] drop-shadow-[0_0_4px_rgba(199,210,254,0.8)] transition-opacity duration-500 motion-reduce:transition-none"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="currentColor"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
