"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

interface Props {
  entries: TocEntry[];
}

export function TableOfContents({ entries }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (obs) => {
        for (const entry of obs) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    entries.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <aside className="hidden xl:block w-52 flex-shrink-0">
      <div className="sticky top-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          On this page
        </p>
        <ul className="space-y-1.5">
          {entries.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  "block text-sm leading-snug transition-colors",
                  level === 3 && "pl-3",
                  activeId === id
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
