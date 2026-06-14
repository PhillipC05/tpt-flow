"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Copy, Download, Check } from "lucide-react";
import { ConfigPanel } from "@/components/simulation/ConfigPanel";
import { SimCharts } from "@/components/simulation/SimCharts";
import { SummaryStats } from "@/components/simulation/SummaryStats";
import { DEFAULT_CONFIG } from "@/lib/simulation/engine";
import type { SimulationConfig } from "@/lib/simulation/types";
import type { SimulationSnapshot, SimulationResult } from "@/lib/simulation/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── URL serialisation ────────────────────────────────────────────────────────

function configToParams(cfg: SimulationConfig): URLSearchParams {
  const p = new URLSearchParams();
  p.set("agents", String(cfg.agents));
  p.set("steps", String(cfg.steps));
  p.set("seed", String(cfg.seed));
  p.set("dr", String(cfg.demurrageRate));
  p.set("ft", String(cfg.freeTierAmount));
  p.set("sc", String(cfg.softCapMultiplier));
  p.set("hc", String(cfg.hardCapMultiplier));
  p.set("ss", String(cfg.softCapSurchargeMultiplier));
  p.set("cf", cfg.commonsFormula);
  p.set("hb", String(cfg.hybridBlend));
  p.set("id", cfg.initialDistribution);
  p.set("tf", String(cfg.transactionFrequency));
  p.set("ts", String(cfg.totalSupply));
  return p;
}

function paramsToConfig(p: URLSearchParams): SimulationConfig {
  const n = (key: string, fallback: number) => {
    const v = p.get(key);
    if (v === null) return fallback;
    const num = parseFloat(v);
    return isNaN(num) ? fallback : num;
  };
  const cf = p.get("cf");
  const id = p.get("id");
  return {
    agents: n("agents", DEFAULT_CONFIG.agents),
    steps: n("steps", DEFAULT_CONFIG.steps),
    seed: n("seed", DEFAULT_CONFIG.seed),
    demurrageRate: n("dr", DEFAULT_CONFIG.demurrageRate),
    freeTierAmount: n("ft", DEFAULT_CONFIG.freeTierAmount),
    softCapMultiplier: n("sc", DEFAULT_CONFIG.softCapMultiplier),
    hardCapMultiplier: n("hc", DEFAULT_CONFIG.hardCapMultiplier),
    softCapSurchargeMultiplier: n("ss", DEFAULT_CONFIG.softCapSurchargeMultiplier),
    commonsFormula:
      cf === "uniform" || cf === "hybrid" ? cf : "proportional",
    hybridBlend: n("hb", DEFAULT_CONFIG.hybridBlend),
    initialDistribution: id === "uniform" ? "uniform" : "pareto",
    transactionFrequency: n("tf", DEFAULT_CONFIG.transactionFrequency),
    totalSupply: n("ts", DEFAULT_CONFIG.totalSupply),
  };
}

// ─── CSV export ───────────────────────────────────────────────────────────────

function exportCsv(snapshots: SimulationSnapshot[]) {
  const headers = [
    "step",
    "velocity",
    "giniCoefficient",
    "commonsPoolSize",
    "totalDemurragePaid",
    "totalCommonsDistributed",
    "totalTransactionVolume",
    "meanBalance",
    "softCap",
    "hardCap",
    "p10",
    "p25",
    "p50",
    "p75",
    "p90",
    "p99",
  ];
  const rows = snapshots.map((s) => [
    s.step,
    s.velocity.toFixed(6),
    s.giniCoefficient.toFixed(6),
    s.commonsPoolSize.toFixed(2),
    s.totalDemurragePaid.toFixed(2),
    s.totalCommonsDistributed.toFixed(2),
    s.totalTransactionVolume.toFixed(2),
    s.meanBalance.toFixed(2),
    s.softCap.toFixed(2),
    s.hardCap.toFixed(2),
    ...s.wealthPercentiles.map((v) => v.toFixed(2)),
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tptflow-simulation.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

type WorkerResponse = { main: SimulationResult; compare: SimulationResult | null };

export function SimulatorClient() {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [snapshots, setSnapshots] = useState<SimulationSnapshot[]>([]);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareSnapshots, setCompareSnapshots] = useState<SimulationSnapshot[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  // Initialise config from URL on first render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.toString()) {
      setConfig(paramsToConfig(params));
    }
  }, []);

  // Create worker once on mount, tear down on unmount
  useEffect(() => {
    if (typeof Worker === "undefined") return;
    const worker = new Worker(
      new URL("./simulation.worker.ts", import.meta.url)
    );
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const { main, compare } = e.data;
      setSnapshots(main.snapshots);
      setCompareSnapshots(compare ? compare.snapshots : []);
      setIsPending(false);
    };
    worker.onerror = () => setIsPending(false);
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const handleChange = useCallback((update: Partial<SimulationConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...update };
      const params = configToParams(next);
      window.history.replaceState(null, "", "?" + params.toString());
      return next;
    });
  }, []);

  const handleRun = useCallback(() => {
    setIsPending(true);
    const compareConfig = compareEnabled
      ? {
          ...config,
          demurrageRate: 0,
          softCapMultiplier: 100,
          hardCapMultiplier: 200,
          softCapSurchargeMultiplier: 1,
        }
      : null;

    if (workerRef.current) {
      workerRef.current.postMessage({ config, compareConfig });
    } else {
      // Fallback: run synchronously if Workers aren't available
      import("@/lib/simulation/engine").then(({ runSimulation }) => {
        const main = runSimulation(config);
        const compare = compareConfig ? runSimulation(compareConfig) : null;
        setSnapshots(main.snapshots);
        setCompareSnapshots(compare ? compare.snapshots : []);
        setIsPending(false);
      });
    }
  }, [config, compareEnabled]);

  const handleReset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setSnapshots([]);
    setCompareSnapshots([]);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const last = snapshots[snapshots.length - 1];
  const first = snapshots[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Config panel */}
      <div className="lg:w-72 flex-shrink-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <ConfigPanel
              config={config}
              onChange={handleChange}
              onRun={handleRun}
              onReset={handleReset}
              running={isPending}
            />
            <Separator className="my-4" />
            <div className="flex items-center gap-3">
              <Switch
                id="compare"
                checked={compareEnabled}
                onCheckedChange={setCompareEnabled}
              />
              <Label htmlFor="compare" className="text-xs cursor-pointer">
                Compare with baseline (no demurrage)
              </Label>
            </div>
            <Separator className="my-4" />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5 mr-1.5" />Copied!</>
                ) : (
                  <><Copy className="h-3.5 w-3.5 mr-1.5" />Share config</>
                )}
              </Button>
              {snapshots.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => exportCsv(snapshots)}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />Export CSV
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts + summary */}
      <div className="flex-1 min-w-0 space-y-4">
        <SimCharts
          snapshots={snapshots}
          compareSnapshots={compareEnabled && compareSnapshots.length > 0 ? compareSnapshots : undefined}
        />
        {last && first && (
          <SummaryStats first={first} last={last} />
        )}
        {!last && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground text-sm space-y-2">
            <p className="font-medium">Ready to simulate</p>
            <p>
              Adjust the parameters on the left and click{" "}
              <strong>Run Simulation</strong> to model how TPT Flow mechanics
              affect velocity and wealth distribution.
            </p>
            <p className="text-xs">
              Try enabling "Compare with baseline" to see the difference demurrage makes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
