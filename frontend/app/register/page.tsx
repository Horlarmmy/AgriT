"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Phone, ArrowLeft } from "lucide-react";
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

export default function RegisterPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"google" | "phone" | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"auth" | "profile">("auth");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [crop, setCrop] = useState("");

  async function handleGoogleSignUp() {
    setIsLoading(true);
    // Placeholder — will hit POST /auth/farmer/register with provider: "google"
    await new Promise((r) => setTimeout(r, 1500));
    setStep("profile");
    setIsLoading(false);
  }

  async function handleSendOtp() {
    if (!phone || phone.length < 10) return;
    setIsLoading(true);
    // Placeholder — will hit POST /auth/farmer/send-otp
    await new Promise((r) => setTimeout(r, 1000));
    setOtpSent(true);
    setIsLoading(false);
  }

  async function handleVerifyOtp() {
    if (!otp || otp.length < 4) return;
    setIsLoading(true);
    // Placeholder — will hit POST /auth/farmer/verify-otp
    await new Promise((r) => setTimeout(r, 1000));
    setStep("profile");
    setIsLoading(false);
  }

  async function handleCompleteProfile() {
    if (!name || !region || !crop) return;
    setIsLoading(true);
    // Placeholder — will hit POST /auth/farmer/register with full profile
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/onboarding");
  }

  return (
    <>
      <SiteHeader />
      <main className="relative mx-auto max-w-lg px-4 sm:px-6 py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "url(/assets/abstract-background/pattern_organic_growth.png)",
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
            {step === "auth" ? (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              >
                <h1 className="text-3xl font-bold">Create your account</h1>
                <p className="mt-2 text-muted-foreground">
                  Sign up as a farmer. No wallet needed — we handle the Web3 under the hood.
                </p>

                {!method ? (
                  <div className="mt-8 space-y-3">
                    <button
                      onClick={handleGoogleSignUp}
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 font-semibold transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )}
                      Sign up with Google
                    </button>
                    <button
                      onClick={() => setMethod("phone")}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 font-semibold transition-colors hover:bg-muted"
                    >
                      <Phone className="h-5 w-5" />
                      Continue with phone number
                    </button>
                  </div>
                ) : (
                  <div className="mt-8">
                    {!otpSent ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                            Phone number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+234 801 234 5678"
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        </div>
                        <button
                          onClick={handleSendOtp}
                          disabled={isLoading || phone.length < 10}
                          className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                        >
                          {isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Send OTP"}
                        </button>
                        <button
                          onClick={() => setMethod(null)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Use a different method
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          We sent a code to <strong>{phone}</strong>
                        </p>
                        <div>
                          <label htmlFor="otp" className="mb-1 block text-sm font-medium">
                            Verification code
                          </label>
                          <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="123456"
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        </div>
                        <button
                          onClick={handleVerifyOtp}
                          disabled={isLoading || otp.length < 4}
                          className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                        >
                          {isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Verify"}
                        </button>
                        <button
                          onClick={() => { setOtpSent(false); setOtp(""); }}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Change phone number
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              >
                <h1 className="text-3xl font-bold">Complete your profile</h1>
                <p className="mt-2 text-muted-foreground">
                  Tell us about your farm so we can set up your account.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">
                      Your name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Adewale Okafor"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Where do you farm?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {regions.map((r) => (
                        <button
                          key={r.code}
                          onClick={() => setRegion(r.code)}
                          className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm transition-all ${
                            region === r.code
                              ? "border-primary bg-primary/5 font-semibold"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          {r.label}
                          <span className="block text-xs text-muted-foreground">{r.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">What do you grow?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {crops.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCrop(c.id)}
                          className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-sm transition-all ${
                            crop === c.id
                              ? "border-primary bg-primary/5 font-semibold"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <span className="text-xl">{c.icon}</span>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteProfile}
                    disabled={isLoading || !name || !region || !crop}
                    className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Create Account"}
                  </button>
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
