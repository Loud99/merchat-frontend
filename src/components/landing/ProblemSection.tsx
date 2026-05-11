import { Clock, AlertCircle, CreditCard, Package, Users, TrendingDown, LucideIcon } from "lucide-react";

const problems: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Clock,
    title: "3–6 hours lost daily",
    body: "Answering the same product questions, quoting prices, confirming orders. Every. Single. Day.",
  },
  {
    Icon: AlertCircle,
    title: "Orders fall through the gaps",
    body: "Customers message when you're asleep, busy, or overwhelmed. No reply = no sale.",
  },
  {
    Icon: CreditCard,
    title: "Payments are missed",
    body: "Bank transfers get sent to the wrong account. No follow-up means no payment.",
  },
  {
    Icon: Package,
    title: "Inventory errors damage trust",
    body: "Selling items that are out of stock breaks customer relationships you worked hard to build.",
  },
  {
    Icon: Users,
    title: "No memory of your customers",
    body: "Every conversation starts from scratch. You have zero data about what your customers buy.",
  },
  {
    Icon: TrendingDown,
    title: "You can't grow past yourself",
    body: "Your business capacity is capped by how many messages you can personally reply to.",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-brand-navy mb-4">
            You&apos;re losing money every day you manage WhatsApp manually.
          </h2>
          <p className="text-[18px] text-[#6B7280] leading-relaxed">
            Every hour you spend copy-pasting prices and chasing payments is an hour you&apos;re not growing.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map(({ Icon, title, body }, i) => (
            <div
              key={i}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Icon size={24} className="text-brand-orange mb-4" strokeWidth={1.5} />
              <h3 className="text-[20px] font-bold text-brand-navy mb-2">{title}</h3>
              <p className="text-[14px] text-[#6B7280] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
