import type { Agent, SimulationConfig } from "./types";

/**
 * Apply demurrage to all agents for one time step.
 * Returns the total demurrage collected to add to the commons pool.
 *
 * Three tiers:
 *   balance ≤ freeTier           → no charge
 *   freeTier < balance ≤ softCap → standard rate
 *   softCap < balance ≤ hardCap  → standard rate × surchargeMultiplier
 *   balance > hardCap            → hard cap overflow → commons; then escalating rate on remainder
 */
export function applyDemurrage(
  agents: Agent[],
  config: SimulationConfig,
  softCap: number,
  hardCap: number
): number {
  let totalCharged = 0;
  const { demurrageRate, freeTierAmount, softCapSurchargeMultiplier } = config;

  for (const agent of agents) {
    // Hard cap overflow first
    if (agent.balance > hardCap) {
      const overflow = agent.balance - hardCap;
      totalCharged += overflow;
      agent.balance = hardCap;
    }

    const balance = agent.balance;
    if (balance <= freeTierAmount) continue;

    let charge = 0;
    const aboveFreeTier = balance - freeTierAmount;

    if (balance <= softCap) {
      // Standard rate on everything above free tier
      charge = aboveFreeTier * demurrageRate;
    } else {
      // Standard rate on the band between free tier and soft cap
      const standardBand = softCap - freeTierAmount;
      charge += standardBand * demurrageRate;

      // Escalating rate on the band between soft cap and hard cap
      const escalatingBand = balance - softCap;
      charge += escalatingBand * demurrageRate * softCapSurchargeMultiplier;
    }

    charge = Math.min(charge, balance - freeTierAmount);
    if (charge <= 0) continue;

    agent.balance -= charge;
    totalCharged += charge;
  }

  return totalCharged;
}
