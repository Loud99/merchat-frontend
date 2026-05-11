import { ReactNode } from "react";

/* ── Inline illustrations ───────────────────────────────────────────── */

function ChatVisual() {
  return (
    <div className="bg-[#ECE5DD] rounded-xl overflow-hidden border border-[#E5E7EB] max-w-sm mx-auto">
      <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold">A</div>
        <div>
          <div className="text-white text-sm font-semibold">Amina Boutique</div>
          <div className="text-white/60 text-xs">online</div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3 text-[13px]">
        <div className="self-end bg-[#DCF8C6] rounded-xl rounded-tr-none px-3 py-2 max-w-[78%] text-gray-800">
          Do you have size 42 in black?
        </div>
        <div className="self-start bg-white rounded-xl rounded-tl-none px-3 py-2 max-w-[78%] shadow-sm text-gray-800">
          Yes! We have black ankle boots in size 42 for ₦18,500. Want to see photos?
        </div>
        <div className="self-end bg-[#DCF8C6] rounded-xl rounded-tr-none px-3 py-2 max-w-[78%] text-gray-800">
          Yes please 🙏
        </div>
        <div className="self-start bg-white rounded-xl rounded-tl-none px-3 py-2 max-w-[86%] shadow-sm text-gray-800">
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <div className="bg-gray-200 rounded-lg aspect-square" />
            <div className="bg-gray-300 rounded-lg aspect-square" />
          </div>
          Genuine leather, padded insole. Ready to ship today 📦
        </div>
      </div>
    </div>
  );
}

function OrderFlowVisual() {
  return (
    <div className="max-w-[280px] mx-auto bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="bg-[#075E54] px-4 py-2.5">
        <span className="text-white text-[13px] font-semibold">Order Details</span>
      </div>
      <div className="p-5 space-y-4">
        {[
          { label: "Full name", placeholder: "Chioma Obi" },
          { label: "Phone number", placeholder: "+234 810 000 0000" },
          { label: "Delivery address", placeholder: "12 Eko Lane, Lagos" },
        ].map((f) => (
          <div key={f.label}>
            <div className="text-[12px] font-medium text-brand-navy mb-1.5">{f.label}</div>
            <div className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-400">
              {f.placeholder}
            </div>
          </div>
        ))}
        <button className="w-full bg-brand-orange text-white text-[13px] font-semibold rounded-lg py-2.5 mt-1 hover:bg-[#B54E20] transition-colors">
          Confirm Order →
        </button>
      </div>
    </div>
  );
}

function DashboardVisual() {
  const orders = [
    { name: "Chioma O.", item: "Ankle Boot (42)", status: "Paid", color: "bg-green-100 text-green-700" },
    { name: "Emeka K.", item: "Canvas Sneaker (41)", status: "Pending", color: "bg-yellow-100 text-yellow-700" },
    { name: "Fatima A.", item: "Block Heel (38)", status: "Shipped", color: "bg-blue-100 text-blue-700" },
  ];

  return (
    <div className="bg-[#F3F4F6] rounded-xl p-4 max-w-sm mx-auto">
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { label: "Orders today", value: "12", color: "text-brand-navy" },
          { label: "Revenue", value: "₦184k", color: "text-success" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-lg p-3 border border-[#E5E7EB]">
            <div className={`text-xl font-bold ${c.color}`}>{c.value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-3">
        <div className="text-[11px] font-semibold text-brand-navy mb-2">Recent Orders</div>
        {orders.map((o) => (
          <div key={o.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
              <div className="text-[12px] font-medium text-brand-navy">{o.name}</div>
              <div className="text-[11px] text-gray-400">{o.item}</div>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${o.color}`}>
              {o.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutomationVisual() {
  return (
    <div className="flex gap-4 justify-center max-w-sm mx-auto">
      {[
        {
          label: "Cart Recovery",
          ai: "Hey! 👋 You left something in your cart. The White Nike Air is still available — want to complete your order?",
          customer: "Yes, let's do it!",
        },
        {
          label: "Post-Delivery Review",
          ai: "Your order arrived! ⭐ How was your experience? A quick review helps other shoppers.",
          customer: "5 stars! Amazing quality 🌟",
        },
      ].map((screen) => (
        <div key={screen.label} className="flex-1 bg-[#ECE5DD] rounded-xl overflow-hidden border border-[#E5E7EB]">
          <div className="bg-[#075E54] px-3 py-2">
            <div className="text-white text-[10px] font-semibold">Merchat Store</div>
          </div>
          <div className="p-3 flex flex-col gap-2 text-[11px]">
            <div className="bg-white rounded-xl rounded-tl-none px-2 py-2 shadow-sm text-gray-800">
              {screen.ai}
            </div>
            <div className="self-end bg-[#DCF8C6] rounded-xl rounded-tr-none px-2 py-2 text-gray-800">
              {screen.customer}
            </div>
          </div>
          <div className="px-3 pb-3">
            <div className="text-[9px] text-center text-gray-500 font-medium">{screen.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Feature row ────────────────────────────────────────────────────── */

function OrangePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block bg-brand-warm text-brand-orange text-[12px] font-semibold px-3 py-1 rounded-full mb-4">
      {children}
    </span>
  );
}

interface FeatureRowProps {
  badge: string;
  title: string;
  body: string;
  visual: ReactNode;
  reverse?: boolean;
}

function FeatureRow({ badge, title, body, visual, reverse }: FeatureRowProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}>
      <div className={reverse ? "lg:order-2" : ""}>
        <OrangePill>{badge}</OrangePill>
        <h3 className="text-[20px] font-bold text-brand-navy mb-4">{title}</h3>
        <p className="text-[16px] text-[#6B7280] leading-relaxed">{body}</p>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────────────── */

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[24px] lg:text-[32px] font-bold text-brand-navy mb-14 lg:mb-20">
          Everything your WhatsApp business needs.
        </h2>
        <div className="flex flex-col gap-16 lg:gap-24">
          <FeatureRow
            badge="AI"
            title="An AI that sells like your best staff member"
            body="Understands vague questions, asks one clarifying question, sends 3–5 product photos, confirms orders, and knows when to hand over to you. Works in English, Pidgin, and the way your customers actually talk."
            visual={<ChatVisual />}
          />
          <FeatureRow
            badge="Orders"
            title="Structured order collection — no errors, no back-and-forth"
            body="When a customer is ready to order, they get a clean form inside WhatsApp. Name, delivery address, payment method. One flow. No missed details."
            visual={<OrderFlowVisual />}
            reverse
          />
          <FeatureRow
            badge="Dashboard"
            title="Your orders, inventory, and conversations in one place"
            body="Manage everything from a mobile-first dashboard. See who ordered what, update stock, and read every AI conversation. Jump in when it matters."
            visual={<DashboardVisual />}
          />
          <FeatureRow
            badge="Automation"
            title="Automatically recover unpaid orders and collect reviews"
            body="2 hours after a customer doesn't pay, they get a reminder. After delivery, they get a review request — automatically, with zero effort from you."
            visual={<AutomationVisual />}
            reverse
          />
        </div>
      </div>
    </section>
  );
}
