"use client";

import { useId, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  type MotionProps,
  type Transition,
} from "motion/react";

export type ZigzagTraceColors = {
  /** Flat 2D track the bolt is drawn over. */
  track: string;
  /** Bolt face gradient, top … */
  boltLight: string;
  /** … to bottom. */
  boltDark: string;
  /**
   * Bolt side, a metallic gradient from top-left to bottom-right.
   * Colours are spread evenly; alternate dark and bright for a polished look.
   */
  metal: string[];
  /** Soft shadow the bolt casts on the track. */
  shadow: string;
  /** Thin highlight along the bolt's top-left edge. */
  highlight: string;
  /** Frame tint at the peak of the pulse. Include alpha, e.g. "rgb(131 56 235 / 0.12)". */
  frame: string;
};

export const DEFAULT_COLORS: ZigzagTraceColors = {
  track: "#dbe7ff",
  boltLight: "#a46dff",
  boltDark: "#7430dc",
  metal: ["#2e1065", "#9a76e6", "#4c1d95", "#1e0a4a", "#7d55d4", "#3b1a7a"],
  shadow: "#4c1d95",
  highlight: "#ffffff",
  frame: "rgb(131 56 235 / 0.12)",
};

export type ZigzagTraceProps = {
  /** Bolt height in px. Width follows the shape's aspect ratio. Default 96. */
  size?: number;
  /** Override any of the colours; the rest keep their defaults. */
  colors?: Partial<ZigzagTraceColors>;
  /** Seconds for one draw → hold → erase cycle. Default 3.2. */
  duration?: number;
  /** Seconds of rest (empty track, clean frame) between cycles. Default 0.4. */
  repeatDelay?: number;
  /** Tint the frame in sync with the draw. Default true. */
  pulse?: boolean;
  /** Accessible name announced to screen readers. Default "Loading". */
  label?: string;
  /**
   * Class for the frame. The frame fills its parent and copies its border
   * radius, so size and round the parent, not the loader.
   */
  className?: string;
};

// Shape measured from the reference, drawn bottom → top.
const PATH = "M14.9 92.1 L31.3 75.7 H7.7 L34.7 48.7 H8.7 L49.7 7.7";
const VIEWBOX = { width: 58, height: 100 };
const STROKE_WIDTH = 11.4;

// Light comes from the top-left, so depth falls to the bottom-right.
const DEPTH_OFFSET = "translate(2.2 3)";
const HIGHLIGHT_OFFSET = "translate(-1.8 -1.8)";
// The bolt sits above the track, so its shadow lands a bit further away.
const SHADOW_OFFSET = "translate(2.4 3.4)";

const STROKE_PROPS = {
  strokeWidth: STROKE_WIDTH,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// times: fade-in → draw → hold → erase → fade-out
const TIMES = [0, 0.03, 0.43, 0.55, 0.96, 1];

// One animation shared by every bolt layer so the depth never drifts apart.
const DRAW = {
  initial: { pathLength: 0, pathOffset: 0, opacity: 0 },
  animate: {
    pathLength: [0, 0.05, 1, 1, 1, 1],
    pathOffset: [0, 0, 0, 0, 0.95, 1],
    opacity: [0, 1, 1, 1, 1, 0],
  },
} satisfies MotionProps;

// Reduced motion: show the finished bolt, no movement.
const DRAWN = {
  initial: false,
  animate: { pathLength: 1, pathOffset: 0, opacity: 1 },
  transition: { duration: 0 },
} satisfies MotionProps;

// Frame pulse, synced to the draw: opacity only, never size.
// white while the bolt fades in → tint grows as it draws, peaks on the hold →
// fades as it erases → white again through the loop delay.
const PULSE = {
  initial: { opacity: 0 },
  animate: { opacity: [0, 0, 1, 1, 0, 0] },
} satisfies MotionProps;

const FRAME_STYLE: CSSProperties = {
  position: "relative",
  display: "grid",
  placeItems: "center",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  borderRadius: "inherit",
};

const FRAME_LAYER_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
};

export function ZigzagTrace({
  size = 96,
  colors,
  duration = 3.2,
  repeatDelay = 0.4,
  pulse = true,
  label = "Loading",
  className,
}: ZigzagTraceProps) {
  const reduceMotion = useReducedMotion();
  const c = { ...DEFAULT_COLORS, ...colors };

  // One clock for the whole loader: bolt layers and frame pulse share it.
  const loop = {
    duration,
    times: TIMES,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay,
  } satisfies Transition;
  const bolt = reduceMotion ? DRAWN : { ...DRAW, transition: loop };

  // useId contains colons, which are awkward inside url(#…)
  const id = useId().replace(/:/g, "");
  const boltGradientId = `bolt-${id}`;
  const metalGradientId = `metal-${id}`;

  return (
    <div
      role="status"
      aria-label={label}
      className={className}
      style={FRAME_STYLE}
    >
      {pulse && !reduceMotion && (
        <motion.div
          aria-hidden
          style={{ ...FRAME_LAYER_STYLE, backgroundColor: c.frame }}
          {...PULSE}
          transition={loop}
        />
      )}

      <svg
        aria-hidden
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        width={(size * VIEWBOX.width) / VIEWBOX.height}
        height={size}
        fill="none"
        style={{ position: "relative", overflow: "visible" }}
      >
        <defs>
          {/* diagonal, so the bands sweep the same way as the light */}
          <linearGradient
            id={metalGradientId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2={VIEWBOX.width}
            y2={VIEWBOX.height}
          >
            {c.metal.map((color, i) => (
              <stop
                key={i}
                offset={c.metal.length > 1 ? i / (c.metal.length - 1) : 0}
                stopColor={color}
              />
            ))}
          </linearGradient>
          {/* userSpaceOnUse: light → dark across the whole bolt, not per path */}
          <linearGradient
            id={boltGradientId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={VIEWBOX.height}
          >
            <stop offset="0" stopColor={c.boltLight} />
            <stop offset="1" stopColor={c.boltDark} />
          </linearGradient>
        </defs>

        {/* track: flat 2D */}
        <path d={PATH} stroke={c.track} {...STROKE_PROPS} />

        {/* bolt: shadow on the track, metal side, face, highlight – one animation */}
        <g transform={SHADOW_OFFSET}>
          <motion.path
            d={PATH}
            stroke={c.shadow}
            strokeOpacity={0.18}
            {...STROKE_PROPS}
            strokeWidth={STROKE_WIDTH + 2}
            {...bolt}
          />
        </g>
        <g transform={DEPTH_OFFSET}>
          <motion.path
            d={PATH}
            stroke={`url(#${metalGradientId})`}
            {...STROKE_PROPS}
            {...bolt}
          />
        </g>
        <motion.path
          d={PATH}
          stroke={`url(#${boltGradientId})`}
          {...STROKE_PROPS}
          {...bolt}
        />
        <g transform={HIGHLIGHT_OFFSET}>
          <motion.path
            d={PATH}
            stroke={c.highlight}
            strokeOpacity={0.4}
            {...STROKE_PROPS}
            strokeWidth={2.4}
            {...bolt}
          />
        </g>
      </svg>
    </div>
  );
}
