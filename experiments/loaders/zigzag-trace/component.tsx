"use client";

import { useId } from "react";
import {
  motion,
  useReducedMotion,
  type MotionProps,
  type Transition,
} from "motion/react";

// Shape measured from the reference, drawn bottom → top.
const PATH = "M14.9 92.1 L31.3 75.7 H7.7 L34.7 48.7 H8.7 L49.7 7.7";
const STROKE_WIDTH = 11.4;

const TRACK = "#dbe7ff";
const BOLT_LIGHT = "#a46dff";
const BOLT_DARK = "#7430dc";
const BOLT_DEPTH = "#4c1d95";

// Metal side: dark purple with bright specular bands, like polished metal.
const METAL_STOPS = [
  { offset: 0, color: "#2e1065" },
  { offset: 0.22, color: "#9a76e6" },
  { offset: 0.4, color: "#4c1d95" },
  { offset: 0.62, color: "#1e0a4a" },
  { offset: 0.8, color: "#7d55d4" },
  { offset: 1, color: "#3b1a7a" },
];

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

// One clock for the whole loader: bolt layers and frame pulse share it.
// times: fade-in → draw → hold → erase → fade-out
const LOOP = {
  duration: 3.2,
  times: [0, 0.03, 0.43, 0.55, 0.96, 1],
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "loop",
  repeatDelay: 0.4,
} satisfies Transition;

// One animation shared by every bolt layer so the depth never drifts apart.
const DRAW = {
  initial: { pathLength: 0, pathOffset: 0, opacity: 0 },
  animate: {
    pathLength: [0, 0.05, 1, 1, 1, 1],
    pathOffset: [0, 0, 0, 0, 0.95, 1],
    opacity: [0, 1, 1, 1, 1, 0],
  },
  transition: LOOP,
} satisfies MotionProps;

// Reduced motion: show the finished bolt, no movement.
const DRAWN = {
  initial: false,
  animate: { pathLength: 1, pathOffset: 0, opacity: 1 },
  transition: { duration: 0 },
} satisfies MotionProps;

// Frame pulse, synced to the draw: opacity only, never size.
// white while the bolt fades in → purple wash grows as it draws, peaks on the
// hold → fades as it erases → white again through the loop delay.
const PULSE = {
  animate: { opacity: [0, 0, 1, 1, 0, 0] },
  transition: LOOP,
} satisfies MotionProps;

export function ZigzagTrace() {
  const reduceMotion = useReducedMotion();
  const bolt = reduceMotion ? DRAWN : DRAW;
  // useId contains colons, which are awkward inside url(#…)
  const id = useId().replace(/:/g, "");
  const boltGradientId = `bolt-${id}`;
  const metalGradientId = `metal-${id}`;
  
  return (
    <div
      role="status"
      aria-label="Loading"
      className="relative grid size-full place-items-center overflow-hidden rounded-[inherit]"
    >
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-[inherit] bg-[#8338eb]/12"
          {...PULSE}
        />
      )}

      <svg
        aria-hidden
        viewBox="0 0 58 100"
        fill="none"
        className="relative h-24 overflow-visible"
      >
        <defs>
          {/* userSpaceOnUse: light → dark across the whole bolt, not per path */}
          {/* diagonal, so the bands sweep the same way as the light */}
          <linearGradient
            id={metalGradientId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="58"
            y2="100"
          >
            {METAL_STOPS.map(({ offset, color }) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
          <linearGradient
            id={boltGradientId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="100"
          >
            <stop offset="0" stopColor={BOLT_LIGHT} />
            <stop offset="1" stopColor={BOLT_DARK} />
          </linearGradient>
        </defs>

        {/* track: flat 2D */}
        <path d={PATH} stroke={TRACK} {...STROKE_PROPS} />

        {/* bolt: shadow on the track, depth, face, highlight – all share one animation */}
        <g transform={SHADOW_OFFSET}>
          <motion.path
            d={PATH}
            stroke={BOLT_DEPTH}
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
            stroke="white"
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
