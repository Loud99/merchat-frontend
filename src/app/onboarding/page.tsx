"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check, CheckCircle, Copy, X, Plus, Trash2, Edit2,
  ChevronDown, Upload, Building2, Truck, CreditCard,
  Bookmark, AlertCircle, Loader2, Info, Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Nigerian states ────────────────────────────────────────────────────────────
const NIGERIAN_STATES = [
  "FCT Abuja", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi",
  "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi",
  "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const BUSINESS_TYPES = [
  "Fashion & Clothing", "Food & Beverages", "Electronics & Gadgets",
  "Beauty & Health", "Home & Living", "Books & Stationery",
  "Kids & Toys", "Sports & Fitness", "Other",
];

const NIGERIAN_BANKS = [
  "GTBank", "Access Bank", "Zenith Bank", "First Bank", "UBA",
  "Fidelity Bank", "Sterling Bank", "Opay", "Kuda Bank", "Other",
];

const DELIVERY_TIMES = [
  "Same day", "1–2 days", "3–5 days", "1–2 weeks", "Varies",
];

const COLOUR_PRESETS = ["#D5652B", "#182E47", "#16A34A", "#7C3AED", "#DB2777", "#EF4444"];

const VARIANT_TYPES = ["Size", "Colour", "Material", "Style", "Weight", "Pack Size"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const STEP_LABELS = [
  "Business Info",
  "Store Setup",
  "Add Products",
  "Delivery",
  "Payment",
  "WhatsApp",
  "Review & Go Live",
];

// ── Types ──────────────────────────────────────────────────────────────────────

interface VariantType {
  type: string;
  options: string[];
}

interface OnboardingProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  compareAtPrice: string;
  description: string;
  imageUrls: string;
  stockQuantity: string;
  hasVariants: boolean;
  variants: VariantType[];
  podEnabled: boolean;
}

interface OnboardingForm {
  // Step 1
  businessName: string;
  businessType: string;
  businessDescription: string;
  businessPhone: string;
  city: string;
  state: string;
  // Step 2
  storeName: string;
  slug: string;
  tagline: string;
  logoPreview: string | null;
  accentColour: string;
  // Step 3
  products: OnboardingProduct[];
  // Step 4
  deliveryStates: string[];
  deliveryTime: string;
  deliveryNote: string;
  // Step 5
  paymentMethods: string[];
  bankName: string;
  accountNumber: string;
  accountName: string;
  // Step 6
  whatsappPath: "existing" | "setup";
  whatsappNumber: string;
}

const DEFAULT_FORM: OnboardingForm = {
  businessName: "", businessType: "", businessDescription: "",
  businessPhone: "", city: "", state: "",
  storeName: "", slug: "", tagline: "", logoPreview: null, accentColour: "#D5652B",
  products: [],
  deliveryStates: [], deliveryTime: "", deliveryNote: "",
  paymentMethods: ["bank_transfer"], bankName: "", accountNumber: "", accountName: "",
  whatsappPath: "existing", whatsappNumber: "",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const inputCls =
  "w-full h-11 px-4 text-[15px] bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl outline-none transition-all " +
  "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 focus:bg-white";

const textareaCls =
  "w-full px-4 py-3 text-[15px] bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl outline-none transition-all resize-none " +
  "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 focus:bg-white";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function passwordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s) as 0 | 1 | 2 | 3 | 4;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="shrink-0 p-1.5 rounded text-[#6C757D] hover:text-brand-orange transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check size={16} className="text-brand-orange" /> : <Copy size={16} />}
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-brand-orange" : "bg-[#DEE2E6]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

// ── Step 1: Business Info ──────────────────────────────────────────────────────

function Step1({ form, patch }: { form: OnboardingForm; patch: (k: keyof OnboardingForm, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[26px] font-bold text-[#212529]">Tell us about your business</h2>
        <p className="text-[16px] text-[#6C757D] mt-1">This helps us personalise your AI and storefront.</p>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
          Business name <span className="text-brand-orange">*</span>
        </label>
        <input
          className={inputCls}
          placeholder="Funke's Fashion"
          value={form.businessName}
          onChange={(e) => patch("businessName", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
          Business type <span className="text-brand-orange">*</span>
        </label>
        <div className="relative">
          <select
            className={inputCls + " appearance-none pr-10"}
            value={form.businessType}
            onChange={(e) => patch("businessType", e.target.value)}
          >
            <option value="">Select a business type</option>
            {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
          Business description <span className="text-brand-orange">*</span>
        </label>
        <textarea
          className={textareaCls}
          rows={4}
          maxLength={300}
          placeholder="We sell affordable ankara and ready-to-wear fashion for working women in Lagos."
          value={form.businessDescription}
          onChange={(e) => patch("businessDescription", e.target.value)}
        />
        <div className="flex justify-between mt-1">
          <p className="text-[12px] text-[#6C757D]">Your AI will use this to answer customer questions. Be specific about what you sell.</p>
          <span className="text-[12px] text-[#ADB5BD] shrink-0 ml-2">{form.businessDescription.length}/300</span>
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
          Business phone number <span className="text-brand-orange">*</span>
        </label>
        <input
          className={inputCls}
          type="tel"
          placeholder="+234 800 000 0000"
          value={form.businessPhone}
          onChange={(e) => patch("businessPhone", e.target.value)}
        />
        <p className="text-[12px] text-[#6C757D] mt-1">Your customers will contact this number. Can be your WhatsApp number.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">City</label>
          <input
            className={inputCls}
            placeholder="Lagos"
            value={form.city}
            onChange={(e) => patch("city", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">State</label>
          <div className="relative">
            <select
              className={inputCls + " appearance-none pr-10"}
              value={form.state}
              onChange={(e) => patch("state", e.target.value)}
            >
              <option value="">Select state</option>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Store Setup ────────────────────────────────────────────────────────

function Step2({ form, patch }: { form: OnboardingForm; patch: (k: keyof OnboardingForm, v: unknown) => void }) {
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSlug = useCallback(async (val: string) => {
    if (!val || val.length < 3) { setSlugStatus("idle"); return; }
    setSlugStatus("checking");
    const supabase = createClient();
    const { data } = await supabase.from("merchants").select("id").eq("slug", val).maybeSingle();
    setSlugStatus(data ? "taken" : "available");
  }, []);

  function handleSlugChange(val: string) {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    patch("slug", clean);
    setSlugStatus("idle");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => checkSlug(clean), 600);
  }

  function handleStoreNameChange(val: string) {
    patch("storeName", val);
    if (!form.slug) {
      const auto = slugify(val);
      patch("slug", auto);
      if (auto.length >= 3) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => checkSlug(auto), 600);
      }
    }
  }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => patch("logoPreview", ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[26px] font-bold text-[#212529]">Set up your storefront</h2>
        <p className="text-[16px] text-[#6C757D] mt-1">Your storefront is where customers browse and shop.</p>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
          Store name <span className="text-brand-orange">*</span>
        </label>
        <input
          className={inputCls}
          placeholder="Funke's Fashion Store"
          value={form.storeName}
          onChange={(e) => handleStoreNameChange(e.target.value)}
        />
        <p className="text-[12px] text-[#6C757D] mt-1">This is what customers see at the top of your storefront.</p>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
          Your store link <span className="text-brand-orange">*</span>
        </label>
        <div className="flex h-11">
          <span className="flex items-center px-3 bg-[#F1F3F5] border border-r-0 border-[#DEE2E6] rounded-l-xl text-[14px] text-[#6C757D] shrink-0 whitespace-nowrap">
            merchat.io/store/
          </span>
          <input
            className="flex-1 px-3 text-[15px] bg-[#F8F9FA] border border-[#DEE2E6] rounded-r-xl outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 focus:bg-white"
            placeholder="funkes-fashion"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            maxLength={50}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-[12px] text-[#6C757D]">Only letters, numbers, and hyphens.</p>
          {slugStatus === "checking" && <span className="text-[12px] text-[#ADB5BD]">Checking…</span>}
          {slugStatus === "available" && <span className="text-[12px] text-[#16A34A] font-medium">✓ Available!</span>}
          {slugStatus === "taken" && <span className="text-[12px] text-[#F44336] font-medium">✗ Taken</span>}
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Store tagline</label>
        <input
          className={inputCls}
          placeholder="Affordable ankara for every occasion"
          value={form.tagline}
          onChange={(e) => patch("tagline", e.target.value.slice(0, 80))}
          maxLength={80}
        />
        <div className="flex justify-between mt-1">
          <p className="text-[12px] text-[#6C757D]">A short sentence that describes what you sell. Optional.</p>
          <span className="text-[12px] text-[#ADB5BD]">{form.tagline.length}/80</span>
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Store logo</label>
        {form.logoPreview ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.logoPreview} alt="Logo preview" className="w-[120px] h-[120px] rounded-full object-cover border-2 border-[#DEE2E6]" />
            <button type="button" onClick={() => patch("logoPreview", null)} className="text-[13px] text-[#F44336] hover:opacity-75 transition-opacity">
              Remove
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#DEE2E6] rounded-xl p-8 cursor-pointer hover:border-brand-orange transition-colors">
            <Upload size={32} className="text-[#ADB5BD] mb-2" />
            <span className="text-[14px] text-[#343A40] font-medium">Click to upload or drag and drop</span>
            <span className="text-[12px] text-[#6C757D] mt-0.5">PNG, JPG or SVG · Max 2MB</span>
            <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={handleLogoFile} />
          </label>
        )}
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
          Accent colour <span className="text-[#ADB5BD] font-normal">(optional)</span>
        </label>
        <p className="text-[12px] text-[#6C757D] mb-2">Shown on your storefront buttons.</p>
        <div className="flex items-center gap-3 flex-wrap">
          {COLOUR_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => patch("accentColour", c)}
              className="w-8 h-8 rounded-full transition-all"
              style={{
                backgroundColor: c,
                outline: form.accentColour === c ? `3px solid ${c}` : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
          <input
            type="text"
            value={form.accentColour}
            onChange={(e) => patch("accentColour", e.target.value)}
            className="w-28 h-9 px-3 text-[13px] bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg outline-none focus:border-brand-orange transition-all"
            placeholder="#D5652B"
          />
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Add Products ───────────────────────────────────────────────────────

const EMPTY_PRODUCT = (): OnboardingProduct => ({
  id: Date.now().toString(),
  name: "", category: "", price: "", compareAtPrice: "",
  description: "", imageUrls: "", stockQuantity: "1",
  hasVariants: false, variants: [], podEnabled: false,
});

function ProductForm({
  product, onSave, onCancel,
}: {
  product: OnboardingProduct;
  onSave: (p: OnboardingProduct) => void;
  onCancel: () => void;
}) {
  const [p, setP] = useState(product);
  const [variantType, setVariantType] = useState("");

  function set(k: keyof OnboardingProduct, v: unknown) {
    setP((prev) => ({ ...prev, [k]: v }));
  }

  function addVariantType() {
    if (!variantType || p.variants.some((v) => v.type === variantType)) return;
    set("variants", [...p.variants, { type: variantType, options: [] }]);
    setVariantType("");
  }

  function setVariantOptions(type: string, options: string[]) {
    set("variants", p.variants.map((v) => v.type === type ? { ...v, options } : v));
  }

  function removeVariant(type: string) {
    set("variants", p.variants.filter((v) => v.type !== type));
  }

  const sizeStrength = passwordStrength; // reuse signature for POD badge, unused here
  void sizeStrength;

  return (
    <div className="border border-[#DEE2E6] rounded-2xl p-5 space-y-4 bg-white">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
            Product name <span className="text-brand-orange">*</span>
          </label>
          <input className={inputCls} placeholder="Ankara Midi Dress" value={p.name} onChange={(e) => set("name", e.target.value)} />
        </div>

        <div className="col-span-2">
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
            Category <span className="text-brand-orange">*</span>
          </label>
          <div className="relative">
            <select className={inputCls + " appearance-none pr-10"} value={p.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">Select a category</option>
              {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
            Price (₦) <span className="text-brand-orange">*</span>
          </label>
          <input className={inputCls} type="number" min="0" placeholder="0" value={p.price} onChange={(e) => set("price", e.target.value)} />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Compare at price (₦)</label>
          <input className={inputCls} type="number" min="0" placeholder="0" value={p.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
        </div>

        <div className="col-span-2">
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Description</label>
          <textarea className={textareaCls} rows={3} placeholder="Describe this product..." value={p.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        <div className="col-span-2">
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Product images</label>
          <textarea
            className={textareaCls}
            rows={2}
            placeholder="https://... , https://... , https://..."
            value={p.imageUrls}
            onChange={(e) => set("imageUrls", e.target.value)}
          />
          <p className="text-[12px] text-[#6C757D] mt-1">Paste image URLs separated by commas. Use Google Drive, Cloudinary, or any public image host.</p>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
            Stock quantity <span className="text-brand-orange">*</span>
          </label>
          <input className={inputCls} type="number" min="0" value={p.stockQuantity} onChange={(e) => set("stockQuantity", e.target.value)} />
        </div>
      </div>

      {/* Variants */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-semibold text-[#343A40]">Does this product have variants?</span>
          <Toggle checked={p.hasVariants} onChange={(v) => set("hasVariants", v)} />
        </div>
        {p.hasVariants && (
          <div className="space-y-3 pl-1">
            {p.variants.map((v) => (
              <div key={v.type} className="border border-[#DEE2E6] rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#343A40]">{v.type}</span>
                  <button type="button" onClick={() => removeVariant(v.type)} className="text-[#ADB5BD] hover:text-[#F44336]"><X size={14} /></button>
                </div>
                {v.type === "Size" ? (
                  <div className="flex flex-wrap gap-1.5">
                    {SIZE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          const opts = v.options.includes(s) ? v.options.filter((o) => o !== s) : [...v.options, s];
                          setVariantOptions(v.type, opts);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-colors ${
                          v.options.includes(s) ? "bg-brand-orange text-white border-brand-orange" : "border-[#DEE2E6] text-[#343A40]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    className={inputCls}
                    placeholder={`e.g. Red, Blue, Green (comma separated)`}
                    value={v.options.join(", ")}
                    onChange={(e) => setVariantOptions(v.type, e.target.value.split(",").map((o) => o.trim()).filter(Boolean))}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select className={inputCls + " appearance-none pr-10 text-[14px]"} value={variantType} onChange={(e) => setVariantType(e.target.value)}>
                  <option value="">Add variant type</option>
                  {VARIANT_TYPES.filter((t) => !p.variants.some((v) => v.type === t)).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={addVariantType}
                disabled={!variantType}
                className="px-3 h-11 rounded-xl bg-brand-orange text-white text-[13px] font-medium disabled:opacity-40 hover:bg-brand-orange-hover transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POD */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-[13px] font-semibold text-[#343A40]">Accept pay on delivery for this product</span>
          {p.podEnabled && (
            <span className="ml-2 text-[11px] bg-[#FBF0EB] text-brand-orange px-2 py-0.5 rounded-full font-medium">Pay on delivery available</span>
          )}
        </div>
        <Toggle checked={p.podEnabled} onChange={(v) => set("podEnabled", v)} />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => onSave(p)}
          disabled={!p.name || !p.price || !p.category}
          className="flex-1 h-11 rounded-xl bg-brand-orange text-white text-[14px] font-semibold disabled:opacity-50 hover:bg-brand-orange-hover transition-colors"
        >
          Save Product
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 h-11 rounded-xl border border-[#DEE2E6] text-[#6C757D] text-[14px] hover:bg-[#F8F9FA] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Step3({ form, patch }: { form: OnboardingForm; patch: (k: keyof OnboardingForm, v: unknown) => void }) {
  const [editing, setEditing] = useState<OnboardingProduct | null>(null);
  const [isNew, setIsNew] = useState(false);

  function openNew() { setEditing(EMPTY_PRODUCT()); setIsNew(true); }
  function openEdit(p: OnboardingProduct) { setEditing({ ...p }); setIsNew(false); }

  function saveProduct(p: OnboardingProduct) {
    const updated = isNew
      ? [...form.products, p]
      : form.products.map((x) => x.id === p.id ? p : x);
    patch("products", updated);
    setEditing(null);
  }

  function removeProduct(id: string) {
    patch("products", form.products.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[26px] font-bold text-[#212529]">Add your first products</h2>
        <p className="text-[16px] text-[#6C757D] mt-1">Add at least one product to launch your store. You can add more later.</p>
      </div>

      <div className="flex items-start gap-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-4 py-3">
        <Info size={16} className="text-[#3B82F6] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#1E40AF]">Your AI will automatically learn about every product you add, including prices, variants, and availability.</p>
      </div>

      {form.products.length > 0 && (
        <div className="space-y-2">
          {form.products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border border-[#DEE2E6] rounded-xl px-3 py-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#F1F3F5] flex items-center justify-center shrink-0 overflow-hidden">
                {p.imageUrls ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrls.split(",")[0].trim()} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[18px]">📦</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#212529] truncate">{p.name}</p>
                <p className="text-[12px] text-[#6C757D]">₦{p.price}</p>
              </div>
              <button type="button" onClick={() => openEdit(p)} className="text-[#ADB5BD] hover:text-brand-orange transition-colors">
                <Edit2 size={15} />
              </button>
              <button type="button" onClick={() => removeProduct(p.id)} className="text-[#ADB5BD] hover:text-[#F44336] transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing ? (
        <ProductForm product={editing} onSave={saveProduct} onCancel={() => setEditing(null)} />
      ) : (
        <button
          type="button"
          onClick={openNew}
          className="w-full h-11 rounded-xl border-2 border-dashed border-brand-orange text-brand-orange text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#FBF0EB] transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      )}

      {form.products.length === 0 && !editing && (
        <p className="text-[13px] text-[#D97706] text-center">
          Add at least one product to continue.
        </p>
      )}
    </div>
  );
}

// ── Step 4: Delivery ───────────────────────────────────────────────────────────

function Step4({ form, patch }: { form: OnboardingForm; patch: (k: keyof OnboardingForm, v: unknown) => void }) {
  function toggleState(s: string) {
    const next = form.deliveryStates.includes(s)
      ? form.deliveryStates.filter((x) => x !== s)
      : [...form.deliveryStates, s];
    patch("deliveryStates", next);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[26px] font-bold text-[#212529]">Where do you deliver?</h2>
        <p className="text-[16px] text-[#6C757D] mt-1">Customers outside your delivery areas will still be able to browse.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[12px] font-semibold text-[#343A40]">States you deliver to</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => patch("deliveryStates", [...NIGERIAN_STATES])} className="text-[12px] text-brand-orange font-medium">Select all</button>
            <button type="button" onClick={() => patch("deliveryStates", [])} className="text-[12px] text-[#6C757D]">Clear all</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-3 border border-[#DEE2E6] rounded-xl p-4 max-h-64 overflow-y-auto">
          {NIGERIAN_STATES.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => toggleState(s)}
                className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                  form.deliveryStates.includes(s) ? "bg-brand-orange border-brand-orange" : "border-[#DEE2E6]"
                }`}
              >
                {form.deliveryStates.includes(s) && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5l2.5 2.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-[13px] text-[#343A40]">{s}</span>
            </label>
          ))}
        </div>
        {form.deliveryStates.length > 0 && (
          <p className="text-[12px] text-brand-orange font-medium mt-2">{form.deliveryStates.length} state{form.deliveryStates.length !== 1 ? "s" : ""} selected</p>
        )}
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Typical delivery time</label>
        <div className="relative">
          <select className={inputCls + " appearance-none pr-10"} value={form.deliveryTime} onChange={(e) => patch("deliveryTime", e.target.value)}>
            <option value="">Select delivery time</option>
            {DELIVERY_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Delivery note</label>
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="We use GIG Logistics for deliveries. Delivery fee is calculated at checkout."
          value={form.deliveryNote}
          onChange={(e) => patch("deliveryNote", e.target.value)}
        />
        <p className="text-[12px] text-[#6C757D] mt-1">This is shown to customers on your storefront.</p>
      </div>
    </div>
  );
}

// ── Step 5: Payment ────────────────────────────────────────────────────────────

const PAYMENT_OPTIONS = [
  { id: "bank_transfer", icon: Building2, title: "Bank Transfer", body: "Customers transfer to your account. Most popular in Nigeria.", comingSoon: false },
  { id: "pod", icon: Truck, title: "Pay on Delivery", body: "Customers pay cash when their order arrives.", comingSoon: false },
  { id: "paystack", icon: CreditCard, title: "Paystack", body: "Accept cards, USSD, and bank transfers via Paystack.", comingSoon: true },
  { id: "flutterwave", icon: CreditCard, title: "Flutterwave", body: "Accept global payments via Flutterwave.", comingSoon: true },
];

function Step5({ form, patch }: { form: OnboardingForm; patch: (k: keyof OnboardingForm, v: unknown) => void }) {
  function toggleMethod(id: string) {
    const methods = form.paymentMethods.includes(id)
      ? form.paymentMethods.filter((m) => m !== id)
      : [...form.paymentMethods, id];
    patch("paymentMethods", methods);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[26px] font-bold text-[#212529]">How will you accept payment?</h2>
        <p className="text-[16px] text-[#6C757D] mt-1">Select all that apply. You can update this anytime.</p>
      </div>

      <div className="space-y-3">
        {PAYMENT_OPTIONS.map(({ id, icon: Icon, title, body, comingSoon }) => {
          const selected = form.paymentMethods.includes(id);
          return (
            <div key={id}>
              <button
                type="button"
                disabled={comingSoon}
                onClick={() => !comingSoon && toggleMethod(id)}
                className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  selected
                    ? "border-brand-orange bg-[#FBF0EB]"
                    : comingSoon
                    ? "border-[#DEE2E6] opacity-60 cursor-not-allowed"
                    : "border-[#DEE2E6] hover:border-[#CED4DA]"
                }`}
              >
                {selected && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </span>
                )}
                {comingSoon && (
                  <span className="absolute top-3 right-3 text-[11px] bg-[#F1F3F5] text-[#6C757D] px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
                )}
                <div className="flex items-start gap-3">
                  <Icon size={20} className={selected ? "text-brand-orange" : "text-[#6C757D]"} />
                  <div>
                    <p className="text-[14px] font-semibold text-[#212529]">{title}</p>
                    <p className="text-[13px] text-[#6C757D] mt-0.5">{body}</p>
                  </div>
                </div>
              </button>

              {/* Bank Transfer expansion */}
              {id === "bank_transfer" && selected && (
                <div className="mt-2 ml-1 p-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl space-y-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Bank name</label>
                    <div className="relative">
                      <select className={inputCls + " appearance-none pr-10"} value={form.bankName} onChange={(e) => patch("bankName", e.target.value)}>
                        <option value="">Select bank</option>
                        {NIGERIAN_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Account number</label>
                    <input className={inputCls} type="tel" placeholder="0123456789" maxLength={10} value={form.accountNumber} onChange={(e) => patch("accountNumber", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">Account name</label>
                    <input className={inputCls} placeholder="TUNDE OKAFOR" value={form.accountName} onChange={(e) => patch("accountName", e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 6: WhatsApp Connection ────────────────────────────────────────────────

function Step6({ form, patch }: { form: OnboardingForm; patch: (k: keyof OnboardingForm, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[26px] font-bold text-[#212529]">Connect your WhatsApp</h2>
        <p className="text-[16px] text-[#6C757D] mt-1">Your AI needs a WhatsApp number to talk to your customers.</p>
      </div>

      <div className="space-y-2">
        {[
          { value: "existing", label: "I already have WhatsApp Business", desc: "Connect your existing WhatsApp Business number." },
          { value: "setup", label: "Help me set it up", desc: "Our team will reach out within 24 hours to help you." },
        ].map(({ value, label, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => patch("whatsappPath", value)}
            className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all ${
              form.whatsappPath === value ? "border-brand-orange bg-[#FBF0EB]" : "border-[#DEE2E6] hover:border-[#CED4DA]"
            }`}
          >
            {form.whatsappPath === value && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                <Check size={11} className="text-white" strokeWidth={3} />
              </span>
            )}
            <p className="text-[14px] font-semibold text-[#212529] pr-7">{label}</p>
            <p className="text-[13px] text-[#6C757D] mt-0.5">{desc}</p>
          </button>
        ))}
      </div>

      {form.whatsappPath === "existing" ? (
        <div>
          <label className="block text-[12px] font-semibold text-[#343A40] mb-1.5">
            Your WhatsApp Business number <span className="text-brand-orange">*</span>
          </label>
          <input
            className={inputCls}
            type="tel"
            placeholder="+234 800 000 0000"
            value={form.whatsappNumber}
            onChange={(e) => patch("whatsappNumber", e.target.value)}
          />
          <p className="text-[12px] text-[#6C757D] mt-1">
            This is the number customers will message. It should be a WhatsApp Business number.{" "}
            <a href="https://business.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="text-brand-orange">
              How to set up WhatsApp Business →
            </a>
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className={`w-2 h-2 rounded-full ${form.whatsappNumber ? "bg-[#16A34A]" : "bg-[#ADB5BD]"}`} />
            <span className={`text-[12px] ${form.whatsappNumber ? "text-[#16A34A]" : "text-[#ADB5BD]"}`}>
              {form.whatsappNumber ? "Connected ✓" : "Not yet connected"}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-4 py-3">
          <p className="text-[13px] text-[#1E40AF]">
            Our team will reach out within 24 hours to help you connect your WhatsApp Business account. You can continue and launch your store in the meantime.
          </p>
        </div>
      )}

      <div className="flex items-start gap-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl px-4 py-3">
        <Shield size={16} className="text-brand-orange shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#343A40]">
          Your customers will see <strong>your business name</strong> when your AI replies — not &quot;Merchat&quot;. Your brand stays front and centre.
        </p>
      </div>
    </div>
  );
}

// ── Step 7: Review & Go Live ───────────────────────────────────────────────────

function ReviewCard({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#DEE2E6] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-semibold text-brand-orange uppercase tracking-wide">{title}</span>
        <button type="button" onClick={onEdit} className="text-[13px] text-[#6C757D] hover:text-[#343A40] transition-colors">Edit</button>
      </div>
      {children}
    </div>
  );
}

function Step7({ form, onGoToStep }: { form: OnboardingForm; onGoToStep: (s: number) => void }) {
  const checks = [
    { label: "Business info complete", ok: !!(form.businessName && form.businessType && form.businessPhone) },
    { label: "At least 1 product added", ok: form.products.length > 0 },
    { label: "Payment method selected", ok: form.paymentMethods.length > 0 },
    { label: "Delivery area selected", ok: form.deliveryStates.length > 0 },
    { label: "WhatsApp connected", ok: !!(form.whatsappNumber), warn: true },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[26px] font-bold text-[#212529]">You&apos;re ready to launch! 🚀</h2>
        <p className="text-[16px] text-[#6C757D] mt-1">Review your setup before going live.</p>
      </div>

      <div className="space-y-3">
        <ReviewCard title="Business" onEdit={() => onGoToStep(1)}>
          <p className="text-[14px] text-[#343A40]"><strong>{form.businessName}</strong></p>
          <p className="text-[13px] text-[#6C757D] mt-0.5">{form.businessType} · {form.businessPhone}</p>
        </ReviewCard>

        <ReviewCard title="Store" onEdit={() => onGoToStep(2)}>
          <p className="text-[14px] text-[#343A40]"><strong>{form.storeName}</strong></p>
          <p className="text-[13px] text-brand-orange mt-0.5">merchat.io/store/{form.slug}</p>
          {form.tagline && <p className="text-[13px] text-[#6C757D] mt-0.5 italic">&ldquo;{form.tagline}&rdquo;</p>}
        </ReviewCard>

        <ReviewCard title="Products" onEdit={() => onGoToStep(3)}>
          <p className="text-[14px] text-[#343A40] font-medium">{form.products.length} product{form.products.length !== 1 ? "s" : ""} added</p>
          <ul className="mt-1 space-y-0.5">
            {form.products.slice(0, 3).map((p) => (
              <li key={p.id} className="text-[13px] text-[#6C757D]">• {p.name}</li>
            ))}
            {form.products.length > 3 && (
              <li className="text-[13px] text-[#6C757D]">• and {form.products.length - 3} more</li>
            )}
          </ul>
        </ReviewCard>

        <ReviewCard title="Delivery" onEdit={() => onGoToStep(4)}>
          <p className="text-[13px] text-[#343A40]">{form.deliveryStates.length} state{form.deliveryStates.length !== 1 ? "s" : ""} · {form.deliveryTime || "Not set"}</p>
        </ReviewCard>

        <ReviewCard title="Payment" onEdit={() => onGoToStep(5)}>
          <p className="text-[13px] text-[#343A40]">
            {form.paymentMethods.map((m) =>
              m === "bank_transfer" ? "Bank Transfer" : m === "pod" ? "Pay on Delivery" : m
            ).join(", ")}
          </p>
        </ReviewCard>

        <ReviewCard title="WhatsApp" onEdit={() => onGoToStep(6)}>
          <p className="text-[13px] text-[#343A40]">
            {form.whatsappPath === "setup"
              ? "Team will assist with setup"
              : form.whatsappNumber || "Not yet connected"}
          </p>
        </ReviewCard>
      </div>

      {/* Checklist */}
      <div className="bg-[#F8F9FA] rounded-2xl p-4 space-y-2">
        {checks.map(({ label, ok, warn }) => (
          <div key={label} className="flex items-center gap-2">
            {ok ? (
              <CheckCircle size={16} className="text-[#16A34A] shrink-0" />
            ) : warn ? (
              <AlertCircle size={16} className="text-[#D97706] shrink-0" />
            ) : (
              <X size={16} className="text-[#F44336] shrink-0" />
            )}
            <span className={`text-[13px] ${ok ? "text-[#343A40]" : warn ? "text-[#D97706]" : "text-[#F44336]"}`}>{label}</span>
            {!ok && warn && <span className="text-[12px] text-[#D97706]">(you can still launch)</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Saved screen ───────────────────────────────────────────────────────────────

function SavedScreen({ token, email, onBack }: { token: string; email: string; onBack: () => void }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  const resumeLink = origin ? `${origin}/onboarding/resume/${token}` : `/onboarding/resume/${token}`;
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col items-center text-center gap-5 py-4">
      <div className="w-16 h-16 rounded-full bg-[#FBF0EB] flex items-center justify-center animate-[pop_0.3s_ease-out]">
        <Bookmark size={32} className="text-brand-orange" />
      </div>
      <div>
        <h2 className="text-[24px] font-bold text-[#212529] mb-2">Progress saved!</h2>
        <p className="text-[15px] text-[#6C757D] leading-relaxed">
          You can continue setting up your store anytime using this link:
        </p>
      </div>
      <div className="w-full bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl px-4 py-3 flex items-center gap-2">
        <span className="text-[12px] font-mono text-[#343A40] flex-1 text-left break-all">{resumeLink || "Generating…"}</span>
        {resumeLink && (
          <button
            type="button"
            onClick={() => { navigator.clipboard.writeText(resumeLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="shrink-0 p-1.5 text-brand-orange hover:opacity-75 transition-opacity"
            aria-label="Copy link"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl px-4 py-3 w-full">
        <CheckCircle size={20} className="text-brand-orange shrink-0" />
        <p className="text-[13px] text-[#6C757D]">We&apos;ve also sent this link to <strong className="text-[#343A40]">{email}</strong></p>
      </div>
      <p className="text-[12px] text-[#ADB5BD]">This link expires in 7 days.</p>
      <button
        type="button"
        onClick={onBack}
        className="w-full h-11 rounded-full bg-brand-orange text-white text-[14px] font-semibold hover:bg-brand-orange-hover transition-colors"
      >
        Continue now
      </button>
      <Link href="/" className="text-[13px] text-[#6C757D] hover:text-[#343A40] transition-colors">
        Go to homepage
      </Link>
    </div>
  );
}

// ── Main wizard ────────────────────────────────────────────────────────────────

function OnboardingWizard() {
  const searchParams = useSearchParams();

  const [restored] = useState<{ step: number; form: Partial<OnboardingForm> } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem("onboarding_restore");
      if (!raw) return null;
      sessionStorage.removeItem("onboarding_restore");
      return JSON.parse(raw);
    } catch { return null; }
  });

  const [step, setStep] = useState(restored?.step ?? 1);
  const [form, setForm] = useState<OnboardingForm>(() =>
    restored ? { ...DEFAULT_FORM, ...(restored.form as OnboardingForm) } : { ...DEFAULT_FORM }
  );
  const [savingLater, setSavingLater] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedScreen, setSavedScreen] = useState<{ token: string; email: string } | null>(null);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  void searchParams;

  function patch(key: keyof OnboardingForm, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const canContinue = (() => {
    switch (step) {
      case 1: return !!(form.businessName && form.businessType && form.businessDescription && form.businessPhone);
      case 2: return !!(form.storeName && form.slug && form.slug.length >= 3);
      case 3: return form.products.length > 0;
      case 4: return true; // delivery is optional
      case 5: return form.paymentMethods.length > 0;
      case 6: return form.whatsappPath === "setup" || !!form.whatsappNumber;
      case 7: return !!(form.businessName && form.products.length > 0 && form.paymentMethods.length > 0);
      default: return true;
    }
  })();

  async function saveProgress(goToStep?: number) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (step === 1) {
      await supabase.from("merchants").update({
        business_name: form.businessName,
        phone: form.businessPhone,
        category: form.businessType,
        description: form.businessDescription,
      }).eq("id", user.id);
    } else if (step === 2) {
      await supabase.from("merchants").update({
        display_name: form.storeName,
        slug: form.slug,
        tagline: form.tagline,
        brand_colour: form.accentColour,
      }).eq("id", user.id);
    } else if (step === 3) {
      const valid = form.products.filter((p) => p.name && parseFloat(p.price) > 0);
      if (valid.length > 0) {
        await supabase.from("products").insert(
          valid.map((p) => ({
            merchant_id: user.id,
            name: p.name,
            price: parseFloat(p.price),
            compare_at_price: p.compareAtPrice ? parseFloat(p.compareAtPrice) : null,
            description: p.description,
            image_urls: p.imageUrls ? p.imageUrls.split(",").map((u: string) => u.trim()).filter(Boolean) : [],
            stock_quantity: parseInt(p.stockQuantity) || 1,
            is_in_stock: true,
            is_active: true,
            pod_enabled: p.podEnabled,
            category: p.category,
          }))
        );
      }
    }

    if (goToStep !== undefined) setStep(goToStep);
  }

  async function next() {
    if (!canContinue) return;
    if (step === 7) {
      setLaunching(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("merchants").update({
            status: "active",
            whatsapp_phone: form.whatsappNumber || null,
            pod_enabled: form.paymentMethods.includes("pod"),
            delivery_areas: form.deliveryStates,
          }).eq("id", user.id);
        }
      } catch (err) {
        console.error("Launch failed:", err);
      } finally {
        setLaunching(false);
      }
      setLaunched(true);
      setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
      return;
    }

    try { await saveProgress(); } catch (err) { console.error(err); }
    setStep((s) => s + 1);
  }

  async function handleSaveLater() {
    setSavingLater(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email ?? "";
      if (!email) { setSaveError("Could not determine your email. Please log in."); return; }
      const token = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
      const formToSave = { ...form, logoPreview: null };
      const { error } = await supabase.from("onboarding_sessions").insert({
        token, email, step, form_data: formToSave,
      });
      if (error) throw error;
      setSavedScreen({ token, email });
    } catch (err) {
      console.error(err);
      setSaveError("Something went wrong. Please try again.");
    } finally {
      setSavingLater(false);
    }
  }

  const progress = ((step - 1) / 6) * 100;

  if (launched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-[28px] font-bold text-[#212529] mb-2">Your store is live!</h1>
          <p className="text-[16px] text-[#6C757D]">Taking you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left sidebar — desktop only */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-[#F8F9FA] border-r border-[#DEE2E6] shrink-0">
        <div className="px-8 pt-8 pb-6">
          <Link href="/">
            <Image src="/images/logo-dark.svg" alt="Merchat.io" width={140} height={23} unoptimized style={{ width: 140, height: "auto" }} />
          </Link>
        </div>
        <nav className="flex-1 px-6 pb-8 overflow-y-auto">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const completed = n < step;
            const current = n === step;
            return (
              <div key={n} className="flex items-start gap-3 mb-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold transition-colors ${
                      completed ? "bg-brand-orange" :
                      current ? "bg-[#182E47]" :
                      "bg-[#DEE2E6]"
                    }`}
                  >
                    {completed ? (
                      <Check size={12} className="text-white" strokeWidth={3} />
                    ) : (
                      <span className={current ? "text-white" : "text-[#ADB5BD]"}>{n}</span>
                    )}
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`w-px flex-1 min-h-[20px] my-1 ${completed ? "bg-brand-orange" : "bg-[#DEE2E6]"}`} />
                  )}
                </div>
                <span className={`pt-0.5 text-[13px] transition-colors pb-4 ${
                  current ? "font-semibold text-[#212529]" :
                  completed ? "text-[#6C757D]" :
                  "text-[#ADB5BD]"
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Right content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Mobile progress bar */}
        <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-[#DEE2E6]">
          <div className="h-1 bg-[#DEE2E6]">
            <div className="h-full bg-brand-orange transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="px-4 py-2 flex items-center justify-between">
            <p className="text-[12px] text-[#6C757D]">Step {step} of 7 — {STEP_LABELS[step - 1]}</p>
            {step < 7 && (
              <button
                type="button"
                onClick={handleSaveLater}
                disabled={savingLater}
                className="text-[12px] text-[#6C757D] disabled:opacity-40"
              >
                {savingLater ? "Saving…" : "Save & continue later"}
              </button>
            )}
          </div>
        </div>

        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-end px-10 pt-8 pb-0">
          {step < 7 && (
            <button
              type="button"
              onClick={handleSaveLater}
              disabled={savingLater}
              className="flex items-center gap-1.5 text-[14px] text-[#6C757D] hover:text-[#343A40] transition-colors disabled:opacity-40"
            >
              {savingLater && <Loader2 size={14} className="animate-spin" />}
              Save &amp; continue later
            </button>
          )}
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-start lg:justify-center px-6 py-8 lg:px-10">
          <div className="w-full max-w-[560px]">
            {savedScreen ? (
              <SavedScreen token={savedScreen.token} email={savedScreen.email} onBack={() => setSavedScreen(null)} />
            ) : (
              <>
                {step === 1 && <Step1 form={form} patch={patch} />}
                {step === 2 && <Step2 form={form} patch={patch} />}
                {step === 3 && <Step3 form={form} patch={patch} />}
                {step === 4 && <Step4 form={form} patch={patch} />}
                {step === 5 && <Step5 form={form} patch={patch} />}
                {step === 6 && <Step6 form={form} patch={patch} />}
                {step === 7 && <Step7 form={form} onGoToStep={setStep} />}

                {saveError && (
                  <div className="flex items-start gap-2 mt-6 px-4 py-3 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[13px] text-[#F44336]">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{saveError}</span>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#DEE2E6] gap-3">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="px-5 h-11 rounded-full border border-[#DEE2E6] text-[#343A40] text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step === 3 && form.products.length === 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s + 1)}
                      className="text-[13px] text-[#ADB5BD] hover:text-[#6C757D] transition-colors mr-auto ml-3"
                    >
                      Skip for now
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={next}
                    disabled={!canContinue || launching}
                    className={`h-[60px] px-8 rounded-full text-white text-[15px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                      step === 7
                        ? "bg-brand-orange hover:bg-brand-orange-hover shadow-[0_0_20px_rgba(213,101,43,0.4)] min-w-[200px] justify-center"
                        : "bg-brand-orange hover:bg-brand-orange-hover"
                    }`}
                  >
                    {launching && <Loader2 size={16} className="animate-spin" />}
                    {step === 7 ? "Launch My Store 🚀" : step === 6 ? "Review & Go Live →" : "Save & Continue →"}
                  </button>
                </div>
              </>
            )}
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
