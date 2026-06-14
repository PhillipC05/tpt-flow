import { describe, it, expect } from "vitest";
import { applyDemurrage } from "./demurrage";
import type { Agent, SimulationConfig } from "./types";

const baseConfig: SimulationConfig = {
  agents: 10,
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

function makeAgent(id: number, balance: number): Agent {
  return { id, balance, txCount: 0, totalTxCount: 0 };
}

describe("applyDemurrage", () => {
  it("does not charge agents below the free tier", () => {
    const agents = [makeAgent(0, 50), makeAgent(1, 100)];
    const charged = applyDemurrage(agents, baseConfig, 500, 1000);
    expect(charged).toBe(0);
    expect(agents[0].balance).toBe(50);
    expect(agents[1].balance).toBe(100);
  });

  it("charges standard rate on balance above free tier up to soft cap", () => {
    const agents = [makeAgent(0, 200)]; // 100 above free tier, below soft cap 500
    const charged = applyDemurrage(agents, baseConfig, 500, 1000);
    // (200 - 100) * 0.01 = 1
    expect(charged).toBeCloseTo(1);
    expect(agents[0].balance).toBeCloseTo(199);
  });

  it("charges escalating rate on balance above soft cap", () => {
    // balance 700: standard band = 500-100 = 400, escalating band = 700-500 = 200
    const agents = [makeAgent(0, 700)];
    const charged = applyDemurrage(agents, baseConfig, 500, 1000);
    const standardCharge = 400 * 0.01;        // 4
    const escalatingCharge = 200 * 0.01 * 3; // 6
    expect(charged).toBeCloseTo(standardCharge + escalatingCharge);
    expect(agents[0].balance).toBeCloseTo(700 - (standardCharge + escalatingCharge));
  });

  it("clips hard cap overflow directly to commons before applying rate", () => {
    // balance 1200, hard cap 1000 → overflow 200 goes straight to commons
    // then remaining 1000: standard band 400 + escalating band 500
    const agents = [makeAgent(0, 1200)];
    const charged = applyDemurrage(agents, baseConfig, 500, 1000);
    const overflow = 200;
    const standardCharge = 400 * 0.01;        // 4
    const escalatingCharge = 500 * 0.01 * 3; // 15
    expect(charged).toBeCloseTo(overflow + standardCharge + escalatingCharge);
    expect(agents[0].balance).toBeCloseTo(1000 - standardCharge - escalatingCharge);
  });

  it("never charges below the free tier floor", () => {
    // balance just above free tier
    const agents = [makeAgent(0, 101)];
    const charged = applyDemurrage(agents, baseConfig, 500, 1000);
    // charge = 1 * 0.01 = 0.01; balance after = 100.99
    expect(agents[0].balance).toBeGreaterThanOrEqual(100);
  });

  it("returns 0 and mutates nothing when all balances are zero", () => {
    const agents = [makeAgent(0, 0), makeAgent(1, 0)];
    const charged = applyDemurrage(agents, baseConfig, 500, 1000);
    expect(charged).toBe(0);
  });

  it("sums charges across multiple agents", () => {
    const agents = [makeAgent(0, 200), makeAgent(1, 200)];
    const charged = applyDemurrage(agents, baseConfig, 500, 1000);
    expect(charged).toBeCloseTo(2);
  });
});
