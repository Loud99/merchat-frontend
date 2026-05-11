"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Eye, EyeOff, CheckCircle2, Loader2, AlertCircle, Copy, Check,
  ImagePlus, Plus, X, ChevronDown, Rocket, Upload,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: string;
  preview?: string;
}

interface DayHours {
  enabled: boolean;
  from: string;
  to: string;
}

interface FormData {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  category: string;
  password: string;
  displayName: string;
  description: string;
  logoPreview: string | null;
  brandColour: string;
  deliveryAreas: string;
  deliveryFee: string;
  freeDelivery: boolean;
  paymentOnDelivery: boolean;
  products: Product[];
  aiName: string;
  tone: "friendly" | "professional" | "energetic";
  workingHours: Record<string, DayHours>;
  outOfHoursMessage: string;
  handoffThreshold: 2 | 3 | 4;
  recoveryDiscountEnabled: boolean;
  recoveryDiscount: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Fashion & Clothing", "Food & Drinks", "Beauty & Skincare",
  "Electronics & Gadgets", "Home & Furniture", "Health & Wellness",
  "Agriculture & Produce", "General Merchandise", "Other",
];

const COLOUR_PRESETS = ["#D5652B", "#182E47", "#16A34A", "#7C3AED", "#DB2777", "#0D9488"];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEFAULT_HOURS: Record<string, DayHours> = {
  Mon: { enabled: true,  from: "08:00", to: "20:00" },
  Tue: { enabled: true,  from: "08:00", to: "20:00" },
  Wed: { enabled: true,  from: "08:00", to: "20:00" },
  Thu: { enabled: true,  from: "08:00", to: "20:00" },
  Fri: { enabled: true,  from: "08:00", to: "20:00" },
  Sat: { enabled: true,  from: "09:00", to: "18:00" },
  Sun: { enabled: false, from: "09:00", to: "17:00" },
};

const STEP_LABELS = [
  "Sign Up",
  "Connect WhatsApp",
  "Store Profile",
  "Add Products",
  "Configure AI",
  "Meet Your AI",
  "Go Live",
];

const PROVISIONED_NUMBER = "+234 901 234 5678";

const DEFAULT_FORM: FormData = {
  businessName: "", ownerName: "", phone: "", email: "", category: "", password: "",
  displayName: "", description: "", logoPreview: null, brandColour: "#D5652B",
  deliveryAreas: "", deliveryFee: "", freeDelivery: false, paymentOnDelivery: false,
  products: [],
  aiName: "Assistant", tone: "friendly",
  workingHours: { ...DEFAULT_HOURS },
  outOfHoursMessage: "Hi! We're currently closed but your message has been received. We'll get back to you first thing tomorrow. 🙏",
  handoffThreshold: 3,
  recoveryDiscountEnabled: false, recoveryDiscount: "",
};

// ── Shared helpers ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-3 text-[15px] rounded-lg border border-[#D1D5DB] bg-white outline-none transition-all " +
  "focus:border-brand-navy focus:shadow-[0_0_0_3px_rgba(24,46,71,0.12)]";

function Field({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">{label}</label>
      {children}
      {helper && <p className="text-[12px] text-[#6B7280] mt-1">{helper}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-brand-orange" : "bg-[#D1D5DB]"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
      </button>
      <span className="text-[14px] text-brand-navy">{label}</span>
    </label>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="shrink-0 p-1.5 rounded text-[#6B7280] hover:text-brand-navy transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check size={16} className="text-[#16A34A]" /> : <Copy size={16} />}
    </button>
  );
}

// ── Step 1 — Sign Up ──────────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
  fromWhatsapp,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
  fromWhatsapp: boolean;
}) {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[22px] font-bold text-brand-navy">Let&apos;s get your store set up</h2>
        <p className="text-[14px] text-[#6B7280] mt-1">Takes under 10 minutes. No technical knowledge needed.</p>
      </div>

      {fromWhatsapp && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#DCFCE7] border border-[#16A34A]/30 text-[13px] text-[#16A34A] font-medium">
          <Check size={15} strokeWidth={2.5} />
          We got your number from WhatsApp — just fill in the rest.
        </div>
      )}

      <Field label="Business name">
        <input className={inputCls} placeholder="e.g. Fashion by Amina" value={data.businessName} onChange={e => onChange("businessName", e.target.value)} />
      </Field>
      <Field label="Your name">
        <input className={inputCls} placeholder="e.g. Amina Bello" value={data.ownerName} onChange={e => onChange("ownerName", e.target.value)} />
      </Field>
      <Field label="Phone number">
        <div className="flex">
          <span className="flex items-center px-3 border border-r-0 border-[#D1D5DB] rounded-l-lg bg-[#F9FAFB] text-[14px] text-brand-navy shrink-0 whitespace-nowrap">
            🇳🇬 +234
          </span>
          <input
            className={`${inputCls} rounded-l-none`}
            type="tel"
            placeholder="0801 234 5678"
            value={data.phone}
            onChange={e => onChange("phone", e.target.value)}
          />
        </div>
      </Field>
      <Field label="Email address">
        <input className={inputCls} type="email" placeholder="you@example.com" value={data.email} onChange={e => onChange("email", e.target.value)} />
      </Field>
      <Field label="Business category">
        <div className="relative">
          <select
            className={`${inputCls} appearance-none`}
            value={data.category}
            onChange={e => onChange("category", e.target.value)}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
        </div>
      </Field>
      <Field label="Password" helper="At least 8 characters">
        <div className="relative">
          <input
            className={`${inputCls} pr-11`}
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={data.password}
            onChange={e => onChange("password", e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-brand-navy transition-colors"
          >
            {showPw ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </Field>
      <p className="text-[13px] text-[#6B7280]">
        By continuing, you agree to our{" "}
        <a href="#" className="text-brand-orange hover:opacity-75 transition-opacity">Terms of Service</a>
        {" "}and{" "}
        <a href="#" className="text-brand-orange hover:opacity-75 transition-opacity">Privacy Policy</a>.
      </p>
    </div>
  );
}

// ── Step 2 — WhatsApp Provisioning ────────────────────────────────────────────

const PROVISION_STEPS = [
  "Registering your business",
  "Creating your WhatsApp number",
  "Configuring your business profile",
];

function Step2({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0); // 0–2 = active step index, 3 = done
  const called = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2500);
    const t2 = setTimeout(() => setPhase(2), 5000);
    const t3 = setTimeout(() => {
      setPhase(3);
      if (!called.current) { called.current = true; onDone(); }
    }, 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusMsg = `🎉 I've upgraded my store! Message me on my new number for faster service, easier ordering, and 24/7 availability: ${PROVISIONED_NUMBER}`;
  const broadcastMsg = `Hi! I've moved my business to a new WhatsApp number with an AI assistant that can answer your questions and take orders anytime: ${PROVISIONED_NUMBER}. Save it now!`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-bold text-brand-navy">Setting up your WhatsApp business number</h2>
        <p className="text-[14px] text-[#6B7280] mt-1">
          We&apos;re registering a dedicated WhatsApp number in your business name. This usually takes 2–8 minutes.
        </p>
      </div>

      {phase < 3 ? (
        <div className="space-y-4 py-4">
          {PROVISION_STEPS.map((label, i) => {
            const done = i < phase;
            const active = i === phase;
            return (
              <div key={label} className="flex items-center gap-3">
                {done  ? <CheckCircle2 size={22} className="text-[#16A34A] shrink-0" /> :
                 active ? <Loader2 size={22} className="text-brand-orange animate-spin shrink-0" /> :
                          <div className="w-[22px] h-[22px] rounded-full border-2 border-[#D1D5DB] shrink-0" />}
                <span className={`text-[15px] ${done ? "text-[#16A34A]" : active ? "text-brand-navy font-medium" : "text-[#9CA3AF]"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center py-2">
            <CheckCircle2 size={48} className="text-[#16A34A] mb-3" />
            <h3 className="text-[20px] font-bold text-brand-navy mb-1">Your number is live!</h3>
            <p className="text-[24px] font-bold text-brand-orange mb-2">{PROVISIONED_NUMBER}</p>
            <p className="text-[14px] text-[#6B7280]">
              Customers who message this number reach your store — in your business name.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">
              Tell your existing customers about your new number
            </p>
            {[
              { label: "WhatsApp Status text", text: statusMsg },
              { label: "Broadcast message", text: broadcastMsg },
            ].map(({ label, text }) => (
              <div key={label} className="border border-[#E5E7EB] rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-brand-navy mb-1">{label}</p>
                    <p className="text-[13px] text-[#6B7280] leading-relaxed">{text}</p>
                  </div>
                  <CopyButton text={text} />
                </div>
              </div>
            ))}
            <p className="text-[12px] text-[#9CA3AF]">
              Share these now or find them anytime in your dashboard under Settings → Redirect Toolkit
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step 3 — Store Profile ────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
  onLogoChange,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string | boolean) => void;
  onLogoChange: (preview: string | null) => void;
}) {
  const [suggesting, setSuggesting] = useState(false);

  async function suggestDescription() {
    setSuggesting(true);
    await new Promise(r => setTimeout(r, 1200));
    onChange(
      "description",
      `We offer the finest ${data.category || "products"} — carefully selected, quality guaranteed, and delivered right to you. Shop with us for the best ${data.businessName || "shopping"} experience.`
    );
    setSuggesting(false);
  }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onLogoChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[22px] font-bold text-brand-navy">Set up your store profile</h2>
        <p className="text-[14px] text-[#6B7280] mt-1">This is what customers see when they visit your storefront page.</p>
      </div>

      <Field label="Store display name" helper="This is the name your customers see.">
        <input className={inputCls} value={data.displayName} onChange={e => onChange("displayName", e.target.value)} />
      </Field>

      <Field label="Store description">
        <div>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            maxLength={200}
            placeholder="Tell customers what you sell and why they should buy from you"
            value={data.description}
            onChange={e => onChange("description", e.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            <button
              type="button"
              onClick={suggestDescription}
              disabled={suggesting}
              className="flex items-center gap-1 text-[13px] text-brand-orange hover:opacity-75 transition-opacity disabled:opacity-50"
            >
              {suggesting && <Loader2 size={13} className="animate-spin" />}
              Suggest description ✨
            </button>
            <span className="text-[12px] text-[#9CA3AF]">{data.description.length}/200</span>
          </div>
        </div>
      </Field>

      <Field label="Logo">
        {data.logoPreview ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.logoPreview} alt="Logo preview" className="w-20 h-20 rounded-full object-cover border border-[#E5E7EB]" />
            <button type="button" onClick={() => onLogoChange(null)} className="text-[13px] text-[#EF4444] hover:opacity-75 transition-opacity">
              Remove
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D1D5DB] rounded-lg p-6 cursor-pointer hover:border-brand-navy transition-colors">
            <ImagePlus size={28} className="text-[#9CA3AF] mb-2" />
            <span className="text-[14px] text-brand-navy font-medium">Upload your logo</span>
            <span className="text-[12px] text-[#6B7280] mt-0.5">or tap to browse</span>
            <span className="text-[11px] text-[#9CA3AF] mt-1">PNG, JPG — max 5MB</span>
            <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoFile} />
          </label>
        )}
      </Field>

      <Field label="Brand colour">
        <div className="flex items-center gap-3 flex-wrap">
          {COLOUR_PRESETS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => onChange("brandColour", c)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: data.brandColour === c ? "#182E47" : "transparent",
                boxShadow: data.brandColour === c ? "0 0 0 2px #fff, 0 0 0 4px #182E47" : "none",
              }}
            />
          ))}
          <input
            type="text"
            value={data.brandColour}
            onChange={e => onChange("brandColour", e.target.value)}
            className="w-28 px-3 py-2 text-[13px] rounded-lg border border-[#D1D5DB] outline-none focus:border-brand-navy transition-all"
            placeholder="#D5652B"
          />
        </div>
      </Field>

      <Field label="Delivery areas" helper="Comma-separated areas. Your customers will see this.">
        <input
          className={inputCls}
          placeholder="e.g. Lagos Island, Victoria Island, Lekki Phase 1"
          value={data.deliveryAreas}
          onChange={e => onChange("deliveryAreas", e.target.value)}
        />
      </Field>

      <div className="space-y-3">
        <Toggle checked={data.freeDelivery} onChange={v => onChange("freeDelivery", v)} label="Free delivery" />
        {!data.freeDelivery && (
          <Field label="Delivery fee">
            <div className="flex">
              <span className="flex items-center px-3 border border-r-0 border-[#D1D5DB] rounded-l-lg bg-[#F9FAFB] text-[14px] text-brand-navy shrink-0">₦</span>
              <input
                className={`${inputCls} rounded-l-none`}
                type="number"
                placeholder="0"
                value={data.deliveryFee}
                onChange={e => onChange("deliveryFee", e.target.value)}
              />
            </div>
          </Field>
        )}
      </div>

      <Toggle
        checked={data.paymentOnDelivery}
        onChange={v => onChange("paymentOnDelivery", v)}
        label="Payment on delivery"
      />
    </div>
  );
}

// ── Step 4 — Add Products ─────────────────────────────────────────────────────

function Step4({ products, onChange }: { products: Product[]; onChange: (p: Product[]) => void }) {
  const [tab, setTab] = useState<"gallery" | "manual">("gallery");
  const [manualName, setManualName] = useState("");
  const [manualPrice, setManualPrice] = useState("");

  function remove(id: string) { onChange(products.filter(p => p.id !== id)); }
  function update(id: string, key: "name" | "price", value: string) {
    onChange(products.map(p => p.id === id ? { ...p, [key]: value } : p));
  }

  function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const next: Product[] = files.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      price: "",
      preview: URL.createObjectURL(f),
    }));
    onChange([...products, ...next]);
    e.target.value = "";
  }

  function saveManual() {
    if (!manualName || !manualPrice) return;
    onChange([...products, { id: Date.now().toString(), name: manualName, price: manualPrice }]);
    setManualName(""); setManualPrice("");
  }

  const hasValid = products.some(p => parseFloat(p.price) > 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[22px] font-bold text-brand-navy">Add your products</h2>
        <p className="text-[14px] text-[#6B7280] mt-1">Upload product photos and set prices. You can add more later.</p>
      </div>

      <div className="flex border-b border-[#E5E7EB]">
        {[
          { key: "gallery", label: "📷 Gallery upload" },
          { key: "manual", label: "✏️ Manual entry" },
          { key: "pricelist", label: "📋 Price list photo", disabled: true },
        ].map(({ key, label, disabled }) => (
          <button
            key={key}
            type="button"
            disabled={!!disabled}
            onClick={() => !disabled && setTab(key as "gallery" | "manual")}
            title={disabled ? "Coming soon" : undefined}
            className={`px-3 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
              tab === key ? "border-brand-orange text-brand-orange" : "border-transparent text-[#6B7280] hover:text-brand-navy"
            } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "gallery" ? (
        <div className="space-y-4">
          {products.length > 0 && (
            <div className="px-3 py-2 bg-[#F4EDE8] border-l-4 border-brand-orange rounded text-[13px] text-brand-navy">
              AI has named your products. Review the names and add prices to continue.
            </div>
          )}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D1D5DB] rounded-lg p-8 cursor-pointer hover:border-brand-navy transition-colors">
            <Upload size={28} className="text-[#9CA3AF] mb-2" />
            <span className="text-[14px] text-brand-navy font-medium">Select up to 50 product photos</span>
            <span className="text-[12px] text-[#6B7280] mt-0.5">Tap to browse your gallery or drag photos here</span>
            <span className="text-[11px] text-[#9CA3AF] mt-1">JPG, PNG, WebP — max 10MB each</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleGallery} />
          </label>
          {products.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {products.map(p => (
                <div key={p.id} className="relative">
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="absolute top-1 right-1 z-10 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <X size={11} />
                  </button>
                  <div className="aspect-square bg-[#F3F4F6] rounded-lg overflow-hidden mb-1.5">
                    {p.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.preview} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                        <ImagePlus size={22} />
                      </div>
                    )}
                  </div>
                  <input
                    value={p.name}
                    onChange={e => update(p.id, "name", e.target.value)}
                    className="w-full text-[12px] text-brand-navy border-b border-transparent hover:border-[#D1D5DB] focus:border-brand-navy outline-none transition-colors mb-1"
                  />
                  <div className="flex items-center">
                    <span className="text-[12px] text-[#6B7280] mr-0.5">₦</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={p.price}
                      onChange={e => update(p.id, "price", e.target.value)}
                      className="flex-1 text-[13px] font-semibold text-brand-navy border-b border-[#D1D5DB] focus:border-brand-orange outline-none transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            <Field label="Product name">
              <input className={inputCls} value={manualName} onChange={e => setManualName(e.target.value)} placeholder="e.g. Ankara Midi Dress" />
            </Field>
            <Field label="Price">
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 border-[#D1D5DB] rounded-l-lg bg-[#F9FAFB] text-[14px] text-brand-navy shrink-0">₦</span>
                <input
                  className={`${inputCls} rounded-l-none`}
                  type="number"
                  placeholder="0"
                  value={manualPrice}
                  onChange={e => setManualPrice(e.target.value)}
                />
              </div>
            </Field>
          </div>
          <button
            type="button"
            onClick={saveManual}
            disabled={!manualName || !manualPrice}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange text-white text-[13px] font-semibold disabled:opacity-50 hover:bg-[#B54E20] transition-colors"
          >
            <Plus size={14} /> Save product
          </button>

          {products.length > 0 && (
            <div className="space-y-2">
              {products.map(p => (
                <div key={p.id} className="flex items-center justify-between px-3 py-2.5 border border-[#E5E7EB] rounded-lg">
                  <span className="text-[14px] text-brand-navy truncate mr-4">{p.name}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[14px] font-semibold text-brand-navy">₦{p.price}</span>
                    <button type="button" onClick={() => remove(p.id)} className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {products.length === 0 && (
        <p className="text-[13px] text-[#D97706]">Add at least one product to continue. You can always add more from your dashboard.</p>
      )}
      {products.length > 0 && !hasValid && (
        <p className="text-[13px] text-[#D97706]">Add a price to at least one product to continue.</p>
      )}
    </div>
  );
}

// ── Step 5 — Configure AI ─────────────────────────────────────────────────────

const TONES = [
  { key: "friendly",     label: "Friendly & Casual",     desc: "Warm, conversational, uses everyday language. Great for fashion, food, beauty." },
  { key: "professional", label: "Professional & Formal",  desc: "Polished and businesslike. Good for electronics, services, B2B." },
  { key: "energetic",    label: "Energetic & Salesy",     desc: "Enthusiastic, uses emojis, drives urgency. Great for promotions." },
] as const;

function Step5({
  data,
  onChange,
  onHoursChange,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string | boolean | number) => void;
  onHoursChange: (day: string, field: keyof DayHours, value: string | boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[22px] font-bold text-brand-navy">Set up your AI assistant</h2>
        <p className="text-[14px] text-[#6B7280] mt-1">Your AI handles customer conversations in your name. Customise how it speaks.</p>
      </div>

      <Field label="AI name" helper="Customers will see this name when the AI introduces itself.">
        <input
          className={inputCls}
          placeholder="e.g. Amina's Assistant, StoreBot"
          value={data.aiName}
          onChange={e => onChange("aiName", e.target.value)}
        />
      </Field>

      <Field label="Tone">
        <div className="space-y-2.5">
          {TONES.map(({ key, label, desc }) => {
            const selected = data.tone === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange("tone", key)}
                className={`relative w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selected ? "border-brand-orange bg-[#FFF8F5]" : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                }`}
              >
                {selected && <Check size={16} className="absolute top-3 right-3 text-brand-orange" />}
                <p className="text-[14px] font-semibold text-brand-navy pr-6">{label}</p>
                <p className="text-[13px] text-[#6B7280] mt-0.5 leading-relaxed">{desc}</p>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Working hours" helper="Outside these hours, the AI uses your out-of-hours message.">
        <div className="space-y-2.5">
          {DAYS.map(day => {
            const h = data.workingHours[day];
            return (
              <div key={day} className="flex items-center gap-3 flex-wrap">
                <span className="w-8 text-[13px] font-medium text-brand-navy shrink-0">{day}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={h.enabled}
                  onClick={() => onHoursChange(day, "enabled", !h.enabled)}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${h.enabled ? "bg-brand-orange" : "bg-[#D1D5DB]"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${h.enabled ? "translate-x-4" : ""}`} />
                </button>
                {h.enabled ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={h.from}
                      onChange={e => onHoursChange(day, "from", e.target.value)}
                      className="text-[13px] border border-[#D1D5DB] rounded px-2 py-1 outline-none focus:border-brand-navy transition-colors"
                    />
                    <span className="text-[12px] text-[#6B7280]">to</span>
                    <input
                      type="time"
                      value={h.to}
                      onChange={e => onHoursChange(day, "to", e.target.value)}
                      className="text-[13px] border border-[#D1D5DB] rounded px-2 py-1 outline-none focus:border-brand-navy transition-colors"
                    />
                  </div>
                ) : (
                  <span className="text-[13px] text-[#9CA3AF]">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      </Field>

      <Field label="Out-of-hours message">
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={data.outOfHoursMessage}
          onChange={e => onChange("outOfHoursMessage", e.target.value)}
        />
      </Field>

      <Field label="AI handoff threshold" helper="How many times the AI tries before handing off to you.">
        <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
          {([2, 3, 4] as const).map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onChange("handoffThreshold", n)}
              className={`flex-1 py-2.5 text-[13px] font-medium transition-colors border-r border-[#D1D5DB] last:border-r-0 ${
                data.handoffThreshold === n ? "bg-brand-navy text-white" : "text-brand-navy hover:bg-[#F3F4F6]"
              }`}
            >
              {n} failed
            </button>
          ))}
        </div>
      </Field>

      <div className="space-y-3">
        <Toggle
          checked={data.recoveryDiscountEnabled}
          onChange={v => onChange("recoveryDiscountEnabled", v)}
          label="Offer a discount for abandoned orders"
        />
        {data.recoveryDiscountEnabled && (
          <Field label="Discount" helper="Shown in the abandoned cart reminder sent 2 hours after an unpaid order.">
            <div className="flex">
              <input
                className={`${inputCls} rounded-r-none`}
                type="number"
                placeholder="10"
                value={data.recoveryDiscount}
                onChange={e => onChange("recoveryDiscount", e.target.value)}
              />
              <span className="flex items-center px-3 border border-l-0 border-[#D1D5DB] rounded-r-lg bg-[#F9FAFB] text-[14px] text-brand-navy shrink-0">%</span>
            </div>
          </Field>
        )}
      </div>
    </div>
  );
}

// ── Step 6 — Meet Your AI ─────────────────────────────────────────────────────

interface ChatMsg { role: "customer" | "ai"; text: string; }

function buildChat(data: FormData): ChatMsg[][] {
  const cat = data.category || "products";
  const store = data.displayName || data.businessName || "our store";
  const ai = data.aiName || "Assistant";
  const p0 = data.products[0];
  const p1 = data.products[1];
  const p2 = data.products[2];
  const areas = data.deliveryAreas || "select areas";
  const feeLine = data.freeDelivery ? "free delivery" : data.deliveryFee ? `a ₦${data.deliveryFee} delivery fee` : "standard delivery rates";

  const productList = [p0, p1, p2]
    .filter(Boolean)
    .map(p => `• ${p!.name} — ₦${p!.price}`)
    .join("\n");

  return [
    [
      { role: "customer", text: "Hello, what do you have?" },
      { role: "ai", text: `Hi! Welcome to ${store} 👋 I'm ${ai}. We specialise in ${cat}. Are you looking for something specific, or shall I show you what's popular?` },
    ],
    [
      { role: "customer", text: "Yes please, show me what you have" },
      { role: "ai", text: `Sure! Here are some of our top picks:\n${productList || "• Check back soon — products coming!"}\n\nWould you like details on any of these?` },
    ],
    [
      { role: "customer", text: p0 ? `Tell me more about the ${p0.name}` : "Tell me more about your products" },
      { role: "ai", text: `${p0 ? `The ${p0.name} is priced at ₦${p0.price}. ` : ""}It's available and ready to ship. Would you like to order it?` },
    ],
    [
      { role: "customer", text: "What about delivery?" },
      { role: "ai", text: `We deliver to ${areas} with ${feeLine}. Orders are typically processed within 24 hours. Any other questions?` },
    ],
    [
      { role: "customer", text: "I want to order" },
      { role: "ai", text: `Awesome! Let me confirm your order. I'll open an order form for you now — just fill in your details and we'll get it sorted right away. Thank you for choosing ${store}! 🎉` },
    ],
  ];
}

const TEST_PILLS = ["Browse", "Products", "Product Q&A", "Delivery", "Order Intent"];

function Step6({ data }: { data: FormData }) {
  const exchanges = buildChat(data);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [typingIdx, setTypingIdx] = useState<number | null>(null);
  const [done, setDone] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      for (let i = 0; i < exchanges.length; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 400 : 500));
        if (cancelled) return;
        setMessages(prev => [...prev, exchanges[i][0]]);
        await new Promise(r => setTimeout(r, 600));
        if (cancelled) return;
        setTypingIdx(i);
        await new Promise(r => setTimeout(r, 1200));
        if (cancelled) return;
        setTypingIdx(null);
        setMessages(prev => [...prev, exchanges[i][1]]);
        setDone(i + 1);
      }
    }
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingIdx]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[22px] font-bold text-brand-navy">Meet your AI assistant</h2>
        <p className="text-[14px] text-[#6B7280] mt-1">See exactly how your AI responds to customers before going live.</p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {TEST_PILLS.map((label, i) => (
          <span
            key={label}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors ${
              i < done ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F3F4F6] text-[#9CA3AF]"
            }`}
          >
            {i < done && <Check size={11} strokeWidth={2.5} />}
            {label}
          </span>
        ))}
      </div>

      <div className="bg-[#E5DDD5] rounded-xl overflow-hidden">
        <div className="h-[300px] overflow-y-auto p-3 space-y-2.5">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "customer" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[78%] px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line ${
                  msg.role === "customer"
                    ? "bg-white rounded-[12px_12px_12px_0]"
                    : "bg-[#DCF8C6] rounded-[12px_12px_0_12px]"
                }`}
              >
                {msg.text}
                <p className="text-[10px] text-[#9CA3AF] mt-1 text-right">
                  {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {typingIdx !== null && (
            <div className="flex justify-end">
              <div className="bg-[#DCF8C6] rounded-[12px_12px_0_12px] px-3 py-2.5 flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {done === exchanges.length && (
        <div className="px-3 py-2 bg-[#F4EDE8] border-l-4 border-brand-orange rounded text-[13px] text-brand-navy font-medium">
          Looking good! Your AI handled all 5 test scenarios. 🎉
        </div>
      )}
      <p className="text-[12px] text-[#9CA3AF] text-center">
        You can rerun this preview anytime from your dashboard under &quot;Test Your AI&quot;.
      </p>
    </div>
  );
}

// ── Step 7 — Go Live ──────────────────────────────────────────────────────────

function Step7({ data }: { data: FormData }) {
  const slug = (data.businessName || "mystore").toLowerCase().replace(/[^a-z0-9]+/g, "") || "mystore";
  const storeUrl = `merchat.io/${slug}`;
  const statusMsg = `🎉 I've upgraded my store! Message me on my new number for faster service, easier ordering, and 24/7 availability: ${PROVISIONED_NUMBER}`;
  const broadcastMsg = `Hi! I've moved my business to a new WhatsApp number with an AI assistant that can answer your questions and take orders anytime: ${PROVISIONED_NUMBER}. Save it now!`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Rocket size={64} className="text-brand-orange animate-bounce" />
        </div>
        <h2 className="text-[26px] font-bold text-brand-navy">You&apos;re live! 🎉</h2>
        <p className="text-[14px] text-[#6B7280] mt-1">Your AI is running. Share your store link and start getting orders.</p>
      </div>

      <div className="bg-[#F4EDE8] rounded-xl p-4">
        <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Your WhatsApp number</p>
        <div className="flex items-center justify-between">
          <p className="text-[22px] font-bold text-brand-orange">{PROVISIONED_NUMBER}</p>
          <CopyButton text={PROVISIONED_NUMBER} />
        </div>
      </div>

      <div className="bg-[#F3F4F6] rounded-xl p-4">
        <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Your storefront link</p>
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-brand-navy">{storeUrl}</p>
          <CopyButton text={storeUrl} />
        </div>
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-brand-orange hover:opacity-75 transition-opacity mt-1 inline-block"
        >
          Open storefront →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "WhatsApp Status", text: statusMsg, iconBg: "bg-[#F4EDE8]", iconColour: "text-brand-orange", btnCls: "border-brand-orange text-brand-orange hover:bg-[#F4EDE8]", btnLabel: "Copy for WhatsApp Status" },
          { label: "Broadcast",       text: broadcastMsg, iconBg: "bg-brand-navy/10", iconColour: "text-brand-navy",   btnCls: "border-brand-navy text-brand-navy hover:bg-[#F3F4F6]",   btnLabel: "Copy for Broadcast" },
        ].map(({ label, text, iconBg, iconColour, btnCls, btnLabel }) => (
          <div key={label} className="border-2 border-[#E5E7EB] rounded-xl p-4 flex flex-col">
            <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center mb-3 shrink-0`}>
              <Rocket size={16} className={iconColour} />
            </div>
            <p className="text-[13px] font-semibold text-brand-navy mb-1">{label}</p>
            <p className="text-[12px] text-[#6B7280] mb-3 leading-relaxed line-clamp-3 flex-1">{text}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(text)}
              className={`w-full py-2 rounded-lg border text-[12px] font-semibold transition-colors ${btnCls}`}
            >
              {btnLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main wizard ───────────────────────────────────────────────────────────────

function OnboardingWizard() {
  const searchParams = useSearchParams();
  const fromWhatsapp = searchParams.get("source") === "whatsapp";
  const waPhone = searchParams.get("phone") ?? "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(() => ({
    ...DEFAULT_FORM,
    phone: waPhone,
  }));
  const [provisioningDone, setProvisioningDone] = useState(false);

  function patch(key: keyof FormData, value: unknown) {
    setForm(prev => {
      if (key === "businessName" && typeof value === "string" && !prev.displayName) {
        return { ...prev, businessName: value, displayName: value };
      }
      return { ...prev, [key]: value };
    });
  }

  function patchHours(day: string, field: keyof DayHours, value: string | boolean) {
    setForm(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: { ...prev.workingHours[day], [field]: value },
      },
    }));
  }

  const canContinue = (() => {
    switch (step) {
      case 1: return !!(form.businessName && form.ownerName && form.phone && form.email && form.category && form.password.length >= 8);
      case 2: return provisioningDone;
      case 3: return !!form.displayName;
      case 4: return form.products.some(p => parseFloat(p.price) > 0);
      case 5: return !!form.aiName;
      default: return true;
    }
  })();

  const ctaLabel =
    step === 1 ? "Create my account →" :
    step === 6 ? "Go live! 🚀" :
    step === 7 ? "Go to my dashboard →" :
    "Continue →";

  function next() {
    if (step < 7) setStep(s => s + 1);
    else window.location.href = "/dashboard";
  }

  const progress = ((step - 1) / 6) * 100;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-[#E5E7EB] flex items-center px-4 lg:px-6 gap-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo-light.svg"
            alt="Merchat.io"
            width={100}
            height={19}
            unoptimized
            priority
            style={{ width: 100, height: "auto" }}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="relative h-1 bg-[#E5E7EB] rounded-full overflow-hidden mb-1">
            <div
              className="absolute inset-y-0 left-0 bg-brand-orange rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-[#6B7280] truncate">
            Step {step} of 7 — {STEP_LABELS[step - 1]}
          </p>
        </div>
        <Link href="/login" className="shrink-0 text-[13px] text-[#6B7280] hover:text-brand-navy transition-colors whitespace-nowrap">
          Save &amp; exit
        </Link>
      </header>

      {/* Body */}
      <div className="flex-1 flex items-start lg:items-center justify-center pt-[80px] pb-8 px-4">
        <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-6 pt-8 pb-6 lg:px-10 lg:pt-10">

          {step === 1 && (
            <Step1
              data={form}
              onChange={(k, v) => patch(k, v)}
              fromWhatsapp={fromWhatsapp}
            />
          )}
          {step === 2 && (
            <Step2 onDone={() => setProvisioningDone(true)} />
          )}
          {step === 3 && (
            <Step3
              data={form}
              onChange={(k, v) => patch(k, v)}
              onLogoChange={preview => patch("logoPreview", preview)}
            />
          )}
          {step === 4 && (
            <Step4
              products={form.products}
              onChange={products => setForm(prev => ({ ...prev, products }))}
            />
          )}
          {step === 5 && (
            <Step5
              data={form}
              onChange={(k, v) => patch(k, v)}
              onHoursChange={patchHours}
            />
          )}
          {step === 6 && <Step6 data={form} />}
          {step === 7 && <Step7 data={form} />}

          {/* Bottom button row */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#E5E7EB] gap-3">
            {step > 1 && step < 7 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="px-5 py-3 rounded-lg border border-[#D1D5DB] text-brand-navy text-[14px] font-semibold hover:bg-[#F3F4F6] transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={next}
              disabled={!canContinue}
              className="flex-1 lg:flex-none lg:min-w-[180px] h-[50px] rounded-lg bg-brand-orange text-white text-[15px] font-semibold hover:bg-[#B54E20] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingWizard />
    </Suspense>
  );
}
