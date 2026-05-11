import { Merchant } from "@/types";
import { formatNaira, getInitials } from "@/lib/storefront";

export default function StoreHeader({ merchant }: { merchant: Merchant }) {
  const { displayName, description, logoUrl, primaryColour, deliveryAreas, deliveryFee } = merchant;
  const initials = getInitials(displayName);
  const feeLabel = deliveryFee === null || deliveryFee === 0 ? "Free delivery" : formatNaira(deliveryFee);

  return (
    <div className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[800px] mx-auto px-6 py-10 flex flex-col items-center text-center">
        {/* Logo / initials */}
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={displayName}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover mb-4"
            style={{ border: `3px solid ${primaryColour}` }}
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-[32px] font-bold mb-4"
            style={{ backgroundColor: primaryColour }}
          >
            {initials}
          </div>
        )}

        <h1 className="text-[28px] lg:text-[32px] font-extrabold text-brand-navy mb-2">
          {displayName}
        </h1>

        <p className="text-[16px] text-[#6B7280] max-w-lg leading-relaxed mb-5 line-clamp-2">
          {description}
        </p>

        {/* Delivery chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#374151] bg-[#F3F4F6] px-3 py-1.5 rounded-full">
            📍 {deliveryAreas}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-full text-white"
            style={{ backgroundColor: primaryColour }}
          >
            🚚 {feeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
