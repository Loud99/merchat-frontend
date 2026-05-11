import Link from "next/link";

const articles = [
  {
    slug: "why-whatsapp-beats-shopify-for-nigerian-smes",
    cover: "https://picsum.photos/seed/whatsapp-commerce/800/450",
    category: "Commerce",
    title: "Why WhatsApp beats Shopify for Nigerian SMEs",
    excerpt:
      "International e-commerce platforms were not designed for Nigeria. Here's why the checkout completion rate stays low, and what WhatsApp-native commerce does differently.",
    author: "Tobi Adeyemi",
    date: "12 April 2026",
    readTime: "6 min read",
  },
  {
    slug: "how-to-write-an-ai-agent-persona-for-your-brand",
    cover: "https://picsum.photos/seed/ai-persona/800/450",
    category: "Product",
    title: "How to write an AI agent persona for your brand",
    excerpt:
      "Your AI shouldn't sound like a chatbot. It should sound like your best salesperson on their best day. A step-by-step guide to writing tone, objection scripts, and escalation triggers.",
    author: "Nkechi Eze",
    date: "28 March 2026",
    readTime: "8 min read",
  },
  {
    slug: "abandoned-cart-recovery-on-whatsapp-what-the-data-says",
    cover: "https://picsum.photos/seed/abandoned-cart/800/450",
    category: "Data",
    title: "Abandoned cart recovery on WhatsApp: what the data says",
    excerpt:
      "We analysed 12,000 incomplete WhatsApp orders across our merchant base. Here's when to send the recovery message, what to say, and how much revenue you're leaving on the table.",
    author: "Amara Osei",
    date: "14 March 2026",
    readTime: "5 min read",
  },
];

const categoryColors: Record<string, string> = {
  Commerce: "bg-[#EEF2FF] text-[#4F46E5]",
  Product: "bg-[#F4EDE8] text-brand-orange",
  Data: "bg-[#F0FDF4] text-[#16A34A]",
};

export default function BlogPage() {
  return (
    <main className="pt-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <span className="inline-block bg-white/10 text-white/80 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6">
            Blog
          </span>
          <h1 className="text-[32px] lg:text-[48px] font-extrabold text-white leading-tight mb-4">
            Insights for WhatsApp sellers
          </h1>
          <p className="text-[18px] text-white/70 leading-relaxed">
            Practical guides, product updates, and data from the Merchat team — for Nigerian merchants who sell seriously on WhatsApp.
          </p>
        </div>
      </section>

      {/* ── Articles ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(({ slug, cover, category, title, excerpt, author, date, readTime }) => (
              <article key={slug} className="border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow group">
                {/* Cover image */}
                <div className="aspect-[16/9] overflow-hidden bg-[#F3F4F6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className={`inline-block text-[12px] font-bold px-2.5 py-0.5 rounded-full mb-3 ${categoryColors[category] ?? "bg-[#F3F4F6] text-[#6B7280]"}`}>
                    {category}
                  </span>
                  <h2 className="text-[18px] font-bold text-brand-navy leading-snug mb-3 group-hover:text-[#1E3D5C] transition-colors">
                    {title}
                  </h2>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed mb-5">
                    {excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[13px] text-[#9CA3AF]">
                    <span>{author}</span>
                    <span>{date} · {readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section className="bg-[#F4EDE8] py-16 lg:py-20">
        <div className="max-w-[560px] mx-auto px-6 text-center">
          <h2 className="text-[24px] lg:text-[30px] font-bold text-brand-navy mb-3">
            Stay in the loop
          </h2>
          <p className="text-[16px] text-[#6B7280] mb-7">
            One email a month. New guides, product updates, and merchant case studies — no noise.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-12 px-4 rounded-lg border border-[#D1D5DB] text-[15px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy transition-colors bg-white"
            />
            <button className="h-12 px-6 bg-brand-orange text-white font-semibold text-[15px] rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-[12px] text-[#9CA3AF] mt-3">No spam. Unsubscribe any time.</p>
        </div>
      </section>

    </main>
  );
}
