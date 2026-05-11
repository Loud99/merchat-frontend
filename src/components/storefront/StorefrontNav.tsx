import Image from "next/image";
import { Merchant } from "@/types";
import { hexToRgba, formatNaira, getInitials } from "@/lib/storefront";

export default function StorefrontNav({ merchant }: { merchant: Merchant }) {
  const { displayName, logoUrl, primaryColour, deliveryAreas, deliveryFee, whatsappDeepLink } = merchant;
  const initials = getInitials(displayName);
  const deliveryText =
    deliveryFee === null || deliveryFee === 0
      ? `Free delivery to: ${deliveryAreas}`
      : `Delivery fee: ${formatNaira(deliveryFee)}`;

  return (
    <>
      <nav
        className="sticky top-0 z-40 h-[60px] flex items-center px-4 lg:px-6"
        style={{ backgroundColor: primaryColour }}
      >
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between gap-4">
          {/* Left: logo + name */}
          <div className="flex items-center gap-3 min-w-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={displayName}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border-2 border-white/30 shrink-0"
              />
            ) : (
              <Image
                src="/images/icon-light.svg"
                alt="Merchat.io"
                width={32}
                height={36}
                unoptimized
                style={{ width: 32, height: "auto" }}
              />
            )}
            <span className="text-white font-bold text-[18px] truncate">{displayName}</span>
          </div>

          {/* Right: WhatsApp CTA */}
          <a
            href={whatsappDeepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white font-semibold text-[14px] px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all"
            style={{ color: primaryColour }}
          >
            Order on WhatsApp
          </a>
        </div>
      </nav>

      {/* Delivery strip */}
      <div
        className="py-2 text-center text-[13px] font-medium"
        style={{
          backgroundColor: hexToRgba(primaryColour, 0.12),
          color: primaryColour,
        }}
      >
        {deliveryText}
      </div>
    </>
  );
}
