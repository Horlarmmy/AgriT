"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, ShieldCheck, Sprout, TrendingUp, Wallet, FileCheck2 } from "lucide-react";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { Reveal, StaggerReveal, FloatingImage } from "./components/motion/Reveal";

const heroSlides = [
  {
    src: "/assets/hero-imgs/hero_protocol_primary.png",
    alt: "AgriTrust protocol visualization",
  },
  {
    src: "/assets/hero-imgs/hero_vyc_certificate.png",
    alt: "Verifiable Yield Certificate",
  },
  {
    src: "/assets/hero-imgs/hero_liquidity_bridge.png",
    alt: "Liquidity bridge connecting farmers to capital",
  },
];

const steps = [
  {
    icon: Leaf,
    title: "Farmers log activity",
    body: "Seed purchases, planting seasons, harvests, and sales are recorded through a simple mobile / USSD gateway.",
    image: "/assets/3d-reusage-icons-img/icon_planting_seed.png",
    reverse: false,
  },
  {
    icon: ShieldCheck,
    title: "Behavior is scored",
    body: "The AgriTrust engine turns that history into an explainable 0–100 trust score — verified, not guessed.",
    image: "/assets/3d-reusage-icons-img/icon_verified_certificate.png",
    reverse: true,
  },
  {
    icon: FileCheck2,
    title: "VYCs are minted",
    body: "A Verifiable Yield Certificate is created on-chain, hash-locked to the activity evidence that produced it.",
    image: "/assets/feature-section-3d-imgs/feature_vyc_certificate.png",
    reverse: true,
  },
  {
    icon: TrendingUp,
    title: "Lenders finance the yield",
    body: "Liquidity providers and insurers fund VYCs, unlocking credit for farmers with a track record — not a title deed.",
    image: "/assets/feature-section-3d-imgs/feature_stellar_liquidity.png",
    reverse: false,
  },
];

const features = [
  {
    icon: Wallet,
    title: "Scores without collateral",
    body: "Farmers borrow against years of consistent behavior instead of land titles they often don't have.",
    image: "/assets/feature-section-3d-imgs/feature_credit_scoring.png",
  },
  {
    icon: ShieldCheck,
    title: "Tamper-evident on-chain record",
    body: "Every VYC carries a SHA-256 hash of its proof-of-activity payload, so anyone can independently re-derive it.",
    image: "/assets/feature-section-3d-imgs/feature_vyc_certificate.png",
  },
  {
    icon: Sprout,
    title: "Built for real markets",
    body: "Stellar rails, micro-USDC settlement, and Soroban contracts keep costs low for smallholder microcredit.",
    image: "/assets/feature-section-3d-imgs/feature_instant_settlement.png",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Section — full viewport height, two-column */}
        <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "url(/assets/abstract-background/pattern_organic_growth.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              {/* Left — copy */}
              <div>
                <Reveal>
                  <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    Fair Finance for Smallholder Farmers on Stellar
                  </span>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ lineHeight: 1.02 }}>
                    Borrow against your <span className="text-primary">behavior</span>, not your paperwork.
                  </h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                    AgriTrust mints Verifiable Yield Certificates from real farming activity — giving
                    smallholder farmers the track record that lenders and insurers can trust.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="mt-10 flex flex-wrap items-center gap-4">
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
                </Reveal>
              </div>

              {/* Right — slideshow */}
              <Reveal direction="right" delay={0.15}>
                <div
                  className="relative"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                >
                  <div className="relative aspect-square max-w-md mx-auto">
                    {heroSlides.map((slide, i) => (
                      <Image
                        key={slide.src}
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        priority={i === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={`object-contain transition-opacity duration-700 ease-in-out ${
                          i === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                  {/* Progress dots */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {heroSlides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === currentSlide
                            ? "w-8 bg-primary"
                            : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-bold">How it works</h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
                From field activity to a financed harvest — four steps, each verified on-chain.
              </p>
            </Reveal>

            <div className="mt-14 space-y-12 sm:space-y-16">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
                >
                  <Reveal
                    direction={step.reverse ? "right" : "left"}
                    delay={0.1}
                    className={step.reverse ? "md:order-2" : ""}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-muted-foreground">{step.body}</p>
                  </Reveal>

                  <Reveal
                    direction={step.reverse ? "left" : "right"}
                    delay={0.2}
                    className={step.reverse ? "md:order-1" : ""}
                  >
                    <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-8">
                      <span className="pointer-events-none absolute right-5 top-3 text-7xl font-black text-foreground/5">
                        0{i + 1}
                      </span>
                      <FloatingImage
                        src={step.image}
                        alt={step.title}
                        className="h-32 w-32 object-contain"
                        duration={6}
                        distance={5}
                      />
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "url(/assets/abstract-background/pattern_connected_field_grid.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-bold">Why such a different kind of credit score?</h2>
            </Reveal>
            <StaggerReveal className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-border bg-card p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
                  <FloatingImage
                    src={feature.image}
                    alt={feature.title}
                    className="mt-4 mx-auto h-24 w-24 object-contain opacity-80"
                    duration={7}
                    distance={4}
                  />
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <Reveal>
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
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
