"use server";

import { createClient } from "@/lib/supabase/server";

const MERCHANT_ID = "b4a55b01-be1b-4aed-a4bc-542a51a39caa";

export interface UINotification {
  id: string;
  type: "new_order" | "payment_received" | "escalation" | "low_stock";
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

function relativeTime(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export async function getNotifications(): Promise<UINotification[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, type, title, body, is_read, created_at, related_id")
    .eq("merchant_id", MERCHANT_ID)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []).map(n => ({
    id: n.id,
    type: n.type as UINotification["type"],
    title: n.title,
    body: n.body,
    isRead: n.is_read,
    createdAt: relativeTime(new Date(n.created_at)),
    relatedId: n.related_id ?? undefined,
  }));
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);
}

export async function markAllNotificationsRead(): Promise<void> {
  const supabase = createClient();
  await supabase.from("notifications")
    .update({ is_read: true })
    .eq("merchant_id", MERCHANT_ID)
    .eq("is_read", false);
}
