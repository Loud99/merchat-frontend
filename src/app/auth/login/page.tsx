"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthLayout from "@/components/auth/AuthLayout";

const inputCls =
  "w-full h-12 px-4 text-[15px] bg-[#F1F3F5] border-[1.5px] border-[#E9ECEF] rounded-xl outline-none transition-all " +
  "focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/15 focus:bg-white";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (authError) {
      setError("Incorrect email or password. Please try again.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    // No altLink — "Sign up" appears only at the bottom of the form
    <AuthLayout>
      <div>
        <h1 className="text-[28px] font-bold text-[#212529] mb-1">
          Welcome back
        </h1>
        <p className="text-[16px] text-[#6C757D] mb-8">
          Log in to your Merchat dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#343A40] transition-colors"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember + forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setRemember((v) => !v)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                  remember ? "bg-[#00C853] border-[#00C853]" : "border-[#DEE2E6]"
                }`}
              >
                {remember && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5l2.5 2.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-[14px] text-[#343A40]">Remember me</span>
            </label>
            <Link href="/auth/forgot-password" className="text-[14px] text-[#00C853] font-medium">
              Forgot password?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-[#FFEBEE] border-l-4 border-[#F44336] rounded-lg px-4 py-3">
              <AlertCircle size={16} className="text-[#F44336] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#F44336]">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-[#00C853] text-white text-[15px] font-semibold hover:bg-[#00B348] active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E9ECEF]" />
            <span className="text-[12px] text-[#ADB5BD]">or</span>
            <div className="flex-1 h-px bg-[#E9ECEF]" />
          </div>

          {/* Google — coming soon */}
          <button
            type="button"
            disabled
            className="w-full h-12 rounded-full border border-[#DEE2E6] bg-[#F8F9FA] text-[15px] font-medium text-[#ADB5BD] flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.251 17.64 11.943 17.64 9.2z" fill="#c0c0c0" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#c0c0c0" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#c0c0c0" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#c0c0c0" />
            </svg>
            Continue with Google
            <span className="text-[11px] ml-1">(Coming soon)</span>
          </button>
        </form>

        {/* Bottom links */}
        <p className="text-center text-[14px] text-[#6C757D] mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-[#00C853] font-semibold">
            Sign up free
          </Link>
        </p>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#E9ECEF]" />
        </div>

        <p className="text-center text-[14px] text-[#6C757D]">
          Shopping on Merchat?{" "}
          <Link href="/auth/customer/login" className="text-[#00C853] font-medium">
            Sign in as a customer →
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
