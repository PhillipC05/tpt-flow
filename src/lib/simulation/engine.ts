import type { SimulationConfig, SimulationResult, SimulationSnapshot, SimulationState } from "./types";
import { createAgents, executeTransactions, resetStepCounters, selectTransactionPairs } from "./agents";
import { applyDemurrage } from "./demurrage";
import { distributeCommons } from "./commons";
import { giniCoefficient, meanBalance, velocityProxy, wealthPercentiles } from "./metrics";
import { createRng } from "./rng";

export const DEFAULT_CONFIG: SimulationConfig = {
  agents: 200,
  steps: 24,
  seed: 42,
  demurrageRate: 0.01,
  freeTierAmount: 100,
  softCapMultiplier: 5,
  hardCapMultiplier: 10,
  softCapSurchargeMultiplier: 3,
  commonsFormula: "proportional",
  hybridBlend: 0.5,
  initialDistribution: "pareto",
  transactionFrequency: 0.3,
  totalSupply: 100000,
};

export const PRESETS: Record<string, Partial<SimulationConfig>> = {
  baseline: {
    demurrageRate: 0,
    softCapMultiplier: 100,
    hardCapMultiplier: 200,
    softCapSurchargeMultiplier: 1,
    label: "Baseline (No Demurrage)",
  } as Partial<SimulationConfig> & { label: string },
  gentle: {
    demurrageRate: 0.005,
    softCapMultiplier: 8,
    hardCapMultiplier: 15,
    softCapSurchargeMultiplier: 2,
    label: "Gentle (0.5%/mo)",
  } as Partial<SimulationConfig> & { label: string },
  standard: {
    demurrageRate: 0.01,
    softCapMultiplier: 5,
    hardCapMultiplier: 10,
    softCapSurchargeMultiplier: 3,
    label: "Standard (1%/mo)",
  } as Partial<SimulationConfig> & { label: string },
  strong: {
    demurrageRate: 0.02,
    softCapMultiplier: 4,
    hardCapMultiplier: 8,
    softCapSurchargeMultiplier: 4,
    label: "Strong (2%/mo)",
  } as Partial<SimulationConfig> & { label: string },
};

function takeSnapshot(state: SimulationState, config: SimulationConfig, stepVolume: number, softCap: number, hardCap: number): SimulationSnapshot {
  const mean = meanBalance(state.agents);
  return {
    step: state.step,
    velocity: velocityProxy(stepVolume, config.totalSupply),
    giniCoefficient: giniCoefficient(state.agents),
    commonsPoolSize: state.commonsPool,
    totalDemurragePaid: state.totalDemurragePaid,
    totalCommonsDistributed: state.totalCommonsDistributed,
    totalTransactionVolume: state.totalTransactionVolume,
    wealthPercentiles: wealthPercentiles(state.agents),
    meanBalance: mean,
    softCap,
    hardCap,
  };
}

export function runSimulation(config: SimulationConfig): SimulationResult {
  const rng = createRng(config.seed + 1); // different seed from agent init
  const agents = createAgents(config);

  const state: SimulationState = {
    agents,
    commonsPool: 0,
    totalDemurragePaid: 0,
    totalCommonsDistributed: 0,
    totalTransactionVolume: 0,
    step: 0,
  };

  const snapshots: SimulationSnapshot[] = [];

  // Initial snapshot (step 0)
  const initialMean = meanBalance(agents);
  const initialSoftCap = initialMean * config.softCapMultiplier;
  const initialHardCap = initialMean * config.hardCapMultiplier;
  snapshots.push(takeSnapshot(state, config, 0, initialSoftCap, initialHardCap));

  for (let step = 1; step <= config.steps; step++) {
    resetStepCounters(agents);

    // 1. Transactions
    const pairs = selectTransactionPairs(agents, config.transactionFrequency, rng);
    const stepVolume = executeTransactions(agents, pairs);
    state.totalTransactionVolume += stepVolume;

    // 2. Compute caps from current mean
    const mean = meanBalance(agents);
    const softCap = mean * config.softCapMultiplier;
    const hardCap = mean * config.hardCapMultiplier;

    // 3. Apply demurrage (only if rate > 0)
    if (config.demurrageRate > 0) {
      const demurrageCollected = applyDemurrage(agents, config, softCap, hardCap);
      state.commonsPool += demurrageCollected;
      state.totalDemurragePaid += demurrageCollected;
    }

    // 4. Distribute commons
    const distributed = distributeCommons(agents, state.commonsPool, config, hardCap);
    state.commonsPool -= distributed;
    state.totalCommonsDistributed += distributed;

    state.step = step;
    snapshots.push(takeSnapshot(state, config, stepVolume, softCap, hardCap));
  }

  return { config, snapshots };
}

export function runComparison(configA: SimulationConfig, configB: SimulationConfig): { a: SimulationResult; b: SimulationResult } {
  // Use same seed for fair comparison
  const seed = configA.seed;
  return {
    a: runSimulation({ ...configA, seed }),
    b: runSimulation({ ...configB, seed }),
  };
}
