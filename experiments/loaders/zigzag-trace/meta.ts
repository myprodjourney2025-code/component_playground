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
  load: () => import("./demo"),
});
