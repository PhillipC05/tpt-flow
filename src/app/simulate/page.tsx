import type { Metadata } from "next";
import { SimulatorClient } from "./SimulatorClient";

export const metadata: Metadata = {
  title: "Simulation — Model Your Economy",
  description: "Configure demurrage rates, accumulation caps, and commons distribution to see how TPT Flow mechanics affect money velocity and wealth distribution.",
};

export default function SimulatePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Economy Simulator</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Configure the parameters and observe how demurrage, accumulation caps, and commons
          redistribution affect money velocity and wealth distribution over time.
          Each step represents one month.
        </p>
      </div>
      <SimulatorClient />
    </div>
  );
}
