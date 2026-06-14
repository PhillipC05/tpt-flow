import type { Agent, SimulationConfig } from "./types";

/**
 * Distribute the commons pool to all agents.
 * Returns the total amount distributed.
 */
export function distributeCommons(
  agents: Agent[],
  poolSize: number,
  config: SimulationConfig,
  hardCap: number
): number {
  if (poolSize <= 0 || agents.length === 0) return 0;

  const weights = computeWeights(agents, config);
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  if (totalWeight === 0) return 0;

  let totalDistributed = 0;

  for (let i = 0; i < agents.length; i++) {
    const share = (weights[i] / totalWeight) * poolSize;
    const distribution = Math.min(share, hardCap - agents[i].balance);
    if (distribution <= 0) continue;
    agents[i].balance += distribution;
    totalDistributed += distribution;
  }

  return totalDistributed;
}

function computeWeights(agents: Agent[], config: SimulationConfig): number[] {
  const n = agents.length;

  if (config.commonsFormula === "uniform") {
    return Array(n).fill(1);
  }

  if (config.commonsFormula === "proportional") {
    return agents.map((a) => Math.max(a.txCount, 0.1));
  }

  // hybrid: blend of uniform and proportional
  const blend = config.hybridBlend; // 0 = all proportional, 1 = all uniform
  return agents.map((a) => {
    const proportional = Math.max(a.txCount, 0.1);
    const uniform = 1;
    return proportional * (1 - blend) + uniform * blend;
  });
}
