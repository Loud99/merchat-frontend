"use client";

import { useState } from "react";
import { CheckCircle2, Calendar } from "lucide-react";

const businessCategories = [
  "Fashion & Clothing",
  "Food & Beverages",
  "Beauty & Cosmetics",
  "Electronics & Gadgets",
  "Home & Furniture",
  "Health & Wellness",
  "Agriculture & Produce",
  "Artisan & Crafts",
  "Books & Stationery",
  "Other",
];

const productRanges = [
  "1–10 products",
  "11–50 products",
  "51–200 products",
  "200+ products",
];

export default function DemoPage() {
  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    phone: "",
    email: "",
    category: "",
    productRange: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="pt-16 bg-[#F4EDE8] min-h-screen">
      <div className="max-w-[640px] mx-auto px-6 py-16 lg:py-24">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-brand-orange text-[13px] font-semibold px-4 py-1.5 rounded-full mb-5">
            <Calendar size={14} strokeWidth={2} />
            Book a personalised demo
          </div>
          <h1 className="text-[32px] lg:text-[40px] font-extrabold text-brand-navy leading-tight mb-4">
            See Merchat in action — live.
          </h1>
          <p className="text-[17px] text-[#6B7280] leading-relaxed">
            In 30 minutes, we&apos;ll show you exactly how Merchat handles your WhatsApp orders, answers customer questions, and helps you sell more — live, with your products.
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
                <h2 className="text-[22px] font-bold text-brand-navy mb-2">You&apos;re booked in.</h2>
                <p className="text-[16px] text-[#6B7280] leading-relaxed max-w-sm mx-auto">
                  We&apos;ll be in touch within 24 hours to confirm your demo time.
                </p>
              </div>
              <p className="text-[13px] text-[#9CA3AF]">
                Questions in the meantime? Email <a href="mailto:hello@merchat.io" className="text-brand-orange hover:underline">hello@merchat.io</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full name */}
              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">Full name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Chioma Obi"
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors"
                />
              </div>

              {/* Business name */}
              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">Business name</label>
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

              {/* Phone */}
              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+234 801 234 5678"
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="chioma@example.com"
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors"
                />
              </div>

              {/* Business category */}
              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">Business category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy transition-colors"
                >
                  <option value="" disabled>Select a category</option>
                  {businessCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Product count */}
              <div>
                <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">How many products do you sell?</label>
                <select
                  name="productRange"
                  value={form.productRange}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy transition-colors"
                >
                  <option value="" disabled>Select a range</option>
                  {productRanges.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-brand-orange text-white font-semibold text-[16px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all mt-2"
              >
                Book my demo →
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
