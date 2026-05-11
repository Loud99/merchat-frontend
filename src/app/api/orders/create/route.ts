import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  selectedVariants: Record<string, string>;
}

interface CreateOrderBody {
  merchantSlug: string;
  customerPhone: string;
  items: OrderItem[];
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderBody = await req.json();
    const { merchantSlug, customerPhone, items } = body;

    if (!merchantSlug || !customerPhone || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Look up merchant by slug
    const { data: merchant, error: mErr } = await supabase
      .from("merchants")
      .select("id")
      .eq("slug", merchantSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (mErr || !merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    // Upsert customer
    const { data: customer } = await supabase
      .from("customers")
      .upsert(
        { merchant_id: merchant.id, phone_number: customerPhone, last_interaction_at: new Date().toISOString() },
        { onConflict: "phone_number,merchant_id" }
      )
      .select("id")
      .maybeSingle();

    const totalAmount = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

    // Create order
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        merchant_id: merchant.id,
        customer_id: customer?.id ?? null,
        total_amount: totalAmount,
        payment_method: "pay_on_delivery",
        status: "new",
        payment_status: "pending",
      })
      .select("id, order_reference")
      .single();

    if (oErr || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order items
    await supabase.from("order_items").insert(
      items.map(i => ({
        order_id: order.id,
        product_id: i.productId,
        product_name: i.productName,
        quantity: i.quantity,
        unit_price: i.unitPrice,
        selected_variants: i.selectedVariants,
      }))
    );

    return NextResponse.json({ orderId: order.id, orderReference: order.order_reference });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
