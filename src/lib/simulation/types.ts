export interface SimulationConfig {
  agents: number;
  steps: number;
  seed: number;
  demurrageRate: number;        // fraction per month, e.g. 0.01 = 1%
  freeTierAmount: number;       // TPT exempt from demurrage
  softCapMultiplier: number;    // soft cap = softCapMultiplier × mean balance
  hardCapMultiplier: number;    // hard cap = hardCapMultiplier × mean balance
  softCapSurchargeMultiplier: number; // rate multiplier above soft cap
  commonsFormula: "proportional" | "uniform" | "hybrid";
  hybridBlend: number;          // 0–1: proportion of uniform vs proportional (only for hybrid)
  initialDistribution: "uniform" | "pareto";
  transactionFrequency: number; // avg transactions per agent per step
  totalSupply: number;          // total TPT in the network
}

export interface Agent {
  id: number;
  balance: number;
  txCount: number;              // transactions this step (reset each step)
  totalTxCount: number;         // lifetime transactions
}

export interface SimulationSnapshot {
  step: number;
  velocity: number;             // total transaction volume this step / total supply
  giniCoefficient: number;
  commonsPoolSize: number;
  totalDemurragePaid: number;
  totalCommonsDistributed: number;
  totalTransactionVolume: number;
  wealthPercentiles: number[];  // [p10, p25, p50, p75, p90, p99]
  meanBalance: number;
  softCap: number;
  hardCap: number;
}

export interface SimulationState {
  agents: Agent[];
  commonsPool: number;
  totalDemurragePaid: number;
  totalCommonsDistributed: number;
  totalTransactionVolume: number;
  step: number;
}

export interface SimulationResult {
  config: SimulationConfig;
  snapshots: SimulationSnapshot[];
}
