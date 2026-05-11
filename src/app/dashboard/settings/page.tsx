"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import {
  Bot, Store, CreditCard, Bell, Share2, User,
  Check, Copy, ExternalLink, Eye, EyeOff, Upload, X, LucideIcon,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Section = "ai" | "profile" | "payments" | "notifications" | "toolkit" | "account";
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
  { key: "payments",      label: "Payment Gateway", icon: CreditCard },
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
  const [deliveryAreas, setDeliveryAreas] = useState("Lagos Island, Victoria Island, Lekki, Ajah");
  const [deliveryFee, setDeliveryFee]     = useState("1500");
  const [freeDelivery, setFreeDelivery]   = useState(false);
  const [pod, setPod]             = useState(true);
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
          <FieldLabel>Delivery areas</FieldLabel>
          <input
            value={deliveryAreas}
            onChange={e => setDeliveryAreas(e.target.value)}
            placeholder="e.g. Lagos Island, Victoria Island"
            className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors"
          />
        </div>

        {/* Delivery fee */}
        <div>
          <FieldLabel>Delivery fee (₦)</FieldLabel>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-[160px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#6B7280]">₦</span>
              <input
                type="number"
                min="0"
                value={freeDelivery ? "0" : deliveryFee}
                onChange={e => setDeliveryFee(e.target.value)}
                disabled={freeDelivery}
                className="w-full h-10 pl-7 pr-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy focus:outline-none focus:border-brand-navy/40 disabled:opacity-50 transition-colors"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Toggle checked={freeDelivery} onChange={setFreeDelivery} />
              <span className="text-[13px] text-brand-navy">Free delivery</span>
            </label>
          </div>
        </div>

        {/* Pay on delivery */}
        <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-4">
          <div>
            <p className="text-[14px] font-medium text-brand-navy">Accept pay on delivery</p>
            <p className="text-[12px] text-[#6B7280] mt-0.5">Customers can pay cash when the order arrives.</p>
          </div>
          <Toggle checked={pod} onChange={setPod} />
        </div>
      </div>

      <SaveBar label="Save store profile" onSave={() => {}} />
    </div>
  );
}

// ── Payment Gateway section ───────────────────────────────────────────────────

function GatewayCard({
  name, keyPrefix, note,
}: {
  name: string;
  keyPrefix: string;
  note?: string;
}) {
  const [connected, setConnected]       = useState(false);
  const [keyInput, setKeyInput]         = useState("");
  const [showKey, setShowKey]           = useState(false);
  const [maskedKey]                     = useState(`${keyPrefix}_●●●●●●●●●abc123`);
  const [confirmDisconnect, setConfirm] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-bold text-brand-navy">{name}</p>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          connected ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F3F4F6] text-[#6B7280]"
        }`}>
          {connected ? "Connected" : "Not connected"}
        </span>
      </div>

      {!connected ? (
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-[#6B7280] mb-1">Secret Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder={`${keyPrefix}_live_...`}
                className="w-full h-10 pl-3 pr-10 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors"
              />
              <button
                onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-brand-navy transition-colors"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Get your secret key from the {name} dashboard.
            </p>
          </div>
          <button
            onClick={() => { if (keyInput.length > 10) setConnected(true); }}
            disabled={keyInput.length <= 10}
            className="h-9 px-5 rounded-xl bg-brand-orange text-white text-[13px] font-semibold hover:bg-[#c45a25] disabled:opacity-40 transition-colors"
          >
            Connect {name}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-lg px-3 py-2">
            <code className="flex-1 text-[13px] text-brand-navy font-mono">{maskedKey}</code>
          </div>
          {!confirmDisconnect ? (
            <button
              onClick={() => setConfirm(true)}
              className="text-[13px] text-[#EF4444] font-medium hover:underline"
            >
              Disconnect
            </button>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-[#FEF2F2] rounded-lg">
              <p className="text-[13px] text-[#92400E] flex-1">Disconnect {name}?</p>
              <button
                onClick={() => { setConnected(false); setKeyInput(""); setConfirm(false); }}
                className="text-[13px] font-semibold text-[#EF4444] hover:underline"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="text-[13px] font-medium text-[#6B7280] hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {note && <p className="text-[12px] text-[#9CA3AF] border-t border-[#F3F4F6] pt-3">{note}</p>}
    </div>
  );
}

function PaymentsSection() {
  return (
    <div>
      <SectionTitle title="Payment Gateway" subtitle="Connect your payment processors to accept online payments." />
      <div className="space-y-4">
        <GatewayCard name="Paystack" keyPrefix="sk_live" />
        <GatewayCard
          name="Flutterwave"
          keyPrefix="FLWSECK"
          note="You can connect both. Merchat will use Paystack as primary."
        />
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
    payments:      <PaymentsSection />,
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
