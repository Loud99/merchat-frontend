import Link from "next/link";
import {
  Bot, Zap, LayoutDashboard, Package, CreditCard, Star,
  MessageSquare, ShoppingCart, BarChart2, Bell, Globe, Lock,
  RefreshCw, Users, Phone, ImageIcon, Truck, Shield,
  Check,
} from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  body: string;
}

interface FeatureGroup {
  category: string;
  description: string;
  color: string;
  iconBg: string;
  iconColor: string;
  features: Feature[];
}

const groups: FeatureGroup[] = [
  {
    category: "AI Agent",
    description: "A 24/7 sales agent trained on your products — in your voice, in Nigerian English.",
    color: "border-[#4F46E5]",
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
    features: [
      { icon: Bot, title: "Natural conversation handling", body: "Understands vague, real-world customer requests and asks one smart clarifying question to move the conversation forward — not a rigid Q&A script." },
      { icon: MessageSquare, title: "Nigerian English and Pidgin support", body: "Your AI matches how customers actually write. Formal English, casual Pidgin, or a mix — it responds in kind without sounding foreign or robotic." },
      { icon: ImageIcon, title: "Automatic product photo delivery", body: "When a customer asks about an item, the AI sends up to five product photos directly in the chat — just as a real sales rep would pull up samples." },
      { icon: RefreshCw, title: "Objection and FAQ handling", body: "Price pushback, delivery timelines, size questions, return policy — configure responses once and the AI handles them consistently, every time." },
      { icon: Bell, title: "Smart escalation to merchant", body: "When frustration is detected or a conversation goes beyond its scope, the AI flags the chat and hands over to you instantly — with full context preserved." },
      { icon: Zap, title: "Real-time catalogue sync", body: "Prices and stock update in your AI the moment you change them in your dashboard. No manual retraining, no delays, no customer seeing stale information." },
    ],
  },
  {
    category: "WhatsApp Flows",
    description: "Structured, native checkout forms that live inside WhatsApp — no external links.",
    color: "border-[#16A34A]",
    iconBg: "bg-[#F0FDF4]",
    iconColor: "text-[#16A34A]",
    features: [
      { icon: ShoppingCart, title: "Order Confirmation Flow", body: "When a customer is ready to buy, they complete a clean native form inside WhatsApp: name, delivery address, landmark, and payment method. No link, no browser, no drop-off." },
      { icon: RefreshCw, title: "Abandoned Cart Recovery", body: "If a customer starts but doesn't complete an order, Merchat automatically sends a personalised recovery message 2 hours later — recovering orders you'd otherwise lose forever." },
      { icon: Star, title: "Post-Delivery Review Request", body: "After you mark an order delivered, your AI sends a review request inside WhatsApp. Star ratings and written feedback collected automatically, no app required." },
      { icon: Zap, title: "Payment link delivery", body: "Once an order is confirmed, the AI immediately sends a payment link via your configured payment gateway (Paystack or Flutterwave) — so customers can pay instantly." },
    ],
  },
  {
    category: "Merchant Dashboard",
    description: "A mobile-first command centre for your entire WhatsApp business.",
    color: "border-brand-orange",
    iconBg: "bg-[#F4EDE8]",
    iconColor: "text-brand-orange",
    features: [
      { icon: LayoutDashboard, title: "Kanban order board", body: "See all orders by status — New, Confirmed, Paid, Dispatched, Delivered — in a drag-friendly Kanban view on desktop, tabbed list on mobile. Advance any order with one tap." },
      { icon: MessageSquare, title: "Full conversation inbox", body: "Read every AI conversation, see escalation alerts, reply directly from the dashboard, and hand control back to the AI when you're done — all without touching WhatsApp." },
      { icon: BarChart2, title: "Analytics dashboard", body: "Today, this week, this month: revenue, order count, average order value, AI conversion rate, and escalation rate — with trend comparisons to the previous period." },
      { icon: Bell, title: "Real-time notifications", body: "New order, payment received, conversation escalated, low stock — critical alerts surface in your dashboard the moment they happen, with one-click navigation to the relevant item." },
    ],
  },
  {
    category: "Inventory Management",
    description: "A product catalogue your AI actually sells from — always accurate, always live.",
    color: "border-[#7C3AED]",
    iconBg: "bg-[#F5F3FF]",
    iconColor: "text-[#7C3AED]",
    features: [
      { icon: Package, title: "Product catalogue", body: "Create and manage unlimited products (Growth plan) with names, descriptions, categories, prices, and stock quantities. Your AI knows every item in your catalogue." },
      { icon: ImageIcon, title: "Product image gallery", body: "Upload JPEG and PNG product images directly from your dashboard or paste public image URLs. Multiple images per product — the AI presents them automatically." },
      { icon: Zap, title: "Product variants", body: "Define variants like size, colour, or material as labelled option groups. The AI uses these to ask the right qualifying questions before confirming an order." },
      { icon: RefreshCw, title: "Live stock management", body: "Toggle products in or out of stock, adjust quantities, and mark items as inactive — all reflected immediately in what your AI will and won't offer customers." },
    ],
  },
  {
    category: "Payments",
    description: "Nigerian payment infrastructure built in — collect money without leaving WhatsApp.",
    color: "border-[#D97706]",
    iconBg: "bg-[#FFFBEB]",
    iconColor: "text-[#D97706]",
    features: [
      { icon: CreditCard, title: "Paystack and Flutterwave", body: "Connect your existing Paystack or Flutterwave account. Payment links are generated and sent automatically after every confirmed order — no manual work." },
      { icon: Truck, title: "Pay on Delivery option", body: "Give customers the choice between online payment and cash on delivery. The AI handles the conversation logic for both, and your dashboard shows payment status clearly." },
      { icon: Shield, title: "Payment status tracking", body: "See at a glance which orders are paid, unpaid, or awaiting. Dashboard payment badges update in real time as customers complete their transactions." },
      { icon: Globe, title: "Naira and USD pricing", body: "Display prices in Naira with optional USD equivalent. Useful for merchants selling to diaspora customers or pricing imported goods with exchange rate exposure." },
    ],
  },
  {
    category: "Customer Experience",
    description: "The end-to-end experience your customers have — from first message to five-star review.",
    color: "border-[#EC4899]",
    iconBg: "bg-[#FDF2F8]",
    iconColor: "text-[#EC4899]",
    features: [
      { icon: Globe, title: "Public storefront page", body: "Every Merchat merchant gets a hosted storefront at merchat.io/yourstore — shareable on Instagram, Twitter, or anywhere. Customers can browse your catalogue before messaging." },
      { icon: Phone, title: "WhatsApp deep link", body: "Your storefront links directly to your WhatsApp number with a pre-filled greeting message. One tap from your storefront starts a conversation with your AI." },
      { icon: Users, title: "Customer profiles", body: "Every customer who orders is saved automatically. See their order history, contact details, and conversation history in one place — without managing a spreadsheet." },
      { icon: Lock, title: "Data privacy and security", body: "All customer data is encrypted at rest and in transit. Merchat is GDPR-aware and follows Meta's WhatsApp Business Platform data use policies." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="pt-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="inline-block bg-white/10 text-white/80 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6">
            All features
          </span>
          <h1 className="text-[32px] lg:text-[52px] font-extrabold text-white leading-tight mb-5">
            Everything you need to sell<br className="hidden lg:block" /> on WhatsApp professionally.
          </h1>
          <p className="text-[18px] text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            Merchat bundles AI, WhatsApp infrastructure, order management, payments, and analytics — so you don&apos;t have to stitch six tools together.
          </p>
          <Link href="/onboarding" className="inline-block bg-brand-orange text-white font-semibold text-[15px] px-8 py-[14px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all">
            Start for free →
          </Link>
        </div>
      </section>

      {/* ── Feature groups ────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 space-y-20 lg:space-y-28">
          {groups.map(({ category, description, color, iconBg, iconColor, features }) => (
            <div key={category}>
              <div className={`border-l-4 ${color} pl-5 mb-10`}>
                <h2 className="text-[24px] lg:text-[28px] font-bold text-brand-navy mb-2">{category}</h2>
                <p className="text-[16px] text-[#6B7280]">{description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="border border-[#E5E7EB] rounded-xl p-6 hover:border-[#D1D5DB] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all">
                    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                      <Icon size={20} className={iconColor} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[16px] font-bold text-brand-navy mb-2">{title}</h3>
                    <p className="text-[14px] text-[#6B7280] leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#F4EDE8] py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-[28px] lg:text-[36px] font-bold text-brand-navy mb-4">
            All of this — starting at free.
          </h2>
          <p className="text-[17px] text-[#6B7280] mb-8 max-w-xl mx-auto">
            Start with the Starter plan, no credit card needed. Upgrade when your volume demands it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding" className="bg-brand-orange text-white font-semibold text-[16px] px-8 py-[14px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all">
              Start for free →
            </Link>
            <Link href="/pricing" className="bg-white text-brand-navy font-semibold text-[16px] px-8 py-[14px] rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all">
              See pricing
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
