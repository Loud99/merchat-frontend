"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputBase =
  "w-full px-4 py-3 text-[15px] rounded-lg border bg-white outline-none transition-all " +
  "focus:border-brand-navy focus:shadow-[0_0_0_3px_rgba(24,46,71,0.12)]";

export default function ResetPasswordPage() {
  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [done, setDone]                 = useState(false);
  const router = useRouter();

  // Supabase embeds the recovery token in the URL hash on redirect.
  // The browser client picks it up automatically via onAuthStateChange.
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Session is now active — form is ready to submit
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 3000);
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
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

        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-8 py-8">
          {done ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5">
                <CheckCircle size={32} strokeWidth={1.5} className="text-[#16A34A]" />
              </div>
              <h2 className="text-[22px] font-bold text-brand-navy mb-2">Password updated!</h2>
              <p className="text-[15px] text-[#6B7280]">Redirecting you to login…</p>
            </div>
          ) : (
            <>
              <h1 className="text-[24px] font-bold text-brand-navy mb-1">Choose a new password</h1>
              <p className="text-[15px] text-[#6B7280] mb-6">Must be at least 8 characters.</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-[13px] font-semibold text-brand-navy mb-1.5">
                    New password
                  </label>
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-brand-navy transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>

                <div className="mb-1">
                  <label htmlFor="confirm" className="block text-[13px] font-semibold text-brand-navy mb-1.5">
                    Confirm new password
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    className={`${inputBase} ${error ? "border-[#EF4444]" : "border-[#D1D5DB]"}`}
                  />
                </div>

                {error && <p className="text-[13px] text-[#EF4444] mt-1.5">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[50px] rounded-lg bg-brand-orange text-white text-[15px] font-semibold mt-5
                    hover:bg-[#B54E20] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating…" : "Update password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
