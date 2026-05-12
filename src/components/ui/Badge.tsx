import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info" | "neutral" | "dark" | "orange";
  size?: "sm" | "md";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  success: "bg-[#E8FAF0] text-[#00C853]",
  warning: "bg-[#FFF3E0] text-[#E65100]",
  error:   "bg-[#FFEBEE] text-[#F44336]",
  info:    "bg-[#E3F2FD] text-[#1565C0]",
  neutral: "bg-[#F1F3F5] text-[#6C757D]",
  dark:    "bg-[#0B1221] text-white",
  orange:  "bg-brand-orange text-white",
};

const sizes: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-3 py-1 text-xs",
};

function Badge({ className, variant = "neutral", size = "md", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold tracking-wide",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
