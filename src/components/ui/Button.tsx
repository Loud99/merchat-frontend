"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "orange" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary: "bg-brand-navy text-white hover:bg-brand-navy-mid",
      secondary: "bg-white text-brand-navy border border-gray-200 hover:bg-gray-50",
      orange: "bg-brand-orange text-white hover:opacity-90",
      ghost: "text-brand-navy hover:bg-gray-100",
      danger: "bg-danger text-white hover:opacity-90",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-8 px-3 text-sm gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant!], sizes[size!], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
