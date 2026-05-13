import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ResumeRedirector from "./ResumeRedirector";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("onboarding_sessions")
    .select("step, form_data, expires_at")
    .eq("token", token)
    .single();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <AlertCircle size={64} className="text-[#D97706]" />
          </div>
          <h1 className="text-[28px] font-bold text-[#212529] mb-3">
            This link is invalid
          </h1>
          <p className="text-[16px] text-[#6C757D] leading-relaxed mb-8">
            This link is invalid or has already been used.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-brand-orange text-white font-semibold text-[15px] px-8 py-3 rounded-full hover:bg-brand-orange-hover active:scale-[0.97] transition-all"
          >
            Log in to continue
          </Link>
        </div>
      </main>
    );
  }

  if (new Date(data.expires_at) < new Date()) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <AlertCircle size={64} className="text-[#D97706]" />
          </div>
          <h1 className="text-[28px] font-bold text-[#212529] mb-3">
            This link has expired
          </h1>
          <p className="text-[16px] text-[#6C757D] leading-relaxed mb-8">
            For security, resume links expire after 7 days. Log in to continue
            your setup.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-brand-orange text-white font-semibold text-[15px] px-8 py-3 rounded-full hover:bg-brand-orange-hover active:scale-[0.97] transition-all"
          >
            Log in to continue
          </Link>
        </div>
      </main>
    );
  }

  return <ResumeRedirector step={data.step} formData={data.form_data} />;
}
