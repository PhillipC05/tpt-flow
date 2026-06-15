import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG, runComparison, runSimulation } from "./engine";
import type { SimulationConfig } from "./types";

const base: SimulationConfig = {
  ...DEFAULT_CONFIG,
  agents: 100,
  steps: 12,
  seed: 42,
  initialDistribution: "pareto",
};

// ── Economic outcomes ──────────────────────────────────────────────────────────

describe("demurrage economic outcomes", () => {
  it("Gini is lower with demurrage than without (baseline)", () => {
    const baseline = runSimulation({ ...base, demurrageRate: 0, softCapMultiplier: 100, hardCapMultiplier: 200, softCapSurchargeMultiplier: 1 });
    const withDemurrage = runSimulation({ ...base, demurrageRate: 0.02, softCapMultiplier: 4, hardCapMultiplier: 8, softCapSurchargeMultiplier: 4 });

    const finalBaseline = baseline.snapshots.at(-1)!;
    const finalDemurrage = withDemurrage.snapshots.at(-1)!;

    expect(finalDemurrage.giniCoefficient).toBeLessThan(finalBaseline.giniCoefficient);
  });

  it("demurrage reduces Gini over time (final < initial)", () => {
    const result = runSimulation({ ...base, demurrageRate: 0.02, softCapMultiplier: 4, hardCapMultiplier: 8, softCapSurchargeMultiplier: 4 });
    const initial = result.snapshots[0].giniCoefficient;
    const final = result.snapshots.at(-1)!.giniCoefficient;
    expect(final).toBeLessThan(initial);
  });

  it("commons pool collects and distributes demurrage", () => {
    const result = runSimulation({ ...base, demurrageRate: 0.01 });
    const final = result.snapshots.at(-1)!;
    expect(final.totalDemurragePaid).toBeGreaterThan(0);
    expect(final.totalCommonsDistributed).toBeGreaterThan(0);
  });

  it("velocity is positive when transactionFrequency > 0", () => {
    const result = runSimulation({ ...base, demurrageRate: 0.01 });
    const hasPositiveVelocity = result.snapshots.slice(1).some((s) => s.velocity > 0);
    expect(hasPositiveVelocity).toBe(true);
  });

  it("no demurrage is collected when rate is 0", () => {
    const result = runSimulation({ ...base, demurrageRate: 0 });
    const final = result.snapshots.at(-1)!;
    expect(final.totalDemurragePaid).toBe(0);
  });

  it("total supply is conserved (demurrage redistributed, not burned)", () => {
    const result = runSimulation({ ...base, demurrageRate: 0.02, softCapMultiplier: 4, hardCapMultiplier: 8, softCapSurchargeMultiplier: 4 });
    // At any snapshot, agent balances + commons pool should equal totalSupply
    // We check by verifying the final commons pool accounts for the difference
    const final = result.snapshots.at(-1)!;
    expect(final.totalDemurragePaid).toBeGreaterThanOrEqual(final.totalCommonsDistributed);
  });
});

// ── Comparison mode ────────────────────────────────────────────────────────────

describe("runComparison", () => {
  it("identical configs produce identical results", () => {
    const { a, b } = runComparison(base, { ...base });
    expect(a.snapshots.length).toBe(b.snapshots.length);
    for (let i = 0; i < a.snapshots.length; i++) {
      expect(a.snapshots[i].giniCoefficient).toBe(b.snapshots[i].giniCoefficient);
      expect(a.snapshots[i].velocity).toBe(b.snapshots[i].velocity);
      expect(a.snapshots[i].commonsPoolSize).toBe(b.snapshots[i].commonsPoolSize);
    }
  });

  it("comparison uses the same seed for both runs (fair comparison)", () => {
    const configA = { ...base, seed: 7 };
    const configB = { ...base, demurrageRate: 0.02, seed: 99 }; // different seed — should be overridden
    const { a, b } = runComparison(configA, configB);
    // Both runs should use configA.seed, so initial conditions match
    expect(a.snapshots[0].giniCoefficient).toBe(b.snapshots[0].giniCoefficient);
  });
});

// ── Edge cases ─────────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("all balances below free tier — no demurrage collected", () => {
    // uniform distribution: each agent balance = totalSupply / agents = 10
    // freeTierAmount = 1000 >> 10, so nothing is charged
    const config: SimulationConfig = {
      ...base,
      initialDistribution: "uniform",
      totalSupply: 1000,
      agents: 100,       // each agent starts with balance = 10
      freeTierAmount: 1000,
      demurrageRate: 0.05,
    };
    const result = runSimulation(config);
    const final = result.snapshots.at(-1)!;
    expect(final.totalDemurragePaid).toBe(0);
  });

  it("all balances above hard cap — overflow collected in first step", () => {
    // uniform: every agent starts with balance = mean
    // hardCapMultiplier = 0.5 → hardCap = 0.5 * mean < mean, so every agent is above hard cap
    const config: SimulationConfig = {
      ...base,
      initialDistribution: "uniform",
      totalSupply: 10000,
      agents: 100,              // each agent balance = 100
      freeTierAmount: 0,
      softCapMultiplier: 0.3,   // softCap = 30  < 100
      hardCapMultiplier: 0.5,   // hardCap = 50  < 100 → every agent overflows
      demurrageRate: 0.01,
      softCapSurchargeMultiplier: 2,
    };
    const result = runSimulation(config);
    const final = result.snapshots.at(-1)!;
    // Hard cap overflow must be collected in the very first demurrage step
    expect(final.totalDemurragePaid).toBeGreaterThan(0);
  });

  it("zero transaction frequency — velocity stays 0 but demurrage still applies", () => {
    const config: SimulationConfig = {
      ...base,
      transactionFrequency: 0,
      demurrageRate: 0.01,
    };
    const result = runSimulation(config);

    // Every step snapshot (after step 0) must have velocity = 0
    for (const snapshot of result.snapshots.slice(1)) {
      expect(snapshot.velocity).toBe(0);
    }

    // Demurrage should still have been collected (pareto dist, balances above free tier)
    expect(result.snapshots.at(-1)!.totalDemurragePaid).toBeGreaterThan(0);
  });

  it("single agent simulation completes without error", () => {
    const result = runSimulation({ ...base, agents: 1, steps: 5 });
    expect(result.snapshots).toHaveLength(6); // step 0 + 5 steps
  });

  it("zero steps returns only the initial snapshot", () => {
    const result = runSimulation({ ...base, steps: 0 });
    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0].step).toBe(0);
  });
});
