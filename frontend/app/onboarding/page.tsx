"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  ChevronRight,
  ChevronLeft,
  Check,
  Globe,
  Sprout,
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

type Role = "farmer" | "lender";

interface FormData {
  role: Role | null;
  name: string;
  region: string;
  crop: string;
}

const stepsByRole: Record<Role, string[]> = {
  farmer: ["Your role", "About you", "Where you farm", "What you grow", "All set"],
  lender: ["Your role", "Connect wallet", "All set"],
};

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    role: null,
    name: "",
    region: "",
    crop: "",
  });

  const steps = form.role ? stepsByRole[form.role] : ["Your role"];
  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  function next() {
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function canAdvance(): boolean {
    if (step === 0) return form.role !== null;
    if (form.role === "farmer") {
      if (step === 1) return form.name.trim().length >= 2;
      if (step === 2) return form.region !== "";
      if (step === 3) return form.crop !== "";
    }
    return true;
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
              <RoleStep
                role={form.role}
                onSelect={(r) => setForm({ ...form, role: r })}
              />
            )}
            {form.role === "farmer" && step === 1 && (
              <NameStep
                name={form.name}
                onChange={(n) => setForm({ ...form, name: n })}
              />
            )}
            {form.role === "farmer" && step === 2 && (
              <RegionStep
                region={form.region}
                onSelect={(r) => setForm({ ...form, region: r })}
              />
            )}
            {form.role === "farmer" && step === 3 && (
              <CropStep
                crop={form.crop}
                onSelect={(c) => setForm({ ...form, crop: c })}
              />
            )}
            {((form.role === "farmer" && step === 4) ||
              (form.role === "lender" && step === 2)) && (
              <CompleteStep form={form} />
            )}
            {form.role === "lender" && step === 1 && (
              <WalletConnectStep />
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
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Go to Dashboard
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/* ---- Step components ---- */

function RoleStep({
  role,
  onSelect,
}: {
  role: Role | null;
  onSelect: (r: Role) => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to AgriTrust</h1>
      <p className="mt-3 text-muted-foreground">
        Choose how you want to participate in the protocol.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onSelect("farmer")}
          className={`group rounded-2xl border-2 p-6 text-left transition-all ${
            role === "farmer"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sprout className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">I&apos;m a Farmer</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up with Google or phone. We create a wallet for you — no seed
            phrase, no gas fees. Just log your activity and build your trust
            score.
          </p>
        </button>
        <button
          onClick={() => onSelect("lender")}
          className={`group rounded-2xl border-2 p-6 text-left transition-all ${
            role === "lender"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">I&apos;m a Lender / Investor</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect your Freighter wallet and complete KYC to fund VYCs and
            provide liquidity to farmers.
          </p>
        </button>
      </div>
    </div>
  );
}

function NameStep({
  name,
  onChange,
}: {
  name: string;
  onChange: (n: string) => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold">What&apos;s your name?</h1>
      <p className="mt-3 text-muted-foreground">
        This stays off-chain — it&apos;s only used to personalize your dashboard.
      </p>
      <div className="mt-8">
        <label htmlFor="farmer-name" className="mb-2 block text-sm font-medium">
          Full name
        </label>
        <input
          id="farmer-name"
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Adewale Okafor"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          autoFocus
        />
      </div>
    </div>
  );
}

function RegionStep({
  region,
  onSelect,
}: {
  region: string;
  onSelect: (r: string) => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Where do you farm?</h1>
      <p className="mt-3 text-muted-foreground">
        Select the state where your farmland is located.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {regions.map((r) => (
          <button
            key={r.code}
            onClick={() => onSelect(r.code)}
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
  );
}

function CropStep({
  crop,
  onSelect,
}: {
  crop: string;
  onSelect: (c: string) => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold">What do you grow?</h1>
      <p className="mt-3 text-muted-foreground">
        Select your primary crop. You can always add more later.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {crops.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
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
  );
}

function WalletConnectStep() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Connect your wallet</h1>
      <p className="mt-3 text-muted-foreground">
        Use Freighter to connect your Stellar wallet. You&apos;ll complete KYC
        after connecting.
      </p>
      <div className="mt-8">
        <button className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 font-semibold transition-colors hover:bg-muted">
          <Wallet className="h-5 w-5" />
          Connect Freighter
        </button>
        <p className="mt-4 text-xs text-muted-foreground">
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
    </div>
  );
}

function CompleteStep({ form }: { form: FormData }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <ShieldCheck className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold">
        {form.role === "farmer" ? "You're all set!" : "Almost there!"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {form.role === "farmer" ? (
          <>
            Your custodial wallet will be created automatically. Head to the
            dashboard to start logging farm activity and building your trust
            score.
          </>
        ) : (
          <>
            After KYC approval, you can start funding VYCs and providing
            liquidity to verified farmers.
          </>
        )}
      </p>
      {form.role === "farmer" && (
        <div className="mt-8 inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-6 py-4 text-sm">
          <div className="flex gap-4">
            <span>
              <span className="text-muted-foreground">Region:</span>{" "}
              <strong>{form.region}</strong>
            </span>
            <span>
              <span className="text-muted-foreground">Crop:</span>{" "}
              <strong>{form.crop}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
