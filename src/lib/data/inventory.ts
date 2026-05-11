"use server";

import { createClient } from "@/lib/supabase/server";

// Hardcoded until auth is wired up — replace with session.merchant_id
const MERCHANT_ID = "b4a55b01-be1b-4aed-a4bc-542a51a39caa";

export interface InventoryProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  outOfStock: boolean;
  active: boolean;
  images: string[];
  variants: { id: string; label: string; options: string[] }[];
  payOnDelivery: boolean;
}

// ── Private helpers ───────────────────────────────────────────────────────────

async function fetchFullProduct(id: string): Promise<InventoryProduct> {
  const supabase = createClient();
  const { data: p } = await supabase
    .from("products")
    .select("id, name, description, category, price, stock_quantity, is_in_stock, is_active, pay_on_delivery")
    .eq("id", id)
    .single();

  if (!p) throw new Error(`Product ${id} not found`);

  const [{ data: images }, { data: variants }] = await Promise.all([
    supabase.from("product_images").select("id, url").eq("product_id", id).order("position", { ascending: true }),
    supabase.from("product_variants").select("id, label, options").eq("product_id", id),
  ]);

  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    category: p.category ?? "",
    price: Number(p.price),
    stock: p.stock_quantity,
    outOfStock: !p.is_in_stock,
    active: p.is_active,
    payOnDelivery: p.pay_on_delivery ?? false,
    images: (images ?? []).map((i: { url: string }) => i.url),
    variants: (variants ?? []).map((v: { id: string; label: string; options: string[] }) => ({
      id: v.id,
      label: v.label,
      options: v.options,
    })),
  };
}

// ── Exported server actions ───────────────────────────────────────────────────

export async function getProducts(): Promise<InventoryProduct[]> {
  const supabase = createClient();

  const { data: rows } = await supabase
    .from("products")
    .select("id, name, description, category, price, stock_quantity, is_in_stock, is_active")
    .eq("merchant_id", MERCHANT_ID)
    .order("created_at", { ascending: true });

  if (!rows || rows.length === 0) return [];

  return Promise.all(rows.map((p) => fetchFullProduct(p.id)));
}

export async function saveProduct(data: {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  outOfStock: boolean;
  payOnDelivery: boolean;
  imageUrls: string[];
  variants: { label: string; options: string[] }[];
}): Promise<InventoryProduct> {
  const supabase = createClient();
  let productId = data.id;

  if (productId) {
    // Update
    await supabase.from("products").update({
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      stock_quantity: data.outOfStock ? 0 : data.stock,
      is_in_stock: !data.outOfStock && data.stock > 0,
      pay_on_delivery: data.payOnDelivery,
    }).eq("id", productId);

    // Replace images
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase.from("product_variants").delete().eq("product_id", productId);
  } else {
    // Create
    const { data: created, error } = await supabase
      .from("products")
      .insert({
        merchant_id: MERCHANT_ID,
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        stock_quantity: data.outOfStock ? 0 : data.stock,
        is_in_stock: !data.outOfStock && data.stock > 0,
        is_active: true,
        pay_on_delivery: data.payOnDelivery,
      })
      .select("id")
      .single();

    if (error || !created) throw new Error(error?.message ?? "Failed to create product");
    productId = created.id;
  }

  // Insert images
  if (data.imageUrls.length > 0) {
    await supabase.from("product_images").insert(
      data.imageUrls.map((url, position) => ({ product_id: productId, url, position }))
    );
  }

  // Insert variants
  if (data.variants.length > 0) {
    await supabase.from("product_variants").insert(
      data.variants.map((v) => ({ product_id: productId, label: v.label, options: v.options }))
    );
  }

  return fetchFullProduct(productId!);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("products").delete().eq("id", id);
}

export async function toggleProductStatus(id: string, currentActive: boolean): Promise<void> {
  const supabase = createClient();
  await supabase.from("products").update({ is_active: !currentActive }).eq("id", id);
}

export async function updateProductField(
  id: string,
  field: "price" | "stock",
  value: number
): Promise<void> {
  const supabase = createClient();
  if (field === "price") {
    await supabase.from("products").update({ price: value }).eq("id", id);
  } else {
    await supabase.from("products").update({
      stock_quantity: value,
      is_in_stock: value > 0,
    }).eq("id", id);
  }
}

export async function uploadProductImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const ALLOWED = ["image/jpeg", "image/png"];
  if (!ALLOWED.includes(file.type)) throw new Error("Only JPEG and PNG files are allowed");
  if (file.size > 10 * 1024 * 1024) throw new Error("File exceeds 10 MB limit");

  const ext = file.type === "image/jpeg" ? "jpg" : "png";
  const filename = `${MERCHANT_ID}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filename, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path);

  return publicUrl;
}
