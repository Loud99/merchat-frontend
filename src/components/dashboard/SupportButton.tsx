"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";


type ModalStatus = "idle" | "sending" | "sent" | "error";

export default function SupportButton({
  merchantName,
  merchantEmail,
}: {
  merchantName: string;
  merchantEmail: string;
}) {
  const [open, setOpen]       = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<ModalStatus>("idle");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSend() {
    if (!message.trim() || status === "sending") return;
    setStatus("sending");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("support_tickets").insert({
      merchant_id: user?.id ?? null,
      message: message.trim(),
      status: "open",
    });

    setStatus(error ? "error" : "sent");
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setMessage("");
      setStatus("idle");
    }, 250);
  }

  return (
    <>
      {/* Floating button — above mobile bottom nav (z-40), below modals */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Contact support"
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-[45] w-13 h-13 w-[52px] h-[52px] rounded-full bg-brand-navy text-white shadow-[0_4px_16px_rgba(24,46,71,0.35)] hover:bg-[#1E3D5C] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
      >
        <MessageCircle size={22} strokeWidth={1.5} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className="relative bg-white w-full sm:max-w-[440px] rounded-t-2xl sm:rounded-2xl shadow-2xl z-10 overflow-hidden"
            role="dialog"
            aria-label="Contact support"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center shrink-0">
                  <MessageCircle size={17} className="text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-brand-navy leading-tight">Contact Support</h2>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">We respond within 2 hours</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="p-1.5 -mr-1.5 rounded-lg text-[#9CA3AF] hover:text-brand-navy hover:bg-[#F3F4F6] transition-colors"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5">
              {status === "sent" ? (
                /* ── Success state ── */
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-[#16A34A]" strokeWidth={1.5} />
                  </div>
                  <p className="text-[17px] font-bold text-brand-navy mb-1">Message sent!</p>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed max-w-xs">
                    Our team will respond within 2 hours.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 h-10 px-7 rounded-xl bg-brand-navy text-white text-[14px] font-semibold hover:bg-[#1E3D5C] transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <>
                  {/* Pre-filled merchant info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">Name</label>
                      <input
                        readOnly
                        value={merchantName}
                        className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy bg-[#F9FAFB] cursor-default select-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">Email</label>
                      <input
                        readOnly
                        value={merchantEmail}
                        className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy bg-[#F9FAFB] cursor-default select-none truncate"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                      Message
                    </label>
                    <textarea
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Describe your issue or question…"
                      className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 resize-none transition-colors"
                    />
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <p className="text-[12px] text-[#EF4444] mb-3">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || status === "sending"}
                    className="w-full h-11 rounded-xl bg-brand-navy text-white text-[14px] font-semibold hover:bg-[#1E3D5C] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={15} strokeWidth={1.5} />
                        Send to Support
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
