import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-[72px] font-bold text-[#DEE2E6] leading-none mb-4">404</h1>
        <h2 className="text-[24px] font-bold text-[#212529] mb-3">Page not found</h2>
        <p className="text-[16px] text-[#6C757D] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 h-11 leading-[44px] rounded-full bg-brand-orange text-white text-[14px] font-semibold hover:bg-brand-orange-hover transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
