"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X, SlidersHorizontal, ShoppingBag, ChevronLeft, ChevronRight,
  ArrowUp, Minus, Plus, Trash2,
} from "lucide-react";
import { Product, Merchant, CartItem } from "@/types";
import { formatNaira, buildWALink } from "@/lib/storefront";

// ── Types ─────────────────────────────────────────────────────────────────────

type Sheet = "action" | "detail" | "filter" | "cart" | null;

// ── Helpers ───────────────────────────────────────────────────────────────────

const GRADIENTS: Record<string, [string, string]> = {
  Dresses:     ["#f97316", "#ec4899"],
  Shoes:       ["#7c3aed", "#2563eb"],
  Bags:        ["#92400e", "#d97706"],
  Accessories: ["#d97706", "#ca8a04"],
};

function grad(category: string) {
  const [from, to] = GRADIENTS[category] ?? ["#6b7280", "#374151"];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

function cartKey(productId: string, v: Record<string, string>) {
  return `${productId}||${Object.entries(v).sort().map(([k, val]) => `${k}:${val}`).join(",")}`;
}

function buildWhatsAppMsg(cart: CartItem[], storeName: string): string {
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const lines = cart.map(i => {
    const vText = Object.entries(i.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ");
    return `• ${i.product.name}${vText ? ` (${vText})` : ""} × ${i.quantity} — ${formatNaira(i.product.price * i.quantity)}`;
  });
  return (
    `Hi! I'd like to place an order from ${storeName}:\n\n` +
    `🛍️ My Order:\n${lines.join("\n")}\n\n` +
    `💰 Total: ${formatNaira(total)}\n\n` +
    `Please confirm availability and payment details. Thank you!`
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed top-8 left-1/2 z-[200] pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${visible ? "0" : "-20px"})`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s, transform 0.25s",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-[14px] font-semibold text-[#182E47]">Added to cart ✓</span>
      </div>
    </div>
  );
}

// ── Cart Screen ───────────────────────────────────────────────────────────────

function CartScreen({
  cart, merchant, onClose, onUpdateQty, onRemove,
}: {
  cart: CartItem[];
  merchant: Merchant;
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
}) {
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-[180] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#E5E7EB] shrink-0 safe-top">
        <button onClick={onClose} className="text-[#182E47] p-1" aria-label="Close cart">
          <X size={22} />
        </button>
        <h2 className="flex-1 text-[18px] font-bold text-[#182E47]">Your cart</h2>
        {itemCount > 0 && (
          <span className="text-[13px] text-[#6B7280]">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <ShoppingBag size={52} className="text-[#D1D5DB]" />
          <p className="text-[20px] font-bold text-[#182E47]">Your cart is empty</p>
          <p className="text-[14px] text-[#6B7280]">Browse products and swipe up to add them here.</p>
          <button
            onClick={onClose}
            className="mt-2 h-11 px-8 rounded-xl text-white text-[14px] font-semibold"
            style={{ backgroundColor: merchant.primaryColour }}
          >
            Keep browsing
          </button>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0">
            {cart.map(item => {
              const key = cartKey(item.product.id, item.selectedVariants);
              const vText = Object.entries(item.selectedVariants)
                .map(([k, v]) => `${k}: ${v}`).join(", ");
              return (
                <div key={key} className="flex gap-3 py-4 border-b border-[#F3F4F6]">
                  {/* Thumb */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#F3F4F6]">
                    {item.product.imageUrls.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ background: grad(item.product.category) }} />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#182E47] line-clamp-1">{item.product.name}</p>
                    {vText && <p className="text-[12px] text-[#9CA3AF] mt-0.5">{vText}</p>}
                    <p className="text-[14px] font-bold mt-0.5" style={{ color: merchant.primaryColour }}>
                      {formatNaira(item.product.price * item.quantity)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQty(key, -1)}
                        className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center"
                        aria-label="Decrease"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-[14px] font-semibold text-[#182E47] w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(key, 1)}
                        className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center"
                        aria-label="Increase"
                      >
                        <Plus size={12} />
                      </button>
                      <button onClick={() => onRemove(key)} className="ml-1 text-[#EF4444]" aria-label="Remove">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="shrink-0 px-4 pt-4 pb-8 border-t border-[#E5E7EB] space-y-3 bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[14px] text-[#6B7280]">Order total</span>
              <span className="text-[22px] font-bold text-[#182E47]">{formatNaira(total)}</span>
            </div>
            <a
              href={buildWALink(merchant.whatsappDeepLink, buildWhatsAppMsg(cart, merchant.displayName))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full h-12 rounded-xl text-white text-[15px] font-semibold"
              style={{ backgroundColor: "#25D366" }}
            >
              Order on WhatsApp
            </a>
            <button
              className="flex items-center justify-center w-full h-12 rounded-xl border-2 text-[15px] font-semibold"
              style={{ color: merchant.primaryColour, borderColor: merchant.primaryColour }}
            >
              Order on web
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Detail Panel (center tap) ─────────────────────────────────────────────────

function DetailPanel({
  product, merchant, visible, onDismiss,
}: {
  product: Product;
  merchant: Merchant;
  visible: boolean;
  onDismiss: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => { setImgIdx(0); }, [product.id]);

  const total = product.imageUrls.length;

  return (
    <>
      {/* Blur backdrop */}
      <div
        onClick={onDismiss}
        className="absolute inset-0 transition-all duration-300"
        style={{
          backdropFilter: visible ? "blur(6px)" : "blur(0px)",
          backgroundColor: visible ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
          pointerEvents: visible ? "auto" : "none",
        }}
      />
      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 rounded-t-3xl overflow-hidden"
        style={{
          height: "62%",
          background: "#0F1421",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Image carousel */}
        <div className="relative h-48 shrink-0 bg-black">
          {total > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrls[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: grad(product.category) }} />
          )}
          {total > 1 && (
            <>
              <button
                onClick={() => setImgIdx(i => (i - 1 + total) % total)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
              >
                <ChevronLeft size={16} className="text-white" />
              </button>
              <button
                onClick={() => setImgIdx(i => (i + 1) % total)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
              >
                <ChevronRight size={16} className="text-white" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.imageUrls.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-4 bg-white" : "w-1.5 bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(100%-12rem)] px-5 py-4">
          <h3 className="text-[20px] font-bold text-white mb-1">{product.name}</h3>
          <p className="text-[22px] font-bold mb-3" style={{ color: merchant.primaryColour }}>
            {formatNaira(product.price)}
          </p>

          {product.description && (
            <p className="text-[14px] text-white/60 leading-relaxed mb-4">{product.description}</p>
          )}

          {/* Variant display */}
          {product.variants.map(v => (
            <div key={v.label} className="mb-3">
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">{v.label}</p>
              <div className="flex flex-wrap gap-2">
                {v.options.map(opt => (
                  <span
                    key={opt}
                    className="px-3 py-1 rounded-full text-[12px] text-white/60 border border-white/15"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-3">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-400" : "bg-red-400"}`} />
            <span className="text-[13px] text-white/50">
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <p className="text-[12px] text-white/30 text-center mt-5">Tap anywhere to close</p>
        </div>
      </div>
    </>
  );
}

// ── Action / Variant Sheet (swipe up) ─────────────────────────────────────────

function ActionSheet({
  product,
  merchant,
  visible,
  selectedVariants,
  onVariantChange,
  onAddToCart,
  onOrderNow,
  onDismiss,
}: {
  product: Product | null;
  merchant: Merchant;
  visible: boolean;
  selectedVariants: Record<string, string>;
  onVariantChange: (label: string, option: string) => void;
  onAddToCart: () => void;
  onOrderNow: () => void;
  onDismiss: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onDismiss}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      />
      {/* Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 rounded-t-3xl z-20"
        style={{
          background: "#0F1421",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
          paddingBottom: "env(safe-area-inset-bottom, 24px)",
        }}
      >
        <div className="px-5 pt-4 pb-6">
          {/* Handle */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

          {product && (
            <>
              {/* Product preview row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  {product.imageUrls.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: grad(product.category) }} />
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-white leading-tight">{product.name}</p>
                  <p className="text-[13px] font-semibold mt-0.5" style={{ color: merchant.primaryColour }}>
                    {formatNaira(product.price)}
                  </p>
                </div>
              </div>

              {/* Variant pickers */}
              {product.variants.length > 0 && (
                <div className="mb-5 space-y-4">
                  {product.variants.map(v => (
                    <div key={v.label}>
                      <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">{v.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {v.options.map(opt => {
                          const active = selectedVariants[v.label] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => onVariantChange(v.label, opt)}
                              className="px-3 py-1.5 rounded-full text-[13px] font-medium border transition-all"
                              style={
                                active
                                  ? { backgroundColor: merchant.primaryColour, color: "#fff", borderColor: merchant.primaryColour }
                                  : { color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)" }
                              }
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onAddToCart}
                  className="w-full h-12 rounded-xl text-white text-[15px] font-bold"
                  style={{ backgroundColor: merchant.primaryColour }}
                >
                  Add to cart
                </button>
                <button
                  onClick={onOrderNow}
                  className="w-full h-12 rounded-xl border text-white text-[15px] font-semibold"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}
                >
                  Order now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Filter Sheet ──────────────────────────────────────────────────────────────

function FilterSheet({
  categories,
  active,
  merchant,
  visible,
  onSelect,
  onDismiss,
}: {
  categories: string[];
  active: string;
  merchant: Merchant;
  visible: boolean;
  onSelect: (cat: string) => void;
  onDismiss: () => void;
}) {
  return (
    <>
      <div
        onClick={onDismiss}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      />
      <div
        onClick={e => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 rounded-t-3xl z-20 px-5 pb-8 pt-4"
        style={{
          background: "#0F1421",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
        <p className="text-[16px] font-bold text-white mb-4">Filter by category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const sel = cat === active;
            return (
              <button
                key={cat}
                onClick={() => onSelect(cat)}
                className="px-4 py-2 rounded-full text-[13px] font-medium border transition-all"
                style={
                  sel
                    ? { backgroundColor: merchant.primaryColour, color: "#fff", borderColor: merchant.primaryColour }
                    : { color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)" }
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ScrollBrowseMode({
  products,
  merchant,
  cart,
  onAddToCart,
  onClose,
}: {
  products: Product[];
  merchant: Merchant;
  cart: CartItem[];
  onAddToCart: (product: Product, variants: Record<string, string>, qty?: number) => void;
  onClose: () => void;
}) {
  const inStock = products.filter(p => p.inStock);
  const categories = ["All", ...Array.from(new Set(inStock.map(p => p.category)))];

  const [filterCat, setFilterCat] = useState("All");
  const [index, setIndex] = useState(0);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [toastVisible, setToastVisible] = useState(false);
  const [imgKey, setImgKey] = useState(0); // used to trigger fade-in on product change

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const wasMoved = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = filterCat === "All"
    ? inStock
    : inStock.filter(p => p.category === filterCat);

  const current = filtered[index] ?? null;

  // Reset index + sheet when filter changes
  useEffect(() => {
    setIndex(0);
    setImgKey(k => k + 1);
    setSheet(null);
  }, [filterCat]);

  // Sync selectedVariants to current product
  useEffect(() => {
    if (!current) return;
    setSelectedVariants(
      Object.fromEntries(current.variants.map(v => [v.label, v.options[0] ?? ""]))
    );
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    if (filtered.length <= 1) return;
    setIndex(i => (i + 1) % filtered.length);
    setImgKey(k => k + 1);
    setSheet(null);
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    if (filtered.length <= 1) return;
    setIndex(i => (i - 1 + filtered.length) % filtered.length);
    setImgKey(k => k + 1);
    setSheet(null);
  }, [filtered.length]);

  // ── Touch handlers ─────────────────────────────────────────────────────────

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    wasMoved.current = false;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchStart.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStart.current.y);
    if (dx > 6 || dy > 6) wasMoved.current = true;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    touchStart.current = null;

    if (adx > 50 && adx > ady) {
      // Horizontal: left=next, right=prev
      if (sheet !== null) return; // don't navigate while a sheet is open
      dx < 0 ? goNext() : goPrev();
    } else if (dy < -50 && ady > adx) {
      // Swipe up
      if (sheet === null) setSheet("action");
    } else if (dy > 50 && ady > adx) {
      // Swipe down
      if (sheet === "action") setSheet(null);
    }
  }

  // Tap: open detail panel (distinguish from swipe)
  function onTap(e: React.MouseEvent) {
    if (wasMoved.current) return;
    // Ignore if a sheet is open (let sheets handle their own dismiss)
    if (sheet === "action" || sheet === "filter") return;
    if (sheet === "detail") { setSheet(null); return; }
    setSheet("detail");
  }

  // ── Cart helpers ───────────────────────────────────────────────────────────

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  // ── Sheet actions ──────────────────────────────────────────────────────────

  function handleAddToCart() {
    if (!current) return;
    onAddToCart(current, selectedVariants, 1);
    setSheet(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
  }

  function handleOrderNow() {
    if (!current) return;
    onAddToCart(current, selectedVariants, 1);
    setSheet("cart");
  }

  // ── Empty filtered state ───────────────────────────────────────────────────

  if (filtered.length === 0) {
    return (
      <div className="fixed inset-0 z-[150] bg-[#0F1421] flex flex-col items-center justify-center text-center px-8">
        <button
          onClick={onClose}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>
        <ShoppingBag size={48} className="text-white/20 mb-4" />
        <p className="text-[18px] font-bold text-white mb-2">No products in this category</p>
        <p className="text-[14px] text-white/50 mb-6">Try a different filter</p>
        <button
          onClick={() => setFilterCat("All")}
          className="h-11 px-6 rounded-xl text-white text-[14px] font-semibold border border-white/20"
        >
          Show all
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Injected animation */}
      <style>{`
        @keyframes sbm-fade { from { opacity: 0; } to { opacity: 1; } }
        .sbm-fade { animation: sbm-fade 0.35s ease-out both; }
      `}</style>

      {/* Full-screen viewer */}
      <div
        className="fixed inset-0 z-[150] bg-black overflow-hidden select-none"
        style={{ perspective: "800px" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onTap}
      >
        {/* Background image — remounts with fade on each product change */}
        {current && (
          <div key={imgKey} className="absolute inset-0 sbm-fade">
            {current.imageUrls.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.imageUrls[0]}
                alt={current.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full" style={{ background: grad(current.category) }} />
            )}
          </div>
        )}

        {/* Faint left / right arrow cues */}
        <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 opacity-25">
          <ChevronLeft size={32} className="text-white" />
        </div>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-25">
          <ChevronRight size={32} className="text-white" />
        </div>

        {/* Bottom gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "58%",
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%)",
          }}
        />

        {/* Product info — bottom */}
        {current && (
          <div className="absolute inset-x-0 bottom-0 px-5 pb-10 pointer-events-none">
            <p className="text-white text-[26px] font-bold leading-tight drop-shadow-md mb-1">
              {current.name}
            </p>
            <p className="text-white/85 text-[18px] font-semibold drop-shadow-sm mb-4">
              {formatNaira(current.price)}
            </p>
            <div className="flex items-center gap-1.5 opacity-45">
              <ArrowUp size={13} className="text-white" />
              <span className="text-white text-[12px] font-medium tracking-wide">Swipe up to add</span>
            </div>
          </div>
        )}

        {/* Top-left: Close */}
        <button
          onClick={e => { e.stopPropagation(); onClose(); }}
          className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
          aria-label="Exit scroll mode"
        >
          <X size={20} className="text-white" />
        </button>

        {/* Top-right: Filter + Cart */}
        <div className="absolute top-12 right-4 z-10 flex flex-col gap-3">
          <button
            onClick={e => { e.stopPropagation(); setSheet(s => s === "filter" ? null : "filter"); }}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
            aria-label="Filter"
          >
            <SlidersHorizontal size={18} className="text-white" />
          </button>

          <button
            onClick={e => { e.stopPropagation(); setSheet("cart"); }}
            className="relative w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
            aria-label="Cart"
          >
            <ShoppingBag size={18} className="text-white" />
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center px-0.5"
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Progress dots (up to 12 products) */}
        {filtered.length > 1 && filtered.length <= 12 && (
          <div className="absolute top-[54px] left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
            {filtered.map((_, i) => (
              <div
                key={i}
                className="rounded-full bg-white transition-all duration-200"
                style={{
                  width: i === index ? 16 : 6,
                  height: 6,
                  opacity: i === index ? 1 : 0.4,
                }}
              />
            ))}
          </div>
        )}

        {/* Detail panel — center tap */}
        {current && (
          <DetailPanel
            product={current}
            merchant={merchant}
            visible={sheet === "detail"}
            onDismiss={() => setSheet(null)}
          />
        )}

        {/* Filter sheet */}
        <FilterSheet
          categories={categories}
          active={filterCat}
          merchant={merchant}
          visible={sheet === "filter"}
          onSelect={cat => { setFilterCat(cat); setSheet(null); }}
          onDismiss={() => setSheet(null)}
        />

        {/* Action / Add-to-cart sheet */}
        <ActionSheet
          product={current}
          merchant={merchant}
          visible={sheet === "action"}
          selectedVariants={selectedVariants}
          onVariantChange={(label, opt) =>
            setSelectedVariants(prev => ({ ...prev, [label]: opt }))
          }
          onAddToCart={handleAddToCart}
          onOrderNow={handleOrderNow}
          onDismiss={() => setSheet(null)}
        />
      </div>

      {/* Cart — rendered outside viewer so it layers on top */}
      {sheet === "cart" && (
        <CartScreen
          cart={cart}
          merchant={merchant}
          onClose={() => setSheet(null)}
          onUpdateQty={() => {}}
          onRemove={() => {}}
        />
      )}

      {/* Success toast */}
      <Toast visible={toastVisible} />
    </>
  );
}
