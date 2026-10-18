import { notFound } from "next/navigation";
import { isProduction } from "@/lib/env";
import { groupByCategory } from "@/registry";
import { Sidebar } from "./_components/sidebar";

export default function PlaygroundLayout({
  children,
}: LayoutProps<"/playground">) {
  // The playground is a dev-only workbench: 404 in any production build.
  if (isProduction) notFound();

  const groups = groupByCategory().map(({ id, label, items }) => ({
    id,
    label,
    items: items.map(({ slug, title }) => ({ slug, title })),
  }));

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar groups={groups} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
