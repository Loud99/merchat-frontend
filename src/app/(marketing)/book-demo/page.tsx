"use client";

import { useState } from "react";
import { CheckCircle2, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const BUSINESS_TYPES = [
  "Fashion & Clothing",
  "Food & Beverages",
  "Electronics & Gadgets",
  "Beauty & Health",
  "Home & Living",
  "Agriculture & Produce",
  "General Merchandise",
  "Other",
];

export default function BookDemoPage() {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    whatsapp: "",
    businessType: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: dbErr } = await supabase.from("demo_requests").insert({
      full_name: form.name,
      business_name: form.businessName,
      whatsapp_number: form.whatsapp,
      business_type: form.businessType,
      message: form.message || null,
    });

    setSubmitting(false);

    if (dbErr) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="pt-16 bg-[#F4EDE8] min-h-screen">
      <div className="max-w-[560px] mx-auto px-6 py-16 lg:py-24">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-brand-orange text-[13px] font-semibold px-4 py-1.5 rounded-full mb-5">
            <Calendar size={14} strokeWidth={2} />
            Book a demo
          </div>
          <h1 className="text-[32px] lg:text-[40px] font-extrabold text-brand-navy leading-tight mb-4">
            See Merchat in action.
          </h1>
          <p className="text-[17px] text-[#6B7280] leading-relaxed">
            Leave your details and we&apos;ll reach out within 24 hours to schedule a personalised walkthrough.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-8 lg:p-10">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-8 gap-5">
              <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <CheckCircle2 size={32} className="text-[#16A34A]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[22px] font-bold text-brand-navy mb-2">
                  Thanks {form.name.split(" ")[0]}! We&apos;ll be in touch.
                </h2>
                <p className="text-[16px] text-[#6B7280] leading-relaxed max-w-sm mx-auto">
                  We&apos;ll reach out on WhatsApp within 24 hours to schedule your demo.
                </p>
              </div>
              <p className="text-[13px] text-[#9CA3AF]">
                Questions in the meantime? Email{" "}
                <a href="mailto:hello@merchat.io" className="text-brand-orange hover:underline">
                  hello@merchat.io
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Chioma Obi"
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">
                  Business name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  required
                  placeholder="Chioma's Closet"
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">
                  WhatsApp number
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  required
                  placeholder="+234 801 234 5678"
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">
                  Business type
                </label>
                <select
                  name="businessType"
                  value={form.businessType}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy focus:outline-none focus:border-brand-navy transition-colors appearance-none bg-white"
                >
                  <option value="">Select your business type</option>
                  {BUSINESS_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">
                  Message <span className="text-[#9CA3AF] font-normal">(optional)</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us a bit about your business or what you'd like to see in the demo…"
                  className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-[13px] text-[#EF4444]">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-brand-orange text-white font-semibold text-[16px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all mt-2 disabled:opacity-50"
              >
                {submitting ? "Booking…" : "Book my demo →"}
              </button>

              <p className="text-center text-[13px] text-[#9CA3AF]">
                No obligation. We&apos;ll pick a time that works for you.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
