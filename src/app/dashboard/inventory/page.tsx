"use client";

import { useState, useRef, useEffect } from "react";
import {
  LayoutGrid, List, Plus, Search, Pencil, EyeOff, Trash2,
  ChevronDown, X, Package, AlertTriangle, Sparkles, Upload, Link2,
} from "lucide-react";
import {
  getProducts,
  saveProduct,
  deleteProduct as dbDeleteProduct,
  toggleProductStatus,
  updateProductField,
  uploadProductImage,
  type InventoryProduct,
} from "@/lib/data/inventory";

// ── Types ─────────────────────────────────────────────────────────────────────

type StockFilter = "all" | "in_stock" | "low_stock" | "out_of_stock";
type ViewMode = "grid" | "list";

type Product = InventoryProduct & { aiEnabled: boolean; showInStorefront: boolean };

interface DrawerVariant {
  id: string;
  label: string;
  options: string[];
  tagInput: string;
}

interface DrawerImage {
  id: string;
  url: string;
}

interface DrawerForm {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  outOfStock: boolean;
  showInStorefront: boolean;
  aiEnabled: boolean;
  images: DrawerImage[];
  urlInput: string;
  variants: DrawerVariant[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["Dresses", "Tops", "Accessories", "Sets", "Outerwear", "Bottoms"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

function stockStatus(p: Product): StockFilter {
  if (p.outOfStock || p.stock === 0) return "out_of_stock";
  if (p.stock <= 3) return "low_stock";
  return "in_stock";
}

function toUiProduct(p: InventoryProduct): Product {
  return { ...p, aiEnabled: true, showInStorefront: true };
}

function emptyForm(): DrawerForm {
  return {
    name: "", description: "", category: "", price: "", stock: "",
    outOfStock: false, showInStorefront: true, aiEnabled: true,
    images: [], urlInput: "", variants: [],
  };
}

function productToForm(p: Product): DrawerForm {
  return {
    name: p.name, description: p.description, category: p.category,
    price: String(p.price), stock: String(p.stock),
    outOfStock: p.outOfStock, showInStorefront: p.showInStorefront,
    aiEnabled: p.aiEnabled,
    images: p.images.map((url, i) => ({ id: `img-${i}`, url })),
    urlInput: "",
    variants: p.variants.map((v) => ({ ...v, tagInput: "" })),
  };
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-brand-orange" : "bg-[#D1D5DB]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

// ── Category dropdown ─────────────────────────────────────────────────────────

function CategoryDropdown({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = selected.length === 0 ? "All categories" : selected.length === 1 ? selected[0] : `${selected.length} categories`;

  function toggle(cat: string) {
    onChange(selected.includes(cat) ? selected.filter((c) => c !== cat) : [...selected, cat]);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-brand-navy hover:border-brand-navy/40 transition-colors whitespace-nowrap"
      >
        {label}
        <ChevronDown size={14} className={`text-brand-navy/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.10)] py-1 z-30">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#F3F4F6] cursor-pointer">
              <input type="checkbox" checked={selected.includes(cat)} onChange={() => toggle(cat)} className="w-4 h-4 accent-brand-orange rounded" />
              <span className="text-[13px] text-brand-navy">{cat}</span>
            </label>
          ))}
          {selected.length > 0 && (
            <>
              <div className="my-1 border-t border-[#E5E7EB]" />
              <button onClick={() => onChange([])} className="w-full text-left px-3 py-2 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2]">
                Clear filter
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Delete modal ──────────────────────────────────────────────────────────────

function DeleteModal({ product, onConfirm, onCancel }: { product: Product; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-[#EF4444]" />
        </div>
        <h3 className="text-[17px] font-bold text-brand-navy text-center mb-1">Delete {product.name}?</h3>
        <p className="text-[13px] text-[#6B7280] text-center mb-6">This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-10 rounded-lg border border-[#E5E7EB] text-brand-navy text-[14px] font-medium hover:bg-[#F3F4F6] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 h-10 rounded-lg bg-[#EF4444] text-white text-[14px] font-semibold hover:bg-[#DC2626] transition-colors">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Product card (grid view) ──────────────────────────────────────────────────

function ProductCard({
  product, editingCell, editingVal,
  onStartEdit, onEditVal, onCommit, onEdit, onToggleActive, onDelete,
}: {
  product: Product;
  editingCell: { id: string; field: "price" | "stock" } | null;
  editingVal: string;
  onStartEdit: (id: string, field: "price" | "stock", val: string) => void;
  onEditVal: (v: string) => void;
  onCommit: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  const isEditing = (field: "price" | "stock") => editingCell?.id === product.id && editingCell.field === field;
  const status = stockStatus(product);

  return (
    <div className={`bg-white rounded-xl border border-[#E5E7EB] overflow-hidden flex flex-col group ${!product.active ? "opacity-60" : ""}`}>
      {/* Image */}
      <div className="relative aspect-square bg-[#F3F4F6]">
        {product.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-[#D1D5DB]" />
          </div>
        )}
        {product.images.length > 1 && (
          <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
            1/{product.images.length}
          </span>
        )}
        {(product.outOfStock || product.stock === 0) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-brand-navy text-[11px] font-bold px-2.5 py-1 rounded-full">Out of stock</span>
          </div>
        )}
        {status === "low_stock" && (
          <div className="absolute top-2 left-2 bg-[#FEF3C7] text-[#D97706] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle size={9} />
            {product.stock} left
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[14px] font-semibold text-brand-navy line-clamp-2 mb-1">{product.name}</p>

        {isEditing("price") ? (
          <input autoFocus value={editingVal} onChange={(e) => onEditVal(e.target.value)} onBlur={onCommit}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") onCommit(); }}
            className="w-full text-[15px] font-bold text-brand-orange border-b border-brand-orange outline-none bg-transparent mb-1"
          />
        ) : (
          <p className="text-[15px] font-bold text-brand-orange mb-1 cursor-text group-hover:underline group-hover:decoration-dashed group-hover:underline-offset-2"
            onDoubleClick={() => onStartEdit(product.id, "price", String(product.price))} title="Double-click to edit price">
            {formatNaira(product.price)}
          </p>
        )}

        {isEditing("stock") ? (
          <input autoFocus value={editingVal} onChange={(e) => onEditVal(e.target.value)} onBlur={onCommit}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") onCommit(); }}
            className="w-full text-[12px] border-b border-brand-navy outline-none bg-transparent"
          />
        ) : (
          <p className={`text-[12px] cursor-text group-hover:underline group-hover:decoration-dashed group-hover:underline-offset-2 ${
            status === "out_of_stock" ? "text-[#EF4444]" : status === "low_stock" ? "text-[#D97706]" : "text-[#16A34A]"
          }`}
            onDoubleClick={() => onStartEdit(product.id, "stock", String(product.stock))} title="Double-click to edit stock">
            {product.outOfStock || product.stock === 0 ? "Out of stock" : `In stock: ${product.stock}`}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} title="Edit product" className="flex-1 flex items-center justify-center h-7 rounded-md bg-[#F3F4F6] text-brand-navy hover:bg-[#E5E7EB] transition-colors">
            <Pencil size={13} />
          </button>
          <button onClick={onToggleActive} title={product.active ? "Deactivate" : "Activate"} className="flex-1 flex items-center justify-center h-7 rounded-md bg-[#F3F4F6] text-brand-navy hover:bg-[#E5E7EB] transition-colors">
            <EyeOff size={13} className={product.active ? "" : "text-[#EF4444]"} />
          </button>
          <button onClick={onDelete} title="Delete product" className="flex-1 flex items-center justify-center h-7 rounded-md bg-[#F3F4F6] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── List row ──────────────────────────────────────────────────────────────────

function ListRow({
  product, editingCell, editingVal,
  onStartEdit, onEditVal, onCommit, onEdit, onToggleActive, onDelete,
}: {
  product: Product;
  editingCell: { id: string; field: "price" | "stock" } | null;
  editingVal: string;
  onStartEdit: (id: string, field: "price" | "stock", val: string) => void;
  onEditVal: (v: string) => void;
  onCommit: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  const isEditing = (field: "price" | "stock") => editingCell?.id === product.id && editingCell.field === field;
  const status = stockStatus(product);

  return (
    <tr className={`border-b border-[#F3F4F6] hover:bg-[#FAFAFA] ${!product.active ? "opacity-60" : ""}`}>
      <td className="p-3 w-10">
        <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] overflow-hidden shrink-0">
          {product.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={16} className="text-[#D1D5DB]" />
            </div>
          )}
        </div>
      </td>
      <td className="p-3 text-[14px] font-medium text-brand-navy max-w-[180px]">
        <span className="line-clamp-1">{product.name}</span>
      </td>
      <td className="p-3 text-[13px] text-[#6B7280] hidden md:table-cell">{product.category}</td>
      <td className="p-3 text-[14px] font-semibold text-brand-orange">
        {isEditing("price") ? (
          <input autoFocus value={editingVal} onChange={(e) => onEditVal(e.target.value)} onBlur={onCommit}
            onKeyDown={(e) => { if (e.key === "Enter") onCommit(); }}
            className="w-24 border-b border-brand-orange outline-none bg-transparent text-brand-orange font-semibold"
          />
        ) : (
          <span className="cursor-pointer hover:underline hover:decoration-dashed hover:underline-offset-2"
            onClick={() => onStartEdit(product.id, "price", String(product.price))}>
            {formatNaira(product.price)}
          </span>
        )}
      </td>
      <td className="p-3 text-[13px] hidden sm:table-cell">
        {isEditing("stock") ? (
          <input autoFocus value={editingVal} onChange={(e) => onEditVal(e.target.value)} onBlur={onCommit}
            onKeyDown={(e) => { if (e.key === "Enter") onCommit(); }}
            className="w-16 border-b border-brand-navy outline-none bg-transparent"
          />
        ) : (
          <span className={`cursor-pointer hover:underline hover:decoration-dashed hover:underline-offset-2 ${
            status === "out_of_stock" ? "text-[#EF4444]" : status === "low_stock" ? "text-[#D97706]" : "text-[#16A34A]"
          }`} onClick={() => onStartEdit(product.id, "stock", String(product.stock))}>
            {product.outOfStock || product.stock === 0 ? "0" : product.stock}
          </span>
        )}
      </td>
      <td className="p-3 hidden lg:table-cell">
        <button onClick={onToggleActive} className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
          product.active ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F3F4F6] text-[#6B7280]"
        }`}>
          {product.active ? "Active" : "Inactive"}
        </button>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-1.5 rounded-md hover:bg-[#F3F4F6] text-brand-navy transition-colors" title="Edit">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-[#FEF2F2] text-[#EF4444] transition-colors" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Product drawer ────────────────────────────────────────────────────────────

function ProductDrawer({ form, setForm, isNew, saving, onSave, onClose, onDelete }: {
  form: DrawerForm;
  setForm: React.Dispatch<React.SetStateAction<DrawerForm>>;
  isNew: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const [suggestingDesc, setSuggestingDesc] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef(form);
  formRef.current = form;

  function set<K extends keyof DrawerForm>(key: K, val: DrawerForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    setUploadError("");

    const errors: string[] = [];
    const valid = files.filter((f) => {
      if (!["image/jpeg", "image/png"].includes(f.type)) {
        errors.push(`${f.name}: only JPEG or PNG`);
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        errors.push(`${f.name}: exceeds 10 MB`);
        return false;
      }
      return true;
    }).slice(0, Math.max(0, 10 - formRef.current.images.length));

    if (errors.length) setUploadError(errors.join(" · "));
    if (!valid.length) return;

    setUploading(true);
    const results = await Promise.allSettled(
      valid.map((f) => { const fd = new FormData(); fd.append("file", f); return uploadProductImage(fd); })
    );
    const uploaded: DrawerImage[] = results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
      .map((r) => ({ id: `img-${Date.now()}-${Math.random()}`, url: r.value }));
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed) setUploadError((prev) => [prev, `${failed} upload(s) failed`].filter(Boolean).join(" · "));
    if (uploaded.length) setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    setUploading(false);
  }

  function addUrlImage() {
    const url = formRef.current.urlInput.trim();
    if (!url.startsWith("http")) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { id: `img-${Date.now()}`, url }],
      urlInput: "",
    }));
  }

  function removeImage(id: string) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i.id !== id) }));
  }

  async function suggestDescription() {
    if (!form.name) return;
    setSuggestingDesc(true);
    await new Promise((r) => setTimeout(r, 1200));
    set("description", `Elevate your wardrobe with the ${form.name}. Crafted for the modern Nigerian woman, this piece combines quality materials with bold design.`);
    setSuggestingDesc(false);
  }

  function addVariant(label: string) {
    set("variants", [...form.variants, { id: `v${Date.now()}`, label, options: [], tagInput: "" }]);
  }

  function removeVariant(id: string) {
    set("variants", form.variants.filter((v) => v.id !== id));
  }

  function updateVariant(id: string, patch: Partial<DrawerVariant>) {
    set("variants", form.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }

  function handleVariantKeyDown(e: React.KeyboardEvent<HTMLInputElement>, vId: string, input: string) {
    const trimmed = input.trim().replace(/,$/, "");
    if ((e.key === "Enter" || e.key === ",") && trimmed) {
      e.preventDefault();
      const v = form.variants.find((x) => x.id === vId);
      if (v && !v.options.includes(trimmed)) {
        updateVariant(vId, { options: [...v.options, trimmed], tagInput: "" });
      }
    } else if (e.key === "Backspace" && !input) {
      const v = form.variants.find((x) => x.id === vId);
      if (v && v.options.length > 0) updateVariant(vId, { options: v.options.slice(0, -1) });
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 lg:inset-y-0 lg:right-0 lg:left-auto z-[80] flex flex-col bg-white lg:w-[560px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E7EB] shrink-0">
          <button onClick={onClose} className="text-[#6B7280] hover:text-brand-navy transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-[17px] font-bold text-brand-navy flex-1">{isNew ? "Add product" : "Edit product"}</h2>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Images */}
          <section>
            <h3 className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
              Product images
            </h3>

            {/* Current image grid */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {form.images.map((img, idx) => (
                  <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-brand-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                    <button onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Option 1 — upload */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading || form.images.length >= 10}
              className="flex items-center gap-2 w-full h-10 px-3 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] text-[13px] text-brand-navy hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors"
            >
              <Upload size={14} className="text-[#6B7280] shrink-0" />
              {uploading ? "Uploading…" : "Upload photo"}
              <span className="text-[#9CA3AF] text-[11px] ml-auto">JPEG or PNG, max 10 MB</span>
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={handleFileUpload} />

            {/* Divider */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 border-t border-[#E5E7EB]" />
              <span className="text-[11px] text-[#9CA3AF]">or</span>
              <div className="flex-1 border-t border-[#E5E7EB]" />
            </div>

            {/* Option 2 — URL */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  value={form.urlInput}
                  onChange={(e) => set("urlInput", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrlImage(); } }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full h-10 pl-8 pr-3 rounded-lg border border-[#E5E7EB] text-[13px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={addUrlImage}
                disabled={!form.urlInput.trim().startsWith("http") || form.images.length >= 10}
                className="h-10 px-4 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-brand-navy hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors shrink-0"
              >
                Add URL
              </button>
            </div>

            {uploadError && (
              <p className="text-[11px] text-[#EF4444] mt-1.5">{uploadError}</p>
            )}
            <p className="text-[11px] text-[#9CA3AF] mt-1.5">
              Up to 10 images. First image is the primary storefront photo.
            </p>
          </section>

          {/* Details */}
          <section>
            <h3 className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] font-medium text-brand-navy mb-1">Product name <span className="text-[#EF4444]">*</span></label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Ankara Midi Dress"
                  className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[13px] font-medium text-brand-navy">Description</label>
                  <button onClick={suggestDescription} disabled={suggestingDesc || !form.name}
                    className="flex items-center gap-1 text-[12px] text-brand-orange font-medium hover:underline disabled:opacity-40 transition-opacity">
                    <Sparkles size={12} />
                    {suggestingDesc ? "Suggesting…" : "Suggest ✨"}
                  </button>
                </div>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe this product…" rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-navy mb-1">Category</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy bg-white focus:outline-none focus:border-brand-navy/40 transition-colors">
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-navy mb-1">Price (₦) <span className="text-[#EF4444]">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#6B7280]">₦</span>
                  <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0"
                    className="w-full h-10 pl-7 pr-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Variants */}
          <section>
            <h3 className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Variants</h3>
            {form.variants.map((v) => (
              <div key={v.id} className="mb-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-brand-navy">{v.label}</span>
                  <button onClick={() => removeVariant(v.id)} className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {v.options.map((opt) => (
                    <span key={opt} className="flex items-center gap-1 bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-full text-[12px] text-brand-navy">
                      {opt}
                      <button onClick={() => updateVariant(v.id, { options: v.options.filter((o) => o !== opt) })} className="text-[#9CA3AF] hover:text-brand-navy ml-0.5">
                        <X size={9} />
                      </button>
                    </span>
                  ))}
                </div>
                <input value={v.tagInput} onChange={(e) => updateVariant(v.id, { tagInput: e.target.value })}
                  onKeyDown={(e) => handleVariantKeyDown(e, v.id, v.tagInput)}
                  placeholder="Type option, press Enter"
                  className="w-full h-8 px-2.5 rounded-md border border-[#E5E7EB] text-[13px] placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40"
                />
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              {[{ label: "Size variants" }, { label: "Colour variants" }, { label: "Custom variant" }].map(({ label }) => (
                <button key={label} onClick={() => addVariant(label.replace(" variants", "").replace(" variant", ""))}
                  className="flex items-center gap-1.5 text-[13px] text-brand-orange font-medium hover:underline">
                  <Plus size={13} />
                  Add {label}
                </button>
              ))}
            </div>
          </section>

          {/* Stock */}
          <section>
            <h3 className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Stock</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] font-medium text-brand-navy mb-1">Quantity</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)}
                  disabled={form.outOfStock} placeholder="0"
                  className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors disabled:opacity-40"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-brand-navy">Mark as out of stock</span>
                <Toggle checked={form.outOfStock} onChange={(v) => set("outOfStock", v)} />
              </div>
            </div>
          </section>

          {/* Visibility */}
          <section>
            <h3 className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Visibility</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-brand-navy">Show in storefront</p>
                  <p className="text-[12px] text-[#6B7280]">Visible on your public product page</p>
                </div>
                <Toggle checked={form.showInStorefront} onChange={(v) => set("showInStorefront", v)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-brand-navy">Offer in AI conversations</p>
                  <p className="text-[12px] text-[#6B7280]">AI can recommend this product to customers</p>
                </div>
                <Toggle checked={form.aiEnabled} onChange={(v) => set("aiEnabled", v)} />
              </div>
            </div>
          </section>

          {!isNew && onDelete && (
            <div className="pt-2 pb-4">
              <button onClick={onDelete} className="text-[13px] text-[#EF4444] font-medium hover:underline">
                Delete product
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#E5E7EB] shrink-0 bg-white">
          <button onClick={onSave} disabled={!form.name.trim() || !form.price || saving}
            className="w-full h-11 rounded-xl bg-brand-orange text-white text-[15px] font-semibold hover:bg-[#c45a25] transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            {saving ? "Saving…" : "Save product"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F4EDE8] flex items-center justify-center mb-4">
        <Package size={28} className="text-brand-orange" />
      </div>
      <p className="text-[18px] font-bold text-brand-navy mb-1">No products yet</p>
      <p className="text-[14px] text-[#6B7280] mb-6 max-w-xs">Add your first product to get started.</p>
      <button onClick={onAdd} className="flex items-center gap-2 h-10 px-5 rounded-xl bg-brand-orange text-white text-[14px] font-semibold hover:bg-[#c45a25] transition-colors">
        <Plus size={16} />
        Add product
      </button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden animate-pulse">
          <div className="aspect-square bg-[#F3F4F6]" />
          <div className="p-3 space-y-2">
            <div className="h-3.5 bg-[#F3F4F6] rounded w-3/4" />
            <div className="h-3 bg-[#F3F4F6] rounded w-1/2" />
            <div className="h-3 bg-[#F3F4F6] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingCell, setEditingCell] = useState<{ id: string; field: "price" | "stock" } | null>(null);
  const [editingVal, setEditingVal] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [drawerForm, setDrawerForm] = useState<DrawerForm>(emptyForm());
  const [saving, setSaving] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  // Load products on mount
  useEffect(() => {
    getProducts()
      .then((rows) => setProducts(rows.map(toUiProduct)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filtered products
  const filtered = products.filter((p) => {
    if (stockFilter !== "all" && stockStatus(p) !== stockFilter) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // ── Inline edit ───────────────────────────────────────────────────────────

  function startEdit(id: string, field: "price" | "stock", val: string) {
    setEditingCell({ id, field });
    setEditingVal(val);
  }

  async function commitEdit() {
    if (!editingCell) return;
    const value =
      editingCell.field === "price"
        ? parseFloat(editingVal) || 0
        : parseInt(editingVal) || 0;

    // Optimistic
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== editingCell.id) return p;
        if (editingCell.field === "price") return { ...p, price: value };
        return { ...p, stock: value, outOfStock: value === 0 };
      })
    );
    setEditingCell(null);
    setEditingVal("");

    await updateProductField(editingCell.id, editingCell.field, value).catch(console.error);
  }

  // ── Drawer ────────────────────────────────────────────────────────────────

  function openAddDrawer() {
    setEditingProduct(null);
    setDrawerForm(emptyForm());
    setDrawerOpen(true);
  }

  function openEditDrawer(p: Product) {
    setEditingProduct(p);
    setDrawerForm(productToForm(p));
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingProduct(null);
  }

  async function saveDrawer() {
    setSaving(true);
    try {
      const imageUrls = drawerForm.images.map((i) => i.url);
      const variants = drawerForm.variants.map(({ tagInput: _t, ...v }) => v);

      const saved = await saveProduct({
        id: editingProduct?.id,
        name: drawerForm.name.trim(),
        description: drawerForm.description.trim(),
        category: drawerForm.category,
        price: parseFloat(drawerForm.price) || 0,
        stock: parseInt(drawerForm.stock) || 0,
        outOfStock: drawerForm.outOfStock,
        imageUrls,
        variants,
      });

      const uiProduct = toUiProduct(saved);
      if (editingProduct) {
        setProducts((prev) => prev.map((p) => (p.id === saved.id ? uiProduct : p)));
      } else {
        setProducts((prev) => [...prev, uiProduct]);
      }
      closeDrawer();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  // ── Toggle active ─────────────────────────────────────────────────────────

  async function toggleActive(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    // Optimistic
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    await toggleProductStatus(id, product.active).catch((err) => {
      console.error("Toggle failed:", err);
      // Revert
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: product.active } : p)));
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    // Optimistic
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setPendingDelete(null);
    if (editingProduct?.id === id) closeDrawer();
    await dbDeleteProduct(id).catch(console.error);
  }

  const STOCK_TABS: { key: StockFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "in_stock", label: "In Stock" },
    { key: "low_stock", label: "Low Stock" },
    { key: "out_of_stock", label: "Out of Stock" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Top bar */}
      <div className="px-4 lg:px-6 py-4 bg-white border-b border-[#E5E7EB] shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[18px] font-bold text-brand-navy hidden sm:block">Inventory</h2>
            <span className="bg-[#F3F4F6] text-brand-navy text-[12px] font-semibold px-2.5 py-0.5 rounded-full">
              {loading ? "…" : `${products.length} products`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-[#F3F4F6] rounded-lg p-0.5">
              <button onClick={() => setViewMode("grid")} aria-label="Grid view"
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-brand-navy shadow-sm" : "text-[#9CA3AF] hover:text-brand-navy"}`}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode("list")} aria-label="List view"
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-brand-navy shadow-sm" : "text-[#9CA3AF] hover:text-brand-navy"}`}>
                <List size={16} />
              </button>
            </div>
            <button onClick={openAddDrawer}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-brand-orange text-white text-[13px] font-semibold hover:bg-[#c45a25] transition-colors">
              <Plus size={15} />
              <span className="hidden sm:inline">Add product</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="px-4 lg:px-6 py-3 bg-white border-b border-[#E5E7EB] shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryDropdown selected={selectedCategories} onChange={setSelectedCategories} />
          <div className="flex items-center bg-[#F3F4F6] rounded-lg p-0.5 gap-0.5">
            {STOCK_TABS.map((tab) => (
              <button key={tab.key} onClick={() => setStockFilter(tab.key)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap ${
                  stockFilter === tab.key ? "bg-white text-brand-navy shadow-sm" : "text-[#6B7280] hover:text-brand-navy"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products…"
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-5">
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 && products.length === 0 ? (
          <EmptyState onAdd={openAddDrawer} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={32} className="text-[#D1D5DB] mb-3" />
            <p className="text-[15px] font-semibold text-brand-navy mb-1">No matching products</p>
            <p className="text-[13px] text-[#6B7280]">Try changing your filters or search query.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} editingCell={editingCell} editingVal={editingVal}
                onStartEdit={startEdit} onEditVal={setEditingVal} onCommit={commitEdit}
                onEdit={() => openEditDrawer(p)} onToggleActive={() => toggleActive(p.id)}
                onDelete={() => setPendingDelete(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="p-3 w-10" />
                  <th className="p-3 text-left text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Name</th>
                  <th className="p-3 text-left text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="p-3 text-left text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Price</th>
                  <th className="p-3 text-left text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">Stock</th>
                  <th className="p-3 text-left text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="p-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ListRow key={p.id} product={p} editingCell={editingCell} editingVal={editingVal}
                    onStartEdit={startEdit} onEditVal={setEditingVal} onCommit={commitEdit}
                    onEdit={() => openEditDrawer(p)} onToggleActive={() => toggleActive(p.id)}
                    onDelete={() => setPendingDelete(p)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <ProductDrawer form={drawerForm} setForm={setDrawerForm} isNew={!editingProduct}
          saving={saving} onSave={saveDrawer} onClose={closeDrawer}
          onDelete={editingProduct ? () => { closeDrawer(); setPendingDelete(editingProduct); } : undefined}
        />
      )}

      {/* Delete modal */}
      {pendingDelete && (
        <DeleteModal product={pendingDelete} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
      )}
    </div>
  );
}
