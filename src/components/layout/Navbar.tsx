"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing",       href: "#pricing" },
  { label: "Features",      href: "/features" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 80);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#E9ECEF]"
            : "bg-white border-b border-[#E9ECEF]"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-8 h-full flex items-center justify-between">
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
                className="text-[15px] font-medium text-[#343A40] hover:text-brand-orange transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-[15px] font-medium text-[#343A40] hover:text-brand-orange transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="bg-brand-orange text-white text-[15px] font-semibold px-7 py-3 rounded-full hover:bg-brand-orange-hover active:scale-[0.97] transition-all"
            >
              Get started
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 -mr-2 text-[#343A40]"
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
            {[...navLinks, { label: "Log in", href: "/login" }].map((l) => (
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
              className="block w-full bg-brand-orange text-white text-[15px] font-semibold text-center px-7 py-[14px] rounded-full hover:bg-brand-orange-hover transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
