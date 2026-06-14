import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Demurrage, accumulation limits, and commons redistribution — the three mechanics of TPT Flow.",
};

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
        {n}
      </div>
      <div className="flex-1 pb-10">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <div className="text-muted-foreground text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Badge variant="outline" className="mb-4">Mechanics</Badge>
      <h1 className="text-4xl font-bold mb-4">How TPT Flow Works</h1>
      <p className="text-muted-foreground text-lg mb-12">
        Three programmable mechanics working together to enforce circulation and prevent
        structural wealth concentration.
      </p>

      {/* Mechanic 1: Demurrage */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">1. Demurrage — Velocity Enforcement</h2>
        <Card className="mb-6 border-primary/20 bg-accent/20">
          <CardContent className="pt-6">
            <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary pl-4">
              "Silvio Gesell proposed demurrage in 1906. John Maynard Keynes called it one of
              the most important unimplemented economic ideas of the 20th century. Modern smart
              contract infrastructure finally makes it globally deployable."
            </blockquote>
          </CardContent>
        </Card>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Demurrage is a holding cost on idle currency. Wallets holding TPT Flow tokens
            beyond a threshold period incur a small automatic charge. This charge is
            redistributed proportionally to active participants — not burned.
          </p>
          <p>
            <strong className="text-foreground">Free tier:</strong> A base holding amount is
            exempt from demurrage. Small wallets are not penalised. The free tier ensures
            that low-income participants can hold reasonable reserves without cost.
          </p>
          <p>
            <strong className="text-foreground">Suggested starting rate:</strong> 0.5–1% per
            month on balances exceeding the free tier threshold. This rate is a governance
            parameter — adjustable within bounded ranges by verified-human vote.
          </p>
          <p>
            <strong className="text-foreground">Implementation:</strong> Smart contracts
            use time-weighted balance decay. On-chain timestamps record last activity. Each
            transaction triggers a balance recalculation applying the holding cost for the
            elapsed period since last activity.
          </p>
        </div>

        {/* Wallet lifecycle diagram */}
        <div className="mt-8 p-6 rounded-lg border border-border bg-muted/20">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Wallet Lifecycle Example</p>
          <div className="grid grid-cols-4 gap-2 text-xs text-center">
            {[
              { label: "Day 0", value: "1,000 TPT", note: "Received" },
              { label: "Day 30", value: "995 TPT", note: "0.5% demurrage applied" },
              { label: "Day 31", value: "1,045 TPT", note: "Used in transaction" },
              { label: "Day 60", value: "1,039 TPT", note: "0.5% demurrage applied" },
            ].map(({ label, value, note }) => (
              <div key={label} className="p-3 rounded border border-border bg-background">
                <p className="text-muted-foreground mb-1">{label}</p>
                <p className="font-bold text-primary">{value}</p>
                <p className="text-muted-foreground mt-1">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Mechanic 2: Accumulation Limits */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">2. Accumulation Limits</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Smart contract logic enforces two-tier caps on individual wallet holdings.
          These caps are not arbitrary — they are derived from network-wide average balances,
          ensuring they scale automatically with the size and activity of the network.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Soft Cap</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">Set at a multiple of the mean wallet balance (e.g. 5×).</p>
              <p>Triggers <strong className="text-foreground">escalating demurrage</strong> on the amount above the cap. The rate increases progressively — the further above the soft cap, the higher the cost.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hard Cap</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">Set at a higher multiple (e.g. 10×).</p>
              <p>Any balance exceeding the hard cap is <strong className="text-foreground">automatically redirected</strong> to the commons pool. The wallet cannot hold more than the hard cap at any point.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-accent/20">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Both caps are governance parameters — adjustable by verified-human vote within bounded
            ranges set at launch. The bounds themselves are immutable at the contract level.
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-16" />

      {/* Mechanic 3: Commons Redistribution */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">3. Commons Redistribution</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          The commons pool is the destination for all demurrage proceeds and hard-cap overflow.
          Money flows in automatically; distribution flows out each period to all verified participants.
        </p>

        <div className="space-y-3">
          {[
            {
              title: "Proportional formula",
              desc: "Distribution weight = transaction count in the period. High-frequency participants receive more. Incentivises real-economy activity.",
            },
            {
              title: "Uniform formula",
              desc: "Equal share per verified participant regardless of activity. Simpler, more egalitarian.",
            },
            {
              title: "Hybrid formula",
              desc: "A weighted blend of proportional and uniform. Balances participation incentives with baseline universal distribution.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="flex gap-4 p-4 rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-16" />

      {/* How the three interact */}
      <section>
        <h2 className="text-2xl font-bold mb-6">How the Three Mechanics Interact</h2>
        <div className="relative">
          <div className="border-l-2 border-primary/30 pl-6">
            <Step n={1} title="A wallet accumulates tokens above the free tier">
              Demurrage begins accruing on the balance above the free tier threshold. The cost
              is small at first — 0.5–1% per month.
            </Step>
            <Step n={2} title="Balance approaches the soft cap">
              Demurrage rate escalates. The cost of holding becomes progressively more expensive
              than spending. The wallet has a strong incentive to transact.
            </Step>
            <Step n={3} title="Balance hits the hard cap">
              Overflow is automatically redirected to the commons pool. The wallet cannot
              accumulate beyond this point regardless of intent.
            </Step>
            <Step n={4} title="Commons pool distributes">
              Every period, the pool distributes to all verified participants. Low-activity
              participants receive a basic distribution. High-frequency participants receive
              more, proportional to their real-economy contribution.
            </Step>
          </div>
        </div>
      </section>
    </div>
  );
}
