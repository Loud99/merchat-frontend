import Link from "next/link";

export default function StorefrontFooter() {
  return (
    <footer className="bg-brand-navy py-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[13px]">
          <span className="text-white/50">Powered by </span>
          <Link href="/" className="text-white font-semibold hover:opacity-80 transition-opacity">
            Merchat.io
          </Link>
        </p>
        <p className="text-[13px] text-white/60">
          Want a store like this?{" "}
          <Link href="/onboarding" className="text-brand-orange font-semibold hover:opacity-80 transition-opacity">
            Start for free →
          </Link>
        </p>
      </div>
    </footer>
  );
}
