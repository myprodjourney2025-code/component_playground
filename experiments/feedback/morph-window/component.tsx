"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

// Everything the animation and the look need lives in this one file, so it can
// be copied on its own. The motion (pill growing into a window, float, ring,
// shine, bevel) comes from a window built for another project.
//
// Colours are CSS variables with neutral defaults. Override them per use with
// the `style` prop, e.g. style={{ "--mw-from": "#10b981", "--mw-to": "#0ea5e9" }}
const CSS = `
.mw-root {
  --mw-from: #6366f1;
  --mw-to: #3b82f6;
  --mw-ring: #6366f1;
}
.mw-button-bg {
  background-image: linear-gradient(135deg, var(--mw-from) 0%, var(--mw-to) 100%);
}
.mw-float { animation: mw-float 6s ease-in-out infinite; }
@keyframes mw-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.mw-ring { animation: mw-ring 2.6s ease-out infinite; }
@keyframes mw-ring {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--mw-ring) 65%, transparent); }
  75%, 100% { box-shadow: 0 0 0 14px color-mix(in srgb, var(--mw-ring) 0%, transparent); }
}

/*
 * One element that is always laid out at its full window size and is only
 * revealed by clip-path + transform. Nothing that changes during the
 * animation affects layout, so the text never re-wraps and the motion stays
 * smooth. A clip-path also clips what the pointer can hit, so the invisible
 * part of the window never reacts to the mouse.
 *   --w         window width        --pill     resting (button) width
 *   --panel-h   window height, measured in JS (the button is the top 3rem)
 */
.mw-panel {
  --w: min(22rem, calc(100vw - 2rem));
  --pill: 3rem;
  --panel-h: 20rem;
  --mw-ease: cubic-bezier(0.32, 0.72, 0, 1);
  --mw-time: 0.55s;
  width: var(--w);
  clip-path: inset(0 0 0 0 round 1rem);
  transform: translate3d(0, 0, 0);
  will-change: clip-path, transform;
  transition:
    clip-path var(--mw-time) var(--mw-ease),
    transform var(--mw-time) var(--mw-ease);
}
.mw-panel[data-open="false"] {
  transform: translate3d(0, calc(var(--panel-h) - 3rem), 0);
  clip-path: inset(
    0 0 calc(var(--panel-h) - 3rem) calc(var(--w) - var(--pill)) round 1.5rem
  );
}
/* With a visible label, the resting button is a wide pill on desktop. Without
   one it is just the round mascot everywhere. */
@media (min-width: 40rem) {
  .mw-panel[data-labeled="true"] { --pill: 11.5rem; }
}
/* The mascot: eyes blink now and then, the antenna glows. */
.mw-eye {
  transform-box: fill-box;
  transform-origin: center;
  animation: mw-blink 5s ease-in-out infinite;
}
@keyframes mw-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  95.5% { transform: scaleY(0.1); }
}
.mw-glow { animation: mw-glow 2.4s ease-in-out infinite; }
@keyframes mw-glow {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}
/* The button's contents glide from the pill's left edge to the window's. */
.mw-head { transition: transform var(--mw-time) var(--mw-ease); }
.mw-panel[data-open="false"] .mw-head {
  transform: translate3d(calc(var(--w) - var(--pill)), 0, 0);
}
/* Keyboard focus ring that follows the visible shape. */
.mw-focus {
  width: var(--pill);
  transition: width var(--mw-time) var(--mw-ease);
}
.mw-panel[data-open="true"] .mw-focus { width: var(--w); }
/*
 * The 3D look: a glossy highlight, a bright top edge and a darker lip along
 * the bottom, laid over the button. It flips to a pressed-in look while the
 * button is held.
 */
.mw-bevel {
  position: absolute;
  overflow: hidden;
  width: var(--pill);
  border-radius: 1.5rem;
  background:
    linear-gradient(
      to bottom,
      rgb(255 255 255 / 0.3) 0%,
      rgb(255 255 255 / 0.14) 49%,
      rgb(255 255 255 / 0) 50%
    ),
    linear-gradient(
      to bottom,
      rgb(255 255 255 / 0.1) 50%,
      rgb(0 0 0 / 0.14) 100%
    );
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.95),
    inset 0 0 0 1px rgb(255 255 255 / 0.32),
    inset 0 -2px 0 rgb(255 255 255 / 0.18),
    inset 0 -4px 3px rgb(0 0 0 / 0.22);
  transition:
    width var(--mw-time) var(--mw-ease),
    border-radius var(--mw-time) var(--mw-ease),
    box-shadow 0.15s ease;
}
/* A bright specular streak that sweeps across now and then. */
.mw-bevel::after {
  content: "";
  position: absolute;
  inset: -10% auto -10% 0;
  width: 28%;
  background: linear-gradient(
    100deg,
    rgb(255 255 255 / 0) 0%,
    rgb(255 255 255 / 0.36) 50%,
    rgb(255 255 255 / 0) 100%
  );
  transform: translate3d(-160%, 0, 0) skewX(-20deg);
  animation: mw-shine 5.5s ease-in-out 1.2s infinite;
}
@keyframes mw-shine {
  0%, 55% { transform: translate3d(-160%, 0, 0) skewX(-20deg); }
  100% { transform: translate3d(480%, 0, 0) skewX(-20deg); }
}
.mw-panel[data-open="true"] .mw-bevel {
  width: var(--w);
  border-radius: 1rem 1rem 0 0;
}
/* Keeps the focus ring's corners the same as the bevel's. */
.mw-shape {
  border-radius: 1.5rem;
  transition:
    width var(--mw-time) var(--mw-ease),
    border-radius var(--mw-time) var(--mw-ease);
}
.mw-panel[data-open="true"] .mw-shape { border-radius: 1rem 1rem 0 0; }
/* The open window's raised edge: bright top, darker lip, hairline border. */
.mw-edge {
  border-radius: 1rem;
  opacity: 0;
  box-shadow:
    inset 0 0 0 1px rgb(0 0 0 / 0.14),
    inset 0 0 0 2px rgb(255 255 255 / 0.6),
    inset 0 2px 0 rgb(255 255 255 / 0.9),
    inset 0 -3px 0 rgb(0 0 0 / 0.14);
  transition: opacity 0.3s ease;
}
.mw-panel[data-open="true"] .mw-edge {
  opacity: 1;
  transition-delay: 0.2s;
}
.mw-btn:active .mw-bevel {
  background: linear-gradient(
    to bottom,
    rgb(0 0 0 / 0.16) 0%,
    rgb(0 0 0 / 0.02) 60%,
    rgb(255 255 255 / 0.12) 100%
  );
  box-shadow:
    inset 0 3px 7px rgb(0 0 0 / 0.35),
    inset 0 0 0 1px rgb(0 0 0 / 0.1);
}
.mw-body {
  opacity: 1;
  transition: opacity 0.3s ease 0.15s;
}
.mw-panel[data-open="false"] .mw-body {
  opacity: 0;
  transition-delay: 0s;
}
@media (prefers-reduced-motion: reduce) {
  .mw-float, .mw-ring, .mw-eye, .mw-glow { animation: none; }
  .mw-panel, .mw-head, .mw-focus, .mw-bevel, .mw-shape, .mw-edge, .mw-body {
    transition: none;
  }
  .mw-bevel::after { animation: none; }
}
`;

// Pinned to the browser window. On a wide screen the page content is a centred
// column (max-w-6xl = 72rem); pinning the button to the window's corner would
// leave it far out at the side, so from desktop width its right edge lines up
// with that column.
const FIXED_POSITION =
  "fixed right-4 bottom-36 sm:right-6 sm:bottom-20 lg:right-[max(1.5rem,calc((100vw_-_72rem)_/_2))] lg:bottom-24";

export type MorphWindowProps = {
  /**
   * Name of the window: its heading when open and the button's accessible
   * name. Always required, even when no label is shown.
   */
  title: string;
  /**
   * Optional text on the resting button, e.g. "Ask AI". Shown on desktop only;
   * on a phone the button stays the round mascot. Leave it out for a mascot
   * only button.
   */
  label?: string;
  /** Replaces the built-in mascot. Anything sized about size-8 works. */
  mascot?: ReactNode;
  /**
   * Where it sits, as Tailwind classes. Default: fixed to the browser window's
   * bottom-right. To pin it inside a box instead, give that box `relative`
   * and pass e.g. "absolute right-4 bottom-4".
   */
  position?: string;
  /** Override the colours: --mw-from, --mw-to (button gradient), --mw-ring. */
  style?: CSSProperties;
  /** Classes for the scrolling content area. Default "space-y-4 p-5". */
  bodyClassName?: string;
  /** Pinned under the content, outside the scroll area, e.g. a message input. */
  footer?: ReactNode;
  /** What the window shows. */
  children: ReactNode;
};

/** A friendly robot head, drawn in SVG. */
export function Mascot() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="size-8 shrink-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
    >
      {/* antenna */}
      <path d="M32 14V8" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="6" r="4" fill="#fde68a" className="mw-glow" />
      {/* ears */}
      <rect x="4" y="29" width="6" height="12" rx="3" fill="#ffffff" fillOpacity="0.85" />
      <rect x="54" y="29" width="6" height="12" rx="3" fill="#ffffff" fillOpacity="0.85" />
      {/* head and visor */}
      <rect x="9" y="13" width="46" height="40" rx="18" fill="#ffffff" />
      <rect x="15" y="20" width="34" height="26" rx="12" fill="#1e1b4b" />
      {/* eyes, cheeks, smile */}
      <ellipse cx="25.5" cy="30" rx="3.4" ry="4.4" fill="#67e8f9" className="mw-eye" />
      <ellipse cx="38.5" cy="30" rx="3.4" ry="4.4" fill="#67e8f9" className="mw-eye" />
      <circle cx="20.5" cy="38" r="2.6" fill="#f9a8d4" fillOpacity="0.85" />
      <circle cx="43.5" cy="38" r="2.6" fill="#f9a8d4" fillOpacity="0.85" />
      <path
        d="M27 38.5Q32 43 37 38.5"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A floating mascot button that grows into a window (chat, assistant, help).
 * The button and the window are one element that
 * grows: with a mouse the pill opens into the window as the pointer enters
 * it; on a touch screen (where the pill is just the icon) a tap opens it. A
 * click or tap pins it open until it is closed again.
 */
export function MorphWindow({
  title,
  label,
  mascot,
  position = FIXED_POSITION,
  style,
  bodyClassName = "space-y-4 p-5",
  footer,
  children,
}: MorphWindowProps) {
  const [open, setOpen] = useState(false);
  // Opened by a click/tap/key rather than a hover: stays open when the
  // pointer leaves.
  const [pinned, setPinned] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelId = useId();

  const openWindow = (viaPointerHover: boolean) => {
    clearTimeout(leaveTimer.current);
    setOpen(true);
    if (!viaPointerHover) setPinned(true);
  };
  const closeWindow = () => {
    clearTimeout(leaveTimer.current);
    setOpen(false);
    setPinned(false);
  };

  // The window is always laid out at full size and only revealed (see
  // .mw-panel above); the collapse needs its real height.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const measure = () => {
      const closed = panel.dataset.open === "false";
      // The resting (closed) shape is calculated from this height. When the
      // content changes size, a resting window just takes the new height at
      // once instead of animating it like an opening.
      if (closed) panel.style.transition = "none";
      panel.style.setProperty("--panel-h", `${panel.offsetHeight}px`);
      if (closed) {
        void panel.offsetHeight; // apply it now, with no transition
        panel.style.transition = "";
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  // A pinned window closes on a click/tap outside it.
  useEffect(() => {
    if (!pinned) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setPinned(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [pinned]);

  return (
    <div
      ref={rootRef}
      // The root only positions things; the clipped panel is what the
      // pointer can actually hit.
      className={[
        "mw-root mw-float pointer-events-none z-40",
        position,
        open && "[animation-play-state:paused]",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          closeWindow();
          rootRef.current?.querySelector("button")?.focus();
        }
      }}
    >
      <style>{CSS}</style>

      {/* A soft ring that draws the eye while the button is at rest. */}
      <span
        aria-hidden="true"
        className={[
          "mw-ring pointer-events-none absolute right-0 bottom-0 h-12 w-12 rounded-full",
          label && "sm:w-[11.5rem]",
          open && "hidden",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      <div className="[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.2))_drop-shadow(0_8px_14px_rgba(0,0,0,0.2))]">
        <div
          ref={panelRef}
          data-open={open}
          data-labeled={Boolean(label)}
          className="mw-panel pointer-events-auto relative bg-white text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50"
          // Only a real mouse hovers; touch and pen taps arrive as clicks.
          // A short grace period on leaving stops a pointer grazing the
          // edge from making the window flicker.
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") openWindow(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse" || pinned) return;
            clearTimeout(leaveTimer.current);
            leaveTimer.current = setTimeout(() => {
              // Someone tabbing through the window keeps it open.
              if (rootRef.current?.contains(document.activeElement)) return;
              setOpen(false);
            }, 140);
          }}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={label ? undefined : title}
            onClick={() => (pinned ? closeWindow() : openWindow(false))}
            className="mw-btn mw-button-bg peer relative block h-12 w-full cursor-pointer text-left text-sm font-medium whitespace-nowrap text-neutral-50 outline-none"
          >
            {/* Under the text, so the shine never dims the label. */}
            <span
              aria-hidden="true"
              className="mw-bevel pointer-events-none absolute top-0 right-0 h-12"
            />
            {/* The text is always in the DOM (the pill clips it on a phone),
                so the button keeps its accessible name. */}
            <span className="mw-head relative z-10 flex h-full w-full items-center gap-2 px-3.5">
              {mascot ?? <Mascot />}
              {/* On a phone the resting button is the icon only: the label is
                  clipped by the 3rem pill but its first letter still peeked
                  out, so it is invisible until the window opens. */}
              <span
                className={[
                  "flex-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] transition-opacity duration-300",
                  open
                    ? "opacity-100 delay-150"
                    : label
                      ? "opacity-0 sm:opacity-100"
                      : "opacity-0",
                ].join(" ")}
              >
                {label ?? title}
              </span>
              {pinned && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-4 shrink-0"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              )}
            </span>
          </button>
          <span
            aria-hidden="true"
            className="mw-focus mw-shape pointer-events-none absolute top-0 right-0 h-12 ring-3 ring-white/80 ring-inset peer-not-focus-visible:hidden"
          />

          {/* The open window's raised edge: bright top, darker lip. */}
          <span
            aria-hidden="true"
            className="mw-edge pointer-events-none absolute inset-0"
          />
          <div
            id={panelId}
            role="region"
            aria-label={title}
            inert={!open}
            className="mw-body"
          >
            <div
              className={`max-h-[60vh] min-h-32 overflow-y-auto text-sm leading-relaxed ${bodyClassName}`}
            >
              {children}
            </div>
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
