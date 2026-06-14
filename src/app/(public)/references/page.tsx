import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "References",
  description: "Key intellectual foundations and references for TPT Flow.",
};

const references = [
  {
    author: "Silvio Gesell",
    work: "The Natural Economic Order",
    year: "1906",
    category: "Economic Theory",
    summary:
      "Proposed demurrage as a monetary mechanism to enforce currency circulation. Argued that money with a holding cost would eliminate hoarding incentives and keep capital working in the real economy. Keynes called Gesell one of the most important unimplemented economic thinkers of his era.",
  },
  {
    author: "John Maynard Keynes",
    work: "The General Theory of Employment, Interest and Money",
    year: "1936",
    category: "Economic Theory",
    summary:
      "Cited Gesell's demurrage proposal as 'a serious contribution to the problem of the rate of interest.' Chapter 23 credits Gesell's 'stamped money' concept as a practical approach to the liquidity trap — a problem Keynes had identified independently.",
  },
  {
    author: "WIR Bank (Wirtschaftsring)",
    work: "Swiss complementary currency, operating 1934–present",
    year: "1934–",
    category: "Empirical Precedent",
    summary:
      "The world's largest and longest-running complementary currency. Approximately 60,000 Swiss SMEs participate. The WIR functions countercyclically — usage increases during downturns, providing liquidity when conventional credit tightens. Direct proof that a complementary currency can operate sustainably at scale.",
  },
  {
    author: "Sardex",
    work: "B2B mutual credit network, Sardinia",
    year: "2010–",
    category: "Empirical Precedent",
    summary:
      "A B2B complementary currency operating in Sardinia. Peer-reviewed research has shown measurable reductions in unemployment and improved SME liquidity in the region. Demonstrates that a complementary currency designed around real-economy use (not speculation) can deliver quantifiable economic outcomes.",
  },
  {
    author: "Thomas Piketty",
    work: "Capital in the Twenty-First Century",
    year: "2013",
    category: "Empirical Research",
    summary:
      "Empirical analysis of wealth and income data across two centuries and multiple countries. Central finding: when the rate of return on capital (r) exceeds economic growth (g), wealth concentration is the structural default outcome of capitalist economies. R > G is the condition that has prevailed for most of recorded history.",
  },
  {
    author: "Atif Mian, Ludwig Straub, Amir Sufi",
    work: "Indebted Demand",
    year: "2021",
    category: "Empirical Research",
    summary:
      "Research showing that wealth concentration reduces aggregate demand and creates sustained debt traps for lower-income households. As wealth concentrates at the top, the wealthy save more of it rather than spending, reducing the circulation of money in the real economy and requiring lower-income households to borrow to maintain consumption.",
  },
  {
    author: "Federal Reserve Economic Data",
    work: "M2SL (M2 Money Supply) and M2V (M2 Velocity of Money)",
    year: "Ongoing",
    category: "Data Source",
    summary:
      "Federal Reserve data showing US M2 growth from $12.1T (Jan 2015) to approximately $21.8T (early 2026), and M2 velocity falling from 1.88 to approximately 1.38 over the same period. These figures underpin the macroeconomic analysis in the TPT Flow executive summary.",
  },
  {
    author: "Margrit Kennedy",
    work: "Interest and Inflation Free Money",
    year: "1995",
    category: "Economic Theory",
    summary:
      "Systematic analysis of demurrage-based currency designs and their historical applications. Kennedy documented multiple real-world demurrage experiments (including Gesell's Freigeld experiments in Austria and Germany in the 1930s) and analysed why they worked and why they were ultimately suppressed.",
  },
];

const categories = [...new Set(references.map((r) => r.category))];

export default function ReferencesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Badge variant="outline" className="mb-4">References</Badge>
      <h1 className="text-4xl font-bold mb-4">Inspirations & References</h1>
      <p className="text-muted-foreground text-lg mb-12">
        TPT Flow is built on 90 years of economic thought and empirical evidence. These are
        the primary intellectual foundations.
      </p>

      {categories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-widest text-sm">
            {category}
          </h2>
          <div className="space-y-6">
            {references
              .filter((r) => r.category === category)
              .map((ref) => (
                <div key={ref.work} className="p-6 rounded-lg border border-border">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold">{ref.author}</p>
                      <p className="text-primary text-sm font-medium">{ref.work}</p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {ref.year}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ref.summary}</p>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
