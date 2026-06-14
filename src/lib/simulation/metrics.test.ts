import { describe, it, expect } from "vitest";
import { giniCoefficient, wealthPercentiles, velocityProxy, meanBalance } from "./metrics";
import type { Agent } from "./types";

function makeAgent(id: number, balance: number): Agent {
  return { id, balance, txCount: 0, totalTxCount: 0 };
}

describe("giniCoefficient", () => {
  it("returns 0 for an empty array", () => {
    expect(giniCoefficient([])).toBe(0);
  });

  it("returns 0 when all balances are equal", () => {
    const agents = [makeAgent(0, 100), makeAgent(1, 100), makeAgent(2, 100)];
    expect(giniCoefficient(agents)).toBeCloseTo(0);
  });

  it("returns 0 when all balances are zero", () => {
    const agents = [makeAgent(0, 0), makeAgent(1, 0)];
    expect(giniCoefficient(agents)).toBe(0);
  });

  it("returns a value near 1 for extreme concentration", () => {
    // One agent holds everything, rest hold 0
    const agents = [makeAgent(0, 0), makeAgent(1, 0), makeAgent(2, 0), makeAgent(3, 1000)];
    const g = giniCoefficient(agents);
    expect(g).toBeGreaterThan(0.7);
    expect(g).toBeLessThanOrEqual(1);
  });

  it("returns value between 0 and 1", () => {
    const agents = [makeAgent(0, 10), makeAgent(1, 50), makeAgent(2, 200), makeAgent(3, 500)];
    const g = giniCoefficient(agents);
    expect(g).toBeGreaterThan(0);
    expect(g).toBeLessThan(1);
  });

  it("is symmetric — result does not depend on agent order", () => {
    const a = [makeAgent(0, 100), makeAgent(1, 400)];
    const b = [makeAgent(0, 400), makeAgent(1, 100)];
    expect(giniCoefficient(a)).toBeCloseTo(giniCoefficient(b));
  });
});

describe("velocityProxy", () => {
  it("returns 0 when total supply is 0", () => {
    expect(velocityProxy(500, 0)).toBe(0);
  });

  it("returns the ratio of volume to supply", () => {
    expect(velocityProxy(1000, 5000)).toBeCloseTo(0.2);
  });

  it("can exceed 1 when velocity is high", () => {
    expect(velocityProxy(20000, 10000)).toBeCloseTo(2);
  });
});

describe("wealthPercentiles", () => {
  it("returns zeros for empty array", () => {
    const result = wealthPercentiles([]);
    expect(result.every((v) => v === 0)).toBe(true);
  });

  it("returns correct percentiles for sorted data", () => {
    // 10 agents with balances 1..10
    const agents = Array.from({ length: 10 }, (_, i) => makeAgent(i, i + 1));
    const [p10, , p50] = wealthPercentiles(agents);
    expect(p10).toBe(1);
    expect(p50).toBe(5);
  });

  it("p99 >= p50 >= p10 for any distribution", () => {
    const agents = [makeAgent(0, 5), makeAgent(1, 100), makeAgent(2, 200), makeAgent(3, 10)];
    const [p10, , p50, , , p99] = wealthPercentiles(agents);
    expect(p99).toBeGreaterThanOrEqual(p50);
    expect(p50).toBeGreaterThanOrEqual(p10);
  });
});

describe("meanBalance", () => {
  it("returns 0 for empty array", () => {
    expect(meanBalance([])).toBe(0);
  });

  it("computes the arithmetic mean", () => {
    const agents = [makeAgent(0, 100), makeAgent(1, 200), makeAgent(2, 300)];
    expect(meanBalance(agents)).toBeCloseTo(200);
  });
});
