import { runSimulation } from "@/lib/simulation/engine";
import type { SimulationConfig } from "@/lib/simulation/types";

type WorkerRequest = {
  config: SimulationConfig;
  compareConfig: SimulationConfig | null;
};

self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  const { config, compareConfig } = event.data;
  const main = runSimulation(config);
  const compare = compareConfig ? runSimulation(compareConfig) : null;
  self.postMessage({ main, compare });
});
