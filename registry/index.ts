import { meta as zigzagTrace } from "@/experiments/loaders/zigzag-trace/meta";
import { meta as template } from "@/experiments/_template/meta";
import { CATEGORIES, type Category, type Experiment } from "./types";

export { CATEGORIES };
export { defineExperiment } from "./define";
export type { Category, Experiment };

/**
 * Register new experiments here – one import + one line.
 *
 *   import { meta as spinnerRing } from "@/experiments/loaders/spinner-ring/meta";
 *   ...
 *   const all: Experiment[] = [spinnerRing];
 */
// NOTE: Cache Components needs at least one static route at build time, so
// keep at least one experiment registered (the template counts).
const all: Experiment[] = [zigzagTrace, template];

export const experiments = [...all].sort((a, b) =>
  b.createdAt.localeCompare(a.createdAt),
);

export function getExperiment(slug: string) {
  return experiments.find((e) => e.slug === slug);
}

export function groupByCategory() {
  return (Object.keys(CATEGORIES) as Category[])
    .map((id) => ({
      id,
      label: CATEGORIES[id],
      items: experiments.filter((e) => e.category === id),
    }))
    .filter((group) => group.items.length > 0);
}
