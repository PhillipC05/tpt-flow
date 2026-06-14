"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { DocMeta } from "@/lib/mdx";

export function DocsSidebar({ docs }: { docs: DocMeta[] }) {
  const pathname = usePathname();

  return (
    <nav className="w-56 flex-shrink-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-3">
        Documentation
      </p>
      <ul className="space-y-1">
        {docs.map((doc) => {
          const href = `/docs/${doc.slug}`;
          const active = pathname === href;
          return (
            <li key={doc.slug}>
              <Link
                href={href}
                className={cn(
                  "block px-3 py-1.5 rounded-md text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {doc.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
