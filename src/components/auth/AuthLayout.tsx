"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    quote: "Set up in 20 minutes, first order that same evening.",
    name: "Tunde O.",
    city: "Lagos",
  },
  {
    quote: "The AI handles my DMs better than I ever could.",
    name: "Funke A.",
    city: "Abuja",
  },
  {
    quote: "Revenue up 40% in 6 weeks. No extra staff.",
    name: "Amaka C.",
    city: "PH",
  },
];

interface AuthLayoutProps {
  children: React.ReactNode;
  altLink?: React.ReactNode;
}

export default function AuthLayout({ children, altLink }: AuthLayoutProps) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % TESTIMONIALS.length);
        setVisible(true);
      }, 350);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[idx];

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex w-1/2 bg-[#0B1221] flex-col items-center justify-center relative overflow-hidden px-14">
        <div className="mb-12">
          <Image
            src="/images/logo-light.svg"
            alt="Merchat.io"
            width={160}
            height={26}
            unoptimized
            priority
            style={{ width: 160, height: "auto", filter: "brightness(0) invert(1)" }}
          />
        </div>

        <div
          className="text-center transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <p className="text-white text-[18px] italic leading-relaxed max-w-[280px] mb-4">
            &ldquo;{t.quote}&rdquo;
          </p>
          <p className="text-[#ADB5BD] text-[12px]">
            — {t.name}, {t.city}
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  i === idx ? "white" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        {/* Ghost meerkat */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none"
          style={{ opacity: 0.06 }}
          aria-hidden="true"
        >
          <Image
            src="/images/icon-light.svg"
            alt=""
            width={240}
            height={240}
            unoptimized
          />
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 lg:w-1/2 bg-white overflow-auto flex flex-col">
        <div className="flex-1 flex flex-col px-6 py-10 lg:px-14 lg:py-14">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Image
              src="/images/logo-light.svg"
              alt="Merchat.io"
              width={140}
              height={23}
              unoptimized
              style={{ width: 140, height: "auto" }}
            />
          </div>

          {/* Alt link */}
          {altLink && (
            <div className="flex justify-end mb-8 hidden lg:flex">
              {altLink}
            </div>
          )}

          {/* Form */}
          <div className="flex-1 flex items-start justify-center lg:items-center">
            <div className="w-full max-w-[400px]">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
