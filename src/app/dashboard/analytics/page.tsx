"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp, ShoppingBag, BarChart2, MessageSquare,
  Percent, AlertCircle, Package, LucideIcon,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

type Range = "today" | "week" | "month" | "custom";

interface DayPoint {
  label: string;
  revenue: number;
  orders: number;
}

interface KpiSet {
  revenue: number;
  orders: number;
  aov: number;
  conversations: number;
  conversionRate: number;
  escalationRate: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const TODAY_POINTS: DayPoint[] = [
  { label: "8am", revenue: 18500, orders: 1 },
  { label: "9am", revenue: 0,     orders: 0 },
  { label: "10am", revenue: 32000, orders: 2 },
  { label: "11am", revenue: 8900,  orders: 1 },
  { label: "12pm", revenue: 55000, orders: 3 },
  { label: "1pm",  revenue: 22000, orders: 1 },
  { label: "2pm",  revenue: 41000, orders: 2 },
  { label: "3pm",  revenue: 18500, orders: 1 },
  { label: "4pm",  revenue: 9800,  orders: 1 },
];

const WEEK_POINTS: DayPoint[] = [
  { label: "Mon",  revenue: 143000, orders: 8  },
  { label: "Tue",  revenue: 89000,  orders: 5  },
  { label: "Wed",  revenue: 212000, orders: 12 },
  { label: "Thu",  revenue: 178000, orders: 9  },
  { label: "Fri",  revenue: 254000, orders: 14 },
  { label: "Sat",  revenue: 310000, orders: 18 },
  { label: "Sun",  revenue: 198000, orders: 11 },
];

const MONTH_POINTS: DayPoint[] = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  revenue: Math.round(80000 + Math.random() * 180000),
  orders: Math.round(4 + Math.random() * 14),
}));

const KPI_DATA: Record<Range, { current: KpiSet; prev: KpiSet }> = {
  today: {
    current: {
      revenue: 205700, orders: 12, aov: 17142,
      conversations: 38, conversionRate: 31.6, escalationRate: 18.4,
    },
    prev: {
      revenue: 184200, orders: 10, aov: 18420,
      conversations: 34, conversionRate: 29.4, escalationRate: 21.0,
    },
  },
  week: {
    current: {
      revenue: 1384000, orders: 77, aov: 17974,
      conversations: 241, conversionRate: 32.0, escalationRate: 15.8,
    },
    prev: {
      revenue: 1210000, orders: 68, aov: 17794,
      conversations: 218, conversionRate: 31.2, escalationRate: 17.4,
    },
  },
  month: {
    current: {
      revenue: 5840000, orders: 312, aov: 18718,
      conversations: 1024, conversionRate: 30.5, escalationRate: 16.2,
    },
    prev: {
      revenue: 5120000, orders: 280, aov: 18286,
      conversations: 940, conversionRate: 29.8, escalationRate: 18.1,
    },
  },
  custom: {
    current: {
      revenue: 5840000, orders: 312, aov: 18718,
      conversations: 1024, conversionRate: 30.5, escalationRate: 16.2,
    },
    prev: {
      revenue: 5120000, orders: 280, aov: 18286,
      conversations: 940, conversionRate: 29.8, escalationRate: 18.1,
    },
  },
};

const TOP_PRODUCTS = [
  { name: "Kaftan Set",        category: "Sets",        orders: 48, revenue: 1248000 },
  { name: "Ankara Midi Dress", category: "Dresses",     orders: 41, revenue:  758500 },
  { name: "Leather Tote Bag",  category: "Accessories", orders: 37, revenue: 1184000 },
  { name: "Lace Evening Gown", category: "Dresses",     orders: 29, revenue: 1595000 },
  { name: "Boubou Dress Set",  category: "Sets",        orders: 24, revenue:  984000 },
];

const FUNNEL_STEPS = [
  { label: "Total conversations",    count: 1024 },
  { label: "Reached product stage",  count: 734  },
  { label: "Order intent shown",     count: 498  },
  { label: "Flow completed",         count: 356  },
  { label: "Paid",                   count: 312  },
];

const ESCALATION_REASONS = [
  { name: "Frustration detected", value: 38, color: "#D5652B" },
  { name: "Too many failures",    value: 24, color: "#D97706" },
  { name: "Manual takeover",      value: 28, color: "#1E3D5C" },
  { name: "Unknown",              value: 10, color: "#9CA3AF" },
];

const AI_HANDLED_PCT = 78;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNaira(n: number) {
  if (n >= 1_000_000) return "₦" + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return "₦" + (n / 1_000).toFixed(1) + "K";
  return "₦" + n.toLocaleString("en-NG");
}

function formatNairaFull(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

function trendPct(current: number, prev: number) {
  if (prev === 0) return 0;
  return ((current - prev) / prev) * 100;
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
            {p.name === "Revenue" ? formatNairaFull(p.value) : p.value}
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
  icon: LucideIcon;
  label: string;
  value: string;
  trend: number;
  accentColor: string;
  isWarning?: boolean;
}) {
  const trendColor = trend > 0 ? "#16A34A" : trend < 0 ? "#EF4444" : "#6B7280";
  const trendArrow = trend > 0 ? "↑" : trend < 0 ? "↓" : "→";
  const trendText = `${trendArrow} ${Math.abs(trend).toFixed(1)}% vs prev period`;

  return (
    <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]" style={{ padding: "16px 20px" }}>
      <div className="flex items-start justify-between mb-3">
        <Icon size={24} style={{ color: isWarning ? "#D97706" : accentColor }} />
        <span className="text-[13px] text-[#6B7280] text-right leading-tight">{label}</span>
      </div>
      <p className="text-[28px] font-bold text-brand-navy leading-none mb-2">{value}</p>
      <p className="text-[12px] font-medium" style={{ color: trendColor }}>{trendText}</p>
    </div>
  );
}

// ── Funnel bar ────────────────────────────────────────────────────────────────

function FunnelBar({ step, total, index, count }: {
  step: { label: string; count: number };
  total: number;
  index: number;
  count: number;
}) {
  const pct = Math.round((step.count / total) * 100);
  const widthPct = (step.count / total) * 100;
  // Gradient from grey (#9CA3AF) → orange (#D5652B) across 5 steps
  const colors = ["#9CA3AF", "#B8906A", "#C97A3F", "#D0692E", "#D5652B"];
  const color = colors[Math.min(index, colors.length - 1)];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-brand-navy font-medium">{step.label}</span>
        <span className="text-[#6B7280]">{step.count.toLocaleString()} <span className="text-[11px]">({pct}%)</span></span>
      </div>
      <div className="h-8 rounded-lg bg-[#F3F4F6] overflow-hidden">
        <div
          className="h-full rounded-lg transition-all duration-500 flex items-center pl-3"
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

// ── Donut legend item ─────────────────────────────────────────────────────────

function DonutLegend({ data, total }: {
  data: { name: string; value: number; color: string }[];
  total: number;
}) {
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const kpi = KPI_DATA[range];

  const chartPoints = useMemo(() => {
    if (range === "today") return TODAY_POINTS;
    if (range === "week") return WEEK_POINTS;
    return MONTH_POINTS;
  }, [range]);

  const RANGES: { key: Range; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week", label: "This week" },
    { key: "month", label: "This month" },
    { key: "custom", label: "Custom" },
  ];

  const kpiCards: {
    icon: LucideIcon; label: string; value: string;
    trend: number; accentColor: string; isWarning?: boolean;
  }[] = [
    {
      icon: TrendingUp, label: "Total Revenue",
      value: formatNaira(kpi.current.revenue),
      trend: trendPct(kpi.current.revenue, kpi.prev.revenue),
      accentColor: "#16A34A",
    },
    {
      icon: ShoppingBag, label: "Total Orders",
      value: String(kpi.current.orders),
      trend: trendPct(kpi.current.orders, kpi.prev.orders),
      accentColor: "#182E47",
    },
    {
      icon: BarChart2, label: "Avg Order Value",
      value: formatNaira(kpi.current.aov),
      trend: trendPct(kpi.current.aov, kpi.prev.aov),
      accentColor: "#D5652B",
    },
    {
      icon: MessageSquare, label: "Conversations",
      value: String(kpi.current.conversations),
      trend: trendPct(kpi.current.conversations, kpi.prev.conversations),
      accentColor: "#2563EB",
    },
    {
      icon: Percent, label: "Conversion Rate",
      value: `${kpi.current.conversionRate.toFixed(1)}%`,
      trend: trendPct(kpi.current.conversionRate, kpi.prev.conversionRate),
      accentColor: "#D5652B",
    },
    {
      icon: AlertCircle, label: "AI Escalation Rate",
      value: `${kpi.current.escalationRate.toFixed(1)}%`,
      trend: trendPct(kpi.current.escalationRate, kpi.prev.escalationRate) * -1,
      accentColor: "#D97706",
      isWarning: kpi.current.escalationRate > 25,
    },
  ];

  const funnelTotal = FUNNEL_STEPS[0].count;
  const donutTotal = ESCALATION_REASONS.reduce((s, r) => s + r.value, 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="px-4 lg:px-6 py-5 space-y-6">

        {/* ── Date range selector ──────────────────────────────────────────── */}
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
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy/40"
              />
              <span className="text-[13px] text-[#6B7280]">to</span>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy/40"
              />
            </div>
          )}
        </div>

        {/* ── KPI cards ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {kpiCards.map(card => (
            <KpiCard key={card.label} {...card} />
          ))}
        </div>

        {/* ── Revenue chart ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h3 className="text-[16px] font-bold text-brand-navy mb-4">Revenue over time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartPoints} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#182E47"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#182E47" }}
              />
              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#D5652B"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: "#D5652B" }}
                strokeDasharray="4 2"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
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

        {/* ── Bottom two-column section ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Top products */}
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
                    <td className="py-2.5 text-right text-[13px] font-medium text-[#6B7280]">{formatNaira(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Conversation funnel */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <h3 className="text-[16px] font-bold text-brand-navy mb-4">Conversation funnel</h3>
            <div className="space-y-3">
              {FUNNEL_STEPS.map((step, i) => (
                <FunnelBar
                  key={step.label}
                  step={step}
                  total={funnelTotal}
                  index={i}
                  count={FUNNEL_STEPS.length}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── AI performance ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h3 className="text-[16px] font-bold text-brand-navy mb-5">AI performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* AI handled stat */}
            <div className="flex flex-col items-center justify-center text-center py-4">
              {/* Progress arc using SVG */}
              <div className="relative w-36 h-36 mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="#D5652B" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 50 * AI_HANDLED_PCT / 100} ${2 * Math.PI * 50}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[32px] font-bold text-brand-navy leading-none">{AI_HANDLED_PCT}%</span>
                  <span className="text-[11px] text-[#9CA3AF] mt-0.5">AI handled</span>
                </div>
              </div>
              <p className="text-[14px] font-semibold text-brand-navy">
                {AI_HANDLED_PCT}% of conversations
              </p>
              <p className="text-[13px] text-[#6B7280] mt-1">
                fully handled by AI without escalation
              </p>
            </div>

            {/* Escalation breakdown donut */}
            <div>
              <p className="text-[14px] font-semibold text-brand-navy mb-3">Escalation reasons</p>
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <PieChart width={120} height={120}>
                    <Pie
                      data={ESCALATION_REASONS}
                      cx={55}
                      cy={55}
                      innerRadius={32}
                      outerRadius={52}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {ESCALATION_REASONS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, ""]}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                  </PieChart>
                </div>
                <DonutLegend data={ESCALATION_REASONS} total={donutTotal} />
              </div>
              <p className="text-[12px] text-[#9CA3AF] mt-3">
                Based on {Math.round(kpi.current.conversations * (kpi.current.escalationRate / 100))} escalated conversations this period.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
