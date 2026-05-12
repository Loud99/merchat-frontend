"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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

const n = testimonials.length;
// Duplicate the array so we can always see 3 cards and loop back invisibly
const slides = [...testimonials, ...testimonials];
const GAP = 24; // px — matches gap-6

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [cardW, setCardW] = useState(0);
  const paused = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure card width synchronously before paint; re-measure on resize
  useLayoutEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const perView = w >= 1024 ? 3 : 1;
      const gaps = perView - 1;
      setCardW((w - gaps * GAP) / perView);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Advance one card every 3 s unless hovered
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) {
        setAnimated(true);
        setIdx((i) => i + 1);
      }
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Once we've slid through all originals, silently snap back to idx 0
  useEffect(() => {
    if (idx !== n) return;
    const t = setTimeout(() => {
      setAnimated(false);
      setIdx(0);
    }, 620); // just after the 600 ms transition ends
    return () => clearTimeout(t);
  }, [idx]);

  // Re-enable transition one paint after the silent snap
  useEffect(() => {
    if (animated) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimated(true))
    );
    return () => cancelAnimationFrame(raf);
  }, [animated]);

  const step = cardW + GAP;

  return (
    <section id="testimonials" className="bg-brand-navy py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[24px] lg:text-[32px] font-bold text-white text-center mb-12">
          Merchants using Merchat.io
        </h2>

        <div
          ref={containerRef}
          className="overflow-hidden"
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          <div
            className="flex"
            style={{
              gap: GAP,
              transform: cardW ? `translateX(-${idx * step}px)` : undefined,
              transition: animated ? "transform 600ms ease-in-out" : "none",
              willChange: "transform",
            }}
          >
            {slides.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white/[0.08] rounded-xl border border-white/10 p-6"
                style={{ width: cardW || undefined }}
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

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8" aria-hidden="true">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === idx % n ? "w-6 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
