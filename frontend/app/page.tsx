"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Sprout, TrendingUp, Wallet, FileCheck2 } from "lucide-react";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

const steps = [
  {
    icon: Leaf,
    title: "Farmers log activity",
    body: "Seed purchases, planting seasons, harvests, and sales are recorded through a simple mobile / USSD gateway.",
    reverse: false,
  },
  {
    icon: ShieldCheck,
    title: "Behavior is scored",
    body: "The AgriTrust engine turns that history into an explainable 0–100 trust score — verified, not guessed.",
    reverse: true,
  },
  {
    icon: FileCheck2,
    title: "VYCs are minted",
    body: "A Verifiable Yield Certificate is created on-chain, hash-locked to the activity evidence that produced it.",
    reverse: false,
  },
  {
    icon: TrendingUp,
    title: "Lenders finance the yield",
    body: "Liquidity providers and insurers fund VYCs, unlocking credit for farmers with a track record — not a title deed.",
    reverse: false,
  },
];

const features = [
  {
    icon: Wallet,
    title: "Scores without collateral",
    body: "Farmers borrow against years of consistent behavior instead of land titles they often don't have.",
  },
  {
    icon: ShieldCheck,
    title: "Tamper-evident on-chain record",
    body: "Every VYC carries a SHA-256 hash of its proof-of-activity payload, so anyone can independently re-derive it.",
  },
  {
    icon: Sprout,
    title: "Built for real markets",
    body: "Stellar rails, micro-USDC settlement, and Soroban contracts keep costs low for smallholder microcredit.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Fair Finance for Smallholder Farmers on Stellar
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Borrow against your <span className="text-primary">behavior</span>, not your paperwork.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            AgriTrust mints Verifiable Yield Certificates from real farming activity — giving
            smallholder farmers the track record that lenders and insurers can trust.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore the Dashboard
            </Link>
            <Link
              href="/score"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold transition-colors hover:bg-muted"
            >
              See how scoring works
            </Link>
          </div>
        </section>

        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-3xl font-bold">How it works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              From field activity to a financed harvest — four steps, each verified on-chain.
            </p>

            <div className="mt-14 space-y-12 sm:space-y-16">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
                >
                  {/* Text */}
                  <motion.div
                    initial={{ opacity: 0, x: step.reverse ? 48 : -48 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={step.reverse ? "md:order-2" : ""}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-muted-foreground">{step.body}</p>
                  </motion.div>

                  {/* Visual */}
                  <motion.div
                    initial={{ opacity: 0, x: step.reverse ? -48 : 48 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className={step.reverse ? "md:order-1" : ""}
                  >
                    <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-8">
                      <span className="pointer-events-none absolute right-5 top-3 text-7xl font-black text-foreground/5">
                        0{i + 1}
                      </span>
                      <step.icon className="h-24 w-24 text-primary/70" strokeWidth={1.25} />
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold">Why such a different kind of credit score?</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-3xl border border-border bg-primary p-8 text-center text-primary-foreground sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to see your trust on the ledger?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/85">
              This preview runs on demo data. Live wallet scoring and on-chain VYC minting connect in the next release.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Explore the Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
