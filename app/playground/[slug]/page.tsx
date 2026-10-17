import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { experiments, getExperiment } from "@/registry";
import { Canvas } from "../_components/canvas";

export function generateStaticParams() {
  return experiments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/playground/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getExperiment(slug)?.title };
}

export default async function ExperimentPage({
  params,
}: PageProps<"/playground/[slug]">) {
  const { slug } = await params;
  const experiment = getExperiment(slug);
  if (!experiment) notFound();

  const { default: Demo } = await experiment.load();

  return (
    <Canvas layout={experiment.layout} title={experiment.title}>
      <Demo />
    </Canvas>
  );
}
