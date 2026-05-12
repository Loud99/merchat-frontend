"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, required, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#343A40] tracking-wide">
            {label}
            {required && <span className="text-brand-orange ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            className={cn(
              "w-full h-12 rounded-lg border-[1.5px] border-[#E9ECEF] bg-[#F1F3F5] px-4 text-[16px] text-[#343A40] placeholder:text-[#ADB5BD] transition-colors",
              "focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 focus:bg-white",
              "disabled:opacity-50 disabled:bg-grey-100 disabled:cursor-not-allowed",
              error && "border-error focus:border-error focus:ring-error/15",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-error">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6C757D]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
