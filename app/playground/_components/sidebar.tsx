"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type Group = {
  id: string;
  label: string;
  items: { slug: string; title: string }[];
};

export function Sidebar({ groups }: { groups: Group[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-60 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-surface p-4">
      <Link href="/" className="text-sm font-semibold tracking-tight">
        ← Playground
      </Link>

      {groups.length === 0 && (
        <p className="text-sm text-muted">No experiments yet.</p>
      )}

      {groups.map((group) => (
        <div key={group.id}>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
            {group.label}
          </h2>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const href = `/playground/${item.slug}`;
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-foreground/5",
                      pathname === href && "bg-foreground/10 font-medium",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
