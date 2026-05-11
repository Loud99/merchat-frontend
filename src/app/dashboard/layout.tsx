import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: merchant } = user
    ? await supabase
        .from("merchants")
        .select("business_name, email")
        .eq("id", user.id)
        .single()
    : { data: null };

  const merchantName  = merchant?.business_name ?? user?.email?.split("@")[0] ?? "Merchant";
  const merchantEmail = merchant?.email ?? user?.email ?? "";

  return (
    <DashboardShell merchantName={merchantName} merchantEmail={merchantEmail}>
      {children}
    </DashboardShell>
  );
}
