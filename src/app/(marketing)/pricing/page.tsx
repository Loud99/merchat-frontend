import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "",
    description: "Start selling on WhatsApp today",
    cta: "Start for free",
    ctaHref: "/onboarding",
    highlight: false,
    popular: false,
    dark: false,
    features: [
      "Up to 50 orders / month",
      "Product catalogue",
      "Basic AI replies",
      "Merchat storefront link",
    ],
  },
  {
    name: "Starter",
    price: "₦15,000",
    period: "/ month",
    description: "For merchants ready to scale",
    cta: "Get started",
    ctaHref: "/onboarding",
    highlight: true,
    popular: true,
    dark: false,
    features: [
      "Unlimited orders",
      "Full AI agent",
      "Order tracking",
      "Payment links",
      "Analytics dashboard",
    ],
  },
  {
    name: "Pro",
    price: "₦35,000",
    period: "/ month",
    description: "For serious businesses",
    cta: "Go Pro",
    ctaHref: "/onboarding",
    highlight: false,
    popular: false,
    dark: true,
    features: [
      "Everything in Starter",
      "Multi-agent support",
      "Custom AI training",
      "Priority support",
      "Advanced analytics",
      "Custom storefront branding",
    ],
  },
  {
    name: "Custom",
    price: "Let's talk",
    period: "",
    description: "Built around your business",
    cta: "Book a demo",
    ctaHref: "/book-demo",
    highlight: false,
    popular: false,
    dark: false,
    features: [
      "Dedicated onboarding team",
      "Custom AI — your catalogue & tone",
      "SLA-backed support",
      "Logistics integrations",
      "API access",
      "White-label options",
    ],
  },
];

const tableRows: {
  feature: string;
  free: boolean | string;
  starter: boolean | string;
  pro: boolean | string;
  custom: boolean | string;
}[] = [
  { feature: "Orders / month",          free: "50",          starter: "Unlimited",      pro: "Unlimited",      custom: "Unlimited"      },
  { feature: "Product catalogue",        free: true,          starter: true,             pro: true,             custom: true             },
  { feature: "AI replies",               free: "Basic",       starter: "Full agent",     pro: "Custom trained", custom: "Custom trained" },
  { feature: "Storefront link",          free: true,          starter: true,             pro: true,             custom: true             },
  { feature: "Order tracking",           free: false,         starter: true,             pro: true,             custom: true             },
  { feature: "Payment links",            free: false,         starter: true,             pro: true,             custom: true             },
  { feature: "Analytics",               free: false,         starter: true,             pro: "Advanced",       custom: "Advanced"       },
  { feature: "Custom storefront",        free: false,         starter: false,            pro: true,             custom: true             },
  { feature: "Multi-agent support",      free: false,         starter: false,            pro: true,             custom: true             },
  { feature: "Custom AI training",       free: false,         starter: false,            pro: true,             custom: true             },
  { feature: "Support",                  free: "Email",       starter: "Email",          pro: "Priority",       custom: "SLA-backed"     },
  { feature: "Onboarding",               free: "Self-serve",  starter: "Self-serve",     pro: "Self-serve",     custom: "Dedicated team" },
  { feature: "Logistics integrations",   free: false,         starter: false,            pro: false,            custom: true             },
  { feature: "API access",               free: false,         starter: false,            pro: false,            custom: true             },
  { feature: "White-label",              free: false,         starter: false,            pro: false,            custom: true             },
];

const faqs = [
  {
    q: "Can I change plans?",
    a: "Yes. You can upgrade at any time — your AI, products, and order history carry over instantly. Downgrading is available at the end of your billing cycle.",
  },
  {
    q: "Is the Free plan really free?",
    a: "Yes, permanently. No credit card needed. You get up to 50 orders a month with basic AI replies and a storefront link — enough to see Merchat working for your business.",
  },
  {
    q: "Are Meta messaging fees included?",
    a: "No. Meta charges separate fees for WhatsApp Business API conversations. These are billed directly by Meta and depend on your usage volume and conversation type. Merchat does not mark these up.",
  },
  {
    q: "What is Custom pricing based on?",
    a: "Custom is priced around your order volume, number of WhatsApp numbers, integrations needed, and support SLA. Book a demo and we'll put together a quote within 24 hours.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Merchat subscriptions are billed in Naira via Paystack. You can pay with any Nigerian debit card, bank transfer, or USSD.",
  },
];

function CellValue({ val }: { val: boolean | string }) {
  if (val === true)  return <span className="text-[#16A34A] font-bold text-[16px]">✓</span>;
  if (val === false) return <span className="text-[#D1D5DB] text-[16px]">—</span>;
  return <span className="text-[13px] text-[#6B7280]">{val}</span>;
}

export default function PricingPage() {
  return (
    <main className="pt-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="inline-block bg-white/10 text-white/80 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6">
            Pricing
          </span>
          <h1 className="text-[32px] lg:text-[52px] font-extrabold text-white leading-tight mb-5">
            Simple pricing.<br className="hidden lg:block" /> No surprises.
          </h1>
          <p className="text-[18px] text-white/70 max-w-xl mx-auto leading-relaxed">
            Start free. Upgrade when your business is ready. No credit card needed to begin.
          </p>
        </div>
      </section>

      {/* ── Plan cards ────────────────────────────────────────────────────── */}
      <section className="bg-[#F9FAFB] py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-7 overflow-hidden transition-transform duration-200 hover:-translate-y-1 ${
                  plan.highlight
                    ? "bg-brand-navy border-brand-navy shadow-[0_8px_32px_rgba(24,46,71,0.18)]"
                    : plan.dark
                    ? "bg-brand-navy border-brand-navy shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                    : "bg-white border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-brand-orange" />
                )}

                <div className="flex items-start justify-between gap-2 mb-3 mt-1">
                  <span className={`text-[12px] font-semibold uppercase tracking-widest ${
                    plan.highlight || plan.dark ? "text-white/60" : "text-[#6B7280]"
                  }`}>
                    {plan.name}
                  </span>
                  {plan.popular && (
                    <span className="shrink-0 bg-brand-orange text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-[34px] font-extrabold leading-none ${
                    plan.highlight || plan.dark ? "text-white" : "text-brand-navy"
                  }`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-[14px] font-medium ${
                      plan.highlight || plan.dark ? "text-white/50" : "text-[#9CA3AF]"
                    }`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className={`text-[13px] mb-6 leading-snug ${
                  plan.highlight || plan.dark ? "text-white/60" : "text-[#6B7280]"
                }`}>
                  {plan.description}
                </p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        size={15}
                        strokeWidth={2.5}
                        className="shrink-0 mt-0.5 text-brand-orange"
                      />
                      <span className={`text-[13px] ${
                        plan.highlight || plan.dark ? "text-white/80" : "text-[#374151]"
                      }`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

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
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[24px] lg:text-[30px] font-bold text-brand-navy text-center mb-10">
            Plan comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-[#E5E7EB]">
                  <th className="pb-4 text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-[30%]">
                    Feature
                  </th>
                  <th className="pb-4 text-[14px] font-bold text-brand-navy text-center">Free</th>
                  <th className="pb-4 text-[14px] font-bold text-brand-orange text-center">Starter</th>
                  <th className="pb-4 text-[14px] font-bold text-brand-navy text-center">Pro</th>
                  <th className="pb-4 text-[14px] font-bold text-[#6B7280] text-center">Custom</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map(({ feature, free, starter, pro, custom }, i) => (
                  <tr
                    key={feature}
                    className={`border-b border-[#F3F4F6] ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}
                  >
                    <td className="py-3.5 pr-4 text-[14px] text-[#374151]">{feature}</td>
                    <td className="py-3.5 text-center"><CellValue val={free} /></td>
                    <td className="py-3.5 text-center bg-orange-50/40"><CellValue val={starter} /></td>
                    <td className="py-3.5 text-center"><CellValue val={pro} /></td>
                    <td className="py-3.5 text-center"><CellValue val={custom} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#F9FAFB] py-16 lg:py-20">
        <div className="max-w-[720px] mx-auto px-6">
          <h2 className="text-[24px] lg:text-[30px] font-bold text-brand-navy text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <h3 className="text-[16px] font-bold text-brand-navy mb-2">{q}</h3>
                <p className="text-[15px] text-[#6B7280] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#F4EDE8] py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-[28px] lg:text-[36px] font-bold text-brand-navy mb-4">
            Ready to start selling smarter?
          </h2>
          <p className="text-[17px] text-[#6B7280] mb-8 max-w-xl mx-auto">
            Start with Free — no card needed. Upgrade when your volume grows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="bg-brand-orange text-white font-semibold text-[16px] px-8 py-[14px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all"
            >
              Start for free →
            </Link>
            <Link
              href="/book-demo"
              className="bg-white text-brand-navy font-semibold text-[16px] px-8 py-[14px] rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
