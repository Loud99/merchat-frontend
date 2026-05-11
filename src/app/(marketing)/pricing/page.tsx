import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For merchants just getting started on WhatsApp.",
    cta: "Start for free",
    ctaHref: "/onboarding",
    highlight: false,
    features: [
      "AI sales agent (up to 500 messages/mo)",
      "Up to 20 products",
      "Order Confirmation Flow",
      "Basic order management",
      "Payment link delivery (Paystack or Flutterwave)",
      "Public storefront page",
      "WhatsApp deep link",
      "7-day conversation history",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "₦25,000",
    period: "/ month",
    description: "For merchants ready to scale WhatsApp sales seriously.",
    cta: "Start Growth plan",
    ctaHref: "/onboarding",
    highlight: true,
    features: [
      "AI sales agent (unlimited messages)",
      "Unlimited products",
      "All WhatsApp Flows (Order, Abandoned Cart, Review)",
      "Full Kanban order board",
      "Full conversation inbox with AI handover",
      "Analytics dashboard (revenue, AOV, conversion rate)",
      "Real-time notifications (orders, payments, escalations)",
      "Customer profiles and order history",
      "Naira + USD pricing",
      "90-day conversation history",
      "Priority support",
    ],
  },
];

const tableRows = [
  { feature: "AI sales agent", starter: "500 msg/mo", growth: "Unlimited" },
  { feature: "Products", starter: "Up to 20", growth: "Unlimited" },
  { feature: "Order Confirmation Flow", starter: true, growth: true },
  { feature: "Abandoned Cart Recovery", starter: false, growth: true },
  { feature: "Post-Delivery Review Request", starter: false, growth: true },
  { feature: "Payment link delivery", starter: true, growth: true },
  { feature: "Kanban order board", starter: false, growth: true },
  { feature: "Conversation inbox", starter: false, growth: true },
  { feature: "Analytics dashboard", starter: false, growth: true },
  { feature: "Real-time notifications", starter: false, growth: true },
  { feature: "Customer profiles", starter: false, growth: true },
  { feature: "Public storefront page", starter: true, growth: true },
  { feature: "Naira + USD pricing", starter: false, growth: true },
  { feature: "Conversation history", starter: "7 days", growth: "90 days" },
  { feature: "Support", starter: "Email", growth: "Priority" },
];

const faqs = [
  {
    q: "Can I change plans?",
    a: "Yes. You can upgrade from Starter to Growth at any time — your AI, products, and order history carry over instantly. Downgrading is available at the end of your billing cycle.",
  },
  {
    q: "What counts as a message?",
    a: "A message is any single WhatsApp message sent by your AI agent to a customer. Inbound customer messages and messages you send manually from the dashboard do not count toward your limit.",
  },
  {
    q: "Are Meta messaging fees included?",
    a: "No. Meta charges separate fees for WhatsApp Business API conversations. These are billed directly by Meta and depend on your usage volume and conversation type. Merchat does not mark these up.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Merchat subscriptions are billed in Naira via Paystack. You can pay with any Nigerian debit card, bank transfer, or USSD. We do not currently support USD billing.",
  },
];

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <span className="text-[#16A34A] font-bold">✓</span>;
  if (val === false) return <span className="text-[#D1D5DB]">—</span>;
  return <span className="text-[14px] text-[#6B7280]">{val}</span>;
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
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? "bg-brand-navy border-brand-navy shadow-[0_8px_32px_rgba(24,46,71,0.18)]"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                {plan.highlight && (
                  <span className="self-start text-[12px] font-bold uppercase tracking-widest bg-brand-orange text-white px-3 py-1 rounded-full mb-4">
                    Most popular
                  </span>
                )}
                <h2 className={`text-[20px] font-bold mb-1 ${plan.highlight ? "text-white" : "text-brand-navy"}`}>
                  {plan.name}
                </h2>
                <p className={`text-[14px] mb-5 ${plan.highlight ? "text-white/60" : "text-[#6B7280]"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-7">
                  <span className={`text-[40px] font-extrabold ${plan.highlight ? "text-white" : "text-brand-navy"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-[16px] ${plan.highlight ? "text-white/50" : "text-[#9CA3AF]"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        size={16}
                        strokeWidth={2.5}
                        className={`shrink-0 mt-0.5 ${plan.highlight ? "text-brand-orange" : "text-[#16A34A]"}`}
                      />
                      <span className={`text-[14px] ${plan.highlight ? "text-white/80" : "text-[#374151]"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaHref}
                  className={`w-full text-center font-semibold text-[15px] px-6 py-[13px] rounded-lg transition-all ${
                    plan.highlight
                      ? "bg-brand-orange text-white hover:bg-[#B54E20] active:scale-[0.98]"
                      : "bg-brand-navy text-white hover:bg-[#1E3D5C] active:scale-[0.98]"
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
        <div className="max-w-[900px] mx-auto px-6">
          <h2 className="text-[24px] lg:text-[30px] font-bold text-brand-navy text-center mb-10">
            Plan comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="pb-4 text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-1/2">Feature</th>
                  <th className="pb-4 text-[14px] font-bold text-brand-navy text-center">Starter</th>
                  <th className="pb-4 text-[14px] font-bold text-brand-orange text-center">Growth</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map(({ feature, starter, growth }, i) => (
                  <tr
                    key={feature}
                    className={`border-b border-[#F3F4F6] ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}
                  >
                    <td className="py-3.5 pr-4 text-[14px] text-[#374151]">{feature}</td>
                    <td className="py-3.5 text-center"><CellValue val={starter} /></td>
                    <td className="py-3.5 text-center"><CellValue val={growth} /></td>
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
            Start with Starter — free, no card needed. Upgrade when your volume grows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding" className="bg-brand-orange text-white font-semibold text-[16px] px-8 py-[14px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all">
              Start for free →
            </Link>
            <Link href="/demo" className="bg-white text-brand-navy font-semibold text-[16px] px-8 py-[14px] rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all">
              Book a demo
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
