import Image from "next/image";
import Link from "next/link";

const productLinks = [
  { label: "How it works",        href: "/how-it-works" },
  { label: "Features",            href: "/features" },
  { label: "Pricing",             href: "/pricing" },
  { label: "Merchant storefront", href: "/fashionbyamina" },
];

const companyLinks = [
  { label: "About",   href: "/about" },
  { label: "Blog",    href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy",   href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy",    href: "/refund-policy" },
];

const socialLinks = [
  { label: "X",        href: "https://twitter.com/merchatio",                icon: "𝕏" },
  { label: "Instagram", href: "https://instagram.com/merchatio",             icon: "IG" },
  { label: "LinkedIn",  href: "https://linkedin.com/company/merchatio",      icon: "in" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0B1221" }} className="text-white">
      <div className="max-w-[1280px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/wordmark-dark.svg"
                alt="Merchat.io"
                width={130}
                height={21}
                unoptimized
                style={{ width: 130, height: "auto" }}
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              AI-powered commerce for Nigerian SMEs
            </p>
          </div>

          {/* Col 2 — Product */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Legal */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-white/40">© 2026 Merchat.io. All rights reserved.</p>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-full bg-[#6C757D]/40 hover:bg-[#6C757D]/70 flex items-center justify-center text-white text-xs font-bold transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
