"use client";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DEFAULT_CONFIG, PRESETS } from "@/lib/simulation/engine";
import type { SimulationConfig } from "@/lib/simulation/types";
import { Label } from "@/components/ui/label";

interface Props {
  config: SimulationConfig;
  onChange: (update: Partial<SimulationConfig>) => void;
  onRun: () => void;
  onReset: () => void;
  running: boolean;
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// Base UI Slider value can be number | readonly number[] — normalise to number
function num(v: number | readonly number[]): number {
  return Array.isArray(v) ? (v as number[])[0] : (v as number);
}

export function ConfigPanel({ config, onChange, onRun, onReset, running }: Props) {
  const approxMean = config.totalSupply / config.agents;
  const approxSoftCap = Math.round(approxMean * config.softCapMultiplier);
  const approxHardCap = Math.round(approxMean * config.hardCapMultiplier);

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Presets</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => onChange({ ...DEFAULT_CONFIG, ...preset })}
            >
              {(preset as { label?: string }).label ?? key}
            </Button>
          ))}
        </div>
      </div>

      {/* Demurrage */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Demurrage</p>
        <div className="space-y-4">
          <Row
            label="Demurrage Rate"
            hint={`${(config.demurrageRate * 100).toFixed(2)}% / month`}
          >
            <Slider
              aria-label="Demurrage Rate"
              min={0} max={0.05} step={0.001}
              value={config.demurrageRate}
              onValueChange={(v) => onChange({ demurrageRate: num(v) })}
            />
          </Row>
          <Row
            label="Free Tier"
            hint={`${config.freeTierAmount} TPT`}
          >
            <Slider
              aria-label="Free Tier Amount"
              min={0} max={500} step={10}
              value={config.freeTierAmount}
              onValueChange={(v) => onChange({ freeTierAmount: num(v) })}
            />
          </Row>
        </div>
      </div>

      {/* Accumulation Caps */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Accumulation Caps</p>
        <div className="space-y-4">
          <Row
            label="Soft Cap Multiplier"
            hint={`${config.softCapMultiplier}× mean (~${approxSoftCap} TPT)`}
          >
            <Slider
              aria-label="Soft Cap Multiplier"
              min={2} max={20} step={0.5}
              value={config.softCapMultiplier}
              onValueChange={(v) => onChange({ softCapMultiplier: Math.min(num(v), config.hardCapMultiplier - 1) })}
            />
          </Row>
          <Row
            label="Hard Cap Multiplier"
            hint={`${config.hardCapMultiplier}× mean (~${approxHardCap} TPT)`}
          >
            <Slider
              aria-label="Hard Cap Multiplier"
              min={3} max={30} step={0.5}
              value={config.hardCapMultiplier}
              onValueChange={(v) => onChange({ hardCapMultiplier: Math.max(num(v), config.softCapMultiplier + 1) })}
            />
          </Row>
          <Row
            label="Soft Cap Surcharge"
            hint={`${config.softCapSurchargeMultiplier}× standard rate`}
          >
            <Slider
              aria-label="Soft Cap Surcharge Multiplier"
              min={1} max={10} step={0.5}
              value={config.softCapSurchargeMultiplier}
              onValueChange={(v) => onChange({ softCapSurchargeMultiplier: num(v) })}
            />
          </Row>
        </div>
      </div>

      {/* Commons */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Commons Distribution</p>
        <div className="space-y-3">
          {(["proportional", "uniform", "hybrid"] as const).map((f) => (
            <label key={f} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="commonsFormula"
                value={f}
                checked={config.commonsFormula === f}
                onChange={() => onChange({ commonsFormula: f })}
                className="accent-primary"
              />
              <span className="text-sm capitalize">{f}</span>
            </label>
          ))}
          {config.commonsFormula === "hybrid" && (
            <Row label="Blend Ratio" hint={`${Math.round(config.hybridBlend * 100)}% uniform`}>
              <Slider
                aria-label="Hybrid Blend Ratio"
                min={0} max={1} step={0.05}
                value={config.hybridBlend}
                onValueChange={(v) => onChange({ hybridBlend: num(v) })}
              />
            </Row>
          )}
        </div>
      </div>

      {/* Network */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Network</p>
        <div className="space-y-4">
          <Row label="Agents" hint={`${config.agents} participants`}>
            <Slider
              aria-label="Number of Agents"
              min={50} max={1000} step={50}
              value={config.agents}
              onValueChange={(v) => onChange({ agents: num(v) })}
            />
          </Row>
          <Row label="Steps" hint={`${config.steps} months`}>
            <Slider
              aria-label="Simulation Steps (months)"
              min={6} max={60} step={6}
              value={config.steps}
              onValueChange={(v) => onChange({ steps: num(v) })}
            />
          </Row>
          <Row label="Tx Frequency" hint={`${(config.transactionFrequency * 100).toFixed(0)}% per agent/mo`}>
            <Slider
              aria-label="Transaction Frequency"
              min={0.05} max={1} step={0.05}
              value={config.transactionFrequency}
              onValueChange={(v) => onChange({ transactionFrequency: num(v) })}
            />
          </Row>
          <Row label="Initial Distribution" hint="">
            <div className="flex gap-4">
              {(["uniform", "pareto"] as const).map((d) => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="initialDistribution"
                    value={d}
                    checked={config.initialDistribution === d}
                    onChange={() => onChange({ initialDistribution: d })}
                    className="accent-primary"
                  />
                  <span className="text-sm capitalize">{d}</span>
                </label>
              ))}
            </div>
          </Row>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button onClick={onRun} disabled={running} className="flex-1">
          {running ? "Running…" : "Run Simulation"}
        </Button>
        <Button onClick={onReset} variant="outline">Reset</Button>
      </div>
    </div>
  );
}
