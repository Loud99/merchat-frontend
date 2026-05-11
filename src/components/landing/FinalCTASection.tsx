import Link from "next/link";

export default function FinalCTASection() {
  return (
    <section className="bg-brand-orange py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-[28px] lg:text-[36px] font-bold text-white mb-4">
          Your AI salesperson is ready. Are you?
        </h2>
        <p className="text-[18px] text-white/85 mb-10 max-w-xl mx-auto leading-relaxed">
          Join merchants across Nigeria who&apos;ve automated their WhatsApp sales. Setup takes 10 minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/onboarding"
            className="bg-white text-brand-orange font-semibold text-[15px] px-7 py-[14px] rounded-lg hover:bg-white/90 active:scale-[0.98] transition-all"
          >
            Start for free →
          </Link>
          <a
            href="#"
            className="border-2 border-white text-white font-semibold text-[15px] px-7 py-[14px] rounded-lg hover:bg-white/10 transition-colors"
          >
            Book a demo
          </a>
        </div>
      </div>
    </section>
  );
}
