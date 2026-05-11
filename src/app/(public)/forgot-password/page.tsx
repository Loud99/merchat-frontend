"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MailCheck, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  // incrementing this restarts the countdown useEffect
  const [sendKey, setSendKey] = useState(0);

  // 60-second countdown after each send
  useEffect(() => {
    if (sendKey === 0) return;
    setCountdown(60);
    const id = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) { clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [sendKey]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    // TODO: call real password-reset API
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
    setSendKey((k) => k + 1);
  }

  async function handleResend() {
    if (countdown > 0 || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSendKey((k) => k + 1);
  }

  const inputBase =
    "w-full px-4 py-3 text-[15px] rounded-lg border border-[#D1D5DB] bg-white outline-none transition-all " +
    "focus:border-brand-navy focus:shadow-[0_0_0_3px_rgba(24,46,71,0.12)]";

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/images/logo-light.svg"
              alt="Merchat.io"
              width={160}
              height={31}
              unoptimized
              priority
              style={{ width: 160, height: "auto" }}
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-8 py-8">
          {!submitted ? (
            // ── Form state ────────────────────────────────────────────────────
            <>
              <h1 className="text-[24px] font-bold text-brand-navy mb-1">Reset your password</h1>
              <p className="text-[15px] text-[#6B7280] mb-6">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="email" className="block text-[13px] font-semibold text-brand-navy mb-1.5">
                    Business email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className={inputBase}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-[50px] rounded-lg bg-brand-orange text-white text-[15px] font-semibold
                    hover:bg-[#B54E20] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            // ── Success state ─────────────────────────────────────────────────
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-16 h-16 rounded-full bg-[#F4EDE8] flex items-center justify-center mb-5">
                <MailCheck size={32} strokeWidth={1.5} className="text-brand-orange" />
              </div>

              <h2 className="text-[22px] font-bold text-brand-navy mb-2">Check your inbox</h2>
              <p className="text-[15px] text-[#6B7280] leading-relaxed mb-6">
                We sent a reset link to{" "}
                <span className="font-semibold text-brand-navy">{email}</span>.{" "}
                Check your spam folder if it doesn&apos;t arrive in 2 minutes.
              </p>

              <button
                onClick={handleResend}
                disabled={countdown > 0 || loading}
                className={`text-[14px] font-semibold transition-all ${
                  countdown > 0 || loading
                    ? "text-[#9CA3AF] cursor-default"
                    : "text-brand-orange hover:opacity-75 cursor-pointer"
                }`}
              >
                {loading
                  ? "Resending…"
                  : countdown > 0
                  ? `Resend email (${countdown}s)`
                  : "Resend email"}
              </button>
            </div>
          )}
        </div>

        {/* Back to log in */}
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-[14px] text-[#6B7280] hover:text-brand-navy transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
