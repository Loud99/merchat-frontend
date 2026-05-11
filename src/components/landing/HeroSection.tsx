import Link from "next/link";

type ChatMessage =
  | { from: "customer" | "ai"; text: string }
  | { from: "ai"; kind: "products"; products: { name: string; price: string }[] };

const messages: ChatMessage[] = [
  { from: "customer", text: "Hello, what shoes do you have?" },
  { from: "ai", text: "Hi! 👋 Are you looking for something specific or should I show you our bestsellers?" },
  { from: "customer", text: "Show me sneakers under 25k" },
  { from: "ai", kind: "products", products: [
    { name: "Nike Air", price: "₦23k" },
    { name: "Jordan 1", price: "₦24k" },
    { name: "Air Max", price: "₦22k" },
  ]},
  { from: "customer", text: "I want the white ones" },
  { from: "ai", text: "Great choice! White Nike Air (Size?) — ₦23,000. Want to place an order?" },
];

function PhoneMockup() {
  return (
    <div
      className="relative mx-auto w-[248px] sm:w-[272px]"
      style={{ filter: "drop-shadow(0 0 48px rgba(213,101,43,0.35))" }}
    >
      {/* Phone shell */}
      <div className="bg-[#18181b] rounded-[44px] p-[10px] border-2 border-white/10">
        {/* Screen */}
        <div className="bg-[#ECE5DD] rounded-[36px] overflow-hidden h-[500px] flex flex-col">
          {/* WhatsApp status bar + header */}
          <div className="bg-[#075E54] px-4 pt-4 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center text-white text-sm font-bold shrink-0">
              M
            </div>
            <div>
              <div className="text-white text-[13px] font-semibold">Merchat Store</div>
              <div className="text-white/60 text-[11px]">online</div>
            </div>
          </div>
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 no-scrollbar">
            {messages.map((msg, i) => {
              if ("kind" in msg && msg.kind === "products") {
                return (
                  <div key={i} className="self-start max-w-[90%]">
                    <div className="bg-white rounded-xl rounded-tl-none px-3 py-2 shadow-sm">
                      <p className="text-[10px] text-gray-500 mb-1.5">Here are our top sneakers 👟</p>
                      <div className="grid grid-cols-3 gap-1">
                        {msg.products.map((p, j) => (
                          <div
                            key={j}
                            className="relative rounded-lg overflow-hidden aspect-square flex flex-col justify-end p-1"
                            style={{ background: "linear-gradient(135deg,#d1d5db,#9ca3af)" }}
                          >
                            <span className="text-[8px] font-bold text-white leading-tight drop-shadow-sm">{p.name}</span>
                            <span className="text-[8px] text-white/90 drop-shadow-sm">{p.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              const textMsg = msg as { from: "customer" | "ai"; text: string };
              return (
                <div
                  key={i}
                  className={`text-[11px] leading-relaxed px-3 py-2 rounded-xl shadow-sm max-w-[80%] ${
                    textMsg.from === "customer"
                      ? "self-end bg-[#DCF8C6] rounded-tr-none text-gray-800"
                      : "self-start bg-white rounded-tl-none text-gray-800"
                  }`}
                >
                  {textMsg.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="bg-brand-navy py-24 lg:min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange text-[13px] font-semibold px-4 py-2 rounded-full mb-6">
              🇳🇬 Built for Nigerian SMEs
            </div>
            <h1 className="text-[32px] lg:text-[48px] font-extrabold text-white leading-tight mb-6">
              Run your entire WhatsApp business on autopilot.
            </h1>
            <p className="text-[18px] text-white/75 leading-relaxed mb-8 max-w-lg">
              Merchat gives your business an AI that talks to customers, closes orders, and manages your inventory — all inside WhatsApp. You focus on sourcing. We handle the rest.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/onboarding"
                className="bg-brand-orange text-white font-semibold text-[15px] px-7 py-[14px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all"
              >
                Start for free →
              </Link>
              <a
                href="#how-it-works"
                className="border-2 border-white text-white font-semibold text-[15px] px-7 py-[14px] rounded-lg hover:bg-white/10 transition-colors"
              >
                See how it works
              </a>
            </div>
            <div className="flex items-center gap-3 text-[13px] text-white/60 flex-wrap">
              <span>50+ merchants</span>
              <span className="text-white/20">·</span>
              <span>24/7 AI coverage</span>
              <span className="text-white/20">·</span>
              <span>0 coding required</span>
            </div>
          </div>

          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
