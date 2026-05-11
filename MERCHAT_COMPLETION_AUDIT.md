# Merchat.io — Full Completion Audit & Prompt Guide
**Version:** 1.0 | **Date:** May 2026  
**Purpose:** This document is a comprehensive prompt guide for Claude Code. It lists every incomplete flow, missing backend, placeholder, and broken interaction across the Merchat.io frontend. Each section contains a ready-to-use Claude Code prompt. Work through sections in order — Authentication first, then Core Flows, then Features.

---

## Project Context

**Product:** Merchat.io — AI-powered WhatsApp commerce platform for Nigerian SMEs  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Postgres + Auth), Lucide React, Recharts  
**Repo:** ~/Desktop/merchat-frontend  
**Database:** Supabase with 11 tables: merchants, products, product_images, orders, order_items, conversations, messages, analytics_events, notifications, support_tickets, onboarding_tokens  

---

## SECTION 1: AUTHENTICATION (Do this first — everything depends on it)

### 1.1 — Supabase Auth: Signup & Login

**Current state:** One hardcoded test credential. No real signup, no real login, no session management.

**What "done" looks like:**
- Merchant can sign up with email + password at /auth/signup
- Merchant can log in at /auth/login
- Session persists across page refreshes
- Authenticated routes redirect to /dashboard if logged in
- Unauthenticated routes redirect to /auth/login if not logged in
- Logout clears session and redirects to homepage

**Claude Code prompt:**
```
Set up full Supabase Auth for the Merchat.io merchant dashboard.

1. Enable email/password auth in Supabase (already done in dashboard — just wire it up in code).

2. Update /auth/login page:
   - Connect the form to supabase.auth.signInWithPassword({ email, password })
   - On success: redirect to /dashboard
   - On error: show the error message below the form (e.g. "Invalid email or password")
   - Add a loading state on the submit button while signing in

3. Update /auth/signup page:
   - Connect form to supabase.auth.signUp({ email, password, options: { data: { full_name, business_name } } })
   - On success: redirect to /onboarding
   - On error: show error message
   - Validate that password is at least 8 characters before submitting

4. Create middleware.ts in the root of the project:
   - Protect all /dashboard/* and /onboarding/* routes — redirect to /auth/login if no session
   - Redirect authenticated users away from /auth/login and /auth/signup to /dashboard

5. Add a logout button in the dashboard sidebar/header that calls supabase.auth.signOut() and redirects to /

6. In lib/supabase/client.ts and lib/supabase/server.ts, ensure the Supabase client is using the correct auth session (cookies-based for server components using @supabase/ssr).

Install @supabase/ssr if not already installed: npm install @supabase/ssr
```

---

### 1.2 — Password Reset Flow

**Current state:** "Forgot password" link exists but does nothing.

**Claude Code prompt:**
```
Implement password reset flow:

1. /auth/forgot-password page: form with email input. On submit, call supabase.auth.resetPasswordForEmail(email, { redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/reset-password' }). Show success message: "Check your email for a reset link."

2. /auth/reset-password page: form with new password + confirm password. On submit, call supabase.auth.updateUser({ password: newPassword }). On success, redirect to /auth/login with a success message "Password updated. Please log in."

3. Wire the "Forgot password?" link on the login page to /auth/forgot-password.

Add NEXT_PUBLIC_SITE_URL=https://merchat.io to .env.local
```

---

### 1.3 — Merchant Profile Creation on Signup

**Current state:** Signing up creates an auth user but no merchant record in the merchants table.

**Claude Code prompt:**
```
After a merchant signs up via Supabase Auth, automatically create a corresponding row in the merchants table.

Create a Supabase database trigger (or handle it in the signup API route):
- On auth.users insert, create a merchants row with: id = auth.user.id, email = user email, full_name and business_name from user metadata, status = 'pending_onboarding', created_at = now()

If using a trigger, create it via the Supabase SQL editor:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.merchants (id, email, full_name, business_name, status, created_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'business_name', 'pending_onboarding', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

Also enable Row Level Security (RLS) on the merchants table so merchants can only read/update their own row:
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants can view own data" ON merchants FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Merchants can update own data" ON merchants FOR UPDATE USING (auth.uid() = id);
```

---

## SECTION 2: ONBOARDING FLOW

### 2.1 — Onboarding Saves Real Data

**Current state:** The 7-step onboarding wizard may not be persisting data to Supabase correctly.

**Claude Code prompt:**
```
Ensure the onboarding wizard (at /onboarding) saves data to Supabase at every step:

Step 1 (Business Info): Save to merchants table — business_name, business_type, description, phone_number
Step 2 (Store Setup): Save to merchants table — store_slug (validate uniqueness against existing slugs), store_name, tagline
Step 3 (Products): Save products to products table with merchant_id = current user's ID
Step 4 (Delivery): Save delivery_states (array of Nigerian states) to merchants table
Step 5 (Payment): Save payment_methods accepted to merchants table
Step 6 (WhatsApp): Save whatsapp_number to merchants table
Step 7 (Review): Set merchant status = 'active', redirect to /dashboard

At each step, use the authenticated user's ID (from supabase.auth.getUser()) as the merchant_id.

The "Next" button should be disabled while saving and show a spinner.
The "Back" button should NOT re-save data.
```

---

### 2.2 — Save & Continue Later (with Email)

**Claude Code prompt:**
```
When the merchant clicks "Save and complete later" in the onboarding wizard:

1. Save current step data to Supabase
2. Generate a unique token (use crypto.randomUUID())
3. Insert into onboarding_tokens table: { token, merchant_id, current_step, created_at, expires_at: 7 days from now }
4. Construct resume URL: process.env.NEXT_PUBLIC_SITE_URL + '/onboarding/resume/' + token
5. Display a screen showing:
   - "Your progress is saved!"
   - The resume link (copyable, with a copy button)
   - "We've sent this link to [email]"
6. Send an email using Resend (npm install resend). Create /app/api/send-resume-email/route.ts:
   - POST endpoint that accepts { email, resumeLink, merchantName }
   - Sends email with subject "Complete your Merchat setup" and body containing the link
   - Use RESEND_API_KEY from .env.local (merchant will need to add their Resend API key)

7. Create /onboarding/resume/[token]/page.tsx:
   - Fetch the token from onboarding_tokens table
   - If expired or not found, show error "This link has expired. Please log in to continue."
   - If valid, restore the merchant to the step they left off (fetch their partial data and pre-fill the form)

Add RESEND_API_KEY=your_key_here to .env.local
```

---

## SECTION 3: DASHBOARD — REPLACE ALL DUMMY DATA

### 3.1 — Conversations Page

**Claude Code prompt:**
```
The conversations page (/dashboard/conversations) should load real data from Supabase.

1. Fetch conversations from the conversations table where merchant_id = current user's ID, ordered by last_message_at DESC.
2. For each conversation, show: customer_name, customer_phone, last_message (from messages table — fetch the most recent message per conversation), last_message_at, unread count (messages where read = false).
3. When a conversation is clicked, load all messages for that conversation from the messages table, ordered by created_at ASC. Show them in a WhatsApp-style chat bubble UI (sent messages right-aligned, received left-aligned).
4. Mark messages as read (update read = true) when a conversation is opened.
5. If there are no conversations, show an empty state: "No conversations yet. Share your store link to start getting messages."

Use real-time subscription (supabase.channel) to update the conversation list when new messages arrive.
```

---

### 3.2 — Orders Page

**Claude Code prompt:**
```
The orders page (/dashboard/orders) should load real data from Supabase.

1. Fetch orders from the orders table where merchant_id = current user's ID.
2. Show filters: All, Pending, Paid, Shipped, Delivered, Cancelled.
3. Each order row should show: order_number, customer_name, customer_phone, total_amount, status, created_at, items count.
4. Order detail modal/page should show full order with line items from order_items table joined with products.
5. Status update: merchant can change order status from the detail view. Update orders table on change.
6. Search orders by customer name, phone, or order number.
7. Pagination: 20 orders per page.
8. Empty state: "No orders yet. Your orders will appear here when customers place them."
```

---

### 3.3 — Inventory Page

**Claude Code prompt:**
```
The inventory page (/dashboard/inventory) should be fully functional with real Supabase data.

1. Fetch products from products table where merchant_id = current user's ID.
2. Display products in a grid/table with: image (from product_images table — first image), name, price, stock_quantity, category, status (active/inactive).
3. Add Product: form with name, description, price, stock_quantity, category, product_images (comma-separated URLs — split and save each to product_images table), variants (structured: size, colour, etc.), pay_on_delivery toggle.
4. Edit Product: pre-fill form with existing data. Update products table and product_images table on save (delete old images, insert new ones).
5. Delete Product: confirm dialog, then delete from products table (cascade delete product_images).
6. Toggle active/inactive status without opening the edit form.
7. Search products by name.
8. Low stock alert: highlight products with stock_quantity < 5 in orange.
```

---

### 3.4 — Analytics Page

**Claude Code prompt:**
```
The analytics page (/dashboard/analytics) should show real aggregated data from Supabase.

Metrics to show (all filtered by merchant_id = current user):
- Total Revenue (sum of total_amount from orders where status = 'paid')
- Total Orders (count of orders)
- Average Order Value (total revenue / total orders)
- Repeat Customer Rate (customers with more than 1 order / total unique customers)
- Top Selling Product by revenue
- Orders by Day of Week (bar chart — group orders by day of week)
- Revenue Over Time (line chart — daily/weekly/monthly toggle)
- Revenue by Product Category (pie chart)
- Conversion Rate (if analytics_events table has storefront views)

Date filter: Last 7 days, Last 30 days, Last 3 months, Custom range.

Export button: download all orders in the date range as CSV (use Papa Parse or just build the CSV string manually and trigger a download).

AI Analyst chat box at the bottom: text input where merchant asks questions. For now, generate responses client-side based on the fetched data (e.g. if they ask "what's my best day?" compute from the data and respond in a chat bubble).
```

---

### 3.5 — Settings Pages

**Claude Code prompt:**
```
All settings pages should load the merchant's current data from Supabase on mount and save changes on form submit.

Store Profile settings (/dashboard/settings/store):
- Load: business_name, store_slug, tagline, description, logo_url, whatsapp_number, delivery_states from merchants table
- Delivery areas: multi-select checklist of all 36 Nigerian states + FCT
- Save button updates the merchants row

Notification settings (/dashboard/settings/notifications):
- Load notification preferences from merchants table (or a merchant_preferences table)
- Toggles for: new order, new message, low stock, daily summary
- Save to Supabase on change

Account settings (/dashboard/settings/account):
- Show current email (read-only)
- Change password: calls supabase.auth.updateUser({ password: newPassword })
- Business name update: updates merchants table

Finances (/dashboard/finances):
- Load all paid orders for the merchant
- Revenue summary: this month, last month, year to date
- Transaction history table: date, order number, customer, amount, payment method
- VAT estimate: 7.5% of revenue by quarter
- Export as CSV button
- Business compliance fields: CAC number, TIN, business address — save to merchants table
```

---

## SECTION 4: STOREFRONT (Customer-Facing)

### 4.1 — Dynamic Storefront

**Claude Code prompt:**
```
The customer storefront at /store/[slug] must be fully dynamic from Supabase.

1. Fetch merchant by slug from merchants table. If not found, show 404 page.
2. Fetch products where merchant_id = merchant.id AND status = 'active' AND stock_quantity > 0.
3. Show merchant's logo, store name, tagline, WhatsApp number.
4. Product cards show: first image from product_images, name, price, pay_on_delivery badge if enabled.
5. Product detail modal shows: all images (carousel), description, variants (structured display — size options, colour swatches), stock availability, price, pay_on_delivery info.
6. Cart: add to cart from product cards and from product modal. Cart persists in sessionStorage.
7. "Order Now" / checkout: builds a WhatsApp message with the cart contents and opens wa.me/[whatsapp_number]?text=[encoded message]
8. WhatsApp message format:
   "Hi! I'd like to order from [store name]:
   - [Product name] x[qty] — ₦[price]
   - [Product name] x[qty] — ₦[price]
   Total: ₦[total]
   Please confirm availability and payment details."
9. Scroll Browse Mode (TikTok-style): already built — ensure it uses real product data.
10. SEO: set page title and meta description from merchant's store name and tagline.
```

---

### 4.2 — Order Creation from Storefront

**Claude Code prompt:**
```
When a customer places an order from the storefront (after the WhatsApp redirect), create a pending order record in Supabase.

Create /app/api/orders/create/route.ts:
- POST endpoint accepting: merchant_id, customer_name, customer_phone, items (array of { product_id, quantity, price }), total_amount
- Insert into orders table: generate order_number (format: MCH-[timestamp]-[random 4 digits])
- Insert into order_items table for each item
- Return the order_id and order_number

On the storefront, before opening WhatsApp, call this API to create a pending order record. The customer's phone number can be collected via a simple modal ("Enter your WhatsApp number so we can send you updates") before redirecting.

Include the order number in the WhatsApp message so merchants can reference it.
```

---

## SECTION 5: MISSING FEATURES & BROKEN INTERACTIONS

### 5.1 — Test Your AI (Sandbox)

**Claude Code prompt:**
```
The "Test Your AI" button in the dashboard should open a modal with a working AI sandbox.

1. The modal shows a WhatsApp-style chat interface.
2. The merchant types a message as if they are a customer.
3. Create /app/api/ai-sandbox/route.ts:
   - POST endpoint accepting: merchant_id, message
   - Fetch the merchant's products from Supabase
   - Call the Anthropic API (Claude claude-haiku-4-5-20251001 model for cost efficiency):
     System prompt: "You are an AI sales assistant for [store_name]. Your job is to help customers browse products, check availability, and place orders via WhatsApp. Here are the available products: [JSON of products with names, prices, descriptions, stock]. Be friendly, helpful, and concise. Respond in a conversational WhatsApp style. If asked about a product not in the list, say it's not currently available."
   - Return the AI response
4. Show response in a chat bubble. Add a timestamp.
5. Conversation history persists within the modal session.
6. Add ANTHROPIC_API_KEY to .env.local

Install: npm install @anthropic-ai/sdk
```

---

### 5.2 — Customer Profile Slide-Over

**Claude Code prompt:**
```
The "View Customer Profile" button in conversations should open a right-side slide-over panel showing:
- Customer name and WhatsApp number
- Total number of orders
- Total amount spent (sum of paid orders)
- Last order date
- List of all their past orders (order number, date, amount, status) — clickable to open order detail
- "Send Message" button that opens the conversation with this customer

Fetch this data from the orders table filtered by customer_phone matching the conversation's customer_phone and merchant_id = current merchant.

The slide-over should animate in from the right (translate-x transition). Close button in top-right corner. Clicking outside closes it.
```

---

### 5.3 — Receipt & Invoice System

**Claude Code prompt:**
```
On the order detail page:

FOR PAID ORDERS:
1. "View Receipt" button opens a modal with a clean receipt showing:
   - Merchat.io logo + merchant store name
   - Receipt number (same as order number)
   - Date
   - Customer name and phone
   - Line items table: product name, quantity, unit price, subtotal
   - Subtotal, any fees, Total
   - Payment method
   - "Thank you for your order!" footer
2. "Download PDF" button on the receipt — use window.print() with a print-specific CSS that hides everything except the receipt modal, or use the jsPDF library (npm install jspdf) to generate a PDF.
3. "Send Receipt" button: shows confirmation dialog "Send receipt to [customer phone] via WhatsApp?" On confirm, open WhatsApp with a pre-filled message containing the order summary and a note that the formal receipt has been prepared.

FOR PENDING/UNPAID ORDERS:
- Replace "Receipt" with "Invoice" everywhere
- Invoice includes a "Payment due" line and payment instructions
- "Send Invoice" button: same WhatsApp flow but with invoice messaging

Add status-based conditional rendering: if order.status === 'paid' show receipt flow, else show invoice flow.
```

---

### 5.4 — Contact Support

**Claude Code prompt:**
```
Add a floating "Contact Support" button to all dashboard pages (fixed bottom-right, above any other floating elements).

Button: speech bubble icon, Merchat brand colour background, white icon.

On click: open a modal with:
- Title: "Contact Support"
- Pre-filled: merchant's name and email (from auth session)
- Subject dropdown: "Technical Issue", "Billing", "Feature Request", "General Question"
- Message textarea (required)
- "Send Message" button

On submit:
- Insert into support_tickets table: { merchant_id, subject, message, status: 'open', created_at }
- Show success state: "Message sent. Our team will respond within 2 hours via email."
- Close modal automatically after 3 seconds

Create the support_tickets table in Supabase if it doesn't exist:
CREATE TABLE support_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id uuid REFERENCES merchants(id),
  subject text,
  message text,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);
```

---

### 5.5 — Book a Demo Page

**Claude Code prompt:**
```
Create /app/book-demo/page.tsx with a clean form:
- Full name (required)
- Business name (required)
- WhatsApp number (required)
- Business type (dropdown: Fashion, Food & Beverages, Electronics, Beauty & Health, Home & Living, Other)
- Message / what do you want to achieve with Merchat? (textarea, optional)
- "Book Demo" submit button

On submit:
- Insert into a demo_requests table in Supabase: { full_name, business_name, whatsapp_number, business_type, message, created_at }
- Show success: "Thanks [name]! We'll reach out on WhatsApp within 24 hours to schedule your demo."
- All nav "Book a demo" and "Talk to us" buttons across the site should link to /book-demo

Create demo_requests table:
CREATE TABLE demo_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text,
  business_name text,
  whatsapp_number text,
  business_type text,
  message text,
  created_at timestamptz DEFAULT now()
);
```

---

## SECTION 6: ROW LEVEL SECURITY (Run after auth is working)

**Claude Code prompt:**
```
Enable Row Level Security on all tables so merchants can only access their own data.

Run these in the Supabase SQL editor:

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants manage own products" ON products USING (auth.uid() = merchant_id);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants view own orders" ON orders USING (auth.uid() = merchant_id);

-- Order Items (accessible if merchant owns the order)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants view own order items" ON order_items USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.merchant_id = auth.uid())
);

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants view own conversations" ON conversations USING (auth.uid() = merchant_id);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants view own messages" ON messages USING (
  EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.merchant_id = auth.uid())
);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants view own notifications" ON notifications USING (auth.uid() = merchant_id);

-- Support Tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants view own tickets" ON support_tickets USING (auth.uid() = merchant_id);

For storefront (public access — no auth needed):
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view merchants" ON merchants FOR SELECT USING (status = 'active');
```

---

## SECTION 7: ENVIRONMENT VARIABLES CHECKLIST

Make sure all of these are in both `.env.local` (local dev) and in Vercel Environment Variables (production):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=https://merchat.io
ANTHROPIC_API_KEY=your_anthropic_api_key
RESEND_API_KEY=your_resend_api_key
```

---

## EXECUTION ORDER

Work through these sections in this order to avoid dependencies breaking things:

1. Section 6 (RLS) — set up security first
2. Section 1 (Authentication) — everything else needs auth
3. Section 2 (Onboarding) — merchants need to onboard before using dashboard
4. Section 3 (Dashboard data) — replace all dummy data
5. Section 4 (Storefront) — customer-facing flows
6. Section 5 (Missing features) — polish and complete interactions
7. Re-run `npm run build` and fix any TypeScript errors
8. Push to GitHub and redeploy to Vercel
9. Add all env vars to Vercel and redeploy

---

## AFTER THIS DOCUMENT IS COMPLETE

Once all the above is working, the next phase is:
- WhatsApp webhook integration (Twilio → Next.js API route)
- AI agent that reads product catalogue and responds to customer WhatsApp messages
- Payment integration (Paystack or Flutterwave for Nigerian market)
- Email notifications (Resend)
- Merchant analytics event tracking (log storefront visits to analytics_events table)
