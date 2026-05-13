import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Merchant, Product } from "@/types";

export async function getStorefrontData(slug: string): Promise<{
  merchant: Merchant;
  products: Product[];
}> {
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("merchants")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!row) notFound();

  const { data: productRows } = await supabase
    .from("products")
    .select("id, name, description, price, category, is_in_stock, stock_quantity, pay_on_delivery, is_new, created_at")
    .eq("merchant_id", row.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const products: Product[] = await Promise.all(
    (productRows ?? []).map(async (p) => {
      const [{ data: images }, { data: variants }] = await Promise.all([
        supabase
          .from("product_images")
          .select("url")
          .eq("product_id", p.id)
          .order("position", { ascending: true }),
        supabase
          .from("product_variants")
          .select("label, options")
          .eq("product_id", p.id),
      ]);

      return {
        id: p.id,
        name: p.name,
        description: p.description ?? "",
        price: Number(p.price),
        category: p.category ?? "",
        imageUrls: (images ?? []).map((i: { url: string }) => i.url),
        inStock: p.is_in_stock,
        stockQuantity: p.stock_quantity ?? 99,
        payOnDelivery: p.pay_on_delivery ?? false,
        isNew: p.is_new ?? false,
        variants: (variants ?? []).map((v: { label: string; options: string[] }) => ({
          label: v.label,
          options: v.options,
        })),
      };
    })
  );

  const waNumber = (row.whatsapp_number ?? "").replace(/\D/g, "");
  const merchant: Merchant = {
    displayName: row.display_name ?? row.business_name,
    description: row.description ?? "",
    logoUrl: row.logo_url ?? null,
    primaryColour: row.brand_colour ?? "#D5652B",
    deliveryAreas: Array.isArray(row.delivery_areas)
      ? row.delivery_areas.join(", ")
      : (row.delivery_areas ?? ""),
    deliveryFee: row.delivery_fee != null ? Number(row.delivery_fee) : null,
    whatsappDeepLink: `https://wa.me/${waNumber}`,
    whatsappPhone: row.whatsapp_number ?? "",
    slug: row.slug,
    isVerified: row.is_verified ?? false,
    podEnabled: row.pod_enabled ?? false,
  };

  return { merchant, products };
}
