"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import {
  Bot, Store, Wallet, Bell, Share2, User,
  Check, Copy, ExternalLink, Upload, X, LucideIcon,
  Download, TrendingUp, FileText, Building2,
  ChevronLeft, ChevronRight, AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────

type Section = "ai" | "profile" | "finances" | "notifications" | "toolkit" | "account";
type Tone = "friendly" | "professional" | "energetic";
type Handoff = "2" | "3" | "4";

interface WorkDay {
  day: string;
  enabled: boolean;
  from: string;
  to: string;
}

interface NotifRow {
  id: string;
  label: string;
  description: string;
  whatsapp: boolean;
  email: boolean;
}

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: Section; label: string; icon: LucideIcon }[] = [
  { key: "ai",            label: "AI Agent",        icon: Bot },
  { key: "profile",       label: "Store Profile",   icon: Store },
  { key: "finances",      label: "Finances",        icon: Wallet },
  { key: "notifications", label: "Notifications",   icon: Bell },
  { key: "toolkit",       label: "Redirect Toolkit",icon: Share2 },
  { key: "account",       label: "Account",         icon: User },
];

// ── Default working hours ─────────────────────────────────────────────────────

const DEFAULT_HOURS: WorkDay[] = [
  { day: "Mon", enabled: true,  from: "08:00", to: "20:00" },
  { day: "Tue", enabled: true,  from: "08:00", to: "20:00" },
  { day: "Wed", enabled: true,  from: "08:00", to: "20:00" },
  { day: "Thu", enabled: true,  from: "08:00", to: "20:00" },
  { day: "Fri", enabled: true,  from: "08:00", to: "20:00" },
  { day: "Sat", enabled: true,  from: "09:00", to: "18:00" },
  { day: "Sun", enabled: false, from: "09:00", to: "17:00" },
];

const COLOR_PRESETS = ["#D5652B", "#182E47", "#16A34A", "#2563EB", "#9333EA", "#DB2777", "#B45309"];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const FINANCES_MERCHANT_ID = "b4a55b01-be1b-4aed-a4bc-542a51a39caa";
const VAT_RATE = 0.075;
const PAGE_SIZE = 10;

interface FinanceOrder {
  id: string;
  reference: string;
  customerName: string;
  amount: number;
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-brand-orange" : "bg-[#D1D5DB]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-brand-navy hover:bg-[#F3F4F6] transition-colors shrink-0"
    >
      {copied ? <Check size={12} className="text-[#16A34A]" /> : <Copy size={12} />}
      {label ?? (copied ? "Copied!" : "Copy")}
    </button>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-[18px] font-bold text-brand-navy">{title}</h2>
      {subtitle && <p className="text-[13px] text-[#6B7280] mt-0.5">{subtitle}</p>}
    </div>
  );
}

function FieldLabel({ children, helper }: { children: React.ReactNode; helper?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-[13px] font-semibold text-brand-navy">{children}</label>
      {helper && <p className="text-[12px] text-[#6B7280] mt-0.5">{helper}</p>}
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">{children}</h3>;
}

function SaveBar({ label, onSave }: { label: string; onSave: () => void }) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] px-6 py-4 mt-8 -mx-6">
      <button
        onClick={onSave}
        className="h-10 px-6 rounded-xl bg-brand-orange text-white text-[14px] font-semibold hover:bg-[#c45a25] transition-colors"
      >
        {label}
      </button>
    </div>
  );
}

// ── AI Agent section ──────────────────────────────────────────────────────────

function AiSection() {
  const [agentName, setAgentName] = useState("Amina's Assistant");
  const [tone, setTone] = useState<Tone>("friendly");
  const [hours, setHours] = useState<WorkDay[]>(DEFAULT_HOURS);
  const [ooMessage, setOoMessage] = useState(
    "Hi! We're currently closed but your message has been received. We'll get back to you first thing tomorrow. 🙏"
  );
  const [handoff, setHandoff] = useState<Handoff>("3");
  const [recoveryOn, setRecoveryOn] = useState(false);
  const [recoveryPct, setRecoveryPct] = useState("10");

  const TONES: { key: Tone; label: string; desc: string }[] = [
    { key: "friendly",     label: "Friendly & Casual",     desc: "Warm, conversational, uses everyday language. Great for fashion, food, beauty." },
    { key: "professional", label: "Professional & Formal",  desc: "Polished and businesslike. Good for electronics, services, B2B." },
    { key: "energetic",    label: "Energetic & Salesy",     desc: "Enthusiastic, uses emojis, drives urgency. Great for promotions." },
  ];

  function updateDay(i: number, patch: Partial<WorkDay>) {
    setHours(h => h.map((d, idx) => idx === i ? { ...d, ...patch } : d));
  }

  return (
    <div>
      <SectionTitle title="AI Agent" subtitle="Customise how your AI assistant communicates with customers." />

      {/* Agent identity */}
      <SubHeading>Agent Identity</SubHeading>
      <div className="space-y-4 mb-6">
        <div>
          <FieldLabel helper="Customers will see this name when the AI introduces itself.">Agent name</FieldLabel>
          <input
            value={agentName}
            onChange={e => setAgentName(e.target.value)}
            placeholder="e.g. Amina's Assistant"
            className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors"
          />
        </div>

        <div>
          <FieldLabel>Tone</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TONES.map(t => (
              <button
                key={t.key}
                onClick={() => setTone(t.key)}
                className={`relative text-left p-3.5 rounded-xl border-2 transition-all ${
                  tone === t.key
                    ? "border-brand-orange bg-[#FFF8F5]"
                    : "border-[#E5E7EB] hover:border-brand-navy/30"
                }`}
              >
                {tone === t.key && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-brand-orange flex items-center justify-center">
                    <Check size={9} className="text-white" strokeWidth={3} />
                  </span>
                )}
                <p className="text-[13px] font-semibold text-brand-navy mb-1 pr-5">{t.label}</p>
                <p className="text-[12px] text-[#6B7280] leading-snug">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Working hours */}
      <SubHeading>Working Hours</SubHeading>
      <p className="text-[12px] text-[#6B7280] mb-3">Outside these hours, the AI uses your out-of-hours message.</p>
      <div className="rounded-xl border border-[#E5E7EB] overflow-hidden mb-6">
        {hours.map((d, i) => (
          <div key={d.day} className={`flex items-center gap-3 px-4 py-3 ${i !== hours.length - 1 ? "border-b border-[#F3F4F6]" : ""}`}>
            <Toggle checked={d.enabled} onChange={v => updateDay(i, { enabled: v })} />
            <span className="w-8 text-[13px] font-semibold text-brand-navy shrink-0">{d.day}</span>
            {d.enabled ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={d.from}
                  onChange={e => updateDay(i, { from: e.target.value })}
                  className="h-8 px-2 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy/40 w-28"
                />
                <span className="text-[12px] text-[#9CA3AF]">to</span>
                <input
                  type="time"
                  value={d.to}
                  onChange={e => updateDay(i, { to: e.target.value })}
                  className="h-8 px-2 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy/40 w-28"
                />
              </div>
            ) : (
              <span className="text-[13px] text-[#9CA3AF] flex-1">Closed</span>
            )}
          </div>
        ))}
      </div>

      {/* Handoff */}
      <SubHeading>Handoff</SubHeading>
      <div className="space-y-4 mb-6">
        <div>
          <FieldLabel>Out-of-hours message</FieldLabel>
          <textarea
            value={ooMessage}
            onChange={e => setOoMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 resize-none transition-colors"
          />
        </div>
        <div>
          <FieldLabel helper="How many times the AI tries before handing off to you.">Handoff threshold</FieldLabel>
          <div className="flex items-center bg-[#F3F4F6] rounded-xl p-1 w-fit gap-0.5">
            {(["2", "3", "4"] as Handoff[]).map(v => (
              <button
                key={v}
                onClick={() => setHandoff(v)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  handoff === v ? "bg-white text-brand-navy shadow-sm" : "text-[#6B7280] hover:text-brand-navy"
                }`}
              >
                {v} failed exchanges
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recovery */}
      <SubHeading>Recovery</SubHeading>
      <div className="rounded-xl border border-[#E5E7EB] p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[14px] font-medium text-brand-navy">Offer a discount for abandoned orders</p>
            <p className="text-[12px] text-[#6B7280] mt-0.5">Shown in the abandoned cart reminder sent 2 hours after an unpaid order.</p>
          </div>
          <Toggle checked={recoveryOn} onChange={setRecoveryOn} />
        </div>
        {recoveryOn && (
          <div className="flex items-center gap-2 mt-3">
            <input
              type="number"
              min="1"
              max="100"
              value={recoveryPct}
              onChange={e => setRecoveryPct(e.target.value)}
              className="w-20 h-9 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 text-center"
            />
            <span className="text-[14px] text-[#6B7280]">% discount</span>
          </div>
        )}
      </div>

      <SaveBar label="Save AI settings" onSave={() => {}} />
    </div>
  );
}

// ── Store Profile section ─────────────────────────────────────────────────────

function ProfileSection() {
  const [name, setName]           = useState("Fashion by Amina");
  const [desc, setDesc]           = useState("Premium African fashion for the modern woman. Ankara, lace, and handcrafted accessories.");
  const [slug, setSlug]           = useState("fashionbyamina");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [colour, setColour]       = useState("#D5652B");
  const [logoUrl, setLogoUrl]     = useState<string | null>(null);
  const [deliveryAreas, setDeliveryAreas] = useState<string[]>(["Lagos", "Abuja (FCT)"]);
  const fileRef = useRef<HTMLInputElement>(null);
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSlugChange(val: string) {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(clean);
    setSlugStatus("checking");
    if (slugTimer.current) clearTimeout(slugTimer.current);
    slugTimer.current = setTimeout(() => {
      setSlugStatus(clean === "taken" ? "taken" : "available");
    }, 700);
  }

  function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setLogoUrl(URL.createObjectURL(file));
    e.target.value = "";
  }

  return (
    <div>
      <SectionTitle title="Store Profile" subtitle="Your public store information and branding." />

      <div className="space-y-5">
        {/* Logo */}
        <div>
          <FieldLabel>Store logo</FieldLabel>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Store size={24} className="text-[#D1D5DB]" />
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 h-9 px-4 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-brand-navy hover:bg-[#F3F4F6] transition-colors"
            >
              <Upload size={14} />
              Upload logo
            </button>
            {logoUrl && (
              <button onClick={() => setLogoUrl(null)} className="text-[13px] text-[#EF4444] hover:underline">Remove</button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>

        {/* Store name */}
        <div>
          <FieldLabel>Store name</FieldLabel>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <FieldLabel>Store description</FieldLabel>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 resize-none transition-colors"
          />
        </div>

        {/* Storefront slug */}
        <div>
          <FieldLabel helper="Lowercase letters, numbers, and hyphens only.">Storefront slug</FieldLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#9CA3AF] select-none pointer-events-none">merchat.io/</span>
            <input
              value={slug}
              onChange={e => handleSlugChange(e.target.value)}
              className="w-full h-10 pl-[88px] pr-24 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium">
              {slugStatus === "checking" && <span className="text-[#9CA3AF]">Checking…</span>}
              {slugStatus === "available" && <span className="text-[#16A34A]">Available</span>}
              {slugStatus === "taken" && <span className="text-[#EF4444]">Taken</span>}
            </div>
          </div>
          {slug && (
            <p className="text-[12px] text-[#6B7280] mt-1">
              Your storefront: <span className="text-brand-navy font-medium">merchat.io/{slug}</span>
            </p>
          )}
        </div>

        {/* Brand colour */}
        <div>
          <FieldLabel>Brand colour</FieldLabel>
          <div className="flex items-center gap-2 flex-wrap">
            {COLOR_PRESETS.map(c => (
              <button
                key={c}
                onClick={() => setColour(c)}
                className={`w-8 h-8 rounded-full transition-all ${colour === c ? "ring-2 ring-offset-2 ring-brand-navy scale-110" : ""}`}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
            <input
              type="color"
              value={colour}
              onChange={e => setColour(e.target.value)}
              className="w-8 h-8 rounded-full border border-[#E5E7EB] cursor-pointer bg-transparent p-0 overflow-hidden"
              title="Custom colour"
            />
          </div>
        </div>

        {/* Delivery areas */}
        <div>
          <FieldLabel helper="Select every state you deliver to.">Delivery areas</FieldLabel>
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
            {/* Summary bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <span className="text-[13px] text-[#6B7280]">
                {deliveryAreas.length === 0
                  ? "No states selected"
                  : `${deliveryAreas.length} state${deliveryAreas.length !== 1 ? "s" : ""} selected`}
              </span>
              <button
                type="button"
                onClick={() => setDeliveryAreas(deliveryAreas.length === NIGERIAN_STATES.length ? [] : [...NIGERIAN_STATES])}
                className="text-[12px] font-medium text-brand-orange hover:opacity-75 transition-opacity"
              >
                {deliveryAreas.length === NIGERIAN_STATES.length ? "Deselect all" : "Select all"}
              </button>
            </div>
            {/* Scrollable checklist */}
            <div className="max-h-52 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-2">
              {NIGERIAN_STATES.map(state => {
                const checked = deliveryAreas.includes(state);
                return (
                  <label key={state} className="flex items-center gap-2 cursor-pointer py-0.5 group">
                    <div
                      onClick={() =>
                        setDeliveryAreas(
                          checked ? deliveryAreas.filter(s => s !== state) : [...deliveryAreas, state]
                        )
                      }
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors cursor-pointer ${
                        checked ? "bg-brand-orange border-brand-orange" : "border-[#D1D5DB] group-hover:border-brand-navy/40"
                      }`}
                    >
                      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[13px] text-brand-navy truncate">{state}</span>
                  </label>
                );
              })}
            </div>
          </div>
          {deliveryAreas.length > 0 && (
            <p className="text-[12px] text-[#6B7280] mt-1.5">
              {deliveryAreas.slice(0, 5).join(", ")}{deliveryAreas.length > 5 ? ` +${deliveryAreas.length - 5} more` : ""}
            </p>
          )}
        </div>
      </div>

      <SaveBar label="Save store profile" onSave={() => {}} />
    </div>
  );
}

// ── Finances section ──────────────────────────────────────────────────────────

function formatNaira(n: number) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function FinancesSection() {
  const [orders, setOrders]   = useState<FinanceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);

  // Compliance
  const [cac, setCac]               = useState("");
  const [tin, setTin]               = useState("");
  const [bizAddress, setBizAddress] = useState("");

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, order_reference, total_amount, created_at, customers(name)")
        .eq("merchant_id", FINANCES_MERCHANT_ID)
        .eq("payment_status", "paid")
        .order("created_at", { ascending: false });

      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOrders(data.map((o: any) => ({
          id: o.id,
          reference: o.order_reference,
          customerName: o.customers?.name ?? "Customer",
          amount: Number(o.total_amount),
          createdAt: o.created_at,
        })));
      }
      setLoading(false);
    })();
  }, []);

  // Revenue calculations
  const now          = new Date();
  const thisMonth    = now.getMonth();
  const thisYear     = now.getFullYear();
  const prevMonth    = thisMonth === 0 ? 11 : thisMonth - 1;
  const prevYear     = thisMonth === 0 ? thisYear - 1 : thisYear;

  function sumRevenue(predicate: (d: Date) => boolean) {
    return orders.filter(o => predicate(new Date(o.createdAt))).reduce((s, o) => s + o.amount, 0);
  }

  const thisMonthRev = sumRevenue(d => d.getMonth() === thisMonth && d.getFullYear() === thisYear);
  const lastMonthRev = sumRevenue(d => d.getMonth() === prevMonth && d.getFullYear() === prevYear);
  const ytdRev       = sumRevenue(d => d.getFullYear() === thisYear);

  const momChange = lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100 : null;

  // Quarterly VAT breakdown
  const QUARTERS = [
    { label: "Q1 (Jan–Mar)", months: [0, 1, 2] },
    { label: "Q2 (Apr–Jun)", months: [3, 4, 5] },
    { label: "Q3 (Jul–Sep)", months: [6, 7, 8] },
    { label: "Q4 (Oct–Dec)", months: [9, 10, 11] },
  ];

  const quarterlyData = QUARTERS.map(q => {
    const revenue = sumRevenue(d => d.getFullYear() === thisYear && q.months.includes(d.getMonth()));
    return { label: q.label, revenue, vat: revenue * VAT_RATE };
  });

  const currentQuarterIdx = Math.floor(thisMonth / 3);

  // Pagination
  const totalPages  = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const pageOrders  = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // CSV export
  function exportCSV() {
    const bom  = "﻿";
    const head = "Date,Description,Amount (₦),VAT (7.5%),Net\n";
    const rows = orders.map(o => {
      const vat = o.amount * VAT_RATE;
      const net = o.amount - vat;
      return [
        formatDate(o.createdAt),
        `"${o.reference} — ${o.customerName}"`,
        o.amount.toFixed(2),
        vat.toFixed(2),
        net.toFixed(2),
      ].join(",");
    }).join("\n");
    const blob = new Blob([bom + head + rows], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `transactions_${thisYear}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // PDF export
  function exportPDF() {
    const win = window.open("", "_blank");
    if (!win) return;
    const totalRev = orders.reduce((s, o) => s + o.amount, 0);
    const totalVat = totalRev * VAT_RATE;
    const totalNet = totalRev - totalVat;
    const rowsHtml = orders.map(o => {
      const vat = o.amount * VAT_RATE;
      const net = o.amount - vat;
      return `<tr>
        <td>${formatDate(o.createdAt)}</td>
        <td>${o.reference} — ${o.customerName}</td>
        <td class="r">₦${o.amount.toLocaleString("en-NG")}</td>
        <td class="r">₦${Math.round(vat).toLocaleString("en-NG")}</td>
        <td class="r">₦${Math.round(net).toLocaleString("en-NG")}</td>
      </tr>`;
    }).join("");
    win.document.write(`<!DOCTYPE html><html><head><title>Transaction Report</title>
<style>
  body{font-family:Arial,sans-serif;padding:32px;color:#182E47;font-size:13px}
  h1{font-size:20px;margin-bottom:4px}
  .meta{color:#6B7280;margin-bottom:24px}
  table{width:100%;border-collapse:collapse}
  th{background:#F3F4F6;padding:10px 12px;text-align:left;font-weight:600;border-bottom:2px solid #E5E7EB}
  td{padding:9px 12px;border-bottom:1px solid #F3F4F6}
  .r{text-align:right}
  .foot td{font-weight:700;border-top:2px solid #E5E7EB;border-bottom:none}
  @media print{@page{margin:20mm}}
</style></head><body>
<h1>Transaction Report — Fashion by Amina</h1>
<p class="meta">Generated ${formatDate(new Date().toISOString())} · ${orders.length} transactions · VAT rate: 7.5%</p>
<table>
  <thead><tr><th>Date</th><th>Description</th><th class="r">Amount</th><th class="r">VAT (7.5%)</th><th class="r">Net</th></tr></thead>
  <tbody>${rowsHtml}</tbody>
  <tfoot><tr class="foot">
    <td colspan="2">Total</td>
    <td class="r">₦${Math.round(totalRev).toLocaleString("en-NG")}</td>
    <td class="r">₦${Math.round(totalVat).toLocaleString("en-NG")}</td>
    <td class="r">₦${Math.round(totalNet).toLocaleString("en-NG")}</td>
  </tr></tfoot>
</table>
</body></html>`);
    win.document.close();
    win.print();
  }

  return (
    <div className="space-y-8">
      <SectionTitle title="Finances" subtitle="Revenue overview, tax estimates, and transaction records." />

      {/* ── 1. Revenue Summary ─────────────────────────────────────────────── */}
      <div>
        <SubHeading>Revenue Summary</SubHeading>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-[#F3F4F6] rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* This month */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={15} className="text-brand-orange" strokeWidth={1.5} />
                <span className="text-[12px] text-[#6B7280] font-medium">This month</span>
              </div>
              <p className="text-[22px] font-bold text-brand-navy leading-none">{formatNaira(thisMonthRev)}</p>
              {momChange !== null && (
                <p className={`text-[11px] mt-1.5 font-medium ${momChange >= 0 ? "text-[#16A34A]" : "text-[#EF4444]"}`}>
                  {momChange >= 0 ? "▲" : "▼"} {Math.abs(momChange).toFixed(1)}% vs last month
                </p>
              )}
            </div>
            {/* Last month */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={15} className="text-[#6B7280]" strokeWidth={1.5} />
                <span className="text-[12px] text-[#6B7280] font-medium">Last month</span>
              </div>
              <p className="text-[22px] font-bold text-brand-navy leading-none">{formatNaira(lastMonthRev)}</p>
            </div>
            {/* Year to date */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={15} className="text-[#16A34A]" strokeWidth={1.5} />
                <span className="text-[12px] text-[#6B7280] font-medium">Year to date ({thisYear})</span>
              </div>
              <p className="text-[22px] font-bold text-brand-navy leading-none">{formatNaira(ytdRev)}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Transaction History ─────────────────────────────────────────── */}
      <div>
        <SubHeading>Transaction History</SubHeading>
        {loading ? (
          <div className="space-y-2 animate-pulse">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-[#F3F4F6] rounded-xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-[#E5E7EB] rounded-xl py-12 flex flex-col items-center gap-2">
            <FileText size={32} className="text-[#D1D5DB]" strokeWidth={1} />
            <p className="text-[13px] text-[#9CA3AF]">No paid transactions yet</p>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-2.5 gap-4">
                <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Order / Customer</span>
                <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-28 text-right">Date</span>
                <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-20 text-center">Method</span>
                <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-28 text-right">Amount</span>
              </div>
              {pageOrders.map((o, i) => (
                <div
                  key={o.id}
                  className={`flex sm:grid sm:grid-cols-[1fr_auto_auto_auto] items-center px-4 py-3 gap-4 ${
                    i !== pageOrders.length - 1 ? "border-b border-[#F3F4F6]" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-brand-navy">{o.reference}</p>
                    <p className="text-[12px] text-[#6B7280] truncate">{o.customerName}</p>
                  </div>
                  <span className="text-[12px] text-[#6B7280] w-28 text-right shrink-0">{formatDate(o.createdAt)}</span>
                  <span className="hidden sm:block w-20 text-center">
                    <span className="text-[11px] font-medium bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full">Online</span>
                  </span>
                  <span className="text-[13px] font-bold text-brand-navy w-28 text-right shrink-0">{formatNaira(o.amount)}</span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3">
                <span className="text-[12px] text-[#6B7280]">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, orders.length)} of {orders.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-brand-navy disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-brand-navy disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── 3. Tax Filing Helper ───────────────────────────────────────────── */}
      <div>
        <SubHeading>Tax Filing Helper</SubHeading>
        <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-2.5 gap-4">
            <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Quarter ({thisYear})</span>
            <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-28 text-right">Revenue</span>
            <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-28 text-right">Est. VAT (7.5%)</span>
          </div>
          {quarterlyData.map((q, i) => {
            const isCurrent = i === currentQuarterIdx;
            return (
              <div
                key={q.label}
                className={`grid grid-cols-[1fr_auto_auto] items-center px-4 py-3 gap-4 ${
                  i !== quarterlyData.length - 1 ? "border-b border-[#F3F4F6]" : ""
                } ${isCurrent ? "bg-[#FAFBFF]" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-brand-navy">{q.label}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold bg-[#DBEAFE] text-[#1D4ED8] px-1.5 py-0.5 rounded-full">Current</span>
                  )}
                </div>
                <span className="text-[13px] font-semibold text-brand-navy w-28 text-right">
                  {q.revenue > 0 ? formatNaira(q.revenue) : "—"}
                </span>
                <span className={`text-[13px] font-semibold w-28 text-right ${q.vat > 0 ? "text-[#D97706]" : "text-[#9CA3AF]"}`}>
                  {q.vat > 0 ? formatNaira(q.vat) : "—"}
                </span>
              </div>
            );
          })}
          {/* YTD totals row */}
          <div className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-3 gap-4 border-t-2 border-[#E5E7EB] bg-[#F9FAFB]">
            <span className="text-[13px] font-bold text-brand-navy">Year to date</span>
            <span className="text-[13px] font-bold text-brand-navy w-28 text-right">{formatNaira(ytdRev)}</span>
            <span className="text-[13px] font-bold text-[#D97706] w-28 text-right">{formatNaira(ytdRev * VAT_RATE)}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 mt-3 p-3.5 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl">
          <AlertCircle size={15} className="text-[#D97706] shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-[12px] text-[#92400E] leading-relaxed">
            <strong>Disclaimer:</strong> These figures are estimates based on recorded revenue at a 7.5% VAT rate. Actual VAT liability depends on your registration status and applicable exemptions. Consult a certified accountant for official filing.
          </p>
        </div>
      </div>

      {/* ── 4. Export for Accounting ───────────────────────────────────────── */}
      <div>
        <SubHeading>Export for Accounting</SubHeading>
        <p className="text-[13px] text-[#6B7280] mb-4">
          Download all transaction data formatted for bookkeeping — columns: Date, Description, Amount, VAT, Net.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            disabled={orders.length === 0}
            className="flex items-center gap-2 h-10 px-5 rounded-xl border border-[#E5E7EB] text-[13px] font-medium text-brand-navy hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors"
          >
            <Download size={15} strokeWidth={1.5} />
            Export as CSV
          </button>
          <button
            onClick={exportPDF}
            disabled={orders.length === 0}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-brand-navy text-white text-[13px] font-medium hover:bg-[#1E3D5C] disabled:opacity-40 transition-colors"
          >
            <FileText size={15} strokeWidth={1.5} />
            Export as PDF
          </button>
        </div>
      </div>

      {/* ── 5. Business Compliance Info ────────────────────────────────────── */}
      <div>
        <SubHeading>Business Compliance</SubHeading>
        <p className="text-[13px] text-[#6B7280] mb-4">
          Store your registration details for reference. This information is not shared publicly.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
            <Building2 size={15} className="text-[#16A34A] shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-[12px] text-[#166534] leading-relaxed">
              Your CAC number and TIN are stored securely for your own records and are not displayed to customers or third parties.
            </p>
          </div>

          <div>
            <FieldLabel helper="e.g. RC-1234567">CAC Registration Number</FieldLabel>
            <input
              value={cac}
              onChange={e => setCac(e.target.value)}
              placeholder="RC-0000000"
              className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors font-mono"
            />
          </div>

          <div>
            <FieldLabel helper="Your Tax Identification Number from FIRS">Tax Identification Number (TIN)</FieldLabel>
            <input
              value={tin}
              onChange={e => setTin(e.target.value)}
              placeholder="00000000-0001"
              className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors font-mono"
            />
          </div>

          <div>
            <FieldLabel>Registered Business Address</FieldLabel>
            <textarea
              value={bizAddress}
              onChange={e => setBizAddress(e.target.value)}
              rows={3}
              placeholder="e.g. 12 Adeola Odeku Street, Victoria Island, Lagos"
              className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 resize-none transition-colors"
            />
          </div>
        </div>

        <SaveBar label="Save compliance info" onSave={() => {}} />
      </div>
    </div>
  );
}

// ── Notifications section ─────────────────────────────────────────────────────

function NotificationsSection() {
  const [waPhone, setWaPhone] = useState("+234 801 234 5678");
  const [email, setEmail]     = useState("amabibid400@gmail.com");
  const [rows, setRows]       = useState<NotifRow[]>([
    { id: "order_created",    label: "New order created",        description: "When a customer places an order",        whatsapp: true,  email: true  },
    { id: "conv_escalated",   label: "Conversation escalated",   description: "When AI hands off to you",               whatsapp: true,  email: false },
    { id: "payment_received", label: "Payment received",         description: "When a payment is confirmed",            whatsapp: true,  email: true  },
    { id: "out_of_stock",     label: "Product out of stock",     description: "When a product's stock hits zero",       whatsapp: true,  email: false },
    { id: "daily_summary",    label: "Daily order summary",      description: "End-of-day recap of orders and revenue", whatsapp: false, email: true  },
  ]);

  function toggle(id: string, field: "whatsapp" | "email") {
    setRows(r => r.map(row => row.id === id ? { ...row, [field]: !row[field] } : row));
  }

  return (
    <div>
      <SectionTitle title="Notifications" subtitle="Choose how and where you receive alerts." />

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <FieldLabel>WhatsApp notifications to:</FieldLabel>
          <input
            value={waPhone}
            onChange={e => setWaPhone(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 transition-colors"
          />
        </div>
        <div>
          <FieldLabel>Email notifications to:</FieldLabel>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 transition-colors"
          />
        </div>
      </div>

      {/* Toggle table */}
      <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-2.5">
          <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Notification</span>
          <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-20 text-center">WhatsApp</span>
          <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-16 text-center">Email</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.id}
            className={`grid grid-cols-[1fr_auto_auto] items-center px-4 py-3.5 ${i !== rows.length - 1 ? "border-b border-[#F3F4F6]" : ""}`}
          >
            <div>
              <p className="text-[14px] font-medium text-brand-navy">{row.label}</p>
              <p className="text-[12px] text-[#6B7280]">{row.description}</p>
            </div>
            <div className="w-20 flex justify-center">
              <Toggle checked={row.whatsapp} onChange={() => toggle(row.id, "whatsapp")} />
            </div>
            <div className="w-16 flex justify-center">
              <Toggle checked={row.email} onChange={() => toggle(row.id, "email")} />
            </div>
          </div>
        ))}
      </div>

      <SaveBar label="Save notifications" onSave={() => {}} />
    </div>
  );
}

// ── Redirect Toolkit section ──────────────────────────────────────────────────

const WA_NUMBER       = "+234 801 234 5678";
const STOREFRONT_LINK = "merchat.io/fashionbyamina";

const WA_STATUS_COPY  = `👗 Shop premium African fashion on WhatsApp!\n✅ Ankara dresses, lace gowns, accessories & more\n🚚 Delivery to Lagos Island, Victoria Island, Lekki\n📱 Message us now: wa.me/2348012345678`;
const BROADCAST_COPY  = `Hi! 👋 Thank you for being a valued customer.\n\nWe've just added new arrivals — check out our latest collections!\n\nShop now: merchat.io/fashionbyamina\n\nReply to this message to order anything. 🛍️`;

function CopyCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <span className="text-[13px] font-semibold text-brand-navy">{title}</span>
        <CopyButton text={content} />
      </div>
      <pre className="px-4 py-3 text-[13px] text-[#374151] whitespace-pre-wrap font-sans leading-relaxed bg-white">
        {content}
      </pre>
    </div>
  );
}

function ToolkitSection() {
  return (
    <div>
      <SectionTitle title="Redirect Toolkit" subtitle="Copy-paste resources to drive customers to your WhatsApp store." />
      <div className="space-y-4">
        <CopyCard title="WhatsApp Status message" content={WA_STATUS_COPY} />
        <CopyCard title="Broadcast message" content={BROADCAST_COPY} />

        <div className="rounded-xl border border-[#E5E7EB] divide-y divide-[#F3F4F6]">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-[12px] text-[#6B7280]">Your WhatsApp business number</p>
              <p className="text-[14px] font-semibold text-brand-navy mt-0.5">{WA_NUMBER}</p>
            </div>
            <CopyButton text={WA_NUMBER} />
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-[12px] text-[#6B7280]">Your storefront link</p>
              <p className="text-[14px] font-semibold text-brand-navy mt-0.5">{STOREFRONT_LINK}</p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text={STOREFRONT_LINK} />
              <a
                href={`https://${STOREFRONT_LINK}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-brand-navy hover:bg-[#F3F4F6] transition-colors shrink-0"
              >
                <ExternalLink size={12} />
                Open
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Account section ───────────────────────────────────────────────────────────

function AccountSection() {
  const [fullName, setFullName]       = useState("Amina Babatunde");
  const [emailVal, setEmailVal]       = useState("amabibid400@gmail.com");
  const [showPwForm, setShowPwForm]   = useState(false);
  const [currentPw, setCurrentPw]     = useState("");
  const [newPw, setNewPw]             = useState("");
  const [confirmPw, setConfirmPw]     = useState("");
  const [showDeleteModal, setDelete]  = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const pwMatch = newPw === confirmPw && newPw.length >= 8;

  return (
    <div>
      <SectionTitle title="Account" subtitle="Manage your personal account details." />

      <div className="space-y-4 mb-6">
        <div>
          <FieldLabel>Full name</FieldLabel>
          <input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 transition-colors"
          />
        </div>
        <div>
          <FieldLabel>Email address</FieldLabel>
          <input
            type="email"
            value={emailVal}
            onChange={e => setEmailVal(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 transition-colors"
          />
        </div>
      </div>

      {/* Change password */}
      <SubHeading>Password</SubHeading>
      {!showPwForm ? (
        <button
          onClick={() => setShowPwForm(true)}
          className="h-9 px-5 rounded-xl border border-[#E5E7EB] text-[13px] font-medium text-brand-navy hover:bg-[#F3F4F6] transition-colors mb-6"
        >
          Change password
        </button>
      ) : (
        <div className="rounded-xl border border-[#E5E7EB] p-4 space-y-3 mb-6">
          {[
            { label: "Current password",     val: currentPw, set: setCurrentPw },
            { label: "New password",          val: newPw,     set: setNewPw },
            { label: "Confirm new password",  val: confirmPw, set: setConfirmPw },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="block text-[12px] font-medium text-[#6B7280] mb-1">{label}</label>
              <input
                type="password"
                value={val}
                onChange={e => set(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 transition-colors"
              />
            </div>
          ))}
          {confirmPw && !pwMatch && (
            <p className="text-[12px] text-[#EF4444]">Passwords don&apos;t match or are too short (min 8 chars).</p>
          )}
          <div className="flex items-center gap-3 pt-1">
            <button
              disabled={!pwMatch || !currentPw}
              className="h-9 px-5 rounded-xl bg-brand-orange text-white text-[13px] font-semibold hover:bg-[#c45a25] disabled:opacity-40 transition-colors"
              onClick={() => { setShowPwForm(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}
            >
              Update password
            </button>
            <button
              onClick={() => { setShowPwForm(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}
              className="text-[13px] text-[#6B7280] hover:text-brand-navy"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <SaveBar label="Save account" onSave={() => {}} />

      {/* Danger zone */}
      <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
        <SubHeading>Danger zone</SubHeading>
        <button
          onClick={() => setDelete(true)}
          className="text-[13px] text-[#EF4444] font-medium hover:underline"
        >
          Delete account
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setDelete(false); setDeleteInput(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[18px] font-bold text-brand-navy">Delete account?</h3>
              <button onClick={() => { setDelete(false); setDeleteInput(""); }} className="text-[#9CA3AF] hover:text-brand-navy ml-4 mt-0.5">
                <X size={18} />
              </button>
            </div>
            <div className="bg-[#FEF2F2] rounded-xl p-3.5 mb-4">
              <p className="text-[13px] text-[#92400E] leading-snug">
                This will permanently delete your store, products, orders, and conversation history. This action cannot be undone.
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-brand-navy mb-1.5">
                Type <strong>DELETE</strong> to confirm
              </label>
              <input
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-[#EF4444] transition-colors font-mono tracking-widest"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setDelete(false); setDeleteInput(""); }}
                className="flex-1 h-10 rounded-xl border border-[#E5E7EB] text-[14px] font-medium text-brand-navy hover:bg-[#F3F4F6] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleteInput !== "DELETE"}
                className="flex-1 h-10 rounded-xl bg-[#EF4444] text-white text-[14px] font-semibold hover:bg-[#DC2626] disabled:opacity-40 transition-colors"
              >
                Delete my account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("ai");

  const SECTION_CONTENT: Record<Section, React.ReactNode> = {
    ai:            <AiSection />,
    profile:       <ProfileSection />,
    finances:      <FinancesSection />,
    notifications: <NotificationsSection />,
    toolkit:       <ToolkitSection />,
    account:       <AccountSection />,
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Mobile: horizontal scrolling tabs */}
      <div className="lg:hidden shrink-0 bg-white border-b border-[#E5E7EB] overflow-x-auto">
        <div className="flex px-4 gap-0.5 py-1 min-w-max">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors ${
                section === key ? "bg-[#F4EDE8] text-brand-orange" : "text-[#6B7280] hover:text-brand-navy hover:bg-[#F3F4F6]"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: left sidebar + content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left nav */}
        <aside className="hidden lg:flex flex-col w-52 shrink-0 bg-white border-r border-[#E5E7EB] py-4 overflow-y-auto">
          <nav className="px-3 space-y-0.5">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors text-left ${
                  section === key
                    ? "bg-[#F4EDE8] text-brand-orange"
                    : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-brand-navy"
                }`}
              >
                <Icon size={16} className={section === key ? "text-brand-orange" : ""} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-6">
            {SECTION_CONTENT[section]}
          </div>
        </main>
      </div>
    </div>
  );
}
