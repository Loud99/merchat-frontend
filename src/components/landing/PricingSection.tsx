import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: null,
    priceLabel: "₦0",
    subtitle: "Start selling on WhatsApp today",
    features: [
      "Up to 50 orders / month",
      "Product catalogue",
      "Basic AI replies",
      "Merchat storefront link",
    ],
    cta: "Start for free",
    ctaHref: "/onboarding",
    highlight: false,
    popular: false,
    dark: false,
  },
  {
    name: "Starter",
    price: "₦15,000",
    priceLabel: null,
    subtitle: "For merchants ready to scale",
    features: [
      "Unlimited orders",
      "Full AI agent",
      "Order tracking",
      "Payment links",
      "Analytics dashboard",
    ],
    cta: "Get started",
    ctaHref: "/onboarding",
    highlight: true,
    popular: true,
    dark: false,
  },
  {
    name: "Pro",
    price: "₦35,000",
    priceLabel: null,
    subtitle: "For serious businesses",
    features: [
      "Everything in Starter",
      "Multi-agent support",
      "Custom AI training",
      "Priority support",
      "Advanced analytics",
      "Custom storefront branding",
    ],
    cta: "Go Pro",
    ctaHref: "/onboarding",
    highlight: false,
    popular: false,
    dark: true,
  },
  {
    name: "Custom",
    price: null,
    priceLabel: "Let's talk",
    subtitle: "Built around your business",
    features: [
      "Dedicated onboarding team",
      "Custom AI — your catalogue & tone",
      "SLA-backed support",
      "Logistics integrations",
      "API access",
      "White-label options",
    ],
    cta: "Book a demo",
    ctaHref: "/book-demo",
    highlight: false,
    popular: false,
    dark: false,
  },
];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl p-6 overflow-hidden transition-transform duration-200 hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-white border-2 border-brand-orange shadow-[0_4px_24px_rgba(213,101,43,0.15)]"
                  : plan.dark
                  ? "bg-brand-navy border border-brand-navy shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                  : "bg-white border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
              }`}
            >
              {/* Highlight stripe */}
              {plan.highlight && (
                <div className="absolute top-0 inset-x-0 h-1 bg-brand-orange" />
              )}

              {/* Header */}
              <div className="mb-5 mt-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[12px] font-semibold uppercase tracking-widest ${
                      plan.dark ? "text-white/60" : "text-[#6B7280]"
                    }`}
                  >
                    {plan.name}
                  </span>
                  {plan.popular && (
                    <span className="shrink-0 bg-brand-orange text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>

                {plan.price ? (
                  <div className="flex items-baseline gap-1 mb-1">
                    <span
                      className={`text-[34px] font-extrabold leading-none ${
                        plan.dark ? "text-white" : "text-brand-navy"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className={`text-[15px] font-semibold ${plan.dark ? "text-white/60" : "text-[#6B7280]"}`}>
                      /mo
                    </span>
                  </div>
                ) : (
                  <div
                    className={`text-[34px] font-extrabold leading-none mb-1 ${
                      plan.dark ? "text-white" : "text-brand-navy"
                    }`}
                  >
                    {plan.priceLabel}
                  </div>
                )}

                <p className={`text-[13px] leading-snug ${plan.dark ? "text-white/60" : "text-[#6B7280]"}`}>
                  {plan.subtitle}
                </p>
              </div>

              {/* Feature list */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px]">
                    <Check
                      size={15}
                      strokeWidth={2.5}
                      className={`mt-0.5 shrink-0 ${
                        plan.dark ? "text-brand-orange" : "text-brand-orange"
                      }`}
                    />
                    <span className={plan.dark ? "text-white/80" : "text-[#374151]"}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`block w-full text-center font-semibold text-[14px] px-5 py-3 rounded-lg transition-all active:scale-[0.98] ${
                  plan.highlight
                    ? "bg-brand-orange text-white hover:bg-[#B54E20]"
                    : plan.dark
                    ? "bg-white text-brand-navy hover:bg-[#F4EDE8]"
                    : "border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-[13px] text-[#6B7280] mt-6">
          WhatsApp messaging costs (set by Meta) are passed through at cost. No Merchat markup.
        </p>
      </div>
    </section>
  );
}
