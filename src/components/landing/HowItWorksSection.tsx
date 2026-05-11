import Link from "next/link";
import { UserPlus, Bot, LayoutDashboard, LucideIcon } from "lucide-react";

const steps: { num: string; Icon: LucideIcon; title: string; body: string }[] = [
  {
    num: "01",
    Icon: UserPlus,
    title: "Sign up and connect in 10 minutes",
    body: "Add your products, configure your AI's name and tone, and Merchat provisions a dedicated WhatsApp Business number for your store — registered in your business name, not ours.",
  },
  {
    num: "02",
    Icon: Bot,
    title: "Your AI handles every customer conversation",
    body: "Customers message your number. The AI answers product questions, shows items, handles order confirmations, and sends payment links — in natural Nigerian English, including Pidgin.",
  },
  {
    num: "03",
    Icon: LayoutDashboard,
    title: "You manage from your dashboard",
    body: "Track orders, manage inventory, see your revenue, and jump into any conversation when needed. On your phone or computer — wherever you are.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-brand-navy py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-white mb-4">
            Merchat runs your WhatsApp sales for you.
          </h2>
          <p className="text-[18px] text-white/70 max-w-xl mx-auto">
            Set up once in under 10 minutes. Your AI handles the rest — 24/7.
          </p>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Desktop connecting line */}
          <div
            className="hidden lg:block absolute h-px bg-white/15"
            style={{ top: "20px", left: "calc(16.67% + 20px)", right: "calc(16.67% + 20px)" }}
          />

          {steps.map(({ num, Icon, title, body }, i) => (
            <div key={i} className="relative flex gap-5 lg:flex-col lg:gap-0 lg:items-center lg:text-center">
              {/* Mobile timeline line */}
              {i < steps.length - 1 && (
                <div className="lg:hidden absolute left-[19px] top-12 w-px bg-white/15" style={{ bottom: "-40px" }} />
              )}

              <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white text-sm font-bold lg:mb-5">
                {num}
              </div>

              <div className="lg:px-2">
                <div className="hidden lg:flex justify-center mb-4">
                  <Icon size={24} className="text-white/50" strokeWidth={1.5} />
                </div>
                <h3 className="text-[20px] font-bold text-white mb-3">{title}</h3>
                <p className="text-[15px] text-white/70 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 lg:mt-16 text-center">
          <Link
            href="/onboarding"
            className="inline-block bg-brand-orange text-white font-semibold text-[15px] px-7 py-[14px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all mb-3"
          >
            Start for free →
          </Link>
          <p className="text-[13px] text-white/50">No credit card required · Setup in under 10 minutes</p>
        </div>
      </div>
    </section>
  );
}
