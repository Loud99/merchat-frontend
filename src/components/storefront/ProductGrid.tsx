"use client";

import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, LayoutGrid, Layers } from "lucide-react";
import { Merchant, Product } from "@/types";
import { hexToRgba, buildWALink, formatNaira } from "@/lib/storefront";
import ScrollBrowseMode from "@/components/storefront/ScrollBrowseMode";

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
      {/* Slide */}
      {total > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={images[index]} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={placeholderStyle(category)} />
      )}

      {/* Out of stock overlay */}
      {!inStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">Out of stock</span>
        </div>
      )}

      {/* Category badge */}
      {showCategory && (
        <div className="absolute bottom-3 left-3">
          <span className="text-white/80 text-xs font-medium bg-black/25 rounded px-2 py-1">
            {category}
          </span>
        </div>
      )}

      {/* Arrows */}
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

      {/* Dots — show when there are multiple images */}
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
  visible: boolean;
}

function ProductModal({ product, merchant, onClose, visible }: ModalProps) {
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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-250 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel — bottom sheet on mobile, centred on desktop */}
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
        {/* Image carousel */}
        <ImageCarousel
          images={product.imageUrls}
          category={product.category}
          inStock={product.inStock}
          height="h-[280px]"
          showCategory
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Content */}
        <div className="p-5 lg:p-6">
          <h2 className="text-[22px] font-bold text-brand-navy mb-1">{product.name}</h2>
          <p className="text-[24px] font-bold mb-3" style={{ color: primaryColour }}>
            {formatNaira(product.price)}
          </p>

          {product.description && (
            <p className="text-[15px] text-[#6B7280] leading-relaxed mb-5">{product.description}</p>
          )}

          {/* Variants */}
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

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-5">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-success" : "bg-danger"}`} />
            <span className="text-[14px] text-[#6B7280]">
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          {/* Two CTAs side by side */}
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
              className={`flex-1 text-center font-semibold text-[14px] py-3.5 rounded-lg border-2 transition-all ${
                !product.inStock ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 active:scale-[0.98]"
              }`}
              style={{ color: primaryColour, borderColor: primaryColour }}
              disabled={!product.inStock}
            >
              Order here
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
}

function ProductCard({ product, primaryColour, waNumber, onOpen }: CardProps) {
  const hasDetails = !!(product.description || product.variants.length > 0);
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi, I'm interested in ${product.name}`
  )}`;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      {/* Carousel — clicking the image opens the modal */}
      <div
        className="w-full cursor-pointer"
        onClick={() => onOpen(product)}
      >
        <ImageCarousel
          images={product.imageUrls}
          category={product.category}
          inStock={product.inStock}
          height="h-[240px]"
        />
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Name */}
        <button
          className="text-left w-full mb-1 focus:outline-none"
          onClick={() => onOpen(product)}
        >
          <h3 className="text-[15px] font-semibold text-brand-navy line-clamp-2 hover:underline decoration-brand-navy/30">
            {product.name}
          </h3>
        </button>

        {/* Price */}
        <p className="text-[18px] font-bold mb-2" style={{ color: primaryColour }}>
          {formatNaira(product.price)}
        </p>

        {/* Pay on delivery badge */}
        {product.payOnDelivery && (
          <span className="inline-block mb-2 text-[11px] font-medium text-[#92400E] bg-[#FEF3C7] border border-[#FCD34D] px-2 py-0.5 rounded-full">
            Pay on delivery available
          </span>
        )}

        {/* Buttons */}
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
            onClick={() => onOpen(product)}
            disabled={!product.inStock}
            className={`flex items-center justify-center w-full h-10 rounded-lg text-[13px] font-semibold border-2 transition-all ${
              !product.inStock ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
            }`}
            style={{ color: primaryColour, borderColor: primaryColour }}
          >
            Order here
          </button>
        </div>

        {/* View details link — only shown when product has description or variants */}
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
    document.body.style.overflow = selectedProduct ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProduct]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
      {/* Filter bar + view toggle */}
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
          title="Scroll mode"
        >
          <Layers size={16} className="text-[#374151]" />
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
            />
          ))
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          merchant={merchant}
          onClose={closeModal}
          visible={modalVisible}
        />
      )}

      {/* Scroll browse mode — full-screen overlay */}
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
