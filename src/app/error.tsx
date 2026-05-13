"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-[28px] font-bold text-[#212529] mb-3">Something went wrong</h1>
        <p className="text-[16px] text-[#6C757D] mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 h-11 rounded-full bg-brand-orange text-white text-[14px] font-semibold hover:bg-brand-orange-hover transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
