"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  Globe,
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const easeOutExpo = [0.21, 0.47, 0.32, 0.98] as const;

const regions = [
  { code: "NG-OYO", label: "Oyo State" },
  { code: "NG-ON", label: "Ondo State" },
  { code: "NG-KW", label: "Kwara State" },
  { code: "NG-EB", label: "Ebonyi State" },
  { code: "NG-KN", label: "Kano State" },
  { code: "NG-AB", label: "Abia State" },
];

const crops = [
  { id: "MAIZE", label: "Maize", icon: "🌽" },
  { id: "COCOA", label: "Cocoa", icon: "🫘" },
  { id: "SOYBEAN", label: "Soybean", icon: "🫛" },
  { id: "RICE", label: "Rice", icon: "🌾" },
  { id: "CASSAVA", label: "Cassava", icon: "🥔" },
];

const steps = ["Where you farm", "What you grow", "All set"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState("");
  const [crop, setCrop] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  function next() {
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function canAdvance(): boolean {
    if (step === 0) return region !== "";
    if (step === 1) return crop !== "";
    return true;
  }

  async function handleComplete() {
    setIsSaving(true);
    // Placeholder — will hit POST /farmer/me with region + crop
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Step {step + 1} of {totalSteps}</span>
            <span>{steps[step]}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
          >
            {step === 0 && (
              <div>
                <h1 className="text-3xl font-bold">Where do you farm?</h1>
                <p className="mt-3 text-muted-foreground">
                  Select the state where your farmland is located.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {regions.map((r) => (
                    <button
                      key={r.code}
                      onClick={() => setRegion(r.code)}
                      className={`inline-flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                        region === r.code
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.code}</p>
                      </div>
                      {region === r.code && (
                        <Check className="ml-auto h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h1 className="text-3xl font-bold">What do you grow?</h1>
                <p className="mt-3 text-muted-foreground">
                  Select your primary crop. You can always add more later.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {crops.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCrop(c.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                        crop === c.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <span className="text-3xl">{c.icon}</span>
                      <span className="text-sm font-semibold">{c.label}</span>
                      {crop === c.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">You&apos;re all set!</h1>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                  Your custodial wallet will be created automatically. Head to the
                  dashboard to start logging farm activity and building your trust
                  score.
                </p>
                <div className="mt-8 inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-6 py-4 text-sm">
                  <div className="flex gap-4">
                    <span>
                      <span className="text-muted-foreground">Region:</span>{" "}
                      <strong>{region}</strong>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Crop:</span>{" "}
                      <strong>{crop}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={prev}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps - 1 ? (
            <button
              onClick={next}
              disabled={!canAdvance()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {isSaving ? "Saving..." : "Go to Dashboard"}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
