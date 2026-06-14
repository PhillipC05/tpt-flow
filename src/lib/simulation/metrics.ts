import type { Agent } from "./types";

export function giniCoefficient(agents: Agent[]): number {
  const n = agents.length;
  if (n === 0) return 0;

  const sorted = [...agents].sort((a, b) => a.balance - b.balance);
  const totalBalance = sorted.reduce((s, a) => s + a.balance, 0);
  if (totalBalance === 0) return 0;

  let sumOfAbsDiff = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sumOfAbsDiff += Math.abs(sorted[i].balance - sorted[j].balance);
    }
  }

  return sumOfAbsDiff / (2 * n * totalBalance);
}

export function wealthPercentiles(agents: Agent[], percentiles: number[] = [10, 25, 50, 75, 90, 99]): number[] {
  if (agents.length === 0) return percentiles.map(() => 0);

  const sorted = [...agents].map((a) => a.balance).sort((a, b) => a - b);
  const n = sorted.length;

  return percentiles.map((p) => {
    const idx = Math.floor((p / 100) * (n - 1));
    return sorted[Math.max(0, Math.min(idx, n - 1))];
  });
}

export function velocityProxy(transactionVolume: number, totalSupply: number): number {
  if (totalSupply === 0) return 0;
  return transactionVolume / totalSupply;
}

export function meanBalance(agents: Agent[]): number {
  if (agents.length === 0) return 0;
  return agents.reduce((s, a) => s + a.balance, 0) / agents.length;
}
