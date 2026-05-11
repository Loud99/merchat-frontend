const merchants = [
  "⭐ Fashion by Amina — Lagos",
  "⭐ Mama Chukwu's Kitchen — Abuja",
  "⭐ Ikenna Electronics — Port Harcourt",
  "⭐ Grace Fabrics — Ibadan",
  "⭐ TechHub Lagos — Victoria Island",
];

export default function SocialProofBar() {
  return (
    <div className="bg-brand-warm overflow-hidden">
      <div className="h-[72px] flex items-center overflow-x-auto no-scrollbar">
        <div className="flex items-center shrink-0 px-6 lg:mx-auto">
          {merchants.map((m, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-[14px] font-medium text-brand-navy whitespace-nowrap px-6 lg:px-8">
                {m}
              </span>
              {i < merchants.length - 1 && (
                <div className="w-px h-5 bg-[#C4BBAF] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
