-- ── Schema additions ─────────────────────────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS unread_count INTEGER NOT NULL DEFAULT 0;

-- ── Test customers ────────────────────────────────────────────────────────────
INSERT INTO customers (id, merchant_id, name, phone_number) VALUES
  ('00000000-0000-0000-0001-000000000001', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa', 'Chioma Obi',    '+234 802 111 2222'),
  ('00000000-0000-0000-0001-000000000002', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa', 'Kelechi Eze',   '+234 803 222 3333'),
  ('00000000-0000-0000-0001-000000000003', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa', 'Adaeze Nwosu',  '+234 804 333 4444'),
  ('00000000-0000-0000-0001-000000000004', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa', 'Funke Oladele', '+234 806 555 6666'),
  ('00000000-0000-0000-0001-000000000005', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa', 'Blessing Eze',  '+234 808 777 8888')
ON CONFLICT DO NOTHING;

-- ── Test orders ───────────────────────────────────────────────────────────────
INSERT INTO orders (id, merchant_id, customer_id, status, payment_method, payment_status,
                    total_amount, delivery_fee, delivery_address, landmark, order_reference, created_at)
VALUES
  ('00000000-0000-0000-0002-000000000001', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000001', 'new', 'pay_now', 'pending',
   39500, 2500, '14 Adeola Hopewell St, Victoria Island', 'Near GTBank ATM',
   'ORD-0047', now() - interval '5 minutes'),

  ('00000000-0000-0000-0002-000000000002', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000002', 'new', 'pay_now', 'pending',
   27000, 2500, '7 Bode Thomas St, Surulere', 'Opposite Shoprite',
   'ORD-0046', now() - interval '12 minutes'),

  ('00000000-0000-0000-0002-000000000003', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000003', 'confirmed', 'pay_now', 'pending',
   31000, 2500, '22 Akin Adesola St, Victoria Island', 'By Eko Hotel',
   'ORD-0045', now() - interval '60 minutes'),

  ('00000000-0000-0000-0002-000000000004', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000001', 'confirmed', 'pay_now', 'pending',
   65000, 0, '5 Glover Road, Ikoyi', 'By Polo Club',
   'ORD-0044', now() - interval '120 minutes'),

  ('00000000-0000-0000-0002-000000000005', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000004', 'paid', 'pay_now', 'paid',
   43500, 2500, '18 Benson St, Lekki Phase 1', 'Near Lekki Market',
   'ORD-0043', now() - interval '135 minutes'),

  ('00000000-0000-0000-0002-000000000006', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000002', 'paid', 'pay_now', 'paid',
   36000, 2500, '9 Admiralty Way, Lekki Phase 1', 'Beside Chicken Republic',
   'ORD-0042', now() - interval '180 minutes'),

  ('00000000-0000-0000-0002-000000000007', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000005', 'dispatched', 'pay_now', 'paid',
   20500, 2500, '33 Agungi Road, Lekki', 'Near Fara Park Estate',
   'ORD-0041', now() - interval '240 minutes'),

  ('00000000-0000-0000-0002-000000000008', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000003', 'delivered', 'pay_on_delivery', 'paid',
   44500, 2500, '6 Mike Akhigbe Way, Jabi, Abuja', 'By Jabi Lake Mall',
   'ORD-0039', now() - interval '1440 minutes')
ON CONFLICT DO NOTHING;

-- ── Order items ───────────────────────────────────────────────────────────────
INSERT INTO order_items (order_id, product_name, quantity, unit_price) VALUES
  ('00000000-0000-0000-0002-000000000001', 'Ankara Midi Dress',     2, 15000),
  ('00000000-0000-0000-0002-000000000001', 'Silk Headwrap',          1,  7000),
  ('00000000-0000-0000-0002-000000000002', 'Leather Tote Bag',       1, 24500),
  ('00000000-0000-0000-0002-000000000003', 'Batik Print Blouse',     3,  8500),
  ('00000000-0000-0000-0002-000000000003', 'Matching Scarf',         1,  3000),
  ('00000000-0000-0000-0002-000000000004', 'Lace Evening Gown',      1, 65000),
  ('00000000-0000-0000-0002-000000000005', 'Kaftan Set',             2, 18000),
  ('00000000-0000-0000-0002-000000000005', 'Bead Necklace',          1,  5000),
  ('00000000-0000-0000-0002-000000000006', 'Aso-ebi Fabric (3 yds)', 1, 33500),
  ('00000000-0000-0000-0002-000000000007', 'White Ankara Top',       1, 18000),
  ('00000000-0000-0000-0002-000000000008', 'Boubou Dress Set',       1, 42000);

-- ── Test conversations ────────────────────────────────────────────────────────
INSERT INTO conversations (id, merchant_id, customer_id, ai_status,
                            last_message_at, last_message_preview, unread_count)
VALUES
  ('00000000-0000-0000-0003-000000000001', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000001', 'escalated',
   now() - interval '2 minutes', 'I''ve been waiting for my order for 3 days now!', 2),

  ('00000000-0000-0000-0003-000000000002', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000002', 'active',
   now() - interval '8 minutes', 'Do you have this in size XL?', 1),

  ('00000000-0000-0000-0003-000000000003', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000003', 'merchant_active',
   now() - interval '15 minutes', 'Okay, I''ll send the money right away', 0),

  ('00000000-0000-0000-0003-000000000004', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000004', 'active',
   now() - interval '32 minutes', 'How much is the express delivery?', 0),

  ('00000000-0000-0000-0003-000000000005', 'b4a55b01-be1b-4aed-a4bc-542a51a39caa',
   '00000000-0000-0000-0001-000000000005', 'resolved',
   now() - interval '60 minutes', 'Thank you so much!', 0)
ON CONFLICT DO NOTHING;

-- ── Messages: conversation 1 (escalated) ─────────────────────────────────────
INSERT INTO messages (conversation_id, sender_type, content, message_type, created_at) VALUES
  ('00000000-0000-0000-0003-000000000001', 'customer',
   'Hi, I ordered 3 days ago and haven''t received anything', 'text', now() - interval '30 minutes'),
  ('00000000-0000-0000-0003-000000000001', 'ai',
   'Hi! I''m sorry to hear that. Let me look into your order status right away.', 'text', now() - interval '29 minutes'),
  ('00000000-0000-0000-0003-000000000001', 'ai',
   'Order #ORD-0039 — Status: Dispatched', 'system', now() - interval '29 minutes'),
  ('00000000-0000-0000-0003-000000000001', 'ai',
   'Your order was dispatched. Could you check with a neighbour or your building security?', 'text', now() - interval '28 minutes'),
  ('00000000-0000-0000-0003-000000000001', 'customer',
   'I''ve been waiting for my order for 3 days now! This is unacceptable!', 'text', now() - interval '2 minutes'),
  ('00000000-0000-0000-0003-000000000001', 'ai',
   'Conversation escalated to merchant', 'system', now() - interval '2 minutes');

-- ── Messages: conversation 2 (ai active) ─────────────────────────────────────
INSERT INTO messages (conversation_id, sender_type, content, message_type, created_at) VALUES
  ('00000000-0000-0000-0003-000000000002', 'customer',
   'Hello, do you have the Ankara Midi Dress?', 'text', now() - interval '15 minutes'),
  ('00000000-0000-0000-0003-000000000002', 'ai',
   'Hi! Welcome 👋 Yes, we have the Ankara Midi Dress at ₦15,000. Would you like to order?', 'text', now() - interval '14 minutes'),
  ('00000000-0000-0000-0003-000000000002', 'customer',
   'Do you have this in size XL?', 'text', now() - interval '8 minutes');

-- ── Messages: conversation 3 (merchant active) ───────────────────────────────
INSERT INTO messages (conversation_id, sender_type, content, message_type, created_at) VALUES
  ('00000000-0000-0000-0003-000000000003', 'customer',
   'Hi, can you remind me of the payment details?', 'text', now() - interval '30 minutes'),
  ('00000000-0000-0000-0003-000000000003', 'ai',
   'Hi! Here''s your secure payment link for order #ORD-0042.', 'text', now() - interval '29 minutes'),
  ('00000000-0000-0000-0003-000000000003', 'ai',
   'Payment link delivered', 'system', now() - interval '29 minutes'),
  ('00000000-0000-0000-0003-000000000003', 'customer',
   'The link isn''t working for me, can you help?', 'text', now() - interval '20 minutes'),
  ('00000000-0000-0000-0003-000000000003', 'ai',
   'Merchant took over conversation', 'system', now() - interval '19 minutes'),
  ('00000000-0000-0000-0003-000000000003', 'merchant',
   'Hi! It''s Amina. GTBank, 0123456789, Fashion by Amina. Send ₦23,000 and confirm here.', 'text', now() - interval '19 minutes'),
  ('00000000-0000-0000-0003-000000000003', 'customer',
   'Okay, I''ll send the money right away', 'text', now() - interval '15 minutes');

-- ── Messages: conversation 4 (ai active) ─────────────────────────────────────
INSERT INTO messages (conversation_id, sender_type, content, message_type, created_at) VALUES
  ('00000000-0000-0000-0003-000000000004', 'customer',
   'Good morning! Do you deliver to Victoria Island?', 'text', now() - interval '45 minutes'),
  ('00000000-0000-0000-0003-000000000004', 'ai',
   'Good morning! Yes, we deliver to Victoria Island. Delivery fee is ₦2,500 with 2–3 hour delivery.', 'text', now() - interval '44 minutes'),
  ('00000000-0000-0000-0003-000000000004', 'customer',
   'How much is the express delivery?', 'text', now() - interval '32 minutes');

-- ── Messages: conversation 5 (resolved) ──────────────────────────────────────
INSERT INTO messages (conversation_id, sender_type, content, message_type, created_at) VALUES
  ('00000000-0000-0000-0003-000000000005', 'customer',
   'Hi, I''m checking on my order. When will it arrive?', 'text', now() - interval '120 minutes'),
  ('00000000-0000-0000-0003-000000000005', 'ai',
   'Hi! Your order #ORD-0041 is out for delivery and should arrive by 2 PM today.', 'text', now() - interval '119 minutes'),
  ('00000000-0000-0000-0003-000000000005', 'customer',
   'Okay, great! Thank you', 'text', now() - interval '115 minutes'),
  ('00000000-0000-0000-0003-000000000005', 'ai',
   'Order delivered ✓', 'system', now() - interval '90 minutes'),
  ('00000000-0000-0000-0003-000000000005', 'customer',
   'Thank you so much!', 'text', now() - interval '60 minutes'),
  ('00000000-0000-0000-0003-000000000005', 'ai',
   'Conversation marked resolved', 'system', now() - interval '60 minutes');

-- ── Notifications ─────────────────────────────────────────────────────────────
INSERT INTO notifications (merchant_id, type, title, body, is_read, created_at) VALUES
  ('b4a55b01-be1b-4aed-a4bc-542a51a39caa', 'new_order',
   'New Order #ORD-0047', 'Chioma Obi placed an order for ₦39,500',
   false, now() - interval '5 minutes'),

  ('b4a55b01-be1b-4aed-a4bc-542a51a39caa', 'escalation',
   'Conversation escalated', 'Chioma Obi is frustrated and needs your attention',
   false, now() - interval '2 minutes'),

  ('b4a55b01-be1b-4aed-a4bc-542a51a39caa', 'payment_received',
   'Payment received', 'Funke Oladele paid ₦43,500 for order #ORD-0043',
   false, now() - interval '135 minutes'),

  ('b4a55b01-be1b-4aed-a4bc-542a51a39caa', 'new_order',
   'New Order #ORD-0046', 'Kelechi Eze placed an order for ₦27,000',
   true, now() - interval '12 minutes');
