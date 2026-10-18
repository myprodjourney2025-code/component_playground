import { defineExperiment } from "@/registry/define";

export const meta = defineExperiment({
  slug: "zigzag-trace",
  title: "Zigzag Trace",
  category: "loaders",
  description: "A zigzag stroke traced along an SVG path over a pale track.",
  tags: ["svg", "motion", "path"],
  inspiration: "Theorem Reach app loading screen (screenshots)",
  createdAt: "2026-10-18",
  layout: "card",
  gallery: {
    fileName: "zigzag-trace.tsx",
    importPath: "@/components/zigzag-trace",
    dependencies: ["motion"],
    requirements: [
      { name: "React 18 or 19", note: "Uses hooks such as useId." },
      { name: "motion", note: "Animation library. Installed in step 1." },
    ],
    examples: [
      { name: "Default", file: "examples/default.tsx", load: () => import("./examples/default") },
      { name: "Teal", file: "examples/teal.tsx", load: () => import("./examples/teal") },
      { name: "Slow, no frame", file: "examples/slow.tsx", load: () => import("./examples/slow") },
      { name: "Large", file: "examples/large.tsx", load: () => import("./examples/large") },
    ],
    props: [
      { name: "size", type: "number", default: "96", description: "Bolt height in px. Width follows the shape's aspect ratio." },
      { name: "colors", type: "Partial<ZigzagTraceColors>", description: "Override any of track, boltLight, boltDark, metal[], shadow, highlight, frame. The rest keep their defaults." },
      { name: "duration", type: "number", default: "3.2", description: "Seconds for one draw, hold and erase cycle." },
      { name: "repeatDelay", type: "number", default: "0.4", description: "Seconds of rest between cycles." },
      { name: "pulse", type: "boolean", default: "true", description: "Tint the frame in sync with the draw." },
      { name: "label", type: "string", default: '"Loading"', description: "Accessible name announced to screen readers." },
      { name: "className", type: "string", description: "Class for the frame. The frame fills its parent and copies its border radius." },
    ],
  },
  load: () => import("./demo"),
});
