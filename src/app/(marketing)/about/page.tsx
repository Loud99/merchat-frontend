import Link from "next/link";
import { Users, Target, Zap, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Merchant-first, always",
    body: "Every decision starts with: does this make a Nigerian merchant's life easier? If it doesn't directly help a seller move product, we don't build it.",
  },
  {
    icon: Zap,
    title: "Speed over perfection",
    body: "Nigerian SMEs can't wait 6 months for a feature. We ship fast, listen harder, and iterate in days — not quarters.",
  },
  {
    icon: Heart,
    title: "Built for the context",
    body: "We don't adapt foreign tools for Nigeria. We build from the ground up — with Pidgin, Naira, Pay on Delivery, and WhatsApp at the centre.",
  },
  {
    icon: Users,
    title: "Small team, big focus",
    body: "We're a lean team that stays focused. We'd rather do three things excellently than ten things adequately.",
  },
];

const team = [
  {
    name: "Tobi Adeyemi",
    role: "CEO & Co-founder",
    bio: "Previously built and sold a fashion e-commerce brand on WhatsApp. Spent 4 years fighting bad tooling — decided to fix it.",
    initials: "TA",
    color: "bg-[#EEF2FF] text-[#4F46E5]",
  },
  {
    name: "Amara Osei",
    role: "CTO & Co-founder",
    bio: "Former ML engineer at a fintech. Built the first version of the AI agent in 6 weeks on a bet. Now it's the whole product.",
    initials: "AO",
    color: "bg-[#F0FDF4] text-[#16A34A]",
  },
  {
    name: "Nkechi Eze",
    role: "Head of Product",
    bio: "5 years running operations at a Lagos logistics startup. Knows exactly what merchants need because she's watched them work.",
    initials: "NE",
    color: "bg-[#F4EDE8] text-brand-orange",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <span className="inline-block bg-white/10 text-white/80 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6">
            About Merchat
          </span>
          <h1 className="text-[32px] lg:text-[52px] font-extrabold text-white leading-tight mb-5">
            We&apos;re building the commerce layer for Nigerian WhatsApp.
          </h1>
          <p className="text-[18px] text-white/70 leading-relaxed">
            Merchat was founded in Lagos in 2026 with one goal: give Nigeria&apos;s 39 million SMEs the same selling infrastructure that big brands take for granted — inside the app their customers already use.
          </p>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[28px] lg:text-[36px] font-bold text-brand-navy mb-5">
                The problem we&apos;re solving
              </h2>
              <div className="space-y-4 text-[16px] text-[#4B5563] leading-relaxed">
                <p>
                  Nigeria&apos;s informal economy runs on WhatsApp. Millions of merchants take orders through DMs, track them in notebooks, send payment details manually, and chase customers for confirmations — every single day.
                </p>
                <p>
                  The tools that exist were built for the West: Shopify, WooCommerce, Instagram Shopping. They require customers to leave WhatsApp, create accounts, and trust payment pages they&apos;ve never seen. Nigerian shoppers don&apos;t complete that journey.
                </p>
                <p>
                  Merchat keeps everything inside WhatsApp — where the trust already exists. Our AI handles the conversation, the Flows handle the checkout, and the dashboard gives merchants the control they&apos;ve never had before.
                </p>
              </div>
            </div>
            <div className="bg-[#F4EDE8] rounded-2xl p-8 lg:p-10">
              <div className="space-y-6">
                {[
                  { stat: "39M+", label: "Nigerian SMEs who could use this" },
                  { stat: "2B+", label: "WhatsApp messages sent in Nigeria daily" },
                  { stat: "< 3%", label: "Merchant-to-customer checkout conversion on external links" },
                  { stat: "2026", label: "Year we decided to fix it" },
                ].map(({ stat, label }) => (
                  <div key={stat} className="flex items-start gap-4">
                    <span className="text-[28px] font-extrabold text-brand-orange leading-none">{stat}</span>
                    <span className="text-[15px] text-[#6B7280] leading-snug pt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section className="bg-[#F9FAFB] py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[24px] lg:text-[30px] font-bold text-brand-navy text-center mb-10">
            How we work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <div className="w-10 h-10 rounded-xl bg-[#F4EDE8] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-brand-orange" strokeWidth={1.5} />
                </div>
                <h3 className="text-[16px] font-bold text-brand-navy mb-2">{title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[24px] lg:text-[30px] font-bold text-brand-navy text-center mb-3">
            The team
          </h2>
          <p className="text-[16px] text-[#6B7280] text-center mb-10">
            Small, Lagos-based, obsessed with the problem.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map(({ name, role, bio, initials, color }) => (
              <div key={name} className="border border-[#E5E7EB] rounded-xl p-6">
                <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-[18px] font-bold mb-4`}>
                  {initials}
                </div>
                <h3 className="text-[16px] font-bold text-brand-navy mb-0.5">{name}</h3>
                <p className="text-[13px] text-brand-orange font-semibold mb-3">{role}</p>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-[28px] lg:text-[36px] font-bold text-white mb-4">
            Join us — or join our merchants.
          </h2>
          <p className="text-[17px] text-white/70 mb-8 max-w-xl mx-auto">
            We&apos;re hiring and always looking for merchants to learn from.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers" className="bg-brand-orange text-white font-semibold text-[16px] px-8 py-[14px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all">
              See open roles →
            </Link>
            <Link href="/onboarding" className="bg-white/10 text-white font-semibold text-[16px] px-8 py-[14px] rounded-lg border border-white/20 hover:bg-white/20 transition-all">
              Start for free
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
