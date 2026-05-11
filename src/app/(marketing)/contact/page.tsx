"use client";

import { useState } from "react";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";

const subjects = [
  "General enquiry",
  "Technical support",
  "Billing or subscription",
  "Partnership or integration",
  "Press or media",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="pt-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 lg:py-20">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <span className="inline-block bg-white/10 text-white/80 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6">
            Contact
          </span>
          <h1 className="text-[32px] lg:text-[48px] font-extrabold text-white leading-tight mb-4">
            Get in touch
          </h1>
          <p className="text-[18px] text-white/70 leading-relaxed">
            Questions, support, press, or just want to say hello — we read every message.
          </p>
        </div>
      </section>

      {/* ── Two-col layout ────────────────────────────────────────────────── */}
      <section className="bg-[#F9FAFB] py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

            {/* Left — contact details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-[20px] font-bold text-brand-navy mb-5">Contact details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F4EDE8] flex items-center justify-center shrink-0">
                      <Mail size={17} className="text-brand-orange" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[13px] text-[#9CA3AF] mb-0.5">General enquiries</p>
                      <a href="mailto:hello@merchat.io" className="text-[15px] font-semibold text-brand-navy hover:text-brand-orange transition-colors">
                        hello@merchat.io
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F4EDE8] flex items-center justify-center shrink-0">
                      <Mail size={17} className="text-brand-orange" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[13px] text-[#9CA3AF] mb-0.5">Support</p>
                      <a href="mailto:support@merchat.io" className="text-[15px] font-semibold text-brand-navy hover:text-brand-orange transition-colors">
                        support@merchat.io
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F4EDE8] flex items-center justify-center shrink-0">
                      <MapPin size={17} className="text-brand-orange" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[13px] text-[#9CA3AF] mb-0.5">Headquarters</p>
                      <p className="text-[15px] font-semibold text-brand-navy">Lagos, Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] pt-8">
                <h3 className="text-[15px] font-bold text-brand-navy mb-3">Response times</h3>
                <div className="space-y-2 text-[14px] text-[#6B7280]">
                  <p>Growth plan merchants: within 4 hours on business days</p>
                  <p>Starter plan merchants: within 24 hours on business days</p>
                  <p>General enquiries: within 48 hours</p>
                </div>
              </div>

              <div className="bg-[#F4EDE8] rounded-xl p-5">
                <p className="text-[14px] text-[#6B7280] leading-relaxed">
                  <span className="font-semibold text-brand-navy">Already a merchant?</span> For fastest support, use the live chat inside your dashboard or WhatsApp us directly from the settings page.
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
                {submitted ? (
                  <div className="flex flex-col items-center text-center py-10 gap-5">
                    <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-[#16A34A]" strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-[22px] font-bold text-brand-navy mb-2">Message received.</h2>
                      <p className="text-[16px] text-[#6B7280] leading-relaxed max-w-sm mx-auto">
                        We&apos;ll get back to you at <span className="font-semibold text-brand-navy">{form.email}</span> as soon as possible.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">Full name</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Tunde Bakare"
                          className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">Email address</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="tunde@example.com"
                          className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">Subject</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy transition-colors"
                      >
                        <option value="" disabled>Select a subject</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[14px] font-semibold text-brand-navy mb-1.5">Message</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us what's on your mind…"
                        className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-brand-orange text-white font-semibold text-[16px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all"
                    >
                      Send message →
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
