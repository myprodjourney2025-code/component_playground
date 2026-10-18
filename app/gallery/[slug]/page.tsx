import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { readGallerySource } from "@/lib/gallery/read-source";
import { galleryComponents } from "@/registry";
import { CodeBlock } from "../_components/code-block";
import { CopyButton } from "../_components/copy-button";
import { VariantViewer, type Variant } from "../_components/variant-viewer";

type Params = PageProps<"/gallery/[slug]">["params"];

const find = (slug: string) => galleryComponents.find((e) => e.slug === slug);

export function generateStaticParams() {
  return galleryComponents.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/gallery/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: find(slug)?.title };
}

export default function GalleryComponentPage({
  params,
}: PageProps<"/gallery/[slug]">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <ComponentDoc params={params} />
    </Suspense>
  );
}

async function ComponentDoc({ params }: { params: Params }) {
  const { slug } = await params;
  const experiment = find(slug);
  if (!experiment?.gallery) notFound();

  const { gallery } = experiment;
  const source = await readGallerySource({ ...experiment, gallery });

  const variants: Variant[] = await Promise.all(
    gallery.examples.map(async (example) => {
      const { default: Example } = await example.load();
      return {
        name: example.name,
        fileName: example.file.split("/").pop() ?? example.file,
        code: source.examples[example.file],
        preview: <Example />,
      };
    }),
  );

  const install = gallery.dependencies?.length
    ? `npm install ${gallery.dependencies.join(" ")}`
    : null;

  return (
    <article className="space-y-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          {experiment.title}
        </h1>
        {experiment.description && (
          <p className="mt-2 max-w-xl text-muted">{experiment.description}</p>
        )}
      </header>

      <VariantViewer variants={variants} />

      <section className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">Installation</h2>

        {install && (
          <Step n={1} title="Install the dependency">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-950 py-2 pl-4 pr-2">
              <code className="font-mono text-sm text-zinc-100">{install}</code>
              <CopyButton text={install} label="Copy install command" />
            </div>
          </Step>
        )}

        <Step
          n={install ? 2 : 1}
          title={`Copy this into ${gallery.importPath.replace(/^@\//, "")}.tsx`}
        >
          <CodeBlock code={source.component} title={gallery.fileName} />
        </Step>
      </section>

      {gallery.props && gallery.props.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Props</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Prop</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Default</th>
                  <th className="px-4 py-2.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {gallery.props.map((prop) => (
                  <tr key={prop.name} className="align-top">
                    <td className="px-4 py-3 font-mono">{prop.name}</td>
                    <td className="px-4 py-3 font-mono text-muted">
                      {prop.type}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted">
                      {prop.default ?? "–"}
                    </td>
                    <td className="px-4 py-3 text-muted">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </article>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <span className="grid size-5 place-items-center rounded-full bg-foreground text-xs text-background">
          {n}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}
