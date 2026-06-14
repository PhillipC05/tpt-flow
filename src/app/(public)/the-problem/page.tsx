import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "The Problem",
  description: "Structural wealth concentration, velocity collapse, and why conventional policy fails.",
};

function Stat({ value, label, sublabel, variant = "primary" }: { value: string; label: string; sublabel?: string; variant?: "primary" | "destructive" | "neutral" }) {
  const colour = variant === "primary" ? "text-primary" : variant === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div className="text-center p-6 rounded-lg border border-border bg-card">
      <p className={`text-5xl font-bold mb-2 ${colour}`}>{value}</p>
      <p className="font-semibold text-sm">{label}</p>
      {sublabel && <p className="text-muted-foreground text-xs mt-1">{sublabel}</p>}
    </div>
  );
}

export default function TheProblemPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Badge variant="outline" className="mb-4">The Problem</Badge>
      <h1 className="text-4xl font-bold mb-4">Why Money Stops Moving</h1>
      <p className="text-muted-foreground text-lg mb-12">
        Conventional monetary systems have a structural flaw. TPT Flow is designed to address
        it at the protocol level — not through policy.
      </p>

      {/* Key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        <Stat value="+91%" label="US M2 Growth" sublabel="2015–2026" variant="neutral" />
        <Stat value="+34%" label="Consumer Price Rise" sublabel="same period" variant="neutral" />
        <Stat value="−36%" label="Money Velocity Fall" sublabel="M2V, 2015–2024" variant="destructive" />
      </div>

      {/* Section 1 */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">Structural Wealth Concentration</h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Conventional monetary systems have a structural flaw: new money enters the economy
            through financial channels first. The wealthy sit at the top of that transmission
            chain and extract advantage before money reaches wages or consumer spending.
          </p>
          <p>
            This is not a bug exploited by bad actors — it is the designed architecture of
            capital-first monetary transmission. When central banks expand money supply, the
            first recipients are financial institutions and asset holders. By the time new
            money reaches the real economy, asset prices have already risen.
          </p>
          <Card className="border-primary/20 bg-accent/20">
            <CardContent className="pt-4">
              <p className="text-xs">
                Thomas Piketty's empirical research shows that when the rate of return on
                capital (r) persistently exceeds economic growth (g), wealth concentration
                is the inevitable structural outcome — not an anomaly. R &gt; G is not a
                temporary condition; it is the default state of unregulated capital.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">The Velocity Collapse</h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            As wealth concentrates, money circulates less. High-net-worth individuals spend
            a smaller proportion of their income than lower-income individuals — this is a
            well-documented empirical pattern, not a moral judgement.
          </p>
          <p>
            The more money pools at the top, the less it turns over in the real economy.
            US M2 velocity fell from 1.88 in 2015 to approximately 1.38 in 2024 — a 36%
            decline. This means the same unit of money created 36% less economic activity
            per year in 2024 than in 2015.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">1.88</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xs">M2 Velocity in 2015</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-destructive">1.38</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xs">M2 Velocity in 2024</CardContent>
            </Card>
          </div>
          <p>
            Mian, Straub and Sufi's research on how wealth concentration reduces aggregate
            demand demonstrates that this is self-reinforcing: as wealth concentrates, demand
            falls, growth slows, and the relative advantage of capital over wages increases
            further. The system has no built-in corrective mechanism.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">The Advice Asymmetry</h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Wealthy individuals have access to sophisticated financial advice that allows
            them to stay ahead of every policy intervention: inflation-hedged assets, offshore
            structures, capital gains treatment, estate planning, and political influence
            over the very rules that govern taxation.
          </p>
          <p>
            Each intervention intended to rebalance the system is navigated and neutralised
            before it reaches its target. The people with the best advice are already
            repositioned before the policy move lands.
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Why Conventional Policy Fails</h2>
        <div className="space-y-3">
          {[
            {
              policy: "Quantitative Easing",
              effect: "Inflates asset prices, primarily benefiting those who already hold assets.",
            },
            {
              policy: "Interest Rate Hikes",
              effect: "Crushes borrowers who lack fixed-rate long-term debt — predominantly lower-income households.",
            },
            {
              policy: "Tax Reform",
              effect: "Captured by those it targets through lobbying, structuring, and jurisdictional arbitrage.",
            },
            {
              policy: "Wealth Tax Proposals",
              effect: "Routinely blocked or diluted before implementation; assets move to non-taxable structures in anticipation.",
            },
          ].map(({ policy, effect }) => (
            <div key={policy} className="p-4 rounded-lg border border-border">
              <p className="font-medium text-sm mb-1">{policy}</p>
              <p className="text-muted-foreground text-sm">{effect}</p>
            </div>
          ))}
        </div>
        <Card className="mt-8 border-primary/20 bg-accent/20">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            TPT Flow does not try to fix these policies. It operates as a parallel layer —
            a complementary currency with its goals encoded at the protocol level, not
            reliant on legislative action or political will to enforce.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
