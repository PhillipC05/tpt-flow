"use client";

import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { SimulationSnapshot } from "@/lib/simulation/types";

const STROKE_A = "hsl(175 30% 45%)";
const STROKE_B = "hsl(220 50% 55%)";

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-4 bg-card" role="img" aria-label={title}>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4" aria-hidden="true">{title}</p>
      {children}
    </div>
  );
}

interface Props {
  snapshots: SimulationSnapshot[];
  compareSnapshots?: SimulationSnapshot[];
}

export function SimCharts({ snapshots, compareSnapshots }: Props) {
  if (snapshots.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border text-muted-foreground text-sm">
        Configure parameters and click Run Simulation to see results.
      </div>
    );
  }

  const data = snapshots.map((s, i) => ({
    step: s.step,
    velocity: +s.velocity.toFixed(4),
    gini: +s.giniCoefficient.toFixed(4),
    commons: +s.commonsPoolSize.toFixed(2),
    p50: +s.wealthPercentiles[2].toFixed(2),
    p90: +s.wealthPercentiles[4].toFixed(2),
    p10: +s.wealthPercentiles[0].toFixed(2),
    // comparison data
    velocityB: compareSnapshots?.[i] ? +compareSnapshots[i].velocity.toFixed(4) : undefined,
    giniB: compareSnapshots?.[i] ? +compareSnapshots[i].giniCoefficient.toFixed(4) : undefined,
    commonsB: compareSnapshots?.[i] ? +compareSnapshots[i].commonsPoolSize.toFixed(2) : undefined,
    p50B: compareSnapshots?.[i] ? +compareSnapshots[i].wealthPercentiles[2].toFixed(2) : undefined,
    p90B: compareSnapshots?.[i] ? +compareSnapshots[i].wealthPercentiles[4].toFixed(2) : undefined,
    p10B: compareSnapshots?.[i] ? +compareSnapshots[i].wealthPercentiles[0].toFixed(2) : undefined,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Velocity */}
      <ChartCard title="Money Velocity (tx volume / total supply per month)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="step" tick={{ fontSize: 11 }} label={{ value: "Month", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => (typeof v === "number" ? v.toFixed(4) : v)} />
            <Legend />
            <Line type="monotone" dataKey="velocity" name="Velocity" stroke={STROKE_A} dot={false} strokeWidth={2} />
            {compareSnapshots && <Line type="monotone" dataKey="velocityB" name="Velocity (B)" stroke={STROKE_B} dot={false} strokeWidth={2} strokeDasharray="5 3" />}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Gini */}
      <ChartCard title="Gini Coefficient (0 = equal, 1 = maximally unequal)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="step" tick={{ fontSize: 11 }} label={{ value: "Month", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => (typeof v === "number" ? v.toFixed(3) : v)} />
            <Legend />
            <Line type="monotone" dataKey="gini" name="Gini" stroke={STROKE_A} dot={false} strokeWidth={2} />
            {compareSnapshots && <Line type="monotone" dataKey="giniB" name="Gini (B)" stroke={STROKE_B} dot={false} strokeWidth={2} strokeDasharray="5 3" />}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Commons Pool */}
      <ChartCard title="Commons Pool Size (TPT)">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="step" tick={{ fontSize: 11 }} label={{ value: "Month", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => (typeof v === "number" ? v.toFixed(0) : v)} />
            <Legend />
            <Area type="monotone" dataKey="commons" name="Commons Pool" stroke={STROKE_A} fill={STROKE_A} fillOpacity={0.15} strokeWidth={2} />
            {compareSnapshots && <Area type="monotone" dataKey="commonsB" name="Commons (B)" stroke={STROKE_B} fill={STROKE_B} fillOpacity={0.10} strokeWidth={2} strokeDasharray="5 3" />}
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Wealth Percentiles */}
      <ChartCard title="Wealth Distribution (p10 / p50 / p90 balance)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="step" tick={{ fontSize: 11 }} label={{ value: "Month", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => (typeof v === "number" ? v.toFixed(1) : v)} />
            <Legend />
            <Line type="monotone" dataKey="p90" name="90th pct" stroke="hsl(220 50% 55%)" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="p50" name="Median" stroke={STROKE_A} dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="p10" name="10th pct" stroke="hsl(30 70% 55%)" dot={false} strokeWidth={1.5} />
            {compareSnapshots && <Line type="monotone" dataKey="p90B" name="90th pct (B)" stroke="hsl(220 50% 55%)" dot={false} strokeWidth={1.5} strokeDasharray="5 3" />}
            {compareSnapshots && <Line type="monotone" dataKey="p50B" name="Median (B)" stroke={STROKE_B} dot={false} strokeWidth={2} strokeDasharray="5 3" />}
            {compareSnapshots && <Line type="monotone" dataKey="p10B" name="10th pct (B)" stroke="hsl(30 70% 55%)" dot={false} strokeWidth={1.5} strokeDasharray="5 3" />}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
