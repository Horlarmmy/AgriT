"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Phone, ArrowLeft, Wallet } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const easeOutExpo = [0.21, 0.47, 0.32, 0.98] as const;

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"google" | "phone" | "wallet" | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleLogin() {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/dashboard");
    setIsLoading(false);
  }

  async function handleSendOtp() {
    if (!phone || phone.length < 10) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setOtpSent(true);
    setIsLoading(false);
  }

  async function handleVerifyOtp() {
    if (!otp || otp.length < 4) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/dashboard");
    setIsLoading(false);
  }

  async function handleWalletConnect() {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/dashboard");
    setIsLoading(false);
  }

  return (
    <>
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left — form */}
          <div>
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Log in to your AgriTrust account.
            </p>

            <AnimatePresence mode="wait">
              {!method ? (
                <motion.div
                  key="choose"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  className="mt-8 space-y-3"
                >
                  <button
                    onClick={handleGoogleLogin}
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
                    Log in with Google
                  </button>
                  <button
                    onClick={() => setMethod("phone")}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 font-semibold transition-colors hover:bg-muted"
                  >
                    <Phone className="h-5 w-5" />
                    Continue with phone number
                  </button>
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">or</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMethod("wallet")}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3.5 font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    <Wallet className="h-5 w-5" />
                    Connect Freighter Wallet
                  </button>
                </motion.div>
              ) : method === "wallet" ? (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  className="mt-8"
                >
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-semibold">Connect Freighter</p>
                        <p className="text-sm text-muted-foreground">For lenders, insurers &amp; investors</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your self-custody wallet to access the capital-side console.
                      You&apos;ll complete KYC after connecting.
                    </p>
                    <button
                      onClick={handleWalletConnect}
                      disabled={isLoading}
                      className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Connecting...
                        </span>
                      ) : (
                        "Connect Wallet"
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => setMethod(null)}
                    className="mt-4 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Use a different method
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  className="mt-8"
                >
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
                        {isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Verify & Log in"}
                      </button>
                      <button
                        onClick={() => { setOtpSent(false); setOtp(""); }}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Change phone number
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Right — auth illustration (hidden on mobile) */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
                <Image
                  src="/assets/signin-login-imgs/auth_login_verified_seedling.png"
                  alt="Secure access to your trust certificates"
                  fill
                  sizes="400px"
                  className="object-contain p-8"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm font-semibold">Your trust, always accessible</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sign in with Google, phone, or connect your Freighter wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
