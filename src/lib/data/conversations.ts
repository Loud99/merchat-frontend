"use server";

import { createClient } from "@/lib/supabase/server";

const MERCHANT_ID = "b4a55b01-be1b-4aed-a4bc-542a51a39caa";

export type UIThreadStatus = "ai_active" | "escalated" | "merchant_active" | "resolved";
export type UIMsgRole = "customer" | "ai" | "merchant" | "system";

export interface UIMessage {
  id: string;
  role: UIMsgRole;
  text: string;
  ts: string;
}

export interface UIThread {
  id: string;
  customerName: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  status: UIThreadStatus;
  unread: number;
  messages: UIMessage[];
}

const DB_TO_UI_STATUS: Record<string, UIThreadStatus> = {
  active: "ai_active",
  escalated: "escalated",
  merchant_active: "merchant_active",
  resolved: "resolved",
};

const UI_TO_DB_STATUS: Record<UIThreadStatus, string> = {
  ai_active: "active",
  escalated: "escalated",
  merchant_active: "merchant_active",
  resolved: "resolved",
};

function relativeTime(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return "Yesterday";
}

export async function getConversations(): Promise<UIThread[]> {
  const supabase = createClient();

  const { data: convs } = await supabase
    .from("conversations")
    .select("id, ai_status, last_message_at, last_message_preview, unread_count, customer_id")
    .eq("merchant_id", MERCHANT_ID)
    .order("last_message_at", { ascending: false });

  if (!convs || convs.length === 0) return [];

  const custIds = Array.from(new Set(convs.map(c => c.customer_id).filter(Boolean)));
  const { data: customers } = custIds.length
    ? await supabase.from("customers").select("id, name, phone_number").in("id", custIds)
    : { data: [] };
  const custMap = Object.fromEntries((customers ?? []).map(c => [c.id, c]));

  const { data: allMsgs } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_type, content, message_type, created_at")
    .in("conversation_id", convs.map(c => c.id))
    .order("created_at", { ascending: true });

  const msgMap: Record<string, UIMessage[]> = {};
  for (const msg of allMsgs ?? []) {
    const role: UIMsgRole = msg.message_type === "system" ? "system" : (msg.sender_type as UIMsgRole);
    (msgMap[msg.conversation_id] ??= []).push({
      id: msg.id,
      role,
      text: msg.content,
      ts: new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    });
  }

  return convs.map(c => {
    const cust = c.customer_id ? custMap[c.customer_id] : null;
    const lastAt = c.last_message_at ? new Date(c.last_message_at) : new Date(0);
    return {
      id: c.id,
      customerName: cust?.name ?? "Unknown",
      phone: cust?.phone_number ?? "",
      lastMessage: c.last_message_preview ?? "",
      timestamp: relativeTime(lastAt),
      status: DB_TO_UI_STATUS[c.ai_status] ?? "ai_active",
      unread: c.unread_count ?? 0,
      messages: msgMap[c.id] ?? [],
    };
  });
}

export async function insertMessage(
  conversationId: string,
  content: string,
  senderType: "merchant" | "customer" | "ai"
): Promise<void> {
  const supabase = createClient();
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_type: senderType,
    content,
    message_type: "text",
  });
  await supabase.from("conversations").update({
    last_message_at: new Date().toISOString(),
    last_message_preview: content.slice(0, 100),
    unread_count: 0,
    ai_status: "merchant_active",
  }).eq("id", conversationId);
}

export async function updateConversationStatus(
  conversationId: string,
  status: UIThreadStatus
): Promise<void> {
  const supabase = createClient();
  await supabase.from("conversations")
    .update({ ai_status: UI_TO_DB_STATUS[status] })
    .eq("id", conversationId);
}
