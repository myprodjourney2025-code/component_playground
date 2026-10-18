"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";

// The theme is the `dark` class on <html>. Subscribing to it keeps the switch's
// accessibility state correct no matter who changed the class.
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
 * Animated light / dark switch. All visuals are driven by the `dark:` variant
 * (pure CSS transitions), so the first paint is always correct and there is no
 * hydration mismatch. Only `aria-checked` comes from React state.
 */
export function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function toggle() {
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
      aria-label="Dark mode"
      onClick={toggle}
      className="group relative h-8 w-16 shrink-0 cursor-pointer overflow-hidden rounded-full border border-black/25 p-0.5 shadow-[0_1px_0_rgba(255,255,255,0.7)] outline-offset-2 transition-shadow duration-500 focus-visible:outline-2 focus-visible:outline-violet-500 motion-reduce:transition-none dark:border-black/60 dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]"
    >
      {/* Sky: day gradient fades out, night gradient fades in */}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100 opacity-100 transition-opacity duration-500 motion-reduce:transition-none dark:opacity-0"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950 opacity-0 transition-opacity duration-500 motion-reduce:transition-none dark:opacity-100"
      />

      {/* Clouds (day) */}
      <span
        aria-hidden
        className="absolute right-2 top-2.5 h-2 w-5 rounded-full bg-white/80 opacity-100 blur-[1px] transition-opacity duration-500 motion-reduce:transition-none dark:opacity-0"
      />
      <span
        aria-hidden
        className="absolute right-4 top-4.5 h-1.5 w-4 rounded-full bg-white/60 opacity-100 blur-[1px] transition-opacity duration-500 motion-reduce:transition-none dark:opacity-0"
      />

      {/* Stars (night) */}
      <span
        aria-hidden
        className="absolute left-2.5 top-2 size-0.5 rounded-full bg-white opacity-0 transition-opacity delay-200 duration-500 motion-reduce:transition-none dark:opacity-90"
      />
      <span
        aria-hidden
        className="absolute left-5 top-4.5 size-[3px] rounded-full bg-white opacity-0 transition-opacity delay-300 duration-500 motion-reduce:transition-none dark:opacity-70"
      />
      <span
        aria-hidden
        className="absolute left-3.5 top-5.5 size-0.5 rounded-full bg-indigo-200 opacity-0 transition-opacity delay-100 duration-500 motion-reduce:transition-none dark:opacity-80"
      />

      {/* Carved-in track: shading painted over the sky, under the knob */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-black/15 via-transparent to-white/10 shadow-[inset_0_2px_5px_rgba(0,0,0,0.3),inset_0_-1px_1px_rgba(255,255,255,0.35)] transition-shadow duration-500 motion-reduce:transition-none dark:shadow-[inset_0_3px_6px_rgba(0,0,0,0.65),inset_0_-1px_1px_rgba(255,255,255,0.1)]"
      />

      {/* Knob: slides, spins, and morphs sun → crescent moon */}
      <span
        aria-hidden
        className={`relative block size-7 translate-x-0 rounded-full drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] transition-transform duration-500 group-active:scale-90 motion-reduce:transition-none dark:translate-x-[30px] ${SPRING}`}
      >
        <span className="absolute inset-0 rotate-0 transition-transform duration-700 motion-reduce:transition-none dark:rotate-[360deg]">
          {/* Sun: glowing core with a ring of rays */}
          <span className="absolute inset-0 opacity-100 drop-shadow-[0_0_6px_rgba(251,191,36,0.75)] transition-opacity duration-500 motion-reduce:transition-none dark:opacity-0">
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
            className="absolute inset-0 m-auto size-[22px] text-slate-100 opacity-0 drop-shadow-[0_0_4px_rgba(199,210,254,0.8)] transition-opacity duration-500 motion-reduce:transition-none dark:opacity-100"
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
