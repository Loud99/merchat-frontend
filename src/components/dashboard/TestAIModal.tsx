"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Bot } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  is_in_stock: boolean;
  description: string | null;
}

interface ChatMessage {
  role: "customer" | "ai";
  text: string;
  ts: Date;
}

// ── Smart reply ────────────────────────────────────────────────────────────────

function generateReply(msg: string, products: Product[], storeName: string): string {
  const lower = msg.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|oya|e kaaro|e kaasan)\b/.test(lower)) {
    return `Hello! 👋 Welcome to ${storeName}. I'm your AI assistant. How can I help you today?\n\nYou can ask me about our products, prices, availability, or how to place an order.`;
  }

  // Catalogue / what do you have
  if (/what.*(sell|have|offer|available|catalogue|products|items|stock)|show.*(items|products|catalogue)|what can i (buy|get|order)/.test(lower)) {
    if (products.length === 0) {
      return `We have a beautiful collection! What are you looking for? 😊`;
    }
    const list = products.slice(0, 6).map(p => `• ${p.name} — ₦${Number(p.price).toLocaleString()}`).join("\n");
    const extra = products.length > 6 ? `\n\n…and ${products.length - 6} more items. Just ask!` : "";
    return `Here's what we currently have:\n\n${list}${extra}\n\nWould you like details on any of these?`;
  }

  // Price / cost
  if (/how much|price|cost|naira|₦|what.*(price|cost)/.test(lower)) {
    const match = products.find(p =>
      lower.includes(p.name.toLowerCase()) ||
      (p.category && lower.includes(p.category.toLowerCase()))
    );
    if (match) {
      const stock = match.is_in_stock ? "It's currently in stock! 🎉" : "This item is currently out of stock.";
      return `The *${match.name}* is ₦${Number(match.price).toLocaleString()}.\n\n${stock}\n\nWould you like to place an order?`;
    }
    return `Our prices depend on the item. Which product are you asking about? I can give you an exact price right away.`;
  }

  // Availability / do you have
  if (/available|in stock|do you have|you get|una get/.test(lower)) {
    const match = products.find(p => lower.includes(p.name.toLowerCase()));
    if (match) {
      if (match.is_in_stock) {
        return `Yes! The *${match.name}* is available at ₦${Number(match.price).toLocaleString()}. Ready to order? 😊`;
      }
      const alt = products.find(p => p.is_in_stock && p.id !== match.id);
      return `I'm sorry, the *${match.name}* is currently out of stock.${alt ? ` You might like the *${alt.name}* at ₦${Number(alt.price).toLocaleString()} instead!` : " Please check back soon."}`;
    }
    return `What specific item are you looking for? I'll check availability for you right away!`;
  }

  // Colour / size variants
  if (/colour|color|size|fit|red|blue|black|white|green|yellow|small|medium|large|xl|xs/.test(lower)) {
    const match = products.find(p => lower.includes(p.name.toLowerCase()));
    if (match) {
      return `For the *${match.name}*, we have several options available. Could you send us your preferred size and colour? We'll confirm what's in stock for you. 😊`;
    }
    return `We carry various sizes and colours across our range! Which item are you asking about?`;
  }

  // Delivery / shipping
  if (/deliver|shipping|send|dispatch|logistics|bring|lagos|abuja|ph|port harcourt/.test(lower)) {
    return `Yes, we deliver across Nigeria! 🚚\n\nLagos delivery — ₦2,500 (1–2 business days)\nOther states — ₦3,500–₦5,000 (2–4 business days)\n\nOrders are dispatched within 24 hours of payment confirmation. Would you like to place an order?`;
  }

  // Place an order / buy
  if (/order|buy|want|purchase|get one|i want|add to cart|checkout/.test(lower)) {
    const match = products.find(p => lower.includes(p.name.toLowerCase()));
    if (match) {
      return `Great choice! 🎉 The *${match.name}* is ₦${Number(match.price).toLocaleString()}.\n\nTo complete your order:\n1️⃣ Send your full delivery address\n2️⃣ Choose payment: Pay Now or Pay on Delivery\n\nReady to proceed?`;
    }
    return `I'd love to help you order! Which item are you interested in? You can ask me about any of our products.`;
  }

  // Payment
  if (/pay|payment|bank|transfer|card|pos|cash/.test(lower)) {
    return `We accept the following payment options:\n\n💳 *Pay Now* — Bank transfer (details sent after order confirmation)\n📦 *Pay on Delivery* — Cash or POS on arrival\n\nWhich would you prefer?`;
  }

  // Returns / refunds
  if (/return|refund|exchange|swap|wrong item|damaged/.test(lower)) {
    return `We have a 7-day return policy. 🔄\n\nIf you received the wrong or damaged item, please contact us with:\n• Your order number\n• A photo of the item\n\nWe'll sort it out for you quickly!`;
  }

  // Thank you
  if (/thank|thanks|appreciate|merci|e se/.test(lower)) {
    return `You're very welcome! 😊 Is there anything else I can help you with today?`;
  }

  // Bye
  if (/bye|goodbye|later|talk to you|ttyl/.test(lower)) {
    return `Take care! 👋 Feel free to message us anytime. We're always here to help. Have a wonderful day!`;
  }

  // Fallback
  return `Thanks for your message! I can help you with:\n\n🛍️ *Browse products* — ask "What do you have?"\n💰 *Check prices* — ask "How much is [item]?"\n📦 *Place an order* — ask "I want to buy [item]"\n🚚 *Delivery info* — ask "How do you deliver?"\n\nWhat would you like to know? 😊`;
}

// ── Bubble ─────────────────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: ChatMessage }) {
  const isCustomer = msg.role === "customer";
  const time = msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Convert *bold* markers to <strong>
  const formatted = msg.text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") && part.endsWith("*")
      ? <strong key={i}>{part.slice(1, -1)}</strong>
      : part.split("\n").map((line, j, arr) => (
          <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
        ))
  );

  return (
    <div className={`flex ${isCustomer ? "justify-end" : "justify-start"} mb-1.5`}>
      <div
        className={`relative max-w-[75%] px-3 py-2 rounded-lg text-[14px] leading-relaxed shadow-sm ${
          isCustomer
            ? "bg-[#DCF8C6] rounded-br-sm text-[#111827]"
            : "bg-white rounded-bl-sm text-[#111827]"
        }`}
      >
        <p className="whitespace-pre-wrap">{formatted}</p>
        <span className="block text-right text-[10px] text-[#6B7280] mt-0.5 -mb-0.5">{time}</span>
      </div>
    </div>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-1.5">
      <div className="bg-white rounded-lg rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 150, 300].map(delay => (
            <span
              key={delay}
              className="w-2 h-2 rounded-full bg-[#9CA3AF] animate-bounce"
              style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────

const TEST_MERCHANT_ID = "b4a55b01-be1b-4aed-a4bc-542a51a39caa";

export default function TestAIModal({
  storeName,
  onClose,
}: {
  storeName: string;
  onClose: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch products + show welcome message
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("id, name, price, category, is_in_stock, description")
      .eq("merchant_id", TEST_MERCHANT_ID)
      .eq("is_active", true)
      .then(({ data }) => {
        const list = (data ?? []) as Product[];
        setProducts(list);
        setMessages([
          {
            role: "ai",
            text: `Hello! 👋 Welcome to *${storeName}*. I'm your AI shopping assistant.\n\nHow can I help you today? You can ask about our products, prices, or how to place an order.`,
            ts: new Date(),
          },
        ]);
      });

    // Close on Escape
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [storeName, onClose]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function handleSend() {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");

    const customerMsg: ChatMessage = { role: "customer", text, ts: new Date() };
    setMessages(prev => [...prev, customerMsg]);
    setTyping(true);

    // Simulate AI thinking delay (800–1400ms)
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const reply = generateReply(text, products, storeName);
      setMessages(prev => [...prev, { role: "ai", text: reply, ts: new Date() }]);
      setTyping(false);
    }, delay);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div className="w-full max-w-[400px] h-[600px] max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.25)] flex flex-col">

        {/* WhatsApp-style header */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Bot size={18} className="text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-[15px] truncate">{storeName}</p>
            <p className="text-white/70 text-[11px]">AI Sandbox · Test mode</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/70 hover:text-white transition-colors p-1 -mr-1"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-3 py-3" style={{ background: "#E5DDD5" }}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-[#075E54] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {messages.map((m, i) => <Bubble key={i} msg={m} />)}
              {typing && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input bar */}
        <div className="bg-[#F0F0F0] px-3 py-2.5 flex items-center gap-2 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message…"
            className="flex-1 bg-white rounded-full px-4 py-2 text-[14px] outline-none border border-[#E5E7EB] focus:border-[#075E54] transition-colors"
            autoComplete="off"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || typing}
            aria-label="Send"
            className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center text-white disabled:opacity-40 transition-opacity shrink-0"
          >
            <Send size={16} strokeWidth={2} className="translate-x-[1px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
