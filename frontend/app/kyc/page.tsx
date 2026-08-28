"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, CheckCircle2, Wallet, ShieldCheck } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const easeOutExpo = [0.21, 0.47, 0.32, 0.98] as const;

const entityTypes = [
  "Commercial Bank",
  "Microfinance Bank",
  "Insurance Company",
  "Impact Fund",
  "Individual Investor",
  "Cooperative",
];

export default function KycPage() {
  const [step, setStep] = useState<"wallet" | "kyc" | "done">("wallet");
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    entityType: "",
    email: "",
    country: "",
  });

  async function handleConnectWallet() {
    setIsConnecting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setWalletAddress("GCPUBA6Y7GZBC5E4VSU7CTHNWN3WQ4FM47R3FM4RH2AWUBAKJ2NBVKX4");
    setIsConnected(true);
    setIsConnecting(false);
  }

  async function handleSubmitKyc() {
    if (!form.fullName || !form.entityType || !form.email) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setStep("done");
    setIsSubmitting(false);
  }

  return (
    <>
      <SiteHeader />
      <main className="relative mx-auto max-w-lg px-4 sm:px-6 py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "url(/assets/abstract-background/pattern_bridge_network.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <AnimatePresence mode="wait">
            {step === "wallet" && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              >
                <h1 className="text-3xl font-bold">Lender Onboarding</h1>
                <p className="mt-2 text-muted-foreground">
                  Connect your Freighter wallet to get started. You&apos;ll complete KYC after connecting.
                </p>

                <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Step 1: Connect Wallet</p>
                      <p className="text-sm text-muted-foreground">Self-custody via Freighter</p>
                    </div>
                  </div>

                  {!isConnected ? (
                    <button
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                      className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Connecting...
                        </span>
                      ) : (
                        "Connect Freighter Wallet"
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Connected
                      </div>
                      <p className="font-mono text-xs text-muted-foreground break-all">
                        {walletAddress}
                      </p>
                      <button
                        onClick={() => setStep("kyc")}
                        className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        Continue to KYC
                      </button>
                    </div>
                  )}

                  <p className="mt-4 text-xs text-muted-foreground text-center">
                    Don&apos;t have Freighter?{" "}
                    <a
                      href="https://freighter.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Install it here
                    </a>
                  </p>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Are you a <strong>farmer</strong>?{" "}
                  <Link href="/register" className="font-semibold text-primary hover:underline">
                    Sign up here instead
                  </Link>
                </p>
              </motion.div>
            )}

            {step === "kyc" && (
              <motion.div
                key="kyc"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              >
                <h1 className="text-3xl font-bold">KYC Verification</h1>
                <p className="mt-2 text-muted-foreground">
                  Required for lending and investing. Your information is kept confidential.
                </p>

                <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Step 2: KYC Details</p>
                      <p className="text-sm text-muted-foreground">Identity and entity information</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
                        Full name / Organization name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="e.g. Adewale Capital Ltd."
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div>
                      <label htmlFor="entityType" className="mb-1 block text-sm font-medium">
                        Entity type
                      </label>
                      <select
                        id="entityType"
                        value={form.entityType}
                        onChange={(e) => setForm({ ...form, entityType: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        <option value="">Select entity type</option>
                        {entityTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-1 block text-sm font-medium">
                        Contact email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="kyc@example.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="mb-1 block text-sm font-medium">
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        placeholder="Nigeria"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <button
                      onClick={handleSubmitKyc}
                      disabled={isSubmitting || !form.fullName || !form.entityType || !form.email}
                      className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        "Submit KYC"
                      )}
                    </button>

                    <button
                      onClick={() => setStep("wallet")}
                      className="w-full text-sm text-muted-foreground hover:text-foreground"
                    >
                      Back to wallet
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">KYC Submitted</h1>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                  Your verification is being reviewed. You&apos;ll receive an email once approved.
                  In the meantime, you can explore the protocol.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/"
                    className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/score"
                    className="rounded-xl border border-border bg-card px-6 py-3 font-semibold transition-colors hover:bg-muted"
                  >
                    Explore Scoring
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
