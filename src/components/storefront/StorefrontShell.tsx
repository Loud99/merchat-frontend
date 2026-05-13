"use client";

import { useState, useCallback, useMemo } from "react";
import { Merchant, Product, CartItem } from "@/types";
import StoreHeader from "./StoreHeader";
import FilterBar, { FilterState } from "./FilterBar";
import ProductGrid from "./ProductGrid";
import ScrollBrowseMode from "./ScrollBrowseMode";

function cartKey(productId: string, variants: Record<string, string>) {
  return `${productId}||${Object.entries(variants)
    .sort()
    .map(([k, v]) => `${k}:${v}`)
    .join(",")}`;
}

function loadCart(slug: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(`cart_${slug}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(slug: string, items: CartItem[]) {
  try {
    sessionStorage.setItem(`cart_${slug}`, JSON.stringify(items));
  } catch { /* ignore */ }
}

export default function StorefrontShell({
  merchant,
  products,
}: {
  merchant: Merchant;
  products: Product[];
}) {
  const [cart, setCartState] = useState<CartItem[]>(() =>
    loadCart(merchant.slug)
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [browseMode, setBrowseMode] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All",
    sort: "newest",
    inStockOnly: false,
    pod: false,
  });

  const setCart = useCallback(
    (updater: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
      setCartState((prev) => {
        const next =
          typeof updater === "function" ? updater(prev) : updater;
        saveCart(merchant.slug, next);
        return next;
      });
    },
    [merchant.slug]
  );

  const addToCart = useCallback(
    (product: Product, variants: Record<string, string>, qty = 1) => {
      setCart((prev) => {
        const key = cartKey(product.id, variants);
        const exists = prev.find(
          (i) => cartKey(i.product.id, i.selectedVariants) === key
        );
        if (exists) {
          return prev.map((i) =>
            cartKey(i.product.id, i.selectedVariants) === key
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        }
        return [...prev, { product, quantity: qty, selectedVariants: variants }];
      });
    },
    [setCart]
  );

  const updateQty = useCallback(
    (key: string, delta: number) => {
      setCart((prev) =>
        prev
          .map((i) =>
            cartKey(i.product.id, i.selectedVariants) === key
              ? { ...i, quantity: Math.max(1, i.quantity + delta) }
              : i
          )
          .filter((i) => i.quantity > 0)
      );
    },
    [setCart]
  );

  const removeItem = useCallback(
    (key: string) => {
      setCart((prev) =>
        prev.filter((i) => cartKey(i.product.id, i.selectedVariants) !== key)
      );
    },
    [setCart]
  );

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    const q = filters.search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (filters.category !== "All") {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }
    if (filters.pod) {
      list = list.filter((p) => p.payOnDelivery);
    }
    if (filters.sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, filters]);

  const inStockProducts = useMemo(
    () => products.filter((p) => p.inStock),
    [products]
  );

  return (
    <>
      <StoreHeader
        merchant={merchant}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onBrowseMode={() => setBrowseMode(true)}
      />
      <FilterBar filters={filters} onFiltersChange={setFilters} />
      <ProductGrid
        merchant={merchant}
        products={filteredProducts}
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        onAddToCart={addToCart}
        onUpdateQty={updateQty}
        onRemoveItem={removeItem}
      />
      {browseMode && (
        <ScrollBrowseMode
          products={inStockProducts}
          merchant={merchant}
          cart={cart}
          onAddToCart={addToCart}
          onClose={() => setBrowseMode(false)}
        />
      )}
    </>
  );
}
