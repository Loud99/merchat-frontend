"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "For Merchants", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 h-16 bg-white border-b border-[#E5E7EB] transition-shadow duration-200${
          scrolled ? " shadow-[0_2px_8px_rgba(0,0,0,0.08)]" : ""
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo-light.svg"
              alt="Merchat.io"
              width={140}
              height={27}
              unoptimized
              priority
              style={{ width: 140, height: "auto" }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[15px] font-medium text-[#374151] hover:text-brand-navy transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-[15px] font-semibold text-brand-navy hover:opacity-70 transition-opacity"
            >
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="bg-brand-orange text-white text-[15px] font-semibold px-7 py-3 rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all"
            >
              Start for free
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 -mr-2 text-brand-navy"
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <div
          className={`absolute right-0 top-0 bottom-0 w-72 bg-brand-navy flex flex-col px-6 pt-6 pb-8 transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end mb-8">
            <button onClick={() => setOpen(false)} className="p-1 text-white" aria-label="Close menu">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {[...navLinks, { label: "Log in", href: "/auth/login" }].map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-white text-xl font-semibold h-12 flex items-center hover:text-white/80 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-auto">
            <Link
              href="/onboarding"
              onClick={() => setOpen(false)}
              className="block w-full bg-brand-orange text-white text-[15px] font-semibold text-center px-7 py-[14px] rounded-lg hover:bg-[#B54E20] transition-colors"
            >
              Start for free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
