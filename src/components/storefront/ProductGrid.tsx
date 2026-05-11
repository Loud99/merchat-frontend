"use client";

import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Layers, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Merchant, Product } from "@/types";
import { buildWALink, formatNaira } from "@/lib/storefront";
import ScrollBrowseMode from "@/components/storefront/ScrollBrowseMode";

// ── Cart ───────────────────────────────────────────────────────────────────────

interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

function loadCart(slug: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(`cart_${slug}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistCart(slug: string, items: CartItem[]) {
  try { sessionStorage.setItem(`cart_${slug}`, JSON.stringify(items)); } catch { /* ignore */ }
}

function buildCartWAMessage(cart: CartItem[], storeName: string): string {
  const lines = cart.map(item => {
    const vText = Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ");
    const vPart = vText ? ` (${vText})` : "";
    return `• ${item.product.name}${vPart} ×${item.quantity} — ${formatNaira(item.product.price * item.quantity)}`;
  });
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return (
    `Hi! I'd like to order from ${storeName}:\n\n` +
    lines.join("\n") +
    `\n\nTotal: ${formatNaira(total)} + delivery\n\nPlease confirm availability and payment details.`
  );
}

// ── Placeholder gradients ─────────────────────────────────────────────────────

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  Dresses: ["#f97316", "#ec4899"],
  Shoes: ["#7c3aed", "#2563eb"],
  Bags: ["#92400e", "#d97706"],
  Accessories: ["#d97706", "#ca8a04"],
};

function placeholderStyle(category: string): React.CSSProperties {
  const [from, to] = CATEGORY_GRADIENTS[category] ?? ["#6b7280", "#374151"];
  return { background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` };
}

// ── Image carousel ────────────────────────────────────────────────────────────

interface CarouselProps {
  images: string[];
  category: string;
  inStock: boolean;
  height: string;
  showCategory?: boolean;
}

function ImageCarousel({ images, category, inStock, height, showCategory = false }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const multi = total > 1;

  useEffect(() => { setIndex(0); }, [images]);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + total) % total);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % total);
  };

  return (
    <div className={`relative ${height} w-full overflow-hidden`}>
      {total > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={images[index]} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={placeholderStyle(category)} />
      )}

      {!inStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">Out of stock</span>
        </div>
      )}

      {showCategory && (
        <div className="absolute bottom-3 left-3">
          <span className="text-white/80 text-xs font-medium bg-black/25 rounded px-2 py-1">
            {category}
          </span>
        </div>
      )}

      {multi && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/65 flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/65 flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </>
      )}

      {multi && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-white" : "w-1.5 bg-white/55"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center py-20 gap-4">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-[#D1D5DB]">
        <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M26 32h12M32 26v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="text-[15px] text-[#6B7280]">No products in this category yet.</p>
    </div>
  );
}

// ── Product modal ─────────────────────────────────────────────────────────────

interface ModalProps {
  product: Product;
  merchant: Merchant;
  onClose: () => void;
  onAddToCart: (product: Product, variants: Record<string, string>) => void;
  visible: boolean;
}

function ProductModal({ product, merchant, onClose, onAddToCart, visible }: ModalProps) {
  const { primaryColour, whatsappDeepLink } = merchant;
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.variants.map((v) => [v.label, v.options[0]]))
  );

  useEffect(() => {
    setSelectedVariants(
      Object.fromEntries(product.variants.map((v) => [v.label, v.options[0]]))
    );
  }, [product]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const variantText = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
  const waLink = buildWALink(
    whatsappDeepLink,
    `Hi, I'm interested in ${product.name}${variantText ? ` (${variantText})` : ""}`
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-250 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed z-50 bg-white overflow-y-auto
          inset-x-0 bottom-0 rounded-t-2xl max-h-[88vh]
          lg:inset-0 lg:m-auto lg:rounded-2xl lg:w-full lg:max-w-xl lg:h-fit lg:max-h-[88vh]
          transition-all duration-[250ms] ease-out
          ${visible
            ? "translate-y-0 opacity-100 lg:scale-100"
            : "translate-y-full opacity-0 lg:translate-y-0 lg:scale-95"
          }`}
      >
        <ImageCarousel
          images={product.imageUrls}
          category={product.category}
          inStock={product.inStock}
          height="h-[280px]"
          showCategory
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="p-5 lg:p-6">
          <h2 className="text-[22px] font-bold text-brand-navy mb-1">{product.name}</h2>
          <p className="text-[24px] font-bold mb-3" style={{ color: primaryColour }}>
            {formatNaira(product.price)}
          </p>

          {product.description && (
            <p className="text-[15px] text-[#6B7280] leading-relaxed mb-5">{product.description}</p>
          )}

          {product.variants.map((v) => (
            <div key={v.label} className="mb-4">
              <p className="text-[13px] font-semibold text-brand-navy mb-2">{v.label}</p>
              <div className="flex flex-wrap gap-2">
                {v.options.map((opt) => {
                  const selected = selectedVariants[v.label] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [v.label]: opt }))}
                      className="px-3 py-1.5 rounded-full text-[13px] font-medium border transition-all"
                      style={
                        selected
                          ? { backgroundColor: primaryColour, color: "#fff", borderColor: primaryColour }
                          : { backgroundColor: "#fff", color: "#374151", borderColor: "#D1D5DB" }
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 mb-5">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-success" : "bg-danger"}`} />
            <span className="text-[14px] text-[#6B7280]">
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="flex gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-white font-semibold text-[14px] py-3.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ backgroundColor: primaryColour }}
            >
              Order on WhatsApp
            </a>
            <button
              onClick={() => {
                if (product.inStock) {
                  onAddToCart(product, selectedVariants);
                  onClose();
                }
              }}
              disabled={!product.inStock}
              className={`flex-1 text-center font-semibold text-[14px] py-3.5 rounded-lg border-2 transition-all ${
                !product.inStock ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 active:scale-[0.98]"
              }`}
              style={{ color: primaryColour, borderColor: primaryColour }}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────

interface CardProps {
  product: Product;
  primaryColour: string;
  waNumber: string;
  onOpen: (p: Product) => void;
  onAddToCart: (p: Product, variants: Record<string, string>) => void;
}

function ProductCard({ product, primaryColour, waNumber, onOpen, onAddToCart }: CardProps) {
  const hasDetails = !!(product.description || product.variants.length > 0);
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi, I'm interested in ${product.name}`
  )}`;

  function handleOrderHere(e: React.MouseEvent) {
    e.stopPropagation();
    if (!product.inStock) return;
    if (product.variants.length > 0) {
      onOpen(product);
    } else {
      onAddToCart(product, {});
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="w-full cursor-pointer" onClick={() => onOpen(product)}>
        <ImageCarousel
          images={product.imageUrls}
          category={product.category}
          inStock={product.inStock}
          height="h-[240px]"
        />
      </div>

      <div className="p-3">
        <button className="text-left w-full mb-1 focus:outline-none" onClick={() => onOpen(product)}>
          <h3 className="text-[15px] font-semibold text-brand-navy line-clamp-2 hover:underline decoration-brand-navy/30">
            {product.name}
          </h3>
        </button>

        <p className="text-[18px] font-bold mb-2" style={{ color: primaryColour }}>
          {formatNaira(product.price)}
        </p>

        {product.payOnDelivery && (
          <span className="inline-block mb-2 text-[11px] font-medium text-[#92400E] bg-[#FEF3C7] border border-[#FCD34D] px-2 py-0.5 rounded-full">
            Pay on delivery available
          </span>
        )}

        <div className="flex flex-col gap-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center justify-center w-full h-10 rounded-lg text-[13px] font-semibold text-white transition-opacity ${
              !product.inStock ? "opacity-50 pointer-events-none" : "hover:opacity-90"
            }`}
            style={{ backgroundColor: primaryColour }}
          >
            Order via WhatsApp
          </a>

          <button
            onClick={handleOrderHere}
            disabled={!product.inStock}
            className={`flex items-center justify-center w-full h-10 rounded-lg text-[13px] font-semibold border-2 transition-all ${
              !product.inStock ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
            }`}
            style={{ color: primaryColour, borderColor: primaryColour }}
          >
            {product.variants.length > 0 ? "Select options" : "Add to cart"}
          </button>
        </div>

        {hasDetails && (
          <button
            onClick={() => onOpen(product)}
            className="mt-2.5 w-full text-center text-[12px] text-[#9CA3AF] hover:text-brand-navy transition-colors underline underline-offset-2"
          >
            View details
          </button>
        )}
      </div>
    </div>
  );
}

// ── Cart drawer ───────────────────────────────────────────────────────────────

interface CartDrawerProps {
  open: boolean;
  cart: CartItem[];
  primaryColour: string;
  onClose: () => void;
  onRemove: (idx: number) => void;
  onQty: (idx: number, delta: number) => void;
  onCheckout: () => void;
}

function CartDrawer({ open, cart, primaryColour, onClose, onRemove, onQty, onCheckout }: CartDrawerProps) {
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

      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-[360px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-brand-navy" strokeWidth={1.5} />
            <h2 className="text-[16px] font-bold text-brand-navy">
              Cart {count > 0 && `(${count})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-brand-navy transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#9CA3AF]">
              <ShoppingCart size={40} strokeWidth={1} />
              <p className="text-[14px]">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, idx) => {
                const vText = Object.entries(item.selectedVariants)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" · ");
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#E5E7EB] shrink-0 bg-[#F3F4F6]">
                      {item.product.imageUrls[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.imageUrls[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full" style={placeholderStyle(item.product.category)} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-brand-navy line-clamp-1">
                        {item.product.name}
                      </p>
                      {vText && <p className="text-[11px] text-[#6B7280] mt-0.5">{vText}</p>}
                      <p className="text-[14px] font-bold mt-1" style={{ color: primaryColour }}>
                        {formatNaira(item.product.price * item.quantity)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onQty(idx, -1)}
                          className="w-6 h-6 rounded-full border border-[#D1D5DB] flex items-center justify-center hover:border-brand-navy transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-[13px] font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onQty(idx, 1)}
                          className="w-6 h-6 rounded-full border border-[#D1D5DB] flex items-center justify-center hover:border-brand-navy transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => onRemove(idx)}
                          className="ml-2 text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#6B7280]">Subtotal</span>
              <span className="text-[16px] font-bold text-brand-navy">{formatNaira(total)}</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF]">+ delivery (confirmed at checkout)</p>
            <button
              onClick={onCheckout}
              className="w-full h-12 rounded-xl text-white font-semibold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ backgroundColor: primaryColour }}
            >
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Checkout modal ────────────────────────────────────────────────────────────

interface CheckoutModalProps {
  open: boolean;
  cart: CartItem[];
  merchant: Merchant;
  onClose: () => void;
}

function CheckoutModal({ open, cart, merchant, onClose }: CheckoutModalProps) {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCheckout() {
    if (!phone.trim() || submitting) return;
    setSubmitting(true);

    const message = buildCartWAMessage(cart, merchant.displayName);
    const waNumber = merchant.whatsappDeepLink.replace("https://wa.me/", "").split("?")[0];

    // Fire-and-forget: create order record in the background
    fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantSlug: merchant.slug,
        customerPhone: phone.trim(),
        items: cart.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.product.price,
          selectedVariants: i.selectedVariants,
        })),
      }),
    }).catch(() => { /* ignore */ });

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-[400px] rounded-t-2xl sm:rounded-2xl shadow-2xl z-10 p-6">
        <h3 className="text-[18px] font-bold text-brand-navy mb-1">Almost there!</h3>
        <p className="text-[13px] text-[#6B7280] mb-5">
          Enter your WhatsApp number so the seller can send you order updates.
        </p>

        <div className="mb-5">
          <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
            Your WhatsApp number
          </label>
          <div className="flex">
            <span className="flex items-center px-3 border border-r-0 border-[#D1D5DB] rounded-l-lg bg-[#F9FAFB] text-[14px] text-brand-navy shrink-0 whitespace-nowrap">
              🇳🇬 +234
            </span>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCheckout(); }}
              placeholder="0801 234 5678"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="w-full px-4 py-2.5 text-[15px] rounded-r-lg border border-[#D1D5DB] focus:outline-none focus:border-brand-navy transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={!phone.trim() || submitting}
          className="w-full h-12 rounded-xl text-white font-semibold text-[15px] transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: merchant.primaryColour }}
        >
          {submitting ? "Opening WhatsApp…" : "Continue to WhatsApp →"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-[13px] text-[#6B7280] hover:text-brand-navy transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProductGrid({
  merchant,
  products,
}: {
  merchant: Merchant;
  products: Product[];
}) {
  const { primaryColour, whatsappDeepLink } = merchant;
  const waNumber = whatsappDeepLink.replace("https://wa.me/", "").split("?")[0];

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scrollMode, setScrollMode] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => loadCart(merchant.slug));
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  function addToCart(product: Product, variants: Record<string, string>) {
    setCart(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && JSON.stringify(i.selectedVariants) === JSON.stringify(variants)
      );
      const next = existing
        ? prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { product, quantity: 1, selectedVariants: variants }];
      persistCart(merchant.slug, next);
      return next;
    });
    setCartOpen(true);
  }

  function removeFromCart(idx: number) {
    setCart(prev => {
      const next = prev.filter((_, i) => i !== idx);
      persistCart(merchant.slug, next);
      return next;
    });
  }

  function updateQty(idx: number, delta: number) {
    setCart(prev => {
      const item = prev[idx];
      if (!item) return prev;
      const newQty = item.quantity + delta;
      const next = newQty <= 0
        ? prev.filter((_, i) => i !== idx)
        : prev.map((i, n) => n === idx ? { ...i, quantity: newQty } : i);
      persistCart(merchant.slug, next);
      return next;
    });
  }

  const filteredProducts =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => setSelectedProduct(null), 260);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (selectedProduct || cartOpen || checkoutOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProduct, cartOpen, checkoutOpen]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
      {/* Filter bar + view toggle + cart button */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 pb-1 w-max">
            {categories.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 px-4 py-2 rounded-full text-[14px] font-medium border transition-all"
                  style={
                    active
                      ? { backgroundColor: primaryColour, color: "#fff", borderColor: primaryColour }
                      : { backgroundColor: "#fff", color: "#374151", borderColor: "#E5E7EB" }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll mode toggle — mobile only */}
        <button
          onClick={() => setScrollMode(true)}
          className="lg:hidden shrink-0 w-9 h-9 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
          aria-label="Switch to scroll mode"
        >
          <Layers size={16} className="text-[#374151]" />
        </button>

        {/* Cart button */}
        <button
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
          className="relative shrink-0 w-9 h-9 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
        >
          <ShoppingCart size={16} className="text-[#374151]" />
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1"
              style={{ backgroundColor: primaryColour }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <EmptyState />
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              primaryColour={primaryColour}
              waNumber={waNumber}
              onOpen={openModal}
              onAddToCart={addToCart}
            />
          ))
        )}
      </div>

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          merchant={merchant}
          onClose={closeModal}
          onAddToCart={addToCart}
          visible={modalVisible}
        />
      )}

      {/* Cart drawer */}
      <CartDrawer
        open={cartOpen}
        cart={cart}
        primaryColour={primaryColour}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onQty={updateQty}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />

      {/* Checkout modal */}
      <CheckoutModal
        open={checkoutOpen}
        cart={cart}
        merchant={merchant}
        onClose={() => setCheckoutOpen(false)}
      />

      {/* Scroll browse mode */}
      {scrollMode && (
        <ScrollBrowseMode
          products={products}
          merchant={merchant}
          onClose={() => setScrollMode(false)}
        />
      )}
    </div>
  );
}
