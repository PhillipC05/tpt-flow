import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, TrendingDown, Zap, Users, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="outline" className="mb-6 text-primary border-primary/30">
            Concept Stage · Seeking Pilot Partners
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Money that{" "}
            <span className="text-primary">must move</span>
            <br />
            creates economic activity.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            TPT Flow is a programmable complementary currency with built-in demurrage — a
            holding cost on idle money. Sitting still is expensive. Spending is rewarded.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/simulate" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
              Try the Simulation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/how-it-works" className={buttonVariants({ size: "lg", variant: "outline" })}>
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem in One Number */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground text-center mb-10">
            The Problem in One Number
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">+91%</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                US M2 money supply grew between 2015 and 2026
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">+34%</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Consumer prices rose over the same period
              </CardContent>
            </Card>
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-destructive">−36%</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Money velocity fell — the missing 57% accumulated in asset markets
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-muted-foreground mt-8 max-w-xl mx-auto text-sm">
            The missing 57% didn't vanish. It accumulated in asset markets accessible primarily
            to the wealthy, while money velocity fell 36% over the same period.
          </p>
        </div>
      </section>

      {/* Three Mechanics */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Three Mechanics. One Goal.</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Programmable rules that make wealth concentration economically self-correcting.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <TrendingDown className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Demurrage</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Wallets holding TPT Flow beyond a threshold period incur a small automatic
                holding cost. Proceeds are redistributed to active participants. Hoarding is
                expensive. Circulating is rewarded.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Accumulation Limits</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Smart contract logic enforces soft and hard caps on individual wallet
                holdings. Escalating demurrage above soft caps. Hard cap overflow redirects
                automatically to the commons pool.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Commons Redistribution</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                A protocol-level commons pool receives overflow from caps and demurrage.
                Distribution is proportional to verified participation — measured by
                transaction frequency, not wealth held.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prior Art Comparison */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Built on Proven Foundations</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            TPT Flow combines mechanics proven across 90 years of complementary currency experiments.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">System</th>
                  <th className="text-left py-3 px-4 font-semibold">Proven</th>
                  <th className="text-left py-3 px-4 font-semibold">Limitation</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["WIR Bank (1934)", "Complementary currency at scale — 60,000 Swiss SMEs", "Geographic, manual trust networks, cannot scale globally"],
                  ["Sardex", "B2B credit network measurably reduced unemployment", "Regionally constrained, no programmable enforcement"],
                  ["Local currencies", "Community circulation mechanics work", "Failed to achieve critical mass beyond small geographies"],
                  ["Crypto / DeFi", "Global reach and programmable money achieved", "Speculation problem — convertibility defeats velocity mechanics"],
                  ["TPT Flow", "Combines demurrage + smart contracts + global reach", "Concept stage — seeking first pilot community"],
                ].map(([sys, proven, limit]) => (
                  <tr key={sys} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="py-3 px-4 font-medium text-foreground">{sys}</td>
                    <td className="py-3 px-4">{proven}</td>
                    <td className="py-3 px-4">{limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <Globe className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Interested in piloting TPT Flow?</h2>
          <p className="text-muted-foreground mb-8">
            We are seeking a closed network for Phase 1 — a freelancer cooperative, SME supply
            chain, or remittance corridor. If your community could benefit from a liquidity
            layer with built-in velocity mechanics, we want to talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/simulate" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
              Model Your Economy <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/docs/parameters" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Read the Spec
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
