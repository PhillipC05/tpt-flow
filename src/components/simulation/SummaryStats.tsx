import type { SimulationSnapshot } from "@/lib/simulation/types";

interface Props {
  first: SimulationSnapshot;
  last: SimulationSnapshot;
}

export function SummaryStats({ first, last }: Props) {
  const velocityChange = ((last.velocity - first.velocity) / Math.max(first.velocity, 0.0001)) * 100;
  const giniChange = ((last.giniCoefficient - first.giniCoefficient) / Math.max(first.giniCoefficient, 0.0001)) * 100;

  function StatRow({ label, value, change, suffix = "", invert = false }: { label: string; value: string; change?: number; suffix?: string; invert?: boolean }) {
    const isPositive = change !== undefined && (invert ? change < 0 : change > 0);
    const isNegative = change !== undefined && (invert ? change > 0 : change < 0);
    return (
      <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{value}{suffix}</span>
          {change !== undefined && (
            <span className={`text-xs ${isPositive ? "text-emerald-500" : isNegative ? "text-destructive" : "text-muted-foreground"}`}>
              {change >= 0 ? "+" : ""}{change.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 bg-card">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Summary Statistics</p>
      <StatRow
        label="Final Velocity"
        value={last.velocity.toFixed(4)}
        change={velocityChange}
      />
      <StatRow
        label="Final Gini Coefficient"
        value={last.giniCoefficient.toFixed(3)}
        change={giniChange}
        invert
      />
      <StatRow
        label="Total Demurrage Paid"
        value={last.totalDemurragePaid.toFixed(0)}
        suffix=" TPT"
      />
      <StatRow
        label="Total Commons Distributed"
        value={last.totalCommonsDistributed.toFixed(0)}
        suffix=" TPT"
      />
      <StatRow
        label="Total Transaction Volume"
        value={last.totalTransactionVolume.toFixed(0)}
        suffix=" TPT"
      />
      <StatRow
        label="Final Median Balance"
        value={last.wealthPercentiles[2].toFixed(1)}
        suffix=" TPT"
      />
      <StatRow
        label="Final 90th / 10th Percentile"
        value={`${last.wealthPercentiles[4].toFixed(0)} / ${last.wealthPercentiles[0].toFixed(0)}`}
        suffix=" TPT"
      />
    </div>
  );
}
