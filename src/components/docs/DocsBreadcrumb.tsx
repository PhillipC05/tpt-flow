import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
}

export function DocsBreadcrumb({ title }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
      <Link href="/docs/parameters" className="hover:text-foreground transition-colors">
        Docs
      </Link>
      <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="text-foreground font-medium truncate">{title}</span>
    </nav>
  );
}
