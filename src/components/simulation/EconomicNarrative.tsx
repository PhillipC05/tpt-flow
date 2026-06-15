import type { SimulationSnapshot } from "@/lib/simulation/types";

interface Props {
  first: SimulationSnapshot;
  last: SimulationSnapshot;
  compareFirst?: SimulationSnapshot;
  compareLast?: SimulationSnapshot;
  months: number;
}

function pct(a: number, b: number): number {
  if (b === 0) return 0;
  return ((a - b) / Math.abs(b)) * 100;
}

function fmt(n: number, digits = 0): string {
  return n.toLocaleString("en-NZ", { maximumFractionDigits: digits });
}

export function EconomicNarrative({ first, last, compareFirst, compareLast, months }: Props) {
  const giniDelta = pct(last.giniCoefficient, first.giniCoefficient);
  const velDelta = pct(last.velocity, first.velocity);
  const medianDelta = pct(last.wealthPercentiles[2], first.wealthPercentiles[2]);

  const giniDir = giniDelta < -5 ? "fell" : giniDelta > 5 ? "rose" : "held steady";
  const velDir = velDelta > 5 ? "increased" : velDelta < -5 ? "decreased" : "stayed flat";

  const giniSentence = giniDir === "held steady"
    ? `Wealth inequality held steady (Gini ${last.giniCoefficient.toFixed(3)}).`
    : `Wealth inequality ${giniDir} from ${first.giniCoefficient.toFixed(3)} → ${last.giniCoefficient.toFixed(3)} (${Math.abs(giniDelta).toFixed(1)}% ${giniDelta < 0 ? "reduction" : "increase"}).`;

  const velSentence = `Money velocity ${velDir}${velDelta !== 0 ? ` by ${Math.abs(velDelta).toFixed(1)}%` : ""}.`;

  const commonsSentence = last.totalDemurragePaid > 0
    ? `${fmt(last.totalDemurragePaid)} TPT collected as demurrage and redistributed via the commons over ${months} months.`
    : `No demurrage was collected (rate is 0 or all balances within the free tier).`;

  const medianSentence = medianDelta > 1
    ? `The median balance rose ${Math.abs(medianDelta).toFixed(1)}% to ${fmt(last.wealthPercentiles[2], 1)} TPT, lifted by commons redistribution.`
    : medianDelta < -1
    ? `The median balance fell ${Math.abs(medianDelta).toFixed(1)}% to ${fmt(last.wealthPercentiles[2], 1)} TPT.`
    : null;

  // Comparison verdict
  let comparisonSentence: string | null = null;
  if (compareFirst && compareLast) {
    const baseGini = compareLast.giniCoefficient;
    const baseVel = compareLast.velocity;
    const giniImprovement = pct(last.giniCoefficient, baseGini);
    const velImprovement = pct(last.velocity, baseVel);
    const parts: string[] = [];
    if (giniImprovement < -1) parts.push(`Gini ${Math.abs(giniImprovement).toFixed(1)}% lower`);
    if (giniImprovement > 1) parts.push(`Gini ${giniImprovement.toFixed(1)}% higher`);
    if (velImprovement > 1) parts.push(`velocity ${velImprovement.toFixed(1)}% higher`);
    if (velImprovement < -1) parts.push(`velocity ${Math.abs(velImprovement).toFixed(1)}% lower`);
    if (parts.length > 0) {
      comparisonSentence = `Compared to the no-demurrage baseline: ${parts.join(", ")}.`;
    }
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">Economic Narrative</p>
      <p className="text-sm text-foreground">{giniSentence} {velSentence}</p>
      <p className="text-sm text-muted-foreground">{commonsSentence}</p>
      {medianSentence && <p className="text-sm text-muted-foreground">{medianSentence}</p>}
      {comparisonSentence && (
        <p className="text-sm font-medium text-primary/80 border-t border-primary/20 pt-1.5 mt-1">{comparisonSentence}</p>
      )}
    </div>
  );
}
