import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Vote, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Governance",
  description: "One-person-one-vote governance with ZK identity. Immutable core mechanics. Bounded adjustable parameters.",
};

export default function GovernancePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Badge variant="outline" className="mb-4">Governance</Badge>
      <h1 className="text-4xl font-bold mb-4">Governance Without Plutocracy</h1>
      <p className="text-muted-foreground text-lg mb-12">
        Governance is the hardest unsolved problem in parallel currency design. TPT Flow
        addresses it with one-person-one-vote mechanics and immutable core rules.
      </p>

      {/* The core risk */}
      <Card className="border-destructive/30 mb-12">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">The Governance Risk</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Conventional token-voting DAO governance is vulnerable to plutocratic capture.
            Wealthy participants buy governance tokens and set rules in their favour,
            recreating the exact problem TPT Flow is designed to solve.
          </p>
          <p className="mt-3 font-medium text-foreground">
            If governance can be bought, the system will be bought.
          </p>
        </CardContent>
      </Card>

      {/* One-person-one-vote */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <Vote className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">One Person, One Vote</h2>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Governance is gated by verified unique human identity — not token holdings.
            One verified person equals one vote, regardless of wallet balance.
          </p>
          <p>
            Identity verification uses zero-knowledge proofs: participants can prove they
            are a unique real human without revealing personal data. This prevents Sybil
            attacks (one person controlling many wallets) while preserving privacy.
          </p>
          <div className="p-4 rounded-lg border border-border bg-muted/20 text-xs">
            <p className="font-semibold mb-2">ZK Identity Integration (Planned)</p>
            <p>
              The identity layer will integrate with existing ZK identity protocols evaluated
              at contract phase. Requirements: Sybil resistance, no personal data on-chain,
              revocable credentials, global accessibility. Candidate protocols are compared
              in the{" "}
              <a href="/docs/architecture" className="text-primary underline">architecture docs</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Immutable vs mutable */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Immutable Core, Bounded Parameters</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Not everything should be governable. The core mechanics that define what TPT Flow
          is are immutable at the contract level. Governance can only adjust parameters
          within bounds set at launch.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Parameter</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Demurrage mechanism exists", "Immutable", "Demurrage cannot be disabled"],
                ["Commons pool existence", "Immutable", "Pool cannot be eliminated"],
                ["One-person-one-vote rule", "Immutable", "Governance model cannot be changed to token-voting"],
                ["Demurrage rate", "Adjustable", "Within bounds: 0.1%–5% per month"],
                ["Free tier amount", "Adjustable", "Within bounds: 0–500 TPT"],
                ["Soft cap multiplier", "Adjustable", "Within bounds: 2×–10× mean balance"],
                ["Hard cap multiplier", "Adjustable", "Must exceed soft cap; max 20×"],
                ["Commons distribution formula", "Adjustable", "Proportional / uniform / hybrid"],
                ["Fiat conversion rate limits", "Adjustable", "Within bounds set at launch"],
              ].map(([param, status, notes]) => (
                <tr key={param} className="border-b border-border/40">
                  <td className="py-3 px-4 font-medium text-foreground">{param}</td>
                  <td className="py-3 px-4">
                    <Badge variant={status === "Immutable" ? "default" : "outline"} className="text-xs">
                      {status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-xs">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Governance process */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Governance Process</h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Parameter changes require a verified-human vote. The process is designed to
            be deliberate — not instant — to prevent flash governance attacks.
          </p>
          <div className="space-y-3">
            {[
              { step: "Proposal", desc: "Any verified participant can submit a parameter change proposal with a rationale." },
              { step: "Discussion Period", desc: "Minimum 7-day discussion window before voting opens." },
              { step: "Vote", desc: "One-person-one-vote. Simple majority for minor adjustments; supermajority for larger changes." },
              { step: "Time-lock", desc: "Passed changes enter a 48-hour time-lock before execution, allowing participants to respond." },
              { step: "Execution", desc: "Smart contract executes the change automatically if the time-lock expires without a veto." },
            ].map(({ step, desc }) => (
              <div key={step} className="flex gap-4 p-4 rounded-lg border border-border">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">{step}</p>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Card className="border-primary/20 bg-accent/20 mt-4">
            <CardContent className="pt-4 text-xs">
              The full governance specification — including quorum requirements, proposal
              thresholds, and emergency pause mechanisms — is documented in{" "}
              <a href="/docs/governance" className="text-primary underline">docs/governance</a>.
              This page is a summary; the spec document is authoritative.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
