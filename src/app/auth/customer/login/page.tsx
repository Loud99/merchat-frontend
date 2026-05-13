"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

const inputCls =
  "w-full h-12 px-4 text-[15px] bg-[#F1F3F5] border-[1.5px] border-[#E9ECEF] rounded-xl outline-none transition-all " +
  "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 focus:bg-white";

function CustomerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError("Incorrect email or password. Please try again.");
    } else {
      router.push(redirectTo);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-bold text-[#212529] mb-1">Sign in</h1>
          <p className="text-[16px] text-[#6C757D]">
            Access your orders and saved products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls + " pr-12"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#343A40]"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-[#FFEBEE] border-l-4 border-[#F44336] rounded-lg px-4 py-3">
              <AlertCircle size={16} className="text-[#F44336] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#F44336]">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-brand-orange text-white text-[15px] font-semibold hover:bg-brand-orange-hover active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-[14px] text-[#6C757D] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/customer/signup" className="text-brand-orange font-semibold">
            Create one
          </Link>
        </p>

        <p className="text-center text-[13px] text-[#ADB5BD] mt-8">
          Are you a merchant?{" "}
          <Link href="/auth/login" className="text-[#6C757D]">
            Merchant login →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense>
      <CustomerLoginForm />
    </Suspense>
  );
}
