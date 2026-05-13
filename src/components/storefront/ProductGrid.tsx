"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, ShoppingCart, Minus, Plus, Trash2, Package,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Merchant, Product, CartItem } from "@/types";
import { formatNaira, buildWALink } from "@/lib/storefront";

// ── constants ──────────────────────────────────────────────────────────────────
const ORANGE = "#D5652B";

function cartItemKey(productId: string, variants: Record<string, string>) {
  return `${productId}||${Object.entries(variants)
    .sort()
    .map(([k, v]) => `${k}:${v}`)
    .join(",")}`;
}

function buildWAMessage(cart: CartItem[], storeName: string): string {
  const lines = cart.map((item) => {
    const vText = Object.entries(item.selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    return `• ${item.product.name}${vText ? ` (${vText})` : ""} × ${item.quantity} — ${formatNaira(item.product.price * item.quantity)}`;
  });
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return (
    `Hi! I'd like to place an order from ${storeName}:\n\n` +
    `🛍️ My Order:\n${lines.join("\n")}\n\n` +
    `💰 Total: ${formatNaira(total)}\n\n` +
    `Please confirm availability and payment details. Thank you!`
  );
}

// ── WhatsApp SVG ──────────────────────────────────────────────────────────────

function WAIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Image carousel ────────────────────────────────────────────────────────────

function ImageCarousel({
  images,
  height,
}: {
  images: string[];
  height: string;
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [images]);
  const total = images.length;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + total) % total);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % total);
  };

  return (
    <div className={`relative ${height} w-full overflow-hidden bg-[#F1F3F5]`}>
      {total > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={images[idx]}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-[#F1F3F5]" />
      )}

      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={15} className="text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={15} className="text-white" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${
                  i === idx ? "w-3 h-[3px] bg-white" : "w-[3px] h-[3px] bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onOpen,
  onAddToCart,
}: {
  product: Product;
  onOpen: () => void;
  onAddToCart: (variants: Record<string, string>) => void;
}) {
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    if (product.variants.length > 0) {
      onOpen();
    } else {
      onAddToCart({});
    }
  };

  const showLowStock =
    product.inStock && product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer"
      onClick={onOpen}
    >
      {/* Image area */}
      <div className="relative">
        <ImageCarousel images={product.imageUrls} height="h-[200px] lg:h-[220px]" />

        {/* Out-of-stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-[12px] font-semibold bg-black/30 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.payOnDelivery && (
            <span className="text-[10px] font-semibold text-white bg-[#FF9800] px-2 py-0.5 rounded-full leading-tight">
              Pay on delivery
            </span>
          )}
          {product.isNew && (
            <span
              className="text-[10px] font-semibold text-white px-2 py-0.5 rounded-full leading-tight"
              style={{ backgroundColor: ORANGE }}
            >
              New
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-[14px] font-semibold text-[#212529] line-clamp-2 mb-1 leading-snug">
          {product.name}
        </p>

        <p className="text-[18px] font-bold text-[#212529] mb-1">
          {formatNaira(product.price)}
        </p>

        {showLowStock && (
          <p className="text-[11px] font-medium text-[#FF9800] mb-2">
            Only {product.stockQuantity} left
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`w-full h-9 rounded-full text-[13px] font-semibold transition-all ${
            product.inStock
              ? "text-white hover:opacity-90 active:scale-[0.97]"
              : "bg-[#ADB5BD] text-white cursor-not-allowed"
          }`}
          style={product.inStock ? { backgroundColor: ORANGE } : undefined}
        >
          {product.inStock ? "Add to cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}

// ── Product modal ─────────────────────────────────────────────────────────────

function ProductModal({
  product,
  merchant,
  visible,
  onClose,
  onAddToCart,
}: {
  product: Product | null;
  merchant: Merchant;
  visible: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variants: Record<string, string>, qty: number) => void;
}) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSelectedVariants(
      Object.fromEntries(product.variants.map((v) => [v.label, v.options[0]]))
    );
    setQty(1);
    setShowMore(false);
  }, [product]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!product) return null;

  const maxQty = product.stockQuantity > 0 ? product.stockQuantity : 99;
  const total = product.price * qty;

  const stockDot =
    !product.inStock
      ? { color: "#F44336", text: "Out of stock" }
      : product.stockQuantity <= 5 && product.stockQuantity > 0
      ? { color: "#FF9800", text: `Only ${product.stockQuantity} left` }
      : { color: ORANGE, text: `In stock (${product.stockQuantity} available)` };

  const waMessage = `Hi, I'm interested in ${product.name}`;
  const waLink = buildWALink(merchant.whatsappDeepLink, waMessage);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-250 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed z-50 bg-white overflow-y-auto
          inset-x-0 bottom-0 rounded-t-[24px] max-h-[92vh]
          lg:inset-0 lg:m-auto lg:rounded-2xl lg:w-full lg:max-w-[640px] lg:h-fit lg:max-h-[90vh]
          transition-all duration-300 ease-out
          ${
            visible
              ? "translate-y-0 opacity-100 lg:scale-100"
              : "translate-y-full opacity-0 lg:translate-y-0 lg:scale-95"
          }`}
      >
        {/* Drag handle (mobile) */}
        <div className="lg:hidden flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 bg-[#DEE2E6] rounded-full" />
        </div>

        {/* Image carousel */}
        <div className="relative h-[300px] lg:h-[360px] bg-[#F1F3F5]">
          <ImageCarousel images={product.imageUrls} height="h-[300px] lg:h-[360px]" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 lg:p-6">
          <h2 className="text-[28px] font-bold text-[#212529] mb-2 leading-tight">
            {product.name}
          </h2>

          {/* Price row */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-[36px] font-extrabold text-[#212529] leading-none">
              {formatNaira(product.price)}
            </span>
            {product.payOnDelivery && (
              <span className="text-[12px] font-semibold text-white bg-[#FF9800] px-3 py-1 rounded-full">
                Pay on delivery available
              </span>
            )}
          </div>

          {/* Stock indicator */}
          <div className="flex items-center gap-1.5 mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: stockDot.color }}
            />
            <span
              className="text-[12px] font-medium"
              style={{ color: stockDot.color }}
            >
              {stockDot.text}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-4">
              <p
                className={`text-[15px] text-[#6C757D] leading-[1.7] ${
                  showMore ? "" : "line-clamp-3"
                }`}
              >
                {product.description}
              </p>
              {product.description.length > 120 && (
                <button
                  onClick={() => setShowMore((v) => !v)}
                  className="text-[13px] font-medium mt-1"
                  style={{ color: ORANGE }}
                >
                  {showMore ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {/* Variants */}
          {product.variants.map((v) => (
            <div key={v.label} className="mb-4">
              <p className="text-[13px] font-semibold text-[#343A40] mb-2">
                {v.label}
              </p>
              <div className="flex flex-wrap gap-2 overflow-x-auto">
                {v.options.map((opt) => {
                  const selected = selectedVariants[v.label] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        setSelectedVariants((prev) => ({
                          ...prev,
                          [v.label]: opt,
                        }))
                      }
                      className="min-w-[48px] h-9 px-4 rounded-full text-[13px] font-medium border-[1.5px] transition-all"
                      style={
                        selected
                          ? {
                              backgroundColor: ORANGE,
                              color: "#fff",
                              borderColor: ORANGE,
                            }
                          : {
                              backgroundColor: "#F1F3F5",
                              color: "#343A40",
                              borderColor: "#E9ECEF",
                            }
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity selector */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-md border-[1.5px] border-[#DEE2E6] flex items-center justify-center hover:border-[#ADB5BD] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="text-[18px] font-bold text-[#212529] min-w-[48px] text-center">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              className="w-9 h-9 rounded-md border-[1.5px] border-[#DEE2E6] flex items-center justify-center hover:border-[#ADB5BD] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => {
              if (!product.inStock) return;
              onAddToCart(product, selectedVariants, qty);
              onClose();
            }}
            disabled={!product.inStock}
            className={`w-full h-[52px] rounded-full text-white text-[16px] font-bold mb-3 transition-all ${
              product.inStock
                ? "hover:opacity-90 active:scale-[0.98]"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{ backgroundColor: ORANGE }}
          >
            {product.inStock
              ? `Add to Cart · ${formatNaira(total)}`
              : "Out of Stock"}
          </button>

          {/* Order via WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-full border-2 border-[#0B1221] text-[#0B1221] text-[15px] font-semibold hover:bg-[#0B1221]/5 transition-colors"
          >
            <WAIcon size={20} className="text-[#25D366]" />
            Order via WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

// ── Cart drawer ───────────────────────────────────────────────────────────────

function CartDrawer({
  open,
  cart,
  merchant,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  cart: CartItem[];
  merchant: Merchant;
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
}) {
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Right drawer on desktop, bottom sheet on mobile */}
      <div
        className={`fixed z-50 bg-white flex flex-col transition-transform duration-300 shadow-2xl
          inset-x-0 bottom-0 rounded-t-2xl max-h-[90vh]
          lg:inset-y-0 lg:right-0 lg:left-auto lg:top-0 lg:bottom-0 lg:w-[400px] lg:max-h-none lg:rounded-none
          ${open ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-y-0 lg:translate-x-full"}`}
      >
        {/* Handle (mobile) */}
        <div className="lg:hidden flex justify-center pt-3">
          <div className="w-8 h-1 bg-[#DEE2E6] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9ECEF]">
          <div>
            <h2 className="text-[18px] font-bold text-[#212529]">My Cart</h2>
            {count > 0 && (
              <p className="text-[13px] text-[#6C757D]">
                {count} item{count !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#ADB5BD] hover:text-[#212529] hover:bg-[#F1F3F5] transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <ShoppingCart size={48} className="text-[#DEE2E6]" strokeWidth={1} />
              <p className="text-[18px] font-semibold text-[#6C757D]">
                Your cart is empty
              </p>
              <p className="text-[14px] text-[#ADB5BD]">
                Browse products to add items
              </p>
              <button
                onClick={onClose}
                className="mt-2 h-11 px-8 rounded-full text-white text-[14px] font-semibold"
                style={{ backgroundColor: ORANGE }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {cart.map((item) => {
                const key = cartItemKey(item.product.id, item.selectedVariants);
                const vText = Object.entries(item.selectedVariants)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" · ");
                return (
                  <div
                    key={key}
                    className="flex gap-3 py-4 border-b border-[#F1F3F5] last:border-0"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#F1F3F5]">
                      {item.product.imageUrls[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.imageUrls[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#E9ECEF]" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-[14px] font-semibold text-[#212529] line-clamp-2 leading-snug">
                          {item.product.name}
                        </p>
                        <button
                          onClick={() => onRemove(key)}
                          className="shrink-0 text-[#ADB5BD] hover:text-[#F44336] transition-colors ml-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      {vText && (
                        <p className="text-[12px] text-[#6C757D] mt-0.5">{vText}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onUpdateQty(key, -1)}
                            className="w-7 h-7 rounded-md border border-[#DEE2E6] flex items-center justify-center hover:border-[#ADB5BD] transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-[14px] font-semibold text-[#212529] w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(key, 1)}
                            className="w-7 h-7 rounded-md border border-[#DEE2E6] flex items-center justify-center hover:border-[#ADB5BD] transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <p className="text-[14px] font-bold text-[#212529]">
                          {formatNaira(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="shrink-0 px-5 pt-4 pb-8 border-t border-[#E9ECEF] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-[#6C757D]">Subtotal</span>
              <span className="text-[15px] font-semibold text-[#6C757D]">
                {formatNaira(total)}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-[13px] text-[#ADB5BD]">Delivery</span>
              <span className="text-[13px] text-[#ADB5BD] italic">
                To be confirmed
              </span>
            </div>
            <div className="border-t border-[#E9ECEF] pt-2 flex items-center justify-between mb-4">
              <span className="text-[16px] font-bold text-[#212529]">Total</span>
              <span className="text-[18px] font-bold text-[#212529]">
                {formatNaira(total)}
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="flex items-center justify-center gap-2 w-full h-[52px] rounded-full text-white text-[16px] font-bold hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ backgroundColor: ORANGE }}
            >
              <WAIcon size={22} />
              Order via WhatsApp
            </button>

            <button
              onClick={onClose}
              className="w-full text-center py-2.5 text-[14px] font-medium text-[#6C757D]"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Order confirmation ────────────────────────────────────────────────────────

function OrderConfirmation({
  storeName,
  waLink,
  onContinue,
}: {
  storeName: string;
  waLink: string;
  onContinue: () => void;
}) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setScale(1), 80);
    return () => clearTimeout(t);
  }, []);

  // Open WhatsApp after short delay
  useEffect(() => {
    const t = setTimeout(() => {
      window.open(waLink, "_blank", "noopener,noreferrer");
    }, 900);
    return () => clearTimeout(t);
  }, [waLink]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center gap-6 px-8 text-center">
      {/* Animated check */}
      <div
        style={{
          transform: `scale(${scale})`,
          transition: "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="40" cy="40" r="40" fill={ORANGE} fillOpacity="0.12" />
          <circle cx="40" cy="40" r="32" fill={ORANGE} fillOpacity="0.2" />
          <circle cx="40" cy="40" r="24" fill={ORANGE} />
          <path
            d="M28 40l9 9 15-18"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <h2 className="text-[32px] font-extrabold text-[#212529] mb-3">
          Order Sent!
        </h2>
        <p className="text-[16px] text-[#6C757D] leading-relaxed max-w-[320px]">
          Your order has been sent to{" "}
          <strong className="text-[#212529]">{storeName}</strong> on WhatsApp.
          They&apos;ll confirm availability and payment details shortly.
        </p>
      </div>

      <div className="flex items-center gap-2 text-[13px] text-[#ADB5BD]">
        <WAIcon size={16} className="animate-spin text-[#25D366]" />
        Opening WhatsApp&hellip;
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        <button
          onClick={onContinue}
          className="w-full h-12 rounded-full border-2 border-[#0B1221] text-[#0B1221] text-[15px] font-semibold hover:bg-[#0B1221]/5 transition-colors"
        >
          Continue shopping
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-medium text-center"
          style={{ color: ORANGE }}
        >
          Open WhatsApp manually
        </a>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center py-24 gap-4 text-center px-6">
      <Package size={64} className="text-[#DEE2E6]" strokeWidth={1} />
      <h3 className="text-[18px] font-bold text-[#6C757D]">No products yet</h3>
      <p className="text-[15px] text-[#ADB5BD] max-w-xs">
        This store is still setting up. Check back soon!
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface ProductGridProps {
  merchant: Merchant;
  products: Product[];
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  onAddToCart: (product: Product, variants: Record<string, string>, qty?: number) => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
}

export default function ProductGrid({
  merchant,
  products,
  cart,
  cartOpen,
  setCartOpen,
  onAddToCart,
  onUpdateQty,
  onRemoveItem,
}: ProductGridProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const openModal = useCallback((p: Product) => {
    setActiveProduct(p);
    requestAnimationFrame(() => setModalVisible(true));
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setActiveProduct(null), 320);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product, variants: Record<string, string>, qty = 1) => {
      onAddToCart(product, variants, qty);
    },
    [onAddToCart]
  );

  const handleCheckout = useCallback(() => {
    const msg = buildWAMessage(cart, merchant.displayName);
    const waLink = buildWALink(merchant.whatsappDeepLink, msg);
    setCartOpen(false);
    setConfirmation(waLink);
  }, [cart, merchant, setCartOpen]);

  return (
    <>
      <div className="bg-[#F8F9FA] p-3 lg:p-4">
        {products.length === 0 ? (
          <div className="grid grid-cols-2">
            <EmptyState />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpen={() => openModal(p)}
                onAddToCart={(variants) => handleAddToCart(p, variants)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal
        product={activeProduct}
        merchant={merchant}
        visible={modalVisible}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        open={cartOpen}
        cart={cart}
        merchant={merchant}
        onClose={() => setCartOpen(false)}
        onUpdateQty={onUpdateQty}
        onRemove={onRemoveItem}
        onCheckout={handleCheckout}
      />

      {confirmation && (
        <OrderConfirmation
          storeName={merchant.displayName}
          waLink={confirmation}
          onContinue={() => setConfirmation(null)}
        />
      )}
    </>
  );
}
