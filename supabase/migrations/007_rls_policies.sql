-- ── Section 6: Row Level Security policies ─────────────────────────────────
-- RLS was already ENABLEd on all tables in 001_initial_schema.sql.
-- Merchants SELECT/UPDATE policies added in 006_auth_trigger_rls.sql.
-- This migration adds the remaining policies for all other tables.

-- ── Products ──────────────────────────────────────────────────────────────────
CREATE POLICY "Merchants manage own products" ON products
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

-- ── Product images ─────────────────────────────────────────────────────────────
CREATE POLICY "Merchants manage own product images" ON product_images
  USING  (EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.merchant_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.merchant_id = auth.uid()));

CREATE POLICY "Public view active product images" ON product_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_active = true)
  );

-- ── Product variants ───────────────────────────────────────────────────────────
CREATE POLICY "Merchants manage own product variants" ON product_variants
  USING  (EXISTS (SELECT 1 FROM products WHERE products.id = product_variants.product_id AND products.merchant_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM products WHERE products.id = product_variants.product_id AND products.merchant_id = auth.uid()));

CREATE POLICY "Public view active product variants" ON product_variants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_variants.product_id AND products.is_active = true)
  );

-- ── Orders ────────────────────────────────────────────────────────────────────
CREATE POLICY "Merchants manage own orders" ON orders
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- ── Order items ───────────────────────────────────────────────────────────────
CREATE POLICY "Merchants access own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.merchant_id = auth.uid())
  );

CREATE POLICY "Insert order items for own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.merchant_id = auth.uid())
  );

-- ── Conversations ─────────────────────────────────────────────────────────────
CREATE POLICY "Merchants manage own conversations" ON conversations
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- ── Messages ──────────────────────────────────────────────────────────────────
CREATE POLICY "Merchants view own messages" ON messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.merchant_id = auth.uid())
  );

CREATE POLICY "Merchants insert messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.merchant_id = auth.uid())
  );

CREATE POLICY "Merchants update own messages" ON messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.merchant_id = auth.uid())
  );

-- ── Notifications ─────────────────────────────────────────────────────────────
CREATE POLICY "Merchants manage own notifications" ON notifications
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- ── Support tickets ───────────────────────────────────────────────────────────
CREATE POLICY "Merchants manage own tickets" ON support_tickets
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- ── Customers ─────────────────────────────────────────────────────────────────
CREATE POLICY "Merchants view own customers" ON customers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.customer_id = customers.id AND orders.merchant_id = auth.uid())
  );

CREATE POLICY "Public can create customers" ON customers
  FOR INSERT WITH CHECK (true);

-- ── Public storefront: active merchants ───────────────────────────────────────
-- Adds a public SELECT on top of the merchant's own SELECT (from migration 006).
CREATE POLICY "Public can view active merchants" ON merchants
  FOR SELECT USING (is_active = true);

-- ── Demo requests table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demo_requests (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name        text,
  business_name    text,
  whatsapp_number  text,
  business_type    text,
  message          text,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert demo requests" ON demo_requests FOR INSERT WITH CHECK (true);
