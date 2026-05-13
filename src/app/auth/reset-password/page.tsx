"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [expired, setExpired] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  const strength = passwordStrength(password);
  const passwordsMatch = confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  // Detect expired/invalid tokens from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("error=access_denied") || hash.includes("error_code=otp_expired")) {
      setExpired(true);
    }
  }, []);

  // Auto-redirect after success
  useEffect(() => {
    if (!done) return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(id); router.push("/auth/login"); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [done, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    setDone(true);
  }

  if (expired) {
    return (
      <AuthLayout
        altLink={
          <Link href="/auth/login" className="text-[14px] text-[#6C757D]">
            ← Back to login
          </Link>
        }
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle size={48} className="text-[#D97706]" />
          </div>
          <h1 className="text-[22px] font-bold text-[#212529] mb-3">Link expired</h1>
          <p className="text-[15px] text-[#6C757D] leading-relaxed mb-6">
            This password reset link has expired. Request a new one.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block w-full h-12 leading-[48px] rounded-full bg-brand-orange text-white text-[15px] font-semibold hover:bg-brand-orange-hover active:scale-[0.97] transition-all text-center"
          >
            Request new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout
        altLink={
          <Link href="/auth/login" className="text-[14px] text-[#6C757D]">
            ← Back to login
          </Link>
        }
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={48} className="text-brand-orange" />
          </div>
          <h1 className="text-[22px] font-bold text-[#212529] mb-3">Password updated!</h1>
          <p className="text-[15px] text-[#6C757D] leading-relaxed mb-6">
            You can now log in with your new password.
          </p>
          <Link
            href="/auth/login"
            className="inline-block w-full h-12 leading-[48px] rounded-full bg-brand-orange text-white text-[15px] font-semibold hover:bg-brand-orange-hover active:scale-[0.97] transition-all text-center"
          >
            Go to login
          </Link>
          <p className="text-[13px] text-[#ADB5BD] mt-3">
            Redirecting in {countdown}s…
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      altLink={
        <Link href="/auth/login" className="text-[14px] text-[#6C757D]">
          ← Back to login
        </Link>
      }
    >
      <div>
        <h1 className="text-[28px] font-bold text-[#212529] mb-1">
          Set a new password
        </h1>
        <p className="text-[16px] text-[#6C757D] mb-8">
          Choose a strong password for your Merchat account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New password */}
          <div>
            <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
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
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className="flex-1 h-1 rounded-full transition-colors"
                      style={{ backgroundColor: strength >= s ? strengthColour[strength] : "#E9ECEF" }}
                    />
                  ))}
                </div>
                <p className="text-[11px] mt-1 font-medium" style={{ color: strengthColour[strength] }}>
                  {strengthLabel[strength]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputCls + " pr-12 " + (passwordsMismatch ? "border-[#F44336]" : "")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#343A40]"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordsMismatch && (
              <p className="text-[12px] text-[#F44336] mt-1">Passwords do not match.</p>
            )}
          </div>

          {error && (
            <p className="text-[13px] text-[#F44336] bg-[#FFEBEE] border-l-4 border-[#F44336] rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !passwordsMatch || password.length < 8}
            className="w-full h-12 rounded-full bg-brand-orange text-white text-[15px] font-semibold hover:bg-brand-orange-hover active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Updating…
              </span>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
