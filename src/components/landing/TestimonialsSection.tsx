const testimonials = [
  {
    quote:
      "Before Merchat, I was spending 4 hours every day just answering WhatsApp. Now I wake up to confirmed orders. It's like I hired someone while I was sleeping.",
    initials: "FA",
    name: "Fatima Aliyu",
    business: "Fashion Boutique, Kano",
  },
  {
    quote:
      "My customers didn't even notice the change. They still message my number, still get fast replies. I'm the one who noticed — I actually have time to restock now.",
    initials: "CN",
    name: "Chukwuemeka Nwankwo",
    business: "Electronics, Onitsha",
  },
  {
    quote:
      "The abandoned cart message alone paid for my subscription in the first week. Three customers came back and completed orders they'd left.",
    initials: "BA",
    name: "Bisi Adeyemo",
    business: "Skincare & Beauty, Lagos",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-brand-navy py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[24px] lg:text-[32px] font-bold text-white text-center mb-12">
          Merchants using Merchat.io
        </h2>

        {/* REPLACE WITH REAL TESTIMONIALS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/[0.08] rounded-xl border border-white/10 p-6"
            >
              <p className="text-white text-[16px] italic leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-[14px]">{t.name}</div>
                  <div className="text-white/60 text-[13px]">{t.business}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
