import Link from "next/link";
import { experiments, groupByCategory } from "@/registry";

export default function Home() {
  const groups = groupByCategory();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          Component Playground
        </h1>
        <p className="mt-2 text-muted">
          {experiments.length} experiments ·{" "}
          <Link href="/playground" className="underline underline-offset-4">
            open the canvas
          </Link>
        </p>
      </header>

      {groups.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-muted">
          Nothing here yet. Copy <code>experiments/_template</code> and register
          it in <code>registry/index.ts</code>.
        </p>
      )}

      <div className="space-y-12">
        {groups.map((group) => (
          <section key={group.id}>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
              {group.label}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/playground/${item.slug}`}
                    className="block h-full rounded-xl border border-border bg-surface p-5 transition-colors hover:border-foreground/40"
                  >
                    <h3 className="font-medium">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-muted">
                        {item.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
