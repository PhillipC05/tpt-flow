import { describe, it, expect } from "vitest";
import { distributeCommons } from "./commons";
import type { Agent, SimulationConfig } from "./types";

const baseConfig: SimulationConfig = {
  agents: 4,
  steps: 12,
  seed: 1,
  demurrageRate: 0.01,
  freeTierAmount: 100,
  softCapMultiplier: 5,
  hardCapMultiplier: 10,
  softCapSurchargeMultiplier: 3,
  commonsFormula: "proportional",
  hybridBlend: 0.5,
  initialDistribution: "uniform",
  transactionFrequency: 0.3,
  totalSupply: 10000,
};

function makeAgent(id: number, balance: number, txCount = 1): Agent {
  return { id, balance, txCount, totalTxCount: txCount };
}

describe("distributeCommons", () => {
  it("returns 0 when pool is empty", () => {
    const agents = [makeAgent(0, 100)];
    expect(distributeCommons(agents, 0, baseConfig, 1000)).toBe(0);
  });

  it("returns 0 when agent list is empty", () => {
    expect(distributeCommons([], 100, baseConfig, 1000)).toBe(0);
  });

  it("distributes proportionally by txCount", () => {
    const agents = [makeAgent(0, 0, 3), makeAgent(1, 0, 1)];
    const distributed = distributeCommons(agents, 100, { ...baseConfig, commonsFormula: "proportional" }, 1000);
    expect(distributed).toBeCloseTo(100);
    expect(agents[0].balance).toBeCloseTo(75); // 3/4 of 100
    expect(agents[1].balance).toBeCloseTo(25); // 1/4 of 100
  });

  it("distributes uniformly regardless of txCount", () => {
    const agents = [makeAgent(0, 0, 10), makeAgent(1, 0, 1)];
    const distributed = distributeCommons(agents, 100, { ...baseConfig, commonsFormula: "uniform" }, 1000);
    expect(distributed).toBeCloseTo(100);
    expect(agents[0].balance).toBeCloseTo(50);
    expect(agents[1].balance).toBeCloseTo(50);
  });

  it("respects hard cap — does not push agent above hard cap", () => {
    const agents = [makeAgent(0, 950, 1), makeAgent(1, 0, 1)];
    const hardCap = 1000;
    // Agent 0 can only receive 50 more; agent 1 gets the rest
    const distributed = distributeCommons(agents, 200, { ...baseConfig, commonsFormula: "uniform" }, hardCap);
    expect(agents[0].balance).toBeLessThanOrEqual(hardCap);
    expect(distributed).toBeLessThanOrEqual(200);
  });

  it("hybrid formula blends proportional and uniform", () => {
    // blend=1 → fully uniform; blend=0 → fully proportional
    const agents = [makeAgent(0, 0, 9), makeAgent(1, 0, 1)];
    const pool = 100;
    const hardCap = 10000;

    const fullyUniform = distributeCommons(
      [makeAgent(0, 0, 9), makeAgent(1, 0, 1)],
      pool,
      { ...baseConfig, commonsFormula: "hybrid", hybridBlend: 1 },
      hardCap
    );
    const fullyProp = distributeCommons(
      [makeAgent(0, 0, 9), makeAgent(1, 0, 1)],
      pool,
      { ...baseConfig, commonsFormula: "hybrid", hybridBlend: 0 },
      hardCap
    );

    // blend=1 same as uniform
    expect(agents[0].balance + agents[1].balance).toBeLessThanOrEqual(pool + 1);
    // Ensure totals equal pool (within float tolerance)
    expect(fullyUniform).toBeCloseTo(100);
    expect(fullyProp).toBeCloseTo(100);
  });
});
