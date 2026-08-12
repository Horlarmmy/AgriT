import { Card, CardHeader } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/Badges";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { MOCK_VYCS, formatDate, formatYield, shortAddress } from "../lib/mock";

const crops = ["MAIZE", "COCOA", "SOYBEAN", "RICE", "CASSAVA"];
const statuses = ["Active", "Redeemed", "Expired", "Cancelled"];

export default function Admin() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">VYC Administration</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mint Verifiable Yield Certificates and update their lifecycle status. Form is read-only
            for now — it wires to <code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /admin/vyc/mint</code> in the next release.
          </p>
        </div>

        <section className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card>
            <CardHeader title="Mint a new VYC" subtitle="Protected by x-admin-token on the API" />
            <form className="space-y-4">
              <div>
                <label htmlFor="farmer" className="mb-1 block text-sm font-medium">
                  Farmer Stellar address
                </label>
                <input
                  id="farmer"
                  type="text"
                  defaultValue="GCPUBA6Y7GZBC5E4VSU7CTHNWN3WQ4FM47R3FM4RH2AWUBAKJ2NBVKX4"
                  disabled
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm disabled:opacity-70"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="crop" className="mb-1 block text-sm font-medium">Crop</label>
                  <select id="crop" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                    {crops.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="region" className="mb-1 block text-sm font-medium">Region</label>
                  <select id="region" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                    <option>NG-OYO</option>
                    <option>NG-ON</option>
                    <option>NG-KW</option>
                    <option>NG-EB</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="yield" className="mb-1 block text-sm font-medium">
                  Expected harvest value (USD)
                </label>
                <input
                  id="yield"
                  type="number"
                  defaultValue={45000}
                  disabled
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm disabled:opacity-70"
                />
              </div>
              <div>
                <label htmlFor="score" className="mb-1 block text-sm font-medium">Credit score</label>
                <input
                  id="score"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={82}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Mint VYC (submission disabled in preview)
              </button>
              <p className="text-xs text-muted-foreground">
                On submission, the backend verifies proof-of-activity, derives the score and hash, and
                calls <code className="rounded bg-muted px-1 py-0.5">mint_vyc</code> on-chain.
              </p>
            </form>
          </Card>

          <Card className="p-0">
            <div className="p-6 pb-0">
              <CardHeader
                title="Certificate registry"
                subtitle="Latest minted VYCs"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-6 py-3 font-medium">VYC</th>
                    <th className="px-6 py-3 font-medium">Crop</th>
                    <th className="px-6 py-3 font-medium">Region</th>
                    <th className="px-6 py-3 font-medium">Value</th>
                    <th className="px-6 py-3 font-medium">Minted</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_VYCS.map((vyc) => (
                    <tr key={vyc.id} className="hover:bg-muted/50">
                      <td className="px-6 py-3 font-mono">{shortAddress(vyc.activityHash)}</td>
                      <td className="px-6 py-3">{vyc.crop}</td>
                      <td className="px-6 py-3">{vyc.region}</td>
                      <td className="px-6 py-3">{formatYield(vyc.expectedYield)}</td>
                      <td className="px-6 py-3">{formatDate(vyc.createdAt)}</td>
                      <td className="px-6 py-3">
                        <StatusBadge status={vyc.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border p-4 px-6 text-xs text-muted-foreground">
              <div className="flex flex-wrap gap-3">
                {statuses.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5">
                    <StatusBadge status={s} />
                  </span>
                ))}
                <span className="ml-auto hidden sm:inline">All rows are demo data.</span>
              </div>
            </div>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}