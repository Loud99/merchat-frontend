"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "whatsapp";
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
      "inline-flex items-center justify-center font-semibold rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-brand-orange text-white hover:bg-brand-orange-hover shadow-sm hover:shadow-orange",
      secondary:
        "bg-transparent text-brand-navy border-[1.5px] border-brand-navy hover:bg-brand-navy/10",
      ghost:
        "bg-transparent text-grey-600 hover:bg-grey-100",
      danger:
        "bg-error text-white hover:opacity-90",
      whatsapp:
        "bg-wa-green text-white hover:opacity-90",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "py-2.5 px-5 text-[13px] gap-1.5",
      md: "py-[14px] px-7 text-[15px] gap-2",
      lg: "py-4 px-9 text-base gap-2",
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
