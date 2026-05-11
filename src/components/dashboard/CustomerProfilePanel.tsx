"use client";

import { useState, useEffect } from "react";
import { X, Phone, ShoppingBag, TrendingUp, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CustomerOrder {
  id: string;
  order_reference: string;
  status: string;
  total_amount: number;
  delivery_fee: number;
  payment_status: string;
  created_at: string;
}

interface ProfileData {
  name: string;
  phone: string;
  orders: CustomerOrder[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function formatNaira(amount: number) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function relativeDate(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7)   return `${days}d ago`;
  return formatDate(iso);
}

const STATUS_STYLES: Record<string, string> = {
  new:        "bg-[#DBEAFE] text-[#1D4ED8]",
  confirmed:  "bg-[#FEF3C7] text-[#D97706]",
  paid:       "bg-[#DCFCE7] text-[#16A34A]",
  dispatched: "bg-[#EDE9FE] text-[#7C3AED]",
  delivered:  "bg-[#F3F4F6] text-[#374151]",
};

function StatusPill({ status }: { status: string }) {
  const cls = STATUS_STYLES[status.toLowerCase()] ?? "bg-[#F3F4F6] text-[#374151]";
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${cls}`}>
      {status}
    </span>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse px-5 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#E5E7EB]" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-[#E5E7EB] rounded w-2/3" />
          <div className="h-3 bg-[#E5E7EB] rounded w-1/2" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-[#E5E7EB] rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-[#E5E7EB] rounded w-1/3" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-[#E5E7EB] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ── Panel ──────────────────────────────────────────────────────────────────────

export default function CustomerProfilePanel({
  customerName,
  phone,
  onClose,
}: {
  customerName: string;
  phone: string;
  onClose: () => void;
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    (async () => {
      // Look up the customer by phone number
      const { data: customer } = await supabase
        .from("customers")
        .select("id, name, phone_number")
        .eq("phone_number", phone)
        .single();

      if (!customer) {
        setProfile({ name: customerName, phone, orders: [] });
        setLoading(false);
        return;
      }

      // Fetch all orders for this customer
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_reference, status, total_amount, delivery_fee, payment_status, created_at")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false });

      setProfile({
        name: customer.name ?? customerName,
        phone: customer.phone_number,
        orders: (orders ?? []) as CustomerOrder[],
      });
      setLoading(false);
    })();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phone, customerName, onClose]);

  const totalOrders = profile?.orders.length ?? 0;
  const totalSpend  = profile?.orders.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;
  const lastOrder   = profile?.orders[0]?.created_at ?? null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div
        className="fixed right-0 top-0 h-full z-[70] w-full sm:w-[380px] bg-white shadow-[−8px_0_32px_rgba(0,0,0,0.12)] flex flex-col"
        role="dialog"
        aria-label="Customer profile"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
          <h2 className="text-[16px] font-bold text-brand-navy">Customer Profile</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 -mr-1.5 rounded-lg text-[#9CA3AF] hover:text-brand-navy hover:bg-[#F3F4F6] transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <Skeleton />
          ) : (
            <div className="px-5 py-5 space-y-6">

              {/* Identity */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E8EDF2] flex items-center justify-center text-brand-navy text-[18px] font-bold shrink-0">
                  {getInitials(profile?.name ?? customerName)}
                </div>
                <div>
                  <p className="text-[17px] font-bold text-brand-navy leading-tight">{profile?.name ?? customerName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Phone size={13} className="text-[#16A34A]" strokeWidth={1.5} />
                    <span className="text-[13px] text-[#6B7280]">{phone || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-center">
                  <ShoppingBag size={16} className="text-brand-orange mx-auto mb-1" strokeWidth={1.5} />
                  <p className="text-[18px] font-bold text-brand-navy leading-none">{totalOrders}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">Orders</p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-center">
                  <TrendingUp size={16} className="text-[#16A34A] mx-auto mb-1" strokeWidth={1.5} />
                  <p className="text-[14px] font-bold text-brand-navy leading-none">{formatNaira(totalSpend)}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">Total spend</p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-center">
                  <Clock size={16} className="text-[#6B7280] mx-auto mb-1" strokeWidth={1.5} />
                  <p className="text-[13px] font-bold text-brand-navy leading-none">{lastOrder ? relativeDate(lastOrder) : "—"}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">Last order</p>
                </div>
              </div>

              {/* Order history */}
              <div>
                <h3 className="text-[13px] font-semibold text-brand-navy mb-3">Order History</h3>

                {profile?.orders.length === 0 ? (
                  <div className="text-center py-10">
                    <ShoppingBag size={36} className="text-[#D1D5DB] mx-auto mb-2" strokeWidth={1} />
                    <p className="text-[13px] text-[#9CA3AF]">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile!.orders.map(order => (
                      <div
                        key={order.id}
                        className="border border-[#E5E7EB] rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[13px] font-semibold text-brand-navy">{order.order_reference}</span>
                          <StatusPill status={order.status} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-semibold text-[#374151]">
                            {formatNaira(order.total_amount)}
                          </span>
                          <span className="text-[11px] text-[#9CA3AF]">{relativeDate(order.created_at)}</span>
                        </div>
                        {order.payment_status === "paid" && (
                          <span className="inline-block mt-1.5 text-[10px] font-medium text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                            Paid
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
