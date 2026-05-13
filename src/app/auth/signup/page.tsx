"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthLayout from "@/components/auth/AuthLayout";

const inputCls =
  "w-full h-12 px-4 text-[15px] bg-[#F1F3F5] border-[1.5px] border-[#E9ECEF] rounded-xl outline-none transition-all " +
  "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 focus:bg-white";

function passwordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
}

const strengthLabel = ["", "Weak", "Fair", "Strong", "Very strong"];
const strengthColour = ["", "#F44336", "#FF9800", "#D5652B", "#D5652B"];

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const strength = passwordStrength(password);
  const passwordsMatch = confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  const canSubmit =
    fullName.trim() &&
    businessName.trim() &&
    email.trim() &&
    password.length >= 8 &&
    passwordsMatch &&
    terms &&
    !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          business_name: businessName,
        },
      },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/onboarding"), 1500);
    }
  }

  return (
    <AuthLayout
      altLink={
        <p className="text-[14px] text-[#6C757D]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-orange font-semibold">
            Log in
          </Link>
        </p>
      }
    >
      <div>
        <h1 className="text-[28px] font-bold text-[#212529] mb-1">
          Create your account
        </h1>
        <p className="text-[16px] text-[#6C757D] mb-8">
          Start selling on WhatsApp in 15 minutes.
        </p>

        {success && (
          <div className="flex items-center gap-3 bg-[#E8FAF0] border border-[#00C853]/30 rounded-xl px-4 py-3 mb-6">
            <CheckCircle size={18} className="text-[#00C853] shrink-0" />
            <p className="text-[14px] text-[#00C853] font-medium">
              Account created! Taking you to setup...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name */}
          <div>
            <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Full name <span className="text-brand-orange">*</span>
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder="Tunde Okafor"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          {/* Business name */}
          <div>
            <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Business name <span className="text-brand-orange">*</span>
            </label>
            <input
              type="text"
              placeholder="Tunde's Electronics"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className={inputCls}
              required
            />
            <p className="text-[12px] text-[#6C757D] mt-1">
              This will be your store&apos;s display name.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Email address <span className="text-brand-orange">*</span>
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="tunde@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Password <span className="text-brand-orange">*</span>
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="At least 8 characters"
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
            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className="flex-1 h-1 rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          strength >= s
                            ? strengthColour[strength]
                            : "#E9ECEF",
                      }}
                    />
                  ))}
                </div>
                <p
                  className="text-[11px] mt-1 font-medium"
                  style={{ color: strengthColour[strength] }}
                >
                  {strengthLabel[strength]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Confirm password <span className="text-brand-orange">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={
                  inputCls +
                  " pr-12 " +
                  (passwordsMismatch ? "border-[#F44336]" : "")
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#343A40]"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {passwordsMatch && (
                <CheckCircle
                  size={16}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-brand-orange"
                />
              )}
              {passwordsMismatch && (
                <X
                  size={16}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-[#F44336]"
                />
              )}
            </div>
            {passwordsMismatch && (
              <p className="text-[12px] text-[#F44336] mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <div
              onClick={() => setTerms((v) => !v)}
              className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                terms
                  ? "bg-brand-orange border-brand-orange"
                  : "border-[#DEE2E6]"
              }`}
            >
              {terms && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path
                    d="M1 3.5l2.5 2.5L8 1"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="text-[13px] text-[#6C757D] leading-snug">
              I agree to Merchat&apos;s{" "}
              <Link
                href="/terms-of-service"
                className="text-brand-orange font-semibold"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-brand-orange font-semibold"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Error */}
          {error && (
            <p className="text-[13px] text-[#F44336] bg-[#FFEBEE] border-l-4 border-[#F44336] rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 rounded-full bg-brand-orange text-white text-[15px] font-semibold hover:bg-brand-orange-hover active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating your account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-[14px] text-[#6C757D] mt-8">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-orange font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
