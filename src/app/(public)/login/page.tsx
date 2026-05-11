"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

// ── Google icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.251 17.64 11.943 17.64 9.2z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

// ── Reusable label + input wrapper ────────────────────────────────────────────
function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-brand-navy mb-1.5">
      {children}
    </label>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Incorrect email or password.");
      return;
    }
    setLoading(true);
    // TODO: replace with real auth call
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setError("Incorrect email or password.");
  }

  const inputBase =
    "w-full px-4 py-3 text-[15px] rounded-lg border bg-white outline-none transition-all " +
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
          <h1 className="text-[24px] font-bold text-brand-navy mb-1">Welcome back</h1>
          <p className="text-[15px] text-[#6B7280] mb-6">Log in to your merchant dashboard</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <FieldLabel htmlFor="email">Business email</FieldLabel>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={`${inputBase} ${error ? "border-danger" : "border-[#D1D5DB]"}`}
              />
            </div>

            {/* Password */}
            <div className="mb-1">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={`${inputBase} pr-11 ${error ? "border-danger" : "border-[#D1D5DB]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-brand-navy transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Inline error */}
            {error && (
              <p className="text-[13px] text-danger mt-1.5">{error}</p>
            )}

            {/* Forgot password */}
            <div className="flex justify-end mt-2 mb-5">
              <Link
                href="/forgot-password"
                className="text-[13px] text-brand-orange hover:opacity-75 transition-opacity"
              >
                Forgot password?
              </Link>
            </div>

            {/* Log in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] rounded-lg bg-brand-orange text-white text-[15px] font-semibold
                hover:bg-[#B54E20] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-[13px] text-[#9CA3AF] font-medium">or</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            className="w-full h-[50px] rounded-lg border-2 border-brand-navy text-brand-navy text-[15px] font-semibold
              flex items-center justify-center gap-3 hover:bg-brand-navy hover:text-white transition-all active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        {/* Sign-up link */}
        <p className="text-center text-[14px] text-[#6B7280] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/onboarding" className="text-brand-orange font-semibold hover:opacity-75 transition-opacity">
            Start for free
          </Link>
        </p>
      </div>
    </div>
  );
}
