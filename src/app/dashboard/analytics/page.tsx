"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  TrendingUp, ShoppingBag, BarChart2, MessageSquare,
  Percent, AlertCircle, Package, LucideIcon,
  Download, ChevronDown, Bot, Send, Users, Star,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { getOrders } from "@/lib/data/orders";
import type { UIOrder } from "@/lib/data/orders";

// ── Types ─────────────────────────────────────────────────────────────────────

type Range = "today" | "week" | "month" | "custom";

interface DayPoint { label: string; revenue: number; orders: number; }

interface KpiSet {
  revenue: number;
  orders: number;
  aov: number;
  conversations: number;
  conversionRate: number;
  escalationRate: number;
  repeatCustomerRate: number;
}

interface AiMessage { role: "user" | "ai"; text: string; }

// ── Mock data ─────────────────────────────────────────────────────────────────

const TODAY_POINTS: DayPoint[] = [
  { label: "8am",  revenue: 18500,  orders: 1 },
  { label: "9am",  revenue: 0,      orders: 0 },
  { label: "10am", revenue: 32000,  orders: 2 },
  { label: "11am", revenue: 8900,   orders: 1 },
  { label: "12pm", revenue: 55000,  orders: 3 },
  { label: "1pm",  revenue: 22000,  orders: 1 },
  { label: "2pm",  revenue: 41000,  orders: 2 },
  { label: "3pm",  revenue: 18500,  orders: 1 },
  { label: "4pm",  revenue: 9800,   orders: 1 },
];

const WEEK_POINTS: DayPoint[] = [
  { label: "Mon", revenue: 143000, orders: 8  },
  { label: "Tue", revenue: 89000,  orders: 5  },
  { label: "Wed", revenue: 212000, orders: 12 },
  { label: "Thu", revenue: 178000, orders: 9  },
  { label: "Fri", revenue: 254000, orders: 14 },
  { label: "Sat", revenue: 310000, orders: 18 },
  { label: "Sun", revenue: 198000, orders: 11 },
];

const MONTH_POINTS: DayPoint[] = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  revenue: Math.round(80000 + (Math.sin(i * 0.4) * 60000) + 60000),
  orders:  Math.round(4 + Math.sin(i * 0.4) * 6 + 5),
}));

const KPI_DATA: Record<Range, { current: KpiSet; prev: KpiSet }> = {
  today: {
    current: { revenue: 205700, orders: 12, aov: 17142, conversations: 38, conversionRate: 31.6, escalationRate: 18.4, repeatCustomerRate: 29.1 },
    prev:    { revenue: 184200, orders: 10, aov: 18420, conversations: 34, conversionRate: 29.4, escalationRate: 21.0, repeatCustomerRate: 26.5 },
  },
  week: {
    current: { revenue: 1384000, orders: 77, aov: 17974, conversations: 241, conversionRate: 32.0, escalationRate: 15.8, repeatCustomerRate: 34.2 },
    prev:    { revenue: 1210000, orders: 68, aov: 17794, conversations: 218, conversionRate: 31.2, escalationRate: 17.4, repeatCustomerRate: 31.8 },
  },
  month: {
    current: { revenue: 5840000, orders: 312, aov: 18718, conversations: 1024, conversionRate: 30.5, escalationRate: 16.2, repeatCustomerRate: 36.8 },
    prev:    { revenue: 5120000, orders: 280, aov: 18286, conversations: 940,  conversionRate: 29.8, escalationRate: 18.1, repeatCustomerRate: 33.4 },
  },
  custom: {
    current: { revenue: 5840000, orders: 312, aov: 18718, conversations: 1024, conversionRate: 30.5, escalationRate: 16.2, repeatCustomerRate: 36.8 },
    prev:    { revenue: 5120000, orders: 280, aov: 18286, conversations: 940,  conversionRate: 29.8, escalationRate: 18.1, repeatCustomerRate: 33.4 },
  },
};

const TOP_PRODUCTS = [
  { name: "Kaftan Set",        category: "Sets",        orders: 48, revenue: 1248000 },
  { name: "Ankara Midi Dress", category: "Dresses",     orders: 41, revenue:  758500 },
  { name: "Leather Tote Bag",  category: "Accessories", orders: 37, revenue: 1184000 },
  { name: "Lace Evening Gown", category: "Dresses",     orders: 29, revenue: 1595000 },
  { name: "Boubou Dress Set",  category: "Sets",        orders: 24, revenue:  984000 },
];

const TOP_BY_REVENUE = [...TOP_PRODUCTS].sort((a, b) => b.revenue - a.revenue)[0];

const CATEGORY_REVENUE = [
  { name: "Sets",        value: 2232000, color: "#182E47" },
  { name: "Dresses",     value: 2353500, color: "#D5652B" },
  { name: "Accessories", value: 1184000, color: "#D97706" },
];

const FUNNEL_STEPS = [
  { label: "Total conversations",   count: 1024 },
  { label: "Reached product stage", count: 734  },
  { label: "Order intent shown",    count: 498  },
  { label: "Flow completed",        count: 356  },
  { label: "Paid",                  count: 312  },
];

const ESCALATION_REASONS = [
  { name: "Frustration detected", value: 38, color: "#D5652B" },
  { name: "Too many failures",    value: 24, color: "#D97706" },
  { name: "Manual takeover",      value: 28, color: "#182E47" },
  { name: "Unknown",              value: 10, color: "#9CA3AF" },
];

const AI_HANDLED_PCT = 78;

const MERCHANT_NAME = "Fashion by Amina";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtN(n: number) {
  if (n >= 1_000_000) return "₦" + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return "₦" + (n / 1_000).toFixed(1) + "K";
  return "₦" + n.toLocaleString("en-NG");
}

function fmtFull(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function trendPct(cur: number, prev: number) {
  if (prev === 0) return 0;
  return ((cur - prev) / prev) * 100;
}

// ── Download utility ──────────────────────────────────────────────────────────

function triggerDownload(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildCSV(orders: UIOrder[]): string {
  const BOM = "﻿";
  const header = ["Date","Order Ref","Customer","Phone","Product","Qty","Unit Price (₦)","Revenue (₦)","Delivery Fee (₦)","Status"].join(",");
  const rows = orders.flatMap(o =>
    o.items.map(item => [
      `"${o.createdAt}"`,
      `"${o.ref}"`,
      `"${o.customer.name}"`,
      `"${o.customer.phone}"`,
      `"${item.name}"`,
      item.qty,
      item.price,
      item.qty * item.price,
      o.deliveryFee,
      `"${o.status}"`,
    ].join(","))
  );
  return BOM + [header, ...rows].join("\n");
}

function buildXLS(orders: UIOrder[]): string {
  const rows = orders.flatMap(o =>
    o.items.map(item => `<tr>
      <td>${o.createdAt}</td><td>${o.ref}</td><td>${o.customer.name}</td>
      <td>${o.customer.phone}</td><td>${item.name}</td><td>${item.qty}</td>
      <td>${item.price}</td><td>${item.qty * item.price}</td>
      <td>${o.deliveryFee}</td><td>${o.status}</td></tr>`)
  ).join("");

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><!--[if gte mso 9]><xml>
<x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>Orders</x:Name><x:WorksheetOptions><x:DisplayGridlines/>
</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>
</x:ExcelWorkbook></xml><![endif]--></head>
<body><table border="1">
<thead><tr style="background:#182E47;color:#fff;font-weight:bold">
<th>Date</th><th>Order Ref</th><th>Customer</th><th>Phone</th>
<th>Product</th><th>Qty</th><th>Unit Price (₦)</th><th>Revenue (₦)</th>
<th>Delivery Fee (₦)</th><th>Status</th></tr></thead>
<tbody>${rows}</tbody></table></body></html>`;
}

function buildAnalyticsPDF(kpi: KpiSet, range: string, orders: UIOrder[]): string {
  const totalRevenue  = fmtFull(kpi.revenue);
  const topRow = orders.slice(0, 5).map(o =>
    `<tr><td>${o.createdAt}</td><td>${o.ref}</td><td>${o.customer.name}</td>
     <td>${o.items.map(i => `${i.qty}× ${i.name}`).join(", ")}</td>
     <td style="text-align:right">${fmtFull(o.items.reduce((s,i)=>s+i.qty*i.price,0))}</td>
     <td>${o.status}</td></tr>`
  ).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Analytics Report · ${MERCHANT_NAME}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;background:#fff}
  .page{max-width:780px;margin:0 auto;padding:48px 40px}
  .hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #182E47}
  .hd-name{font-size:22px;font-weight:700;color:#182E47}
  .hd-sub{font-size:13px;color:#6B7280;margin-top:3px}
  .hd-date{font-size:12px;color:#9CA3AF;text-align:right}
  h2{font-size:15px;font-weight:700;color:#182E47;margin:24px 0 12px}
  .kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:8px}
  .kpi{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:16px}
  .kpi-label{font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .kpi-value{font-size:22px;font-weight:700;color:#182E47}
  .kpi-trend{font-size:11px;margin-top:4px}
  .kpi-trend.up{color:#16A34A} .kpi-trend.down{color:#EF4444}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{background:#F9FAFB;padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#6B7280;border-bottom:1px solid #E5E7EB}
  td{padding:8px 12px;border-bottom:1px solid #F3F4F6;color:#374151}
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #E5E7EB;font-size:11px;color:#9CA3AF;text-align:center}
  @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
</style>
</head>
<body><div class="page">
  <div class="hd">
    <div>
      <div class="hd-name">${MERCHANT_NAME}</div>
      <div class="hd-sub">Analytics Report · ${range}</div>
    </div>
    <div class="hd-date">Generated ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
  </div>
  <h2>Key Metrics</h2>
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">Total Revenue</div><div class="kpi-value">${totalRevenue}</div></div>
    <div class="kpi"><div class="kpi-label">Total Orders</div><div class="kpi-value">${kpi.orders}</div></div>
    <div class="kpi"><div class="kpi-label">Avg Order Value</div><div class="kpi-value">${fmtFull(kpi.aov)}</div></div>
    <div class="kpi"><div class="kpi-label">Conversations</div><div class="kpi-value">${kpi.conversations}</div></div>
    <div class="kpi"><div class="kpi-label">Conversion Rate</div><div class="kpi-value">${kpi.conversionRate.toFixed(1)}%</div></div>
    <div class="kpi"><div class="kpi-label">Repeat Customer Rate</div><div class="kpi-value">${kpi.repeatCustomerRate.toFixed(1)}%</div></div>
  </div>
  <h2>Top Products by Revenue</h2>
  <table>
    <thead><tr><th>#</th><th>Product</th><th>Category</th><th>Orders</th><th style="text-align:right">Revenue</th></tr></thead>
    <tbody>${TOP_PRODUCTS.sort((a,b)=>b.revenue-a.revenue).map((p,i)=>
      `<tr><td>${i+1}</td><td><strong>${p.name}</strong></td><td>${p.category}</td>
       <td>${p.orders}</td><td style="text-align:right">${fmtFull(p.revenue)}</td></tr>`).join("")}
    </tbody>
  </table>
  <h2>Recent Orders</h2>
  <table>
    <thead><tr><th>Date</th><th>Ref</th><th>Customer</th><th>Items</th><th style="text-align:right">Revenue</th><th>Status</th></tr></thead>
    <tbody>${topRow || "<tr><td colspan='6' style='text-align:center;color:#9CA3AF;padding:24px'>No orders in range</td></tr>"}</tbody>
  </table>
  <div class="footer">Generated by Merchat.io · ${MERCHANT_NAME}</div>
</div></body></html>`;
}

// ── AI analyst response generator ─────────────────────────────────────────────

function generateAnalystReply(query: string, kpi: KpiSet, prev: KpiSet, range: Range): string {
  const q = query.toLowerCase();
  const rl = range === "today" ? "today" : range === "week" ? "this week" : "this month";
  const revTrend = trendPct(kpi.revenue, prev.revenue);
  const convTrend = trendPct(kpi.conversations, prev.conversations);

  if (/best.*day|busiest.*day|which.*day|day.*week|peak/.test(q)) {
    return `Saturday is your strongest day this week with 18 orders and ₦310,000 in revenue. Your busiest window is 12pm–6pm. Friday and Saturday together account for about 40% of your weekly revenue — a targeted weekend flash sale could push this even higher.`;
  }
  if (/restock|inventory|running.*low|out.*stock|stock/.test(q)) {
    return `The Kaftan Set has the highest order volume (48 orders) and needs consistent restocking. The Lace Evening Gown drives your top revenue (₦1.6M) — a single stockout there would hurt disproportionately. I'd prioritise those two for your next restock cycle.`;
  }
  if (/revenue.*trend|how.*revenue|sales.*trend|growth/.test(q)) {
    const dir = revTrend > 0 ? "up" : "down";
    return `Revenue ${rl} is ${fmtFull(kpi.revenue)}, ${dir} ${Math.abs(revTrend).toFixed(1)}% from the previous period. Conversations are also ${convTrend > 0 ? "up" : "down"} ${Math.abs(convTrend).toFixed(1)}%, which is a leading indicator of future orders. Your Wednesday and weekend peaks are your key drivers.`;
  }
  if (/conversion|convert|chat.*order|orders.*from/.test(q)) {
    return `Your conversion rate is ${kpi.conversionRate.toFixed(1)}% ${rl}. For every 100 WhatsApp conversations, ~${Math.round(kpi.conversionRate)} result in a paid order. Industry average for WhatsApp commerce sits at 25–30%, so you're performing above average. A quicker response to product questions could push this past 35%.`;
  }
  if (/ai.*performance|how.*ai|escalation|handoff|ai.*doing/.test(q)) {
    const escDir = kpi.escalationRate < prev.escalationRate ? "down" : "up";
    return `Your AI is handling ${AI_HANDLED_PCT}% of conversations fully without escalation. The escalation rate is ${kpi.escalationRate.toFixed(1)}%, ${escDir} from ${prev.escalationRate.toFixed(1)}% last period. The top escalation trigger is "frustration detected" (38%) — improving the AI's handling of complaints and delays could get you to 85%+ AI resolution.`;
  }
  if (/repeat.*customer|loyal|return|retention|churn/.test(q)) {
    const rDir = kpi.repeatCustomerRate > prev.repeatCustomerRate ? "up" : "down";
    return `${kpi.repeatCustomerRate.toFixed(1)}% of your orders ${rl} came from repeat customers, ${rDir} from ${prev.repeatCustomerRate.toFixed(1)}% last period. Your top repeat buyers tend to come back for the Kaftan Set and Ankara Midi Dress. A simple loyalty message after delivery could push retention above 40%.`;
  }
  if (/top.*product|best.*product|best.*selling|most.*sold|popular/.test(q)) {
    return `By revenue, your top product is the Lace Evening Gown at ₦1.6M — high unit price (₦65,000) with 29 orders. By volume, the Kaftan Set leads with 48 orders. These two products are worth featuring at the top of your WhatsApp catalogue and running occasional bundle offers.`;
  }
  if (/categor|which.*type|dress|set|bag|accessory/.test(q)) {
    return `Dresses are your highest-revenue category at ₦2.35M (40.8% of revenue), driven largely by the Lace Evening Gown. Sets are close behind at ₦2.23M. Accessories (₦1.18M) punch above their weight given lower average prices — high volume, steady demand.`;
  }
  if (/average.*order|aov|order.*value/.test(q)) {
    const aovTrend = trendPct(kpi.aov, prev.aov);
    return `Your average order value ${rl} is ${fmtFull(kpi.aov)}, ${aovTrend >= 0 ? "up" : "down"} ${Math.abs(aovTrend).toFixed(1)}% vs the prior period. Bundling lower-priced items (like the Bead Necklace or Silk Headwrap) with popular products could raise this to ₦20,000+.`;
  }

  return `Here's your summary for ${rl}: ${kpi.orders} orders totalling ${fmtFull(kpi.revenue)}, average order value of ${fmtFull(kpi.aov)}, and a ${kpi.conversionRate.toFixed(1)}% conversation-to-order conversion rate. Your AI resolves ${AI_HANDLED_PCT}% of conversations independently. Try asking about a specific metric — revenue trends, top products, repeat customers, or day-of-week performance.`;
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-lg p-3 text-[13px]">
      <p className="font-semibold text-brand-navy mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-[#6B7280]">{p.name}:</span>
          <span className="font-semibold text-brand-navy">
            {p.name === "Revenue" ? fmtFull(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon, label, value, trend, accentColor, isWarning,
}: {
  icon: LucideIcon; label: string; value: string;
  trend: number; accentColor: string; isWarning?: boolean;
}) {
  const trendColor = trend > 0 ? "#16A34A" : trend < 0 ? "#EF4444" : "#6B7280";
  const trendArrow = trend > 0 ? "↑" : trend < 0 ? "↓" : "→";
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4">
      <div className="flex items-start justify-between mb-3">
        <Icon size={22} style={{ color: isWarning ? "#D97706" : accentColor }} strokeWidth={1.5} />
        <span className="text-[12px] text-[#6B7280] text-right leading-tight">{label}</span>
      </div>
      <p className="text-[26px] font-bold text-brand-navy leading-none mb-2">{value}</p>
      <p className="text-[11px] font-medium" style={{ color: trendColor }}>
        {trendArrow} {Math.abs(trend).toFixed(1)}% vs prev period
      </p>
    </div>
  );
}

function TopProductCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4">
      <div className="flex items-start justify-between mb-3">
        <Star size={22} className="text-[#D97706]" strokeWidth={1.5} />
        <span className="text-[12px] text-[#6B7280] text-right leading-tight">Top Product · Revenue</span>
      </div>
      <p className="text-[17px] font-bold text-brand-navy leading-snug mb-1 line-clamp-2">
        {TOP_BY_REVENUE.name}
      </p>
      <p className="text-[15px] font-semibold text-brand-orange">{fmtN(TOP_BY_REVENUE.revenue)}</p>
      <p className="text-[11px] text-[#9CA3AF] mt-1.5">{TOP_BY_REVENUE.orders} orders this period</p>
    </div>
  );
}

// ── Funnel bar ────────────────────────────────────────────────────────────────

function FunnelBar({ step, total, index, count }: {
  step: { label: string; count: number };
  total: number; index: number; count: number;
}) {
  const widthPct = (step.count / total) * 100;
  const colors = ["#9CA3AF", "#B8906A", "#C97A3F", "#D0692E", "#D5652B"];
  const color = colors[Math.min(index, colors.length - 1)];
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-brand-navy font-medium">{step.label}</span>
        <span className="text-[#6B7280]">
          {step.count.toLocaleString()}
          <span className="text-[11px] ml-1">({Math.round(widthPct)}%)</span>
        </span>
      </div>
      <div className="h-8 rounded-lg bg-[#F3F4F6] overflow-hidden">
        <div
          className="h-full rounded-lg flex items-center pl-3 transition-all duration-500"
          style={{ width: `${widthPct}%`, backgroundColor: color }}
        >
          {widthPct > 20 && (
            <span className="text-white text-[12px] font-semibold">{step.count.toLocaleString()}</span>
          )}
        </div>
      </div>
      {index < count - 1 && (
        <div className="text-[11px] text-[#9CA3AF] pl-1">
          → {Math.round((step.count / total) * 100)}% reached this stage
        </div>
      )}
    </div>
  );
}

// ── Donut legend ──────────────────────────────────────────────────────────────

function DonutLegend({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.name} className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
          <span className="text-[13px] text-brand-navy flex-1">{d.name}</span>
          <span className="text-[13px] font-semibold text-brand-navy">{d.value}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Export dropdown ───────────────────────────────────────────────────────────

function ExportDropdown({
  kpi, range, orders,
}: {
  kpi: KpiSet; range: Range; orders: UIOrder[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const rangeLabel = range === "today" ? "Today" : range === "week" ? "This Week" : range === "month" ? "This Month" : "Custom";

  function handleCSV() {
    setOpen(false);
    triggerDownload("orders.csv", "text/csv;charset=utf-8", buildCSV(orders));
  }

  function handleXLS() {
    setOpen(false);
    triggerDownload("orders.xls", "application/vnd.ms-excel", buildXLS(orders));
  }

  function handlePDF() {
    setOpen(false);
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(buildAnalyticsPDF(kpi, rangeLabel, orders));
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
  }

  const items = [
    { label: "Export as CSV",       sub: "Orders table, spreadsheet-ready", action: handleCSV },
    { label: "Export as Excel (.xls)", sub: "Native Excel format",          action: handleXLS },
    { label: "Export as PDF",        sub: "Formatted analytics report",     action: handlePDF },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 h-9 px-4 rounded-xl border border-[#D1D5DB] bg-white text-[13px] font-medium text-brand-navy hover:bg-[#F3F4F6] transition-colors"
      >
        <Download size={14} strokeWidth={1.5} />
        Export
        <ChevronDown size={14} strokeWidth={1.5} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1.5 z-50">
          {items.map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full text-left px-4 py-2.5 hover:bg-[#F9FAFB] transition-colors"
            >
              <p className="text-[13px] font-medium text-brand-navy">{item.label}</p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">{item.sub}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Analyst ────────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  "What's my best day of the week?",
  "Which product should I restock?",
  "How is my revenue trending?",
  "How is the AI performing?",
];

function AiAnalyst({ kpi, prev, range }: { kpi: KpiSet; prev: KpiSet; range: Range }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function submit(query: string) {
    const q = query.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    setTimeout(() => {
      const reply = generateAnalystReply(q, kpi, prev, range);
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      setLoading(false);
    }, 700 + Math.random() * 400);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); }
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E7EB] bg-gradient-to-r from-brand-navy/5 to-transparent">
        <div className="w-9 h-9 rounded-xl bg-brand-navy flex items-center justify-center shrink-0">
          <Bot size={18} className="text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[15px] font-bold text-brand-navy">Ask your AI analyst</p>
          <p className="text-[12px] text-[#9CA3AF]">Powered by your live analytics data</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="px-4 py-4 min-h-[180px] max-h-[320px] overflow-y-auto space-y-3">
        {messages.length === 0 && !loading && (
          <div className="text-center py-6">
            <p className="text-[13px] text-[#9CA3AF]">Ask a question about your business performance.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "bg-brand-navy text-white rounded-br-sm"
                  : "bg-[#F3F4F6] text-brand-navy rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#F3F4F6] rounded-xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 150, 300].map(d => (
                  <span
                    key={d}
                    className="w-2 h-2 rounded-full bg-[#9CA3AF] animate-bounce"
                    style={{ animationDelay: `${d}ms`, animationDuration: "1s" }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-3 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map(q => (
          <button
            key={q}
            onClick={() => submit(q)}
            disabled={loading}
            className="text-[12px] font-medium text-brand-navy bg-[#F3F4F6] hover:bg-[#E8EDF2] px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 flex items-center gap-2 border-t border-[#F3F4F6] pt-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything about your sales, products, or AI…"
          className="flex-1 px-4 py-2.5 text-[13px] rounded-xl border border-[#D1D5DB] outline-none focus:border-brand-navy transition-colors placeholder:text-[#9CA3AF]"
          autoComplete="off"
        />
        <button
          onClick={() => submit(input)}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center shrink-0 hover:opacity-80 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send"
        >
          <Send size={15} strokeWidth={2} className="translate-x-[1px]" />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange]         = useState<Range>("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo]   = useState("");
  const [orders, setOrders]       = useState<UIOrder[]>([]);

  useEffect(() => { getOrders().then(setOrders); }, []);

  const kpiData = KPI_DATA[range];
  const kpi  = kpiData.current;
  const prev = kpiData.prev;

  const chartPoints = useMemo(() => {
    if (range === "today") return TODAY_POINTS;
    if (range === "week")  return WEEK_POINTS;
    return MONTH_POINTS;
  }, [range]);

  const RANGES: { key: Range; label: string }[] = [
    { key: "today",  label: "Today"      },
    { key: "week",   label: "This week"  },
    { key: "month",  label: "This month" },
    { key: "custom", label: "Custom"     },
  ];

  const kpiCards: {
    icon: LucideIcon; label: string; value: string;
    trend: number; accentColor: string; isWarning?: boolean;
  }[] = [
    { icon: TrendingUp,    label: "Total Revenue",        value: fmtN(kpi.revenue),           trend: trendPct(kpi.revenue, prev.revenue),             accentColor: "#16A34A" },
    { icon: ShoppingBag,   label: "Total Orders",         value: String(kpi.orders),           trend: trendPct(kpi.orders, prev.orders),               accentColor: "#182E47" },
    { icon: BarChart2,     label: "Avg Order Value",      value: fmtN(kpi.aov),               trend: trendPct(kpi.aov, prev.aov),                     accentColor: "#D5652B" },
    { icon: MessageSquare, label: "Conversations",        value: String(kpi.conversations),    trend: trendPct(kpi.conversations, prev.conversations), accentColor: "#2563EB" },
    { icon: Percent,       label: "Conversion Rate",      value: `${kpi.conversionRate.toFixed(1)}%`, trend: trendPct(kpi.conversionRate, prev.conversionRate), accentColor: "#D5652B" },
    { icon: AlertCircle,   label: "AI Escalation Rate",   value: `${kpi.escalationRate.toFixed(1)}%`, trend: trendPct(kpi.escalationRate, prev.escalationRate) * -1, accentColor: "#D97706", isWarning: kpi.escalationRate > 25 },
    { icon: Users,         label: "Repeat Customer Rate", value: `${kpi.repeatCustomerRate.toFixed(1)}%`, trend: trendPct(kpi.repeatCustomerRate, prev.repeatCustomerRate), accentColor: "#7C3AED" },
  ];

  const funnelTotal = FUNNEL_STEPS[0].count;
  const totalCategoryRevenue = CATEGORY_REVENUE.reduce((s, c) => s + c.value, 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="px-4 lg:px-6 py-5 space-y-6">

        {/* ── Date range + Export ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl p-1 gap-0.5">
              {RANGES.map(r => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    range === r.key
                      ? "bg-brand-navy text-white"
                      : "text-[#6B7280] hover:text-brand-navy hover:bg-[#F3F4F6]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {range === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy/40" />
                <span className="text-[13px] text-[#6B7280]">to</span>
                <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy/40" />
              </div>
            )}
          </div>
          <ExportDropdown kpi={kpi} range={range} orders={orders} />
        </div>

        {/* ── KPI cards (8) ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map(card => <KpiCard key={card.label} {...card} />)}
          <TopProductCard />
        </div>

        {/* ── Revenue over time ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h3 className="text-[16px] font-bold text-brand-navy mb-4">Revenue over time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartPoints} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" orientation="left"
                tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={52} />
              <YAxis yAxisId="ord" orientation="right"
                tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<ChartTooltip />} />
              <Line yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue"
                stroke="#182E47" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#182E47" }} />
              <Line yAxisId="ord" type="monotone" dataKey="orders" name="Orders"
                stroke="#D5652B" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#D5652B" }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3 pl-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-[2.5px] bg-brand-navy rounded" />
              <span className="text-[12px] text-[#6B7280]">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-[2px] border-t-2 border-dashed border-brand-orange" />
              <span className="text-[12px] text-[#6B7280]">Orders</span>
            </div>
          </div>
        </div>

        {/* ── Orders by DOW + Revenue by Category ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Orders by Day of Week */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <h3 className="text-[16px] font-bold text-brand-navy mb-1">Orders by day of week</h3>
            <p className="text-[12px] text-[#9CA3AF] mb-4">Based on this week's data</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={WEEK_POINTS} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  formatter={(v) => [v, "Orders"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                />
                <Bar dataKey="orders" name="Orders" fill="#182E47" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {WEEK_POINTS.map((entry, i) => (
                    <Cell key={i} fill={entry.orders === Math.max(...WEEK_POINTS.map(p => p.orders)) ? "#D5652B" : "#182E47"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-[#9CA3AF] mt-3">
              <span className="text-brand-orange font-medium">Saturday</span> is your peak day this week
            </p>
          </div>

          {/* Revenue by product category */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <h3 className="text-[16px] font-bold text-brand-navy mb-1">Revenue by category</h3>
            <p className="text-[12px] text-[#9CA3AF] mb-4">Share of total product revenue</p>
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <PieChart width={160} height={160}>
                  <Pie data={CATEGORY_REVENUE} cx={75} cy={75}
                    innerRadius={44} outerRadius={70}
                    dataKey="value" paddingAngle={3}>
                    {CATEGORY_REVENUE.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [fmtN(Number(v)), ""]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                  />
                </PieChart>
              </div>
              <div className="flex-1 space-y-3">
                {CATEGORY_REVENUE.map(c => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-[13px] text-brand-navy font-medium">{c.name}</span>
                      </div>
                      <span className="text-[12px] text-[#6B7280]">{Math.round(c.value / totalCategoryRevenue * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.value / totalCategoryRevenue * 100}%`, backgroundColor: c.color }}
                      />
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">{fmtN(c.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Top products + Funnel ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <h3 className="text-[16px] font-bold text-brand-navy mb-4">Top products by orders</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F3F4F6]">
                  <th className="pb-2 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-7">#</th>
                  <th className="pb-2 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Product</th>
                  <th className="pb-2 text-right text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Orders</th>
                  <th className="pb-2 text-right text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map((p, i) => (
                  <tr key={p.name} className={i % 2 === 1 ? "bg-[#F9FAFB]" : ""}>
                    <td className="py-2.5 px-1 text-[12px] font-bold text-[#9CA3AF]">{i + 1}</td>
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#F4EDE8] flex items-center justify-center shrink-0">
                          <Package size={14} className="text-brand-orange" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-brand-navy line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-[#9CA3AF]">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-[13px] font-semibold text-brand-navy">{p.orders}</td>
                    <td className="py-2.5 text-right text-[13px] font-medium text-[#6B7280]">{fmtN(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <h3 className="text-[16px] font-bold text-brand-navy mb-4">Conversation funnel</h3>
            <div className="space-y-3">
              {FUNNEL_STEPS.map((step, i) => (
                <FunnelBar key={step.label} step={step} total={funnelTotal} index={i} count={FUNNEL_STEPS.length} />
              ))}
            </div>
          </div>
        </div>

        {/* ── AI performance ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h3 className="text-[16px] font-bold text-brand-navy mb-5">AI performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="relative w-36 h-36 mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke="#D5652B" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 50 * AI_HANDLED_PCT / 100} ${2 * Math.PI * 50}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[32px] font-bold text-brand-navy leading-none">{AI_HANDLED_PCT}%</span>
                  <span className="text-[11px] text-[#9CA3AF] mt-0.5">AI handled</span>
                </div>
              </div>
              <p className="text-[14px] font-semibold text-brand-navy">{AI_HANDLED_PCT}% of conversations</p>
              <p className="text-[13px] text-[#6B7280] mt-1">fully handled by AI without escalation</p>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-brand-navy mb-3">Escalation reasons</p>
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <PieChart width={120} height={120}>
                    <Pie data={ESCALATION_REASONS} cx={55} cy={55}
                      innerRadius={32} outerRadius={52} dataKey="value" paddingAngle={2}>
                      {ESCALATION_REASONS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, ""]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                  </PieChart>
                </div>
                <DonutLegend data={ESCALATION_REASONS} />
              </div>
              <p className="text-[12px] text-[#9CA3AF] mt-3">
                Based on {Math.round(kpi.conversations * (kpi.escalationRate / 100))} escalated conversations this period.
              </p>
            </div>
          </div>
        </div>

        {/* ── AI Analyst ───────────────────────────────────────────────────── */}
        <AiAnalyst kpi={kpi} prev={prev} range={range} />

      </div>
    </div>
  );
}
