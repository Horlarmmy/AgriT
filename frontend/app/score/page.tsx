import { Card, CardHeader } from "../components/ui/Card";
import { ScoreRing } from "../components/ui/Badges";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { FACTOR_LABELS } from "../lib/mock";
import { Reveal, StaggerReveal, FloatingImage } from "../components/motion/Reveal";

const SAMPLE_SCORE = {
  score: 82,
  label: "high",
  factors: {
    base: 78,
    consistency: 84,
    recency: 90,
    volume: 74,
    diversity: 66,
  },
};

const factorAssets: Record<string, { image: string; description: string }> = {
  base: {
    image: "/assets/feature-section-3d-imgs/feature_credit_scoring.png",
    description: "Core behavior metrics — season-to-season activity volume, counterparty count, and recency of logging.",
  },
  consistency: {
    image: "/assets/feature-section-3d-imgs/feature_stellar_liquidity.png",
    description: "How regular your farming activity is. Consecutive seasons without gaps raise this factor.",
  },
  recency: {
    image: "/assets/feature-section-3d-imgs/feature_instant_settlement.png",
    description: "How recently you last logged activity. Fresh data means higher trust.",
  },
  volume: {
    image: "/assets/feature-section-3d-imgs/feature_universal_access.png",
    description: "Total harvest value logged over time. Larger consistent volumes signal reliability.",
  },
  diversity: {
    image: "/assets/feature-section-3d-imgs/feature_parametric_insurance.png",
    description: "Variety of counterparties and crop types. Diverse activity shows real operational breadth.",
  },
};

function FactorBar({ name, value, asset }: { name: string; value: number; asset: { image: string; description: string } }) {
  return (
    <Reveal>
      <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30">
        <div className="hidden sm:block">
          <FloatingImage
            src={asset.image}
            alt={name}
            className="h-14 w-14 object-contain"
            duration={6}
            distance={3}
          />
        </div>
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-semibold">{name}</span>
            <span className="text-muted-foreground">{value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${value}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{asset.description}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function Scoring() {
  return (
    <>
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Background pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "url(/assets/abstract-background/pattern_certificate_particles.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative">
          <Reveal>
            <div className="mb-8">
              <h1 className="text-3xl font-bold">How AgriTrust Scores Work</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                The engine turns raw wallet behavior into one explainable 0–100 score. Each of the five
                factors below can be inspected — so a farmer (or a lender) always knows why a number went
                up or down.
              </p>
            </div>
          </Reveal>

          <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <Reveal direction="left" delay={0.1}>
              <Card className="flex flex-col items-center justify-center text-center">
                <FloatingImage
                  src="/assets/hero-imgs/hero_vyc_certificate.png"
                  alt="VYC certificate"
                  className="h-28 w-28 object-contain mb-4"
                  duration={8}
                  distance={5}
                />
                <ScoreRing score={SAMPLE_SCORE.score} />
                <p className="mt-4 text-lg font-bold capitalize">{SAMPLE_SCORE.label} trust</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Example profile — 6 harvest seasons of verified activity
                </p>
              </Card>
            </Reveal>

            <div>
              <Reveal direction="right" delay={0.1}>
                <Card>
                  <CardHeader
                    title="Factor breakdown"
                    subtitle="Weighted inputs to the displayed score"
                  />
                </Card>
              </Reveal>
              <StaggerReveal className="mt-4 space-y-3">
                {Object.entries(SAMPLE_SCORE.factors).map(([key, value]) => (
                  <FactorBar
                    key={key}
                    name={FACTOR_LABELS[key] ?? key}
                    value={value}
                    asset={factorAssets[key]}
                  />
                ))}
              </StaggerReveal>
            </div>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal direction="left" delay={0.1}>
              <Card className="flex gap-4">
                <FloatingImage
                  src="/assets/3d-reusage-icons-img/icon_verified_certificate.png"
                  alt="Verified certificate"
                  className="h-16 w-16 object-contain flex-shrink-0"
                  duration={7}
                  distance={4}
                />
                <div>
                  <CardHeader title="Verifiable, not trusted" />
                  <p className="text-sm text-muted-foreground">
                    Every score is shipped alongside a SHA-256 hash of the exact activity payload that
                    produced it. Anyone can replay the inputs from public Horizon data and confirm the
                    on-chain certificate matches what the engine actually saw.
                  </p>
                </div>
              </Card>
            </Reveal>
            <Reveal direction="right" delay={0.15}>
              <Card className="flex gap-4">
                <FloatingImage
                  src="/assets/3d-reusage-icons-img/icon_transaction_transfer.png"
                  alt="Transaction transfer"
                  className="h-16 w-16 object-contain flex-shrink-0"
                  duration={6}
                  distance={3}
                />
                <div>
                  <CardHeader title="Deterministic math, plain-English output" />
                  <p className="text-sm text-muted-foreground">
                    The score is computed deterministically — no AI in the loop for the number itself. An
                    optional explanation layer translates the factors into language a farmer and a lender
                    can both act on.
                  </p>
                </div>
              </Card>
            </Reveal>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
