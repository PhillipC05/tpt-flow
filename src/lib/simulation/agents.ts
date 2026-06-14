import type { Agent, SimulationConfig } from "./types";
import { createRng } from "./rng";

export function createAgents(config: SimulationConfig): Agent[] {
  const rng = createRng(config.seed);
  const agents: Agent[] = [];

  if (config.initialDistribution === "uniform") {
    const balance = config.totalSupply / config.agents;
    for (let i = 0; i < config.agents; i++) {
      agents.push({ id: i, balance, txCount: 0, totalTxCount: 0 });
    }
  } else {
    // Pareto: use power-law distribution to simulate wealth concentration
    // Generate raw Pareto values then normalise to totalSupply
    const alpha = 1.16; // Pareto 80/20 approximately
    const raw = Array.from({ length: config.agents }, () => {
      const u = Math.max(rng(), 1e-9);
      return Math.pow(u, -1 / alpha);
    });
    const total = raw.reduce((s, v) => s + v, 0);
    for (let i = 0; i < config.agents; i++) {
      agents.push({
        id: i,
        balance: (raw[i] / total) * config.totalSupply,
        txCount: 0,
        totalTxCount: 0,
      });
    }
  }

  return agents;
}

export function selectTransactionPairs(
  agents: Agent[],
  frequency: number,
  rng: () => number
): Array<[number, number, number]> {
  // Returns [fromIdx, toIdx, amount]
  const n = agents.length;
  const txCount = Math.round(n * frequency);
  const pairs: Array<[number, number, number]> = [];

  for (let i = 0; i < txCount; i++) {
    const fromIdx = Math.floor(rng() * n);
    let toIdx = Math.floor(rng() * (n - 1));
    if (toIdx >= fromIdx) toIdx++;

    const from = agents[fromIdx];
    if (from.balance <= 0) continue;

    // Transaction amount: 1%–20% of sender's balance
    const fraction = 0.01 + rng() * 0.19;
    const amount = Math.min(from.balance, from.balance * fraction);
    if (amount <= 0) continue;

    pairs.push([fromIdx, toIdx, amount]);
  }

  return pairs;
}

export function executeTransactions(
  agents: Agent[],
  pairs: Array<[number, number, number]>
): number {
  let totalVolume = 0;
  for (const [fromIdx, toIdx, amount] of pairs) {
    const from = agents[fromIdx];
    const to = agents[toIdx];
    if (from.balance < amount) continue;
    from.balance -= amount;
    to.balance += amount;
    from.txCount++;
    to.txCount++;
    from.totalTxCount++;
    to.totalTxCount++;
    totalVolume += amount;
  }
  return totalVolume;
}

export function resetStepCounters(agents: Agent[]): void {
  for (const agent of agents) {
    agent.txCount = 0;
  }
}
