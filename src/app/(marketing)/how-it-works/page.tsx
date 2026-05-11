import Link from "next/link";
import {
  UserPlus, Bot, LayoutDashboard, Phone, Zap, ShoppingCart,
  MessageSquare, BarChart2, Package, Check,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="pt-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="inline-block bg-white/10 text-white/80 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6">
            How Merchat works
          </span>
          <h1 className="text-[32px] lg:text-[52px] font-extrabold text-white leading-tight mb-5">
            Your WhatsApp business,<br className="hidden lg:block" /> on autopilot.
          </h1>
          <p className="text-[18px] lg:text-[20px] text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            Set up once in under 10 minutes. Merchat provisions a real WhatsApp Business number, trains an AI on your products, and handles every customer conversation — so you can focus on running your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding" className="bg-brand-orange text-white font-semibold text-[15px] px-8 py-[14px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all">
              Start for free →
            </Link>
            <Link href="/demo" className="bg-white/10 text-white font-semibold text-[15px] px-8 py-[14px] rounded-lg hover:bg-white/20 transition-all">
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3 Steps ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-[28px] lg:text-[36px] font-bold text-brand-navy mb-4">Three steps to your WhatsApp store</h2>
            <p className="text-[17px] text-[#6B7280]">No developer needed. No complicated setup.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 relative">
            <div className="hidden lg:block absolute h-px bg-[#E5E7EB]" style={{ top: "28px", left: "calc(16.67% + 28px)", right: "calc(16.67% + 28px)" }} />

            {[
              {
                num: "01", Icon: UserPlus, color: "bg-[#F4EDE8]", iconColor: "text-brand-orange",
                title: "Sign up and add your products",
                body: "Create your account, upload your product catalogue, set your prices, and configure your AI's name and tone. We handle everything else — including getting you a WhatsApp Business number registered in your business name.",
                items: ["Product catalogue upload", "AI name and tone settings", "Delivery areas and fees", "Payment method configuration"],
              },
              {
                num: "02", Icon: Bot, color: "bg-[#EEF2FF]", iconColor: "text-[#4F46E5]",
                title: "Your AI handles every conversation",
                body: "From the moment a customer sends their first message, your Merchat AI takes over. It answers questions, shows products, confirms orders, sends payment links, and knows exactly when to escalate to you.",
                items: ["24/7 availability, zero downtime", "Responds in Nigerian English and Pidgin", "Sends product images automatically", "Handles objections and follow-ups"],
              },
              {
                num: "03", Icon: LayoutDashboard, color: "bg-[#F0FDF4]", iconColor: "text-[#16A34A]",
                title: "You manage from your dashboard",
                body: "Every order, conversation, and payment lands in your Merchat dashboard. Advance orders through statuses, update your inventory, read AI conversations, and jump in whenever a customer needs a human touch.",
                items: ["Real-time order kanban board", "Inventory and stock management", "Full conversation history", "Revenue and performance analytics"],
              },
            ].map(({ num, Icon, color, iconColor, title, body, items }) => (
              <div key={num} className="flex flex-col">
                <div className={`relative z-10 w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6`}>
                  <Icon size={26} className={iconColor} strokeWidth={1.5} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-orange text-white text-[11px] font-bold flex items-center justify-center">{num}</span>
                </div>
                <h3 className="text-[20px] font-bold text-brand-navy mb-3">{title}</h3>
                <p className="text-[15px] text-[#6B7280] leading-relaxed mb-5">{body}</p>
                <ul className="space-y-2 mt-auto">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-[14px] text-brand-navy">
                      <Check size={14} className="text-brand-orange shrink-0" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp Number Provisioning ──────────────────────────────────── */}
      <section className="bg-[#F4EDE8] py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block bg-white text-brand-orange text-[12px] font-semibold px-3 py-1 rounded-full mb-5">
                WhatsApp Number Provisioning
              </span>
              <h2 className="text-[28px] lg:text-[36px] font-bold text-brand-navy mb-5 leading-tight">
                A real WhatsApp Business number — in your name, not ours.
              </h2>
              <p className="text-[16px] text-[#6B7280] leading-relaxed mb-5">
                Most commerce tools make you share a number with hundreds of other merchants. Merchat provisions a dedicated WhatsApp Business API number registered under your business name, giving your store a professional presence your customers trust.
              </p>
              <p className="text-[16px] text-[#6B7280] leading-relaxed mb-8">
                Once provisioned — typically within the hour — your number appears with a green verified badge in WhatsApp. Customers see your business name, not a random number.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Phone, label: "Dedicated number", sub: "Yours alone, forever" },
                  { icon: Check, label: "Verified badge", sub: "Meta-approved business" },
                  { icon: Zap, label: "Provisioned fast", sub: "Usually within the hour" },
                  { icon: MessageSquare, label: "API-powered", sub: "No phone required" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                    <Icon size={18} className="text-brand-orange mb-2" strokeWidth={1.5} />
                    <p className="text-[14px] font-semibold text-brand-navy">{label}</p>
                    <p className="text-[12px] text-[#9CA3AF]">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-navy rounded-2xl p-8 lg:p-10">
              <div className="space-y-5">
                {[
                  { step: "1", title: "You sign up", body: "Create your Merchat account and complete the business verification form." },
                  { step: "2", title: "We apply to Meta", body: "Merchat submits your WhatsApp Business API application with your business details on your behalf." },
                  { step: "3", title: "Number goes live", body: "Within hours, your dedicated number is live. We set up your profile, display name, and business description." },
                  { step: "4", title: "AI starts answering", body: "From the moment it's live, your Merchat AI starts responding to customer messages automatically." },
                ].map(({ step, title, body }) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white text-[13px] font-bold shrink-0 mt-0.5">{step}</div>
                    <div>
                      <p className="text-[15px] font-semibold text-white mb-1">{title}</p>
                      <p className="text-[14px] text-white/60 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The AI Agent ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#F4EDE8] text-brand-orange text-[12px] font-semibold px-3 py-1 rounded-full mb-5">
              The AI Agent
            </span>
            <h2 className="text-[28px] lg:text-[36px] font-bold text-brand-navy mb-4">
              Not a chatbot. An actual sales agent.
            </h2>
            <p className="text-[17px] text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Merchat&apos;s AI is trained on your specific products, prices, delivery areas, and business policies. It handles entire conversations from first message to confirmed order — without sounding robotic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Understands how Nigerians shop", body: "Responds naturally to vague requests like 'what do you have for a wedding?' and follows up with one smart clarifying question rather than a long form." },
              { title: "Shows products, not just text", body: "When a customer asks about a product, the AI sends photos from your catalogue automatically — exactly how a sales rep would." },
              { title: "Speaks Nigerian English and Pidgin", body: "Your AI matches the customer's register. If they write casual Pidgin, it responds in kind. If they are formal, it stays professional." },
              { title: "Handles objections", body: "Price pushback, out-of-stock queries, delivery timing questions — the AI handles these with pre-configured responses you control." },
              { title: "Knows when to escalate", body: "If a conversation gets complex or a customer expresses frustration, the AI flags it immediately and hands over to you with full context." },
              { title: "Learns from your catalogue", body: "Update a product price or add a new item to your dashboard? Your AI knows about it in real time — no retraining required." },
            ].map(({ title, body }) => (
              <div key={title} className="border border-[#E5E7EB] rounded-xl p-6">
                <div className="w-8 h-8 rounded-lg bg-[#F4EDE8] flex items-center justify-center mb-4">
                  <Check size={16} className="text-brand-orange" strokeWidth={2.5} />
                </div>
                <h3 className="text-[16px] font-bold text-brand-navy mb-2">{title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp Flows ────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block bg-white/10 text-white/80 text-[12px] font-semibold px-3 py-1 rounded-full mb-5">
                WhatsApp Flows
              </span>
              <h2 className="text-[28px] lg:text-[36px] font-bold text-white mb-5 leading-tight">
                Structured forms, inside WhatsApp.
              </h2>
              <p className="text-[16px] text-white/70 leading-relaxed mb-5">
                When a customer is ready to order, Merchat launches a WhatsApp Flow — a native, structured form inside the chat. No links to external sites. No drop-offs. Just a clean checkout experience your customer never has to leave WhatsApp for.
              </p>
              <p className="text-[16px] text-white/70 leading-relaxed mb-8">
                Merchat uses WhatsApp Flows for order collection, abandoned cart recovery, and post-delivery review requests — all triggered automatically at exactly the right moment.
              </p>
              <div className="space-y-3">
                {[
                  "Order Confirmation Flow — name, address, payment method",
                  "Abandoned Cart Recovery — auto-triggered 2 hours after drop-off",
                  "Post-Delivery Review — sent automatically after confirmed delivery",
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-[15px] text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-[#ECE5DD] rounded-2xl overflow-hidden border border-white/10 max-w-[280px] w-full">
                <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold">A</div>
                  <div>
                    <div className="text-white text-[13px] font-semibold">Amina Boutique</div>
                    <div className="text-white/60 text-[11px]">online</div>
                  </div>
                </div>
                <div className="p-4 space-y-3 text-[13px]">
                  <div className="bg-white rounded-xl rounded-tl-none px-3 py-2 shadow-sm text-gray-800">
                    Great choice! Let me collect your order details 📋
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="bg-brand-navy px-3 py-2.5">
                      <div className="text-white text-[12px] font-semibold">Order Details</div>
                    </div>
                    <div className="p-3 space-y-2">
                      {["Full name", "Phone number", "Delivery address"].map(f => (
                        <div key={f}>
                          <div className="text-[10px] font-medium text-brand-navy mb-1">{f}</div>
                          <div className="border border-gray-200 rounded px-2 py-1.5 text-[11px] text-gray-400">Enter {f.toLowerCase()}</div>
                        </div>
                      ))}
                      <button className="w-full bg-brand-orange text-white text-[11px] font-semibold rounded py-1.5 mt-1">
                        Confirm Order →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Merchant Dashboard ────────────────────────────────────────────── */}
      <section className="bg-[#F3F4F6] py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-white text-brand-orange text-[12px] font-semibold px-3 py-1 rounded-full mb-5 border border-[#E5E7EB]">
              Merchant Dashboard
            </span>
            <h2 className="text-[28px] lg:text-[36px] font-bold text-brand-navy mb-4">
              Your entire business in one screen.
            </h2>
            <p className="text-[17px] text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              The Merchat dashboard is built mobile-first. Manage orders, inventory, and conversations from your phone at the market or on your laptop at home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: ShoppingCart, title: "Orders", body: "Kanban board showing every order by status. Advance from New → Confirmed → Paid → Dispatched → Delivered with one tap." },
              { Icon: MessageSquare, title: "Conversations", body: "Read every customer conversation your AI has handled. Jump in at any point. See which customers need attention." },
              { Icon: Package, title: "Inventory", body: "Add, edit, and toggle products. Upload images, set variants, manage stock quantities in real time." },
              { Icon: BarChart2, title: "Analytics", body: "Revenue today, this week, this month. Order volume, conversion rate, AI performance, and your top products." },
            ].map(({ Icon, title, body }) => (
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

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-brand-orange py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-[28px] lg:text-[36px] font-bold text-white mb-4">
            Ready to put your WhatsApp sales on autopilot?
          </h2>
          <p className="text-[17px] text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of Nigerian merchants who&apos;ve stopped managing WhatsApp manually.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding" className="bg-white text-brand-orange font-semibold text-[16px] px-8 py-[14px] rounded-lg hover:bg-[#F4EDE8] active:scale-[0.98] transition-all">
              Start for free →
            </Link>
            <Link href="/demo" className="bg-white/20 text-white font-semibold text-[16px] px-8 py-[14px] rounded-lg hover:bg-white/30 transition-all">
              Book a demo
            </Link>
          </div>
          <p className="text-white/60 text-[13px] mt-4">No credit card required · Setup in under 10 minutes</p>
        </div>
      </section>

    </main>
  );
}
