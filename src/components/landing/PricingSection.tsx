import Link from "next/link";
import { Check } from "lucide-react";

const starterFeatures = [
  "Up to 50 products",
  "AI agent included",
  "1 WhatsApp number",
  "Order Confirmation Flow",
  "Basic analytics",
  "Community support",
];

const growthFeatures = [
  "Unlimited products",
  "Everything in Starter",
  "Abandoned Cart Recovery",
  "Post-Delivery Reviews",
  "Full analytics dashboard",
  "Priority support via WhatsApp",
  "Custom storefront URL",
];

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 mb-8">
      {items.map((f) => (
        <li key={f} className="flex items-center gap-3 text-[15px] text-[#374151]">
          <Check size={16} className="text-brand-orange shrink-0" strokeWidth={2.5} />
          {f}
        </li>
      ))}
    </ul>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-brand-warm py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-brand-navy mb-3">
            Simple, honest pricing.
          </h2>
          <p className="text-[18px] text-[#6B7280]">Start free. Pay as your business grows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Starter */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="mb-6">
              <div className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-widest mb-2">Starter</div>
              <div className="text-[40px] font-extrabold text-brand-navy leading-none mb-1">Free</div>
              <div className="text-[14px] text-[#6B7280]">Perfect to get started</div>
            </div>
            <FeatureList items={starterFeatures} />
            <Link
              href="/onboarding"
              className="block w-full text-center border-2 border-brand-navy text-brand-navy font-semibold text-[15px] px-7 py-[14px] rounded-lg hover:bg-brand-navy hover:text-white transition-all"
            >
              Get started free
            </Link>
          </div>

          {/* Growth */}
          <div className="relative bg-white rounded-xl border-2 border-brand-orange p-8 shadow-[0_4px_16px_rgba(0,0,0,0.10)] overflow-hidden hover:-translate-y-1 transition-transform duration-200">
            <div className="absolute top-0 inset-x-0 h-1 bg-brand-orange" />
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-widest mb-2">Growth</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[40px] font-extrabold text-brand-navy leading-none">₦15,000</span>
                  <span className="text-[18px] font-semibold text-[#6B7280]">/mo</span>
                </div>
                <div className="text-[13px] text-[#6B7280] mb-1">or $10/mo</div>
                <div className="text-[14px] text-[#6B7280]">For merchants with real volume</div>
              </div>
              <span className="shrink-0 bg-brand-orange text-white text-[11px] font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
            <FeatureList items={growthFeatures} />
            <Link
              href="/onboarding"
              className="block w-full text-center bg-brand-orange text-white font-semibold text-[15px] px-7 py-[14px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all"
            >
              Start 14-day free trial
            </Link>
          </div>
        </div>

        <p className="text-center text-[13px] text-[#6B7280] mt-6">
          WhatsApp messaging costs (set by Meta) are passed through at cost. No Merchat markup.
        </p>
      </div>
    </section>
  );
}
