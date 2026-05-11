"use server";

import { createClient } from "@/lib/supabase/server";

const MERCHANT_ID = "b4a55b01-be1b-4aed-a4bc-542a51a39caa";

export type UIOrderStatus = "New" | "Confirmed" | "Paid" | "Dispatched" | "Delivered";

export interface UIOrderItem { name: string; qty: number; price: number; }

export interface UIOrder {
  id: string;
  ref: string;
  status: UIOrderStatus;
  customer: { name: string; phone: string; address: string; landmark: string };
  items: UIOrderItem[];
  deliveryFee: number;
  paymentMethod: "online" | "delivery";
  paid: boolean;
  paidAt?: string;
  timestamp: string;
  createdAt: string;
}

const DB_TO_UI: Record<string, UIOrderStatus> = {
  new: "New", confirmed: "Confirmed", paid: "Paid",
  dispatched: "Dispatched", delivered: "Delivered",
};

const UI_TO_DB: Record<UIOrderStatus, string> = {
  New: "new", Confirmed: "confirmed", Paid: "paid",
  Dispatched: "dispatched", Delivered: "delivered",
};

function relativeTime(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return "Yesterday";
}

export async function getOrders(): Promise<UIOrder[]> {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("orders")
    .select("id, order_reference, status, payment_method, payment_status, total_amount, delivery_fee, delivery_address, landmark, created_at, customer_id")
    .eq("merchant_id", MERCHANT_ID)
    .order("created_at", { ascending: false });

  if (!rows || rows.length === 0) return [];

  const custIds = Array.from(new Set(rows.map(o => o.customer_id).filter(Boolean)));
  const { data: customers } = custIds.length
    ? await supabase.from("customers").select("id, name, phone_number").in("id", custIds)
    : { data: [] };
  const custMap = Object.fromEntries((customers ?? []).map(c => [c.id, c]));

  const { data: items } = await supabase
    .from("order_items")
    .select("order_id, product_name, quantity, unit_price")
    .in("order_id", rows.map(o => o.id));

  const itemsMap: Record<string, UIOrderItem[]> = {};
  for (const item of items ?? []) {
    (itemsMap[item.order_id] ??= []).push({
      name: item.product_name,
      qty: item.quantity,
      price: Number(item.unit_price),
    });
  }

  return rows.map(o => {
    const cust = o.customer_id ? custMap[o.customer_id] : null;
    const createdAt = new Date(o.created_at);
    return {
      id: o.id,
      ref: `#${o.order_reference}`,
      status: DB_TO_UI[o.status] ?? "New",
      customer: {
        name: cust?.name ?? "Unknown Customer",
        phone: cust?.phone_number ?? "",
        address: o.delivery_address ?? "",
        landmark: o.landmark ?? "",
      },
      items: itemsMap[o.id] ?? [],
      deliveryFee: Number(o.delivery_fee ?? 0),
      paymentMethod: o.payment_method === "pay_now" ? "online" : "delivery",
      paid: o.payment_status === "paid",
      paidAt: o.payment_status === "paid"
        ? createdAt.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })
        : undefined,
      timestamp: relativeTime(createdAt),
      createdAt: createdAt.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }),
    };
  });
}

export async function updateOrderStatus(id: string, nextStatus: UIOrderStatus): Promise<void> {
  const supabase = await createClient();
  const updates: Record<string, string> = { status: UI_TO_DB[nextStatus] };
  if (nextStatus === "Paid") updates.payment_status = "paid";
  await supabase.from("orders").update(updates).eq("id", id);
}
