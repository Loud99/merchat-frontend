"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do my customers need to download anything?",
    a: "No. Everything happens inside WhatsApp, which your customers already have. No app downloads, no account creation, no friction.",
  },
  {
    q: "Will my customers see 'Merchat' instead of my business name?",
    a: "No. Your dedicated WhatsApp number is registered under your own business name. Customers see your brand, not ours.",
  },
  {
    q: "What happens to my existing customers when I join?",
    a: "We provide a ready-made redirect message for your WhatsApp status and broadcast list. Most merchants migrate their active customer base in 24–48 hours.",
  },
  {
    q: "Do I need technical knowledge to set up?",
    a: "No. Setup takes under 10 minutes and requires no technical knowledge. If you can use WhatsApp, you can use Merchat.",
  },
  {
    q: "How does the AI know about my products?",
    a: "You upload your products during setup (photos from your gallery or manual entry). The AI reads your live inventory for every customer conversation.",
  },
  {
    q: "What if the AI gets something wrong?",
    a: "The AI hands conversations to you when it's uncertain. You get a notification, take over in your dashboard, and hand back to the AI when done. You're always in control.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="border-t border-[#E5E7EB]">
      {faqs.map((item, i) => (
        <div key={i} className="border-b border-[#E5E7EB]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-6 group"
          >
            <span className="text-[16px] font-semibold text-brand-navy">{item.q}</span>
            <ChevronDown
              size={20}
              strokeWidth={1.5}
              className={`shrink-0 text-brand-navy transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              open === i ? "max-h-48 pb-5" : "max-h-0"
            }`}
          >
            <p className="text-[15px] text-[#6B7280] leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
