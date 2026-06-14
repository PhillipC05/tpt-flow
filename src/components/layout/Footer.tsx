import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">TPT Flow</span>
          <span>— a complementary currency for the real economy</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href="/docs/parameters" className="hover:text-foreground transition-colors">Docs</Link>
          <Link href="/simulate" className="hover:text-foreground transition-colors">Simulate</Link>
          <Link href="/references" className="hover:text-foreground transition-colors">References</Link>
        </nav>
        <p className="text-xs">Concept stage · Not financial advice</p>
      </div>
    </footer>
  );
}
