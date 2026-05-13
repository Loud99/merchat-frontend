"use client";

import { useState } from "react";
import { UserPlus, Shield, ShoppingCart, Play, X } from "lucide-react";
import { Merchant } from "@/types";
import { getInitials } from "@/lib/storefront";

function WhatsAppIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface StoreHeaderProps {
  merchant: Merchant;
  cartCount: number;
  onCartOpen: () => void;
  onBrowseMode: () => void;
}

export default function StoreHeader({ merchant, cartCount, onCartOpen, onBrowseMode }: StoreHeaderProps) {
  const [signInDismissed, setSignInDismissed] = useState(false);
  const initials = getInitials(merchant.displayName);

  const downloadVCard = () => {
    const vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${merchant.displayName}`,
      `TEL;TYPE=WHATSAPP:${merchant.whatsappPhone}`,
      `URL:https://merchat.io/store/${merchant.slug}`,
      "END:VCARD",
    ].join("\n");
    const blob = new Blob([vcf], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${merchant.displayName.replace(/\s+/g, "-")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="relative bg-[#0B1221] flex flex-col items-center text-center px-4 pt-10 pb-8 min-h-[200px] lg:min-h-[240px]">
        {/* Cart icon — top right */}
        <button
          onClick={onCartOpen}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center"
          aria-label="Open cart"
        >
          <div className="relative">
            <ShoppingCart size={24} className="text-white" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-[#25D366] flex items-center justify-center text-white text-[11px] font-bold leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
        </button>

        {/* Avatar */}
        {merchant.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={merchant.logoUrl}
            alt={merchant.displayName}
            className="w-[72px] h-[72px] rounded-full object-cover bg-white border-[3px] border-[#25D366] mb-3"
          />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full bg-brand-orange flex items-center justify-center text-white text-[24px] font-bold border-[3px] border-[#25D366] mb-3">
            {initials}
          </div>
        )}

        {/* Store name + verified */}
        <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
          <h1 className="text-[28px] font-bold text-white leading-tight">{merchant.displayName}</h1>
          {merchant.isVerified && (
            <span className="flex items-center gap-1 text-[#2196F3] text-[12px] font-medium">
              <Shield size={14} />
              Verified Merchant
            </span>
          )}
        </div>

        {/* Tagline */}
        {merchant.description && (
          <p className="text-[13px] text-[#ADB5BD] italic mb-3 max-w-xs leading-relaxed">
            {merchant.description}
          </p>
        )}

        {/* WhatsApp row */}
        {merchant.whatsappPhone && (
          <a
            href={merchant.whatsappDeepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 mb-3"
          >
            <WhatsAppIcon size={16} className="text-[#25D366]" />
            <span className="text-[12px] text-[#ADB5BD]">{merchant.whatsappPhone}</span>
          </a>
        )}

        {/* Save + Browse row */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={downloadVCard}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-[12px] font-medium px-4 py-2 rounded-full transition-colors"
          >
            <UserPlus size={14} />
            Save {merchant.displayName}
          </button>
          <button
            onClick={onBrowseMode}
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-[12px] font-medium px-4 py-2 rounded-full transition-colors"
          >
            <Play size={11} fill="white" strokeWidth={0} />
            Browse Mode
          </button>
        </div>
      </div>

      {/* Sign-in prompt */}
      {!signInDismissed && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF]">
          <p className="flex-1 text-[12px] text-[#6C757D] leading-snug">
            Sign in to save products, track orders, and get updates
          </p>
          <a
            href="/auth/customer/login"
            className="text-[12px] text-brand-orange font-semibold shrink-0"
          >
            Sign in
          </a>
          <button
            onClick={() => setSignInDismissed(true)}
            aria-label="Dismiss"
            className="text-[#ADB5BD] shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
