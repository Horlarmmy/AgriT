import { Card, CardHeader } from "../components/ui/Card";
import { ScoreRing } from "../components/ui/Badges";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { FACTOR_LABELS } from "../lib/mock";

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

function FactorBar({ name, value }: { name: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function Scoring() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">How AgriTrust Scores Work</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The engine turns raw wallet behavior into one explainable 0–100 score. Each of the five
            factors below can be inspected — so a farmer (or a lender) always knows why a number went
            up or down.
          </p>
        </div>

        <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="flex flex-col items-center justify-center text-center">
            <ScoreRing score={SAMPLE_SCORE.score} />
            <p className="mt-4 text-lg font-bold capitalize">{SAMPLE_SCORE.label} trust</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Example profile — 6 harvest seasons of verified activity
            </p>
          </Card>

          <Card>
            <CardHeader
              title="Factor breakdown"
              subtitle="Weighted inputs to the displayed score"
            />
            <div className="space-y-5">
              {Object.entries(SAMPLE_SCORE.factors).map(([key, value]) => (
                <FactorBar key={key} name={FACTOR_LABELS[key] ?? key} value={value} />
              ))}
            </div>
          </Card>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader title="Verifiable, not trusted" />
            <p className="text-sm text-muted-foreground">
              Every score is shipped alongside a SHA-256 hash of the exact activity payload that
              produced it. Anyone can replay the inputs from public Horizon data and confirm the
              on-chain certificate matches what the engine actually saw.
            </p>
          </Card>
          <Card>
            <CardHeader title="Deterministic math, plain-English output" />
            <p className="text-sm text-muted-foreground">
              The score is computed deterministically — no AI in the loop for the number itself. An
              optional explanation layer translates the factors into language a farmer and a lender
              can both act on.
            </p>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}