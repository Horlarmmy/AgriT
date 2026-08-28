"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { ScoreRing, StatusBadge } from "../components/ui/Badges";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { MOCK_VYCS, SAMPLE_FARMER, formatDate, formatYield, shortAddress } from "../lib/mock";
import { getFarmerVycs, getVyc, VycRecord as SorobanVycRecord } from "../services/soroban";
import { ActivityFeed } from "../components/ActivityFeed";
import { useContractEvents } from "../hooks/useContractEvents";
import { useWallet } from "../lib/wallet/WalletContext";
import { Reveal, StaggerReveal, FloatingImage } from "../components/motion/Reveal";

export default function Dashboard() {
  const { publicKey: address, status, connect, refreshBalance } = useWallet();
  const isConnected = status === "connected";
  const [vycs, setVycs] = useState<typeof MOCK_VYCS>(MOCK_VYCS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const activity = useContractEvents(address, () => {
    setRefreshToken((value) => value + 1);
    void refreshBalance();
  });

  useEffect(() => {
    async function fetchVycs() {
      if (!isConnected || !address) {
        setVycs(MOCK_VYCS);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const vycIds = await getFarmerVycs(address);

        if (vycIds.length === 0) {
          setVycs([]);
          setIsLoading(false);
          return;
        }

        const vycPromises = vycIds.map((id) => getVyc(id));
        const results = await Promise.all(vycPromises);

        const fetchedVycs = results
          .filter((r) => r.success && r.data)
          .map((r) => {
            const data = r.data as SorobanVycRecord;
            return {
              id: parseInt(data.id),
              farmer: data.farmer,
              score: data.score,
              expectedYield: parseInt(data.expectedYield),
              crop: data.crop,
              region: data.region,
              activityHash: data.activityHash,
              status: data.status,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          });

        setVycs(fetchedVycs.length > 0 ? fetchedVycs : MOCK_VYCS);
      } catch (err) {
        console.error("Error fetching VYCs:", err);
        setError(err instanceof Error ? err.message : "Failed to load certificates");
        setVycs(MOCK_VYCS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVycs();
  }, [isConnected, address, refreshToken]);

  const active = vycs.filter((v) => v.status === "Active");
  const activeValue = active.reduce((sum, v) => sum + v.expectedYield, 0);
  const best = vycs.length > 0 ? Math.max(...vycs.map((v) => v.score)) : 0;
  const lifetimeCertificates = vycs.length;

  return (
    <>
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Background pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "url(/assets/abstract-background/pattern_bridge_network.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative">
          {/* Header */}
          <Reveal>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <FloatingImage
                    src="/assets/feature-section-3d-imgs/feature_vyc_certificate.png"
                    alt="VYC certificate"
                    className="h-16 w-16 object-contain"
                    duration={7}
                    distance={4}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isConnected && address ? (
                      <>
                        Wallet <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{shortAddress(address)}</code> ·
                        {vycs === MOCK_VYCS ? " showing demo data" : " live on-chain data"}
                      </>
                    ) : (
                      <>
                        Wallet <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{shortAddress(SAMPLE_FARMER)}</code> ·
                        demo data — connect wallet for live certificates
                      </>
                    )}
                  </p>
                  {error && (
                    <p className="mt-2 text-sm text-destructive">{error}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                {!isConnected && (
                  <button
                    onClick={connect}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    Connect Wallet
                  </button>
                )}
                <Link
                  href="/mint"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Mint VYC
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Stats cards */}
          <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          </StaggerReveal>

          {/* Main content */}
          <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* VYC table */}
            <Reveal direction="left" delay={0.1}>
              <Card className="p-0">
                <div className="p-6 pb-0">
                  <CardHeader
                    title="Verifiable Yield Certificates"
                    subtitle="Minted against hash-locked proof-of-activity"
                  />
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : vycs.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No certificates minted yet</p>
                    <Link
                      href="/mint"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                      Mint Your First VYC
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {vycs.map((vyc) => (
                    <div
                      key={vyc.id}
                      className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
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
                )}
              </Card>
            </Reveal>

            {/* Sidebar */}
            <div className="space-y-6">
              <Reveal direction="right" delay={0.15}>
                <ActivityFeed {...activity} onMarkRead={activity.markRead} />
              </Reveal>

              <Reveal direction="right" delay={0.2}>
                <Card>
                  <div className="flex items-start gap-4">
                    <FloatingImage
                      src="/assets/feature-section-3d-imgs/feature_credit_scoring.png"
                      alt="Credit scoring"
                      className="h-20 w-20 object-contain"
                      duration={8}
                      distance={5}
                    />
                    <div className="flex-1">
                      <CardHeader
                        title="Current trust position"
                        subtitle="Latest scored behavior"
                      />
                      <div className="flex items-center gap-4 mt-2">
                        <ScoreRing score={82} />
                        <div>
                          <p className="font-semibold">High trust</p>
                          <p className="text-sm text-muted-foreground">
                            Consistent season-to-season activity across 5 factor groups.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>

              <Reveal direction="right" delay={0.25}>
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
              </Reveal>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
