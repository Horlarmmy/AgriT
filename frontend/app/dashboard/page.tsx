import { Card, CardHeader } from "../components/ui/Card";
import { ScoreRing, StatusBadge } from "../components/ui/Badges";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { MOCK_VYCS, SAMPLE_FARMER, formatDate, formatYield, shortAddress } from "../lib/mock";

export default function Dashboard() {
  const active = MOCK_VYCS.filter((v) => v.status === "Active");
  const activeValue = active.reduce((sum, v) => sum + v.expectedYield, 0);
  const best = Math.max(...MOCK_VYCS.map((v) => v.score));
  const lifetimeCertificates = MOCK_VYCS.length;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Wallet <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{shortAddress(SAMPLE_FARMER)}</code> ·
            demo data — live wallet scoring connects in the next release
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-muted-foreground">Best trust score</p>
            <p className="mt-1 text-3xl font-bold text-primary">{best}</p>
            <p className="text-xs text-muted-foreground">/100</p>
          </Card>
          <Card>
            <p className="text-sm text-muted-foreground">Active certificates</p>
            <p className="mt-1 text-3xl font-bold">{active.length}</p>
            <p className="text-xs text-muted-foreground">of {lifetimeCertificates} lifetime VYCs</p>
          </Card>
          <Card>
            <p className="text-sm text-muted-foreground">Active financed value</p>
            <p className="mt-1 text-3xl font-bold">{formatYield(activeValue)}</p>
            <p className="text-xs text-muted-foreground">across all active VYCs</p>
          </Card>
          <Card>
            <p className="text-sm text-muted-foreground">Repayment standing</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">Good</p>
            <p className="text-xs text-muted-foreground">no defaults on record</p>
          </Card>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <Card className="p-0">
            <div className="p-6 pb-0">
              <CardHeader
                title="Verifiable Yield Certificates"
                subtitle="Minted against hash-locked proof-of-activity"
              />
            </div>
            <div className="divide-y divide-border">
              {MOCK_VYCS.map((vyc) => (
                <div
                  key={vyc.id}
                  className="flex flex-wrap items-center gap-4 px-6 py-4"
                >
                  <ScoreRing score={vyc.score} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      VYC #{vyc.id} · {vyc.crop}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {vyc.region} · expected yield {formatYield(vyc.expectedYield)} · minted{" "}
                      {formatDate(vyc.createdAt)}
                    </p>
                    <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                      {vyc.activityHash}
                    </p>
                  </div>
                  <StatusBadge status={vyc.status} />
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader
                title="Current trust position"
                subtitle="Latest scored behavior"
              />
              <div className="flex items-center gap-4">
                <ScoreRing score={82} />
                <div>
                  <p className="font-semibold">High trust</p>
                  <p className="text-sm text-muted-foreground">
                    Consistent season-to-season activity across 5 factor groups.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="What would strengthen this"
                subtitle="Engine suggestions"
              />
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">—</span>
                  Hold 3+ months of continuous sales activity to raise the volume factor.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">—</span>
                  Trade with more counterparties to improve diversity.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">—</span>
                  Keep harvest logs updated promptly for best recency credit.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}