import { defineExperiment } from "@/registry/define";

export const meta = defineExperiment({
  slug: "morph-window",
  title: "Morph Window",
  category: "feedback",
  description: "A floating mascot button that grows into a chat or assistant window.",
  tags: ["floating", "clip-path", "popover"],
  inspiration: "Bhagyam dashboard: Today's forecast window",
  createdAt: "2026-10-19",
  layout: "full",
  load: () => import("./demo"),
});
