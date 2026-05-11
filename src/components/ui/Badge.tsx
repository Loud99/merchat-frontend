import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "navy" | "orange" | "success" | "warning" | "danger" | "gray";
  size?: "sm" | "md";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  navy: "bg-brand-navy text-white",
  orange: "bg-brand-orange text-white",
  success: "bg-green-100 text-success",
  warning: "bg-amber-100 text-warning",
  danger: "bg-red-100 text-danger",
  gray: "bg-gray-100 text-gray-600",
};

const sizes: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs font-medium",
};

function Badge({ className, variant = "gray", size = "md", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
