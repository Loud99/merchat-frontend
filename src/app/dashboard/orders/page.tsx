"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag, TrendingUp, CreditCard, CheckCircle2,
  Check, X,
} from "lucide-react";
import { getOrders, updateOrderStatus } from "@/lib/data/orders";
import type { UIOrder as Order, UIOrderStatus as OrderStatus } from "@/lib/data/orders";

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrderItem { name: string; qty: number; price: number; }

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_LIST: OrderStatus[] = ["New", "Confirmed", "Paid", "Dispatched", "Delivered"];

const COL_COLOR: Record<OrderStatus, string> = {
  New:        "#6B7280",
  Confirmed:  "#D97706",
  Paid:       "#16A34A",
  Dispatched: "#2563EB",
  Delivered:  "#182E47",
};

const COL_BG: Record<OrderStatus, string> = {
  New:        "bg-[#F3F4F6]",
  Confirmed:  "bg-[#FEF3C7]",
  Paid:       "bg-[#DCFCE7]",
  Dispatched: "bg-[#DBEAFE]",
  Delivered:  "bg-[#E8EDF2]",
};

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  New: "Confirmed", Confirmed: "Paid", Paid: "Dispatched", Dispatched: "Delivered",
};

// ── Skeleton loader ───────────────────────────────────────────────────────────

function OrdersSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 lg:p-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white rounded-xl border border-[#E5E7EB]" />)}
      </div>
      <div className="hidden lg:flex gap-4 flex-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="w-[248px] shrink-0 space-y-3">
            <div className="h-10 bg-[#F3F4F6] rounded-xl" />
            {[1,2].map(j => <div key={j} className="h-36 bg-white rounded-xl border border-[#E5E7EB]" />)}
          </div>
        ))}
      </div>
    </div>
  );
}


// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₦${n.toLocaleString()}`;
const subtotal = (o: Order) => o.items.reduce((s, i) => s + i.qty * i.price, 0);
const orderTotal = (o: Order) => subtotal(o) + o.deliveryFee;
const itemSummary = (o: Order) => o.items.map(i => `${i.qty}× ${i.name}`).join(", ");

// ── Payment badge ─────────────────────────────────────────────────────────────

function PaymentBadge({ order }: { order: Order }) {
  if (order.paymentMethod === "delivery") {
    return <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] font-medium whitespace-nowrap">Pay on Delivery</span>;
  }
  return order.paid
    ? <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-medium whitespace-nowrap">Pay Now ✓</span>
    : <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-medium whitespace-nowrap">Pay Now</span>;
}

// ── Status timeline (for modal) ───────────────────────────────────────────────

function StatusTimeline({ status }: { status: OrderStatus }) {
  const current = STATUS_LIST.indexOf(status);
  return (
    <div className="flex items-start gap-0">
      {STATUS_LIST.map((s, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
            <div className="w-full flex items-center">
              {i > 0 && <div className={`flex-1 h-0.5 ${i <= current ? "bg-brand-orange" : "bg-[#E5E7EB]"}`} />}
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                done   ? "bg-brand-orange border-brand-orange" :
                active ? "border-brand-orange bg-white" :
                         "border-[#D1D5DB] bg-white"
              }`}>
                {done   && <Check size={12} className="text-white" strokeWidth={2.5} />}
                {active && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
              </div>
              {i < STATUS_LIST.length - 1 && <div className={`flex-1 h-0.5 ${i < current ? "bg-brand-orange" : "bg-[#E5E7EB]"}`} />}
            </div>
            <span className={`text-[10px] font-medium text-center leading-tight ${active ? "text-brand-orange" : done ? "text-[#6B7280]" : "text-[#D1D5DB]"}`}>
              {s}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Advance confirmation dialog ───────────────────────────────────────────────

function AdvanceDialog({
  order,
  onConfirm,
  onCancel,
}: {
  order: Order;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const next = NEXT[order.status];
  if (!next) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-[320px]" onClick={e => e.stopPropagation()}>
        <h3 className="text-[17px] font-bold text-brand-navy mb-2">Mark as {next}?</h3>
        <p className="text-[13px] text-[#6B7280] mb-1">{order.ref} · {order.customer.name}</p>
        {order.status === "Dispatched" && (
          <p className="text-[13px] text-[#D97706] bg-[#FEF3C7] rounded-lg px-3 py-2 mt-3 leading-snug">
            This will send a review request to the customer in 24 hours.
          </p>
        )}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[#D1D5DB] text-brand-navy text-[14px] font-medium hover:bg-[#F3F4F6] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-brand-orange text-white text-[14px] font-semibold hover:bg-[#B54E20] transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order detail modal ────────────────────────────────────────────────────────

function OrderDetailModal({
  order,
  onClose,
  onAdvance,
}: {
  order: Order;
  onClose: () => void;
  onAdvance: (id: string) => void;
}) {
  const sub = subtotal(order);
  const tot = orderTotal(order);
  const next = NEXT[order.status];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/50" onClick={onClose}>
      <div
        className="w-full sm:max-w-[600px] bg-white sm:rounded-2xl flex flex-col overflow-hidden h-full sm:h-auto sm:max-h-[88vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-brand-navy">{order.ref}</h2>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">{order.createdAt}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:text-brand-navy hover:bg-[#F3F4F6] transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Customer */}
          <div>
            <h3 className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Customer</h3>
            <p className="text-[15px] font-semibold text-brand-navy">{order.customer.name}</p>
            <a
              href={`tel:${order.customer.phone}`}
              className="text-[14px] text-brand-orange hover:opacity-75 transition-opacity mt-0.5 inline-block"
            >
              {order.customer.phone}
            </a>
            <p className="text-[13px] text-[#6B7280] mt-1">{order.customer.address}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">{order.customer.landmark}</p>
          </div>

          {/* Items table */}
          <div>
            <h3 className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Items</h3>
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Product</th>
                    <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Qty</th>
                    <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Unit</th>
                    <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-b border-[#F3F4F6] last:border-0">
                      <td className="px-4 py-3 text-brand-navy font-medium">{item.name}</td>
                      <td className="px-3 py-3 text-center text-[#6B7280]">{item.qty}</td>
                      <td className="px-4 py-3 text-right text-[#6B7280]">{fmt(item.price)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-navy">{fmt(item.qty * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Totals */}
            <div className="mt-3 space-y-1.5 px-1">
              <div className="flex justify-between text-[13px] text-[#6B7280]">
                <span>Subtotal</span>
                <span>{fmt(sub)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#6B7280]">
                <span>Delivery fee</span>
                <span>{order.deliveryFee === 0 ? "Free" : fmt(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold text-brand-navy pt-1.5 border-t border-[#E5E7EB]">
                <span>Total</span>
                <span className="text-brand-orange">{fmt(tot)}</span>
              </div>
            </div>
          </div>

          {/* Payment status */}
          <div>
            <h3 className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Payment</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <PaymentBadge order={order} />
              <span className="text-[13px] text-[#6B7280]">
                {order.paymentMethod === "delivery" ? "Cash on delivery" : "Online payment"}
              </span>
              {order.paid && order.paidAt && (
                <span className="text-[12px] text-[#9CA3AF]">Paid {order.paidAt}</span>
              )}
            </div>
          </div>

          {/* Status timeline */}
          <div>
            <h3 className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Order progress</h3>
            <StatusTimeline status={order.status} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="shrink-0 px-5 py-4 border-t border-[#E5E7EB] flex gap-3">
          {next && (
            <button
              onClick={() => onAdvance(order.id)}
              className="flex-1 h-11 rounded-xl bg-brand-orange text-white text-[14px] font-semibold hover:bg-[#B54E20] transition-colors"
            >
              Advance to {next}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-[#D1D5DB] text-brand-navy text-[14px] font-medium hover:bg-[#F3F4F6] transition-colors"
          >
            Message customer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Kanban card ───────────────────────────────────────────────────────────────

function KanbanCard({
  order,
  onAdvance,
  onViewDetail,
}: {
  order: Order;
  onAdvance: (id: string) => void;
  onViewDetail: (id: string) => void;
}) {
  const next = NEXT[order.status];
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.09)] transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <button
          onClick={() => onViewDetail(order.id)}
          className="text-[13px] font-semibold text-brand-navy hover:underline"
        >
          {order.ref}
        </button>
        <span className="text-[11px] text-[#9CA3AF]">{order.timestamp}</span>
      </div>
      <p className="text-[14px] font-medium text-brand-navy mb-1">{order.customer.name}</p>
      <p className="text-[12px] text-[#6B7280] truncate mb-2.5">{itemSummary(order)}</p>
      <p className="text-[16px] font-bold text-brand-orange mb-3">{fmt(orderTotal(order))}</p>
      <div className="flex items-center justify-between gap-2">
        <PaymentBadge order={order} />
        {next && (
          <button
            onClick={() => onAdvance(order.id)}
            className="text-[12px] text-[#6B7280] hover:text-brand-navy border border-[#D1D5DB] hover:border-brand-navy px-2.5 py-1 rounded-lg transition-colors shrink-0"
          >
            → Advance
          </button>
        )}
      </div>
    </div>
  );
}

// ── Mobile order card (expandable) ────────────────────────────────────────────

function MobileOrderCard({
  order,
  expanded,
  onToggle,
  onAdvance,
  onViewDetail,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onAdvance: (id: string) => void;
  onViewDetail: (id: string) => void;
}) {
  const next = NEXT[order.status];
  return (
    <div className="border-b border-[#E5E7EB] bg-white">
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-4 hover:bg-[#F9FAFB] transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-brand-navy">{order.ref}</p>
            <p className="text-[13px] text-[#6B7280] mt-0.5 truncate">{order.customer.name} · {itemSummary(order)}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[15px] font-bold text-brand-orange">{fmt(orderTotal(order))}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{order.timestamp}</p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 bg-[#F9FAFB] border-t border-[#E5E7EB] space-y-3">
          {/* Items */}
          <div className="space-y-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-[13px]">
                <span className="text-brand-navy">{item.qty}× {item.name}</span>
                <span className="text-[#6B7280]">{fmt(item.qty * item.price)}</span>
              </div>
            ))}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-[13px] text-[#9CA3AF]">
                <span>Delivery</span>
                <span>{fmt(order.deliveryFee)}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <a
            href={`tel:${order.customer.phone}`}
            className="block text-[13px] text-brand-orange hover:opacity-75 transition-opacity"
          >
            {order.customer.phone}
          </a>

          {/* Address */}
          <p className="text-[13px] text-[#6B7280]">{order.customer.address}</p>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onViewDetail(order.id)}
              className="flex-1 h-10 rounded-xl border border-[#D1D5DB] text-brand-navy text-[13px] font-medium hover:bg-white transition-colors"
            >
              View details
            </button>
            {next && (
              <button
                onClick={() => onAdvance(order.id)}
                className="flex-1 h-10 rounded-xl bg-brand-orange text-white text-[13px] font-semibold hover:bg-[#B54E20] transition-colors"
              >
                Advance to {next}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Summary card ──────────────────────────────────────────────────────────────

function SummaryCard({
  icon: Icon,
  iconBg,
  iconCls,
  title,
  value,
  subtext,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconCls: string;
  title: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}>
        <Icon size={18} strokeWidth={1.5} className={iconCls} />
      </div>
      <p className="text-[26px] font-bold text-brand-navy leading-none">{value}</p>
      <p className="text-[13px] font-semibold text-brand-navy mt-1">{title}</p>
      {subtext && <p className="text-[12px] text-[#9CA3AF] mt-0.5">{subtext}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders]               = useState<Order[]>([]);
  const [loading, setLoading]             = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [advanceOrderId, setAdvanceOrderId]   = useState<string | null>(null);
  const [mobileTab, setMobileTab]             = useState<OrderStatus>("New");
  const [expandedId, setExpandedId]           = useState<string | null>(null);

  useEffect(() => {
    getOrders().then(data => { setOrders(data); setLoading(false); });
  }, []);

  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) ?? null : null;
  const advanceOrder  = advanceOrderId  ? orders.find(o => o.id === advanceOrderId)  ?? null : null;

  async function doAdvance(orderId: string) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const next = NEXT[order.status];
    if (!next) return;
    // Optimistic update
    setOrders(prev => prev.map(o =>
      o.id !== orderId ? o : { ...o, status: next, paid: next === "Paid" ? true : o.paid }
    ));
    setAdvanceOrderId(null);
    setExpandedId(null);
    await updateOrderStatus(orderId, next);
  }

  // Summary metrics
  const newCount        = orders.filter(o => o.status === "New").length;
  const revenueToday    = orders.filter(o => o.status === "Delivered").reduce((s, o) => s + orderTotal(o), 0);
  const deliveredCount  = orders.filter(o => o.status === "Delivered").length;
  const awaitingPayment = orders.filter(o => (o.status === "New" || o.status === "Confirmed") && !o.paid).length;

  if (loading) return <OrdersSkeleton />;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 lg:p-6">
      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        <SummaryCard
          icon={ShoppingBag}  iconBg="bg-[#FEF3C7]" iconCls="text-brand-orange"
          title="New Orders"   value={newCount}
          subtext="Awaiting confirmation"
        />
        <SummaryCard
          icon={TrendingUp}   iconBg="bg-[#DCFCE7]" iconCls="text-[#16A34A]"
          title="Revenue Today" value={fmt(revenueToday)}
          subtext={`Across ${deliveredCount} order${deliveredCount !== 1 ? "s" : ""}`}
        />
        <SummaryCard
          icon={CreditCard}   iconBg="bg-[#FEF3C7]" iconCls="text-[#D97706]"
          title="Awaiting Payment" value={awaitingPayment}
          subtext="Payment links sent"
        />
        <SummaryCard
          icon={CheckCircle2} iconBg="bg-[#DCFCE7]" iconCls="text-[#16A34A]"
          title="Delivered Today" value={deliveredCount}
        />
      </div>

      {/* ── Kanban board (desktop) ──────────────────────────────────────────── */}
      <div className="hidden lg:flex gap-4 flex-1 min-h-0 overflow-x-auto pb-2">
        {STATUS_LIST.map(status => {
          const colOrders = orders.filter(o => o.status === status);
          return (
            <div key={status} className="w-[248px] shrink-0 flex flex-col min-h-0">
              {/* Column header */}
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 ${COL_BG[status]}`}>
                <span className="text-[13px] font-bold" style={{ color: COL_COLOR[status] }}>{status}</span>
                <span
                  className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-white/70"
                  style={{ color: COL_COLOR[status] }}
                >
                  {colOrders.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
                {colOrders.map(o => (
                  <KanbanCard
                    key={o.id}
                    order={o}
                    onAdvance={setAdvanceOrderId}
                    onViewDetail={setSelectedOrderId}
                  />
                ))}
                {colOrders.length === 0 && (
                  <div className="flex items-center justify-center py-10 text-[13px] text-[#D1D5DB] border-2 border-dashed border-[#E5E7EB] rounded-xl">
                    No orders
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Tabbed list (mobile) ────────────────────────────────────────────── */}
      <div className="lg:hidden flex-1 flex flex-col min-h-0 overflow-hidden -mx-4">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-[#E5E7EB] bg-white shrink-0 px-1">
          {STATUS_LIST.map(status => (
            <button
              key={status}
              onClick={() => { setMobileTab(status); setExpandedId(null); }}
              className={`px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                mobileTab === status
                  ? "border-brand-orange text-brand-orange"
                  : "border-transparent text-[#6B7280] hover:text-brand-navy"
              }`}
            >
              {status}
              <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${mobileTab === status ? "bg-[#F4EDE8] text-brand-orange" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                {orders.filter(o => o.status === status).length}
              </span>
            </button>
          ))}
        </div>

        {/* Card list */}
        <div className="flex-1 overflow-y-auto bg-white">
          {orders.filter(o => o.status === mobileTab).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6 gap-3">
              <ShoppingBag size={40} className="text-[#D1D5DB]" strokeWidth={1} />
              <p className="text-[14px] font-semibold text-brand-navy">No {mobileTab.toLowerCase()} orders</p>
            </div>
          ) : (
            orders.filter(o => o.status === mobileTab).map(o => (
              <MobileOrderCard
                key={o.id}
                order={o}
                expanded={expandedId === o.id}
                onToggle={() => setExpandedId(expandedId === o.id ? null : o.id)}
                onAdvance={setAdvanceOrderId}
                onViewDetail={setSelectedOrderId}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Order detail modal ──────────────────────────────────────────────── */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onAdvance={(id) => { setAdvanceOrderId(id); }}
        />
      )}

      {/* ── Advance confirmation ────────────────────────────────────────────── */}
      {advanceOrder && (
        <AdvanceDialog
          order={advanceOrder}
          onConfirm={() => doAdvance(advanceOrder.id)}
          onCancel={() => setAdvanceOrderId(null)}
        />
      )}
    </div>
  );
}
