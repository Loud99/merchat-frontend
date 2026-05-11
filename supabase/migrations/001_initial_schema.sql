-- ─────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────
CREATE TYPE order_status AS ENUM ('new', 'confirmed', 'paid', 'dispatched', 'delivered');
CREATE TYPE payment_method AS ENUM ('pay_now', 'pay_on_delivery');
CREATE TYPE payment_status AS ENUM ('pending', 'paid');
CREATE TYPE ai_status AS ENUM ('active', 'escalated', 'merchant_active', 'resolved');
CREATE TYPE sender_type AS ENUM ('customer', 'ai', 'merchant');
CREATE TYPE message_type AS ENUM ('text', 'image', 'flow', 'system');
CREATE TYPE notification_type AS ENUM ('new_order', 'payment_received', 'escalation', 'low_stock');
CREATE TYPE provisioning_status AS ENUM ('pending', 'active', 'suspended');

-- ─────────────────────────────────────────────────────────────
-- merchants
-- ─────────────────────────────────────────────────────────────
CREATE TABLE merchants (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  business_name       TEXT NOT NULL,
  display_name        TEXT,
  email               TEXT NOT NULL UNIQUE,
  phone               TEXT,
  category            TEXT,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT,
  logo_url            TEXT,
  brand_colour        TEXT DEFAULT '#D5652B',
  delivery_areas      TEXT[],
  delivery_fee        NUMERIC(10, 2) DEFAULT 0,
  pod_enabled         BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_number     TEXT,
  provisioning_status provisioning_status NOT NULL DEFAULT 'pending',
  is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

-- ─────────────────────────────────────────────────────────────
-- products
-- ─────────────────────────────────────────────────────────────
CREATE TABLE products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  merchant_id    UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC(12, 2) NOT NULL,
  category       TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  is_in_stock    BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_products_merchant_id ON products(merchant_id);

-- ─────────────────────────────────────────────────────────────
-- product_images
-- ─────────────────────────────────────────────────────────────
CREATE TABLE product_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- ─────────────────────────────────────────────────────────────
-- product_variants
-- ─────────────────────────────────────────────────────────────
CREATE TABLE product_variants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  options    TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);

-- ─────────────────────────────────────────────────────────────
-- customers
-- ─────────────────────────────────────────────────────────────
CREATE TABLE customers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  phone_number        TEXT NOT NULL,
  name                TEXT,
  merchant_id         UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  last_interaction_at TIMESTAMPTZ,
  UNIQUE (phone_number, merchant_id)
);

CREATE INDEX idx_customers_merchant_id ON customers(merchant_id);
CREATE INDEX idx_customers_phone_number ON customers(phone_number);

-- ─────────────────────────────────────────────────────────────
-- orders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  merchant_id      UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  customer_id      UUID REFERENCES customers(id) ON DELETE SET NULL,
  status           order_status NOT NULL DEFAULT 'new',
  payment_method   payment_method NOT NULL DEFAULT 'pay_on_delivery',
  payment_status   payment_status NOT NULL DEFAULT 'pending',
  total_amount     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  delivery_address TEXT,
  landmark         TEXT,
  order_reference  TEXT NOT NULL UNIQUE DEFAULT 'ORD-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  payment_link     TEXT
);

CREATE INDEX idx_orders_merchant_id ON orders(merchant_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ─────────────────────────────────────────────────────────────
-- order_items
-- ─────────────────────────────────────────────────────────────
CREATE TABLE order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name      TEXT NOT NULL,
  quantity          INTEGER NOT NULL DEFAULT 1,
  unit_price        NUMERIC(12, 2) NOT NULL,
  selected_variants JSONB DEFAULT '{}'
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ─────────────────────────────────────────────────────────────
-- conversations
-- ─────────────────────────────────────────────────────────────
CREATE TABLE conversations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  merchant_id          UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  customer_id          UUID REFERENCES customers(id) ON DELETE SET NULL,
  ai_status            ai_status NOT NULL DEFAULT 'active',
  last_message_at      TIMESTAMPTZ,
  last_message_preview TEXT
);

CREATE INDEX idx_conversations_merchant_id ON conversations(merchant_id);
CREATE INDEX idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- ─────────────────────────────────────────────────────────────
-- messages
-- ─────────────────────────────────────────────────────────────
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type     sender_type NOT NULL,
  content         TEXT NOT NULL,
  message_type    message_type NOT NULL DEFAULT 'text'
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- reviews
-- ─────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_id    UUID REFERENCES orders(id) ON DELETE SET NULL,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT
);

CREATE INDEX idx_reviews_merchant_id ON reviews(merchant_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);

-- ─────────────────────────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  related_id  UUID
);

CREATE INDEX idx_notifications_merchant_id ON notifications(merchant_id);
CREATE INDEX idx_notifications_is_read ON notifications(merchant_id, is_read);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
ALTER TABLE merchants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;
