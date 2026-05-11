import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const productLinks = [
  { label: "How it works",       href: "/how-it-works" },
  { label: "Features",           href: "/features" },
  { label: "Pricing",            href: "/pricing" },
  { label: "Merchant storefront",href: "/fashionbyamina" },
];

const companyLinks = [
  { label: "About",    href: "/about" },
  { label: "Blog",     href: "/blog" },
  { label: "Careers",  href: "/careers" },
  { label: "Contact",  href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy",   href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy",    href: "/refund-policy" },
];

const socialLinks = [
  { label: "Twitter / X", href: "https://twitter.com/merchatio" },
  { label: "Instagram",   href: "https://instagram.com/merchatio" },
  { label: "LinkedIn",    href: "https://linkedin.com/company/merchatio" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Brand */}
          <div>
            <div className="mb-3">
              <Image
                src="/images/wordmark-dark.svg"
                alt="Merchat.io"
                width={130}
                height={21}
                unoptimized
                style={{ width: 130, height: "auto" }}
              />
            </div>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              AI-powered commerce for Nigerian SMEs
            </p>
            <p className="text-sm text-white/40">© 2026 Merchat.io</p>
          </div>

          {/* Col 2 — Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social row */}
        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-center gap-6">
          {socialLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
