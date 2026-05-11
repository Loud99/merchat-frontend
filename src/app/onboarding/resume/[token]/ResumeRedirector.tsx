"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  step: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: Record<string, any>;
}

export default function ResumeRedirector({ step, formData }: Props) {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.setItem(
      "onboarding_restore",
      JSON.stringify({ step, form: formData })
    );
    router.replace("/onboarding");
  }, [step, formData, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-brand-orange animate-spin" />
        <p className="text-[15px] text-[#6B7280]">Restoring your progress…</p>
      </div>
    </main>
  );
}
