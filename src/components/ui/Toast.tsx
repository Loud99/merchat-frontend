"use client";

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  ReactNode,
} from "react";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastOptions extends Omit<ToastItem, "id"> {
  duration?: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

type Action = { type: "ADD"; item: ToastItem } | { type: "REMOVE"; id: string };

function reducer(state: ToastItem[], action: Action): ToastItem[] {
  if (action.type === "ADD") return [...state, action.item];
  if (action.type === "REMOVE") return state.filter((t) => t.id !== action.id);
  return state;
}

const icons: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles: Record<ToastVariant, string> = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-brand-navy",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const toast = useCallback(
    ({ duration = 4000, variant = "info", ...rest }: ToastOptions) => {
      const id = crypto.randomUUID();
      dispatch({ type: "ADD", item: { id, variant, ...rest } });
      if (duration > 0) {
        setTimeout(() => dispatch({ type: "REMOVE", id }), duration);
      }
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      >
        {toasts.map((t) => {
          const Icon = icons[t.variant];
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
              )}
            >
              <Icon size={18} className={cn("mt-0.5 shrink-0", variantStyles[t.variant])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-navy">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-gray-500">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: "REMOVE", id: t.id })}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
