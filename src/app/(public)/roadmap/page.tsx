import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Three-phase rollout from closed network pilot to global complementary currency layer.",
};

type PhaseStatus = "active" | "upcoming" | "future";

function PhaseCard({
  phase,
  title,
  status,
  target,
  goal,
  items,
}: {
  phase: string;
  title: string;
  status: PhaseStatus;
  target: string;
  goal: string;
  items: string[];
}) {
  const statusConfig: Record<PhaseStatus, { badge: string; icon: React.ReactNode; colour: string }> = {
    active: { badge: "Active", icon: <Clock className="h-4 w-4 text-primary" />, colour: "border-primary/40" },
    upcoming: { badge: "Upcoming", icon: <Circle className="h-4 w-4 text-muted-foreground" />, colour: "border-border" },
    future: { badge: "Future", icon: <Circle className="h-4 w-4 text-muted-foreground/50" />, colour: "border-border/50 opacity-70" },
  };
  const { badge, icon, colour } = statusConfig[status];

  return (
    <Card className={`${colour}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">{phase}</p>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <div className="flex flex-col items-end gap-1">
            {icon}
            <Badge variant={status === "active" ? "default" : "outline"} className="text-xs">{badge}</Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{target}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{goal}</p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Badge variant="outline" className="mb-4">Roadmap</Badge>
      <h1 className="text-4xl font-bold mb-4">From Concept to Global Layer</h1>
      <p className="text-muted-foreground text-lg mb-12">
        A currency is worthless until people accept it. The bootstrap problem requires
        critical mass on both sides simultaneously. TPT Flow solves this with a staged
        rollout through increasingly open networks.
      </p>

      <div className="space-y-6 mb-16">
        <PhaseCard
          phase="Phase 0 — Now"
          title="Concept & Simulation"
          status="active"
          target="2025–2026"
          goal="Build the intellectual and technical foundation. Validate economic mechanics through simulation before writing a single contract."
          items={[
            "Executive summary and whitepaper complete",
            "Documentation site (this site)",
            "Economic simulation / parameter modeller",
            "Legal structure review (NZ/AU crypto-specialist firm)",
            "Identify pilot community candidate",
            "Commission economic modelling",
          ]}
        />
        <PhaseCard
          phase="Phase 1 — Closed Network"
          title="First Pilot"
          status="upcoming"
          target="Seeking pilot partner"
          goal="Launch within a defined economic network where trust already exists and pain is acute. Prove that velocity mechanics work and accumulation limits don't kill participation."
          items={[
            "Select pilot community (freelancer co-op / SME supply chain / remittance corridor)",
            "Deploy core smart contracts to testnet",
            "ZK identity integration",
            "Basic wallet PWA (send/receive/demurrage display)",
            "Merchant API for pilot participants",
            "Target: 500–2,000 active wallets",
          ]}
        />
        <PhaseCard
          phase="Phase 2 — Network Expansion"
          title="Open Network"
          status="future"
          target="After Phase 1 success"
          goal="Open to adjacent networks. Build merchant acceptance. Develop API ecosystem. Establish commons pool governance with verified-human voting."
          items={[
            "Open to adjacent communities",
            "Public merchant API and SDKs",
            "Governance portal for parameter voting",
            "Multi-ramp fiat on/off (rate-limited)",
            "Target: 10,000–50,000 active wallets",
          ]}
        />
        <PhaseCard
          phase="Phase 3 — Global Layer"
          title="Open Protocol"
          status="future"
          target="Long-term"
          goal="Open protocol. Global mobile wallet. Focus on emerging markets where banking exclusion is highest and the alternative financial system is weakest."
          items={[
            "Open protocol with public governance",
            "Global mobile wallet (offline-capable for emerging markets)",
            "Multiple fiat on/off ramp integrations",
            "Remittance corridor focus",
            "Target: 500,000+ active wallets",
          ]}
        />
      </div>

      {/* Immediate next steps */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Immediate Next Steps</h2>
        <p className="text-muted-foreground text-sm mb-6">
          This is a concept-stage project. The concrete near-term actions are:
        </p>
        <div className="space-y-3">
          {[
            "Validate the closed-network bootstrap target — identify a specific community willing to pilot",
            "Engage a smart contract security firm for architecture review before any contract is written",
            "Commission economic modelling: what demurrage rate and accumulation cap produces optimal velocity without destroying participation incentives?",
            "Legal review: NZ/AU crypto-specialist firm to assess regulatory classification and optimal legal structure",
            "Use the simulation tool to model different parameter configurations",
            "Define the convertibility model in detail — the highest-risk open design question",
          ].map((item, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-lg border border-border">
              <span className="text-primary font-bold text-sm flex-shrink-0">{i + 1}.</span>
              <span className="text-sm text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
