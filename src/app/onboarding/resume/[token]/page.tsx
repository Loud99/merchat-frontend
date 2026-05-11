import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ResumeRedirector from "./ResumeRedirector";

export default async function ResumePage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("onboarding_sessions")
    .select("step, form_data, expires_at")
    .eq("token", params.token)
    .single();

  const expired = !data || new Date(data.expires_at) < new Date();

  if (expired) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F3F4F6] px-4">
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-full bg-[#FEF3C7] flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={28} className="text-[#D97706]" />
          </div>
          <h1 className="text-[22px] font-bold text-brand-navy mb-2">
            This link has expired
          </h1>
          <p className="text-[15px] text-[#6B7280] mb-8 leading-relaxed">
            Resume links expire after 7 days. Start a new setup — it only takes
            10 minutes.
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-brand-orange text-white font-semibold text-[15px] px-7 py-3 rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all"
          >
            Start setup →
          </Link>
        </div>
      </main>
    );
  }

  return <ResumeRedirector step={data.step} formData={data.form_data} />;
}
