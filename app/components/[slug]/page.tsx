import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { readGallerySource } from "@/lib/gallery/read-source";
import { SITE, absoluteUrl } from "@/lib/site";
import { CATEGORIES, galleryComponents } from "@/registry";
import { JsonLd } from "../../_components/json-ld";
import { CodeBlock } from "../_components/code-block";
import { CopyButton } from "../_components/copy-button";
import { ShareLinks } from "../_components/share-links";
import { ComponentPageSkeleton } from "../_components/skeletons";
import { VariantViewer, type Variant } from "../_components/variant-viewer";

type Params = PageProps<"/components/[slug]">["params"];

const find = (slug: string) => galleryComponents.find((e) => e.slug === slug);

export function generateStaticParams() {
  return galleryComponents.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = find(slug);
  if (!item) return {};

  const title = `${item.title}: free copy-paste React ${CATEGORIES[item.category].toLowerCase()} component`;
  const description = `${item.description ?? item.title} Copy the code, MIT licensed.`;
  return {
    title,
    description,
    keywords: item.tags,
    alternates: { canonical: `/components/${slug}` },
    openGraph: { title, description, url: `/components/${slug}`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function ComponentPage({
  params,
}: PageProps<"/components/[slug]">) {
  return (
    <Suspense fallback={<ComponentPageSkeleton />}>
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

  const pageUrl = absoluteUrl(`/components/${experiment.slug}`);

  return (
    <article className="space-y-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareSourceCode",
              name: experiment.title,
              description: experiment.description,
              url: pageUrl,
              programmingLanguage: "TypeScript",
              runtimePlatform: "React",
              codeRepository: SITE.repo,
              license: SITE.licenseUrl,
              isAccessibleForFree: true,
              keywords: experiment.tags,
              dateCreated: experiment.createdAt,
              author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Components", item: absoluteUrl("/components") },
                { "@type": "ListItem", position: 2, name: experiment.title, item: pageUrl },
              ],
            },
          ],
        }}
      />
      <header className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            {CATEGORIES[experiment.category]}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {experiment.title}
          </h1>
          {experiment.description && (
            <p className="mt-2 max-w-xl text-muted">{experiment.description}</p>
          )}
        </div>
        <ShareLinks
          url={pageUrl}
          text={`${experiment.title}: a free copy-paste React component`}
        />
      </header>

      <VariantViewer variants={variants} />

      <section className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">Installation</h2>

        {gallery.requirements && gallery.requirements.length > 0 && (
          <ul className="space-y-2 rounded-xl border border-border bg-surface p-4 text-sm">
            {gallery.requirements.map((r) => (
              <li key={r.name} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-medium">{r.name}</span>
                <span className="text-muted">{r.note}</span>
              </li>
            ))}
          </ul>
        )}

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
