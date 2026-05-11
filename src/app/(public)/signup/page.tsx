"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-brand-navy mb-1.5">
      {children}
    </label>
  );
}

const inputBase =
  "w-full px-4 py-3 text-[15px] rounded-lg border bg-white outline-none transition-all " +
  "focus:border-brand-navy focus:shadow-[0_0_0_3px_rgba(24,46,71,0.12)]";

export default function SignupPage() {
  const [fullName, setFullName]         = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !businessName.trim() || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          business_name: businessName.trim(),
        },
      },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/onboarding");
  }

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
          <h1 className="text-[24px] font-bold text-brand-navy mb-1">Create your account</h1>
          <p className="text-[15px] text-[#6B7280] mb-6">Start selling on WhatsApp in minutes.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <FieldLabel htmlFor="fullName">Full name</FieldLabel>
              <input
                id="fullName"
                type="text"
                placeholder="Amina Babatunde"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                autoComplete="name"
                className={`${inputBase} ${error ? "border-[#EF4444]" : "border-[#D1D5DB]"}`}
              />
            </div>

            <div className="mb-4">
              <FieldLabel htmlFor="businessName">Business name</FieldLabel>
              <input
                id="businessName"
                type="text"
                placeholder="Fashion by Amina"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                autoComplete="organization"
                className={`${inputBase} ${error ? "border-[#EF4444]" : "border-[#D1D5DB]"}`}
              />
            </div>

            <div className="mb-4">
              <FieldLabel htmlFor="email">Business email</FieldLabel>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className={`${inputBase} ${error ? "border-[#EF4444]" : "border-[#D1D5DB]"}`}
              />
            </div>

            <div className="mb-1">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`${inputBase} pr-11 ${error ? "border-[#EF4444]" : "border-[#D1D5DB]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-brand-navy transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {error && <p className="text-[13px] text-[#EF4444] mt-1.5 mb-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] rounded-lg bg-brand-orange text-white text-[15px] font-semibold mt-5
                hover:bg-[#B54E20] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-[12px] text-[#9CA3AF] mt-4 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms-of-service" className="underline hover:text-brand-navy">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="underline hover:text-brand-navy">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-center text-[14px] text-[#6B7280] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-orange font-semibold hover:opacity-75 transition-opacity">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
