# Merchat.io — System Connections & Interchanges
**File 8 of 8 | For Claude Design & Engineering**  
**Reference:** All other files in this series.

---

## Purpose

This file maps every connection between Merchat's parts — who triggers what, what data flows where, what one action causes in another part of the system. Use this to ensure no flow is designed in isolation.

---

## Actor Map

| Actor | Description | Primary Interface |
|-------|-------------|-------------------|
| **Merchant** | Nigerian SME owner selling products | `/dashboard/*` |
| **Customer** | Person buying from a merchant | `/store/[slug]`, `/marketplace`, `/assistant`, `/account` |
| **AI Agent** | Automated system handling conversations | WhatsApp + `/assistant` |
| **Merchat Admin** | Merchat operations team | `/admin/*` |
| **WhatsApp** | External messaging channel | Via Twilio/Meta API |
| **Supabase** | Database and auth backend | Backend only |
| **Wallet System** | Internal payment holding | Backend, surfaced in `/account/wallet` and `/dashboard/finances` |

---

## Connection 1: Merchant Onboarding → Platform Activation

```
Merchant signs up (/auth/signup)
  → Supabase Auth creates user
  → DB trigger creates merchants row (status: pending_onboarding)
  → Redirect to /onboarding

Merchant completes 7 steps
  → Each step saves data to merchants / products tables
  → Step 7: merchants.status → 'active'
  → Redirect to /dashboard with confetti

Merchant opts into marketplace (/dashboard/marketplace)
  → Admin sees application in /admin/approvals queue
  → Automated checklist runs against DB (products count, order count, score, disputes)
  → Admin approves → merchants.marketplace_listed = true
  → WhatsApp notification sent to merchant: "Your store is now on the Merchat marketplace"
  → Store appears in /marketplace category grid
```

---

## Connection 2: Customer Orders a Product → Merchant Gets an Order

```
Customer visits /store/[slug]
  → Fetches merchant by slug from merchants table
  → Fetches products where merchant_id = merchant.id AND status = 'active'

Customer adds to cart → taps "Order via WhatsApp"
  → /api/orders/create called with { merchant_id, customer_phone, items, total }
  → Order row inserted (status: pending, order_number generated)
  → Order items rows inserted
  → WhatsApp deep link opens: wa.me/[merchant_phone]?text=[pre-filled message with order number]

Customer messages merchant via WhatsApp
  → Twilio webhook receives message → POST /api/whatsapp/webhook
  → Webhook matches message to existing pending order (by order number in message)
  → Conversation row created or updated in conversations table
  → Message row inserted

Merchant sees new conversation in /dashboard/conversations (real-time via Supabase subscription)
Merchant sees new order in /dashboard/orders (status: pending)
```

---

## Connection 3: AI Agent Handles a Customer WhatsApp Message

```
Customer sends WhatsApp message to merchant's number
  → Twilio receives → POST /api/whatsapp/webhook

Webhook handler:
  1. Identifies merchant from the receiving phone number (match to merchants.whatsapp_number)
  2. Fetches merchant's products from products table (live or cached <5min)
  3. Fetches conversation history for this customer (by customer_phone)
  4. Sends to /api/ai-agent with { merchant_context, products, conversation_history, new_message }

AI agent (Claude claude-haiku-4-5-20251001):
  System prompt includes: merchant name, store description, product catalogue, merchant policies
  Generates reply in WhatsApp-style conversational format

Webhook handler:
  5. Sends AI reply via Twilio WhatsApp API to customer
  6. Saves AI reply to messages table (sender: 'ai', content: reply)
  7. Updates conversations.last_message_at

Merchant sees the exchange in /dashboard/conversations
  → Messages labelled "AI" on the right side
  → Merchant can toggle "Take over from AI" to switch to manual mode
  → Manual mode: AI paused, merchant types replies, sent via Twilio
```

---

## Connection 4: Order Confirmation → Delivery → Fund Release

```
Merchant marks order as Confirmed (in /dashboard/orders)
  → orders.status → 'confirmed'
  → WhatsApp notification to customer: "Your order has been confirmed..."

Merchant marks order as Shipped
  → orders.status → 'shipped'
  → WhatsApp notification to customer: "Your order is on its way..."

Merchant marks order as Delivered
  → orders.status → 'delivered'
  → orders.delivered_at = now()
  → Funds move to "cooling off" state in wallet system (locked, not yet released to merchant)
  → Timer set: 48 hours

At T+48 hours (or sooner if customer confirms):
  → WhatsApp review request sent to customer (via Merchat's platform number)
  → "Did you receive your order? Reply YES or ISSUE"

IF customer replies YES:
  → Customer is asked for star rating (reply 1-5)
  → Customer is asked for written review (optional)
  → Review saved to reviews table (merchant_id, order_id, rating, text, created_at)
  → orders.review_status → 'confirmed'
  → Funds released: payout row created in payouts table
  → WhatsApp to merchant: "Payment of ₦[amount] released. Order #[ref] complete."

IF 48 hours pass with no customer reply:
  → Auto-release: payout row created
  → orders.review_status → 'auto_released'

IF customer replies ISSUE:
  → Dispute flow triggered (see Connection 5)
```

---

## Connection 5: Dispute → Resolution → Wallet / Payout

```
Customer raises dispute (via WhatsApp reply or /account/orders/[id]#dispute)
  → dispute row created: { order_id, merchant_id, customer_phone, reason, description, photos[], status: 'open' }
  → orders.dispute_status → 'active'
  → Funds remain frozen (not released to merchant)
  → Merchant notified via WhatsApp: "Customer raised a dispute on Order #[ref]. You have 72 hours to respond."
  → Admin sees dispute in /admin/disputes queue

Merchant responds (via /dashboard/orders/[id] → dispute section):
  → dispute.merchant_response = response text
  → dispute.status → 'merchant_responded'
  → Customer notified via WhatsApp: "The merchant has responded to your dispute. [link to view]"

IF customer accepts resolution:
  → dispute.status → 'resolved_satisfied'
  → Funds released to merchant (payout created)
  → Customer WhatsApp: "Glad it's sorted! ₦[amount] released to the merchant."

IF customer does not accept / merchant does not respond within 72 hours:
  → dispute.status → 'escalated'
  → Admin /admin/disputes queue shows critical alert
  → Admin reviews evidence and makes ruling

Admin rules in favour of CUSTOMER:
  → dispute.status → 'resolved_customer'
  → Refund process begins:
    IF return required:
      → Customer WhatsApp: "Refund approved. Return the item to [address] within 7 days."
      → Wallet.locked_amount += order total (stays locked until return confirmed)
      → Merchant confirms return receipt in /dashboard/orders
      → On confirmation: wallet.available_balance += refund | wallet.locked_amount -= refund
      → Customer WhatsApp: "₦[amount] added to your Merchat wallet."
    IF no return required (e.g. damaged item):
      → wallet.available_balance += refund immediately
  → Merchant internal score: -10 points
  → If merchant failed to refund themselves: additional -15 points

Admin rules in favour of MERCHANT:
  → dispute.status → 'resolved_merchant'
  → Funds released to merchant (payout created)
  → Customer WhatsApp: "After review, we've released the funds to the merchant. If you have further concerns, email support@merchat.io"
  → Merchant internal score: no change (dispute not their fault)

Score threshold check (after every score change):
  → If score drops to 40-59: warning WhatsApp to merchant + admin alert
  → If score drops below 20: merchant suspended, marketplace listing removed, admin notified
  → If score drops to 0: platform access revoked, funds frozen pending review
```

---

## Connection 6: Customer Account → Cross-Merchant Profile

```
Customer signs up with WhatsApp OTP at /auth/customer/signup
  → Supabase Auth creates customer user (separate from merchant users table)
  → System queries orders table WHERE customer_phone = [verified phone]
  → All matching anonymous orders linked to new customer account
  → Customer profile shows full order history across all merchants

Customer logs in on a storefront (/store/funkes-fashion)
  → Session persists across all storefronts (same merchat.io domain)
  → Wishlist heart icons become active (can save products)
  → "Sign in to save" prompt disappears

Customer adds to wishlist
  → wishlist row created: { customer_id, product_id, merchant_id, added_at }
  → Shown in /account/wishlist

Product goes out of stock (merchant updates inventory)
  → products.stock_quantity = 0
  → All wishlist rows for that product: notification_pending = true
  
Product comes back in stock
  → Stock update detected
  → WhatsApp notification sent to all customers who wishlisted: "🔔 [Product] from [Merchant] is back in stock!"

Price drops on a wishlisted product
  → Price update detected
  → Compare to wishlist row's saved_price (stored at time of wishlisting)
  → If new price < saved_price: WhatsApp to customer: "📉 Price drop on [Product]..."
```

---

## Connection 7: AI Shopping Assistant → Multi-Merchant Order

```
Customer visits /assistant (logged in or guest)
  → Chat interface loads

Customer types: "I want ankara fabric under ₦5,000 and baby clothes size 3 months"
  → AI parses query → two separate search intents
  → /api/assistant/search called with { query_1: 'ankara fabric', max_price: 5000, query_2: 'baby clothes size 3 months' }
  → Queries products table across ALL active merchants (marketplace-listed only)
  → Returns ranked results per query (by relevance + merchant score)

AI presents results as product cards in chat:
  → "I found these ankara options:" + 3 product cards
  → "And for baby clothes:" + 3 product cards

Customer taps "Add to Session Cart" on selected items
  → session_cart table (or browser session): { session_id, items: [{ product_id, merchant_id, qty }] }
  → Cart icon badge updates

Customer taps "Proceed to Checkout"
  → IF any item has delivery > 48 hours: confirmation screen shown
  → Redirect to /checkout/session/[session_id]

Bundled checkout page:
  → Groups items by merchant
  → Shows separate delivery address per merchant (default: customer's saved address)
  → Payment: single Merchat-hosted payment covers all merchants' amounts combined
  → Customer pays → Merchat receives payment

On payment success:
  → For EACH merchant in the session:
    → orders row created (status: pending)
    → order_items rows created
    → Merchant notified via WhatsApp: "New order #[ref] from the Merchat AI assistant — ₦[amount]"
    → Merchant sees order in /dashboard/orders
  → Customer sees bundled session in /account/orders (one session card, sub-orders per merchant)
  → Individual tracking per merchant order

Funds held by Merchat:
  → Each merchant's portion held in escrow separately
  → Released individually per merchant as each order completes the delivery + cool-off cycle
```

---

## Connection 8: Marketplace Promotion → Merchant Visibility

```
Merchant visits /dashboard/promoted
  → Sees available slots per category
  → Sees current bids and minimum bids (pulled from promotions table)

Merchant places bid:
  → bid row created: { merchant_id, category, amount, duration_days, status: 'active' }
  → Admin sees bid in /admin/promoted/auctions

Auction ends (scheduled job runs at end of auction period):
  → Highest bid per slot wins
  → promotion row created: { merchant_id, category, slot: 1/2/3, starts_at, ends_at, amount_paid }
  → Losing bidders notified via WhatsApp: "You were outbid for [Category] slot. Bid again?"
  → Winning merchant notified: "You won a promoted slot in [Category] for [duration]!"
  → Payment deducted from merchant's wallet or card

Promotion goes live:
  → /marketplace [Category] page shows promoted banner with this merchant's card
  → Slot card has "Sponsored" badge
  → Other customers browsing that category see the promotion

Promotion expires:
  → promotion.status → 'expired'
  → Slot becomes available again
  → Next auction begins (after configured cooldown period)
  → Merchant notified: "Your [Category] promotion has ended. Rebid to keep your spot."
```

---

## Connection 9: Receipt URL → Shareable Proof of Purchase

```
Order is marked as paid
  → /api/receipts/generate called
  → receipt row created: { order_id, token: uuid, expires_at: delivery_date + 30 days }
  → Receipt URL: merchat.io/receipt/[token]

Receipt URL shared:
  → Anyone with the link can view the receipt page (no auth required)
  → Page fetches order details using token (not order ID directly — privacy)
  → Shows: merchant info, customer name, items, total, payment status

If URL shared beyond 30 days:
  → receipt.expires_at < now()
  → Page shows "This receipt has expired" state

Customer downloads PDF:
  → window.print() with print-specific CSS
  → PDF contains same data as the receipt page

Merchant sends receipt via WhatsApp:
  → Merchant clicks "Send Receipt" in /dashboard/orders/[id]
  → Confirmation modal: "Send to [customer phone]?"
  → On confirm: Twilio sends WhatsApp message from merchant's number:
    "Here's your receipt for Order #[ref]: merchat.io/receipt/[token]"
```

---

## Connection 10: Merchant Internal Score → Platform Behaviour

```
Score starts at 70 on merchant creation.

Score changes are triggered by:
  - Order events (fulfilment, timing)
  - Review scores from customers
  - Dispute outcomes
  - Response time to disputes

Score is checked:

ON MARKETPLACE APPROVAL:
  → Score must be > 60 to be approved
  → If score drops below 60 after listing: auto-removed from marketplace
    → Merchant WhatsApp: "Your marketplace listing has been paused. Improve your score to relist."
    → Admin notified

ON SUSPENSION THRESHOLD (score < 20):
  → merchants.status → 'suspended'
  → Dashboard access blocked: merchant sees suspension notice with reason
  → WhatsApp: "Your Merchat account has been suspended. Contact support@merchat.io"
  → Admin must manually review and reinstate or terminate

SCORE IS NEVER SHOWN TO MERCHANT DIRECTLY
  → Instead, merchant sees indirect signals:
    → "Verified Merchant" badge lost if score drops below 60
    → Warning banner in dashboard: "Your account performance is below our standards. Check your disputes and order history."
    → Marketplace listing status changes

SCORE IS VISIBLE TO ADMIN IN:
  → /admin/merchants table (coloured badge)
  → /admin/merchants/[id] → Score History tab (timeline chart)
```

---

## Connection 11: WhatsApp Notification Routing

All platform WhatsApp messages are routed through Merchat's Twilio account.

**Sender identity:**
- Messages TO customers about their orders → sent FROM the merchant's WhatsApp number (so customer sees merchant's business name)
- Messages TO customers about platform events (wallet, disputes, reviews) → sent FROM Merchat's platform number
- Messages TO merchants → sent FROM Merchat's platform number

**Message flow:**
```
Event occurs in DB
  → Event handler in Next.js API route triggered
  → Constructs message using template from admin config
  → Calls /api/notifications/whatsapp with { to, from, template, variables }
  → Route calls Twilio API to send WhatsApp message
  → Logs notification to notifications table: { recipient_type, recipient_id, event, status, sent_at }
```

**Delivery failures:**
- If Twilio returns error: notification.status → 'failed'
- Admin can see failed notifications in /admin/notifications
- Retry logic: 3 attempts with 15-minute intervals

---

## Connection 12: Wallet Flow (End to End)

```
CUSTOMER TOPS UP WALLET:
  Customer → /account/wallet → "Top Up" → selects amount + method
  → Payment processed (bank transfer confirmed OR Paystack webhook received)
  → wallet_transactions row: { customer_id, type: 'credit', amount, source: 'top_up' }
  → customer_wallets.available_balance += amount
  → WhatsApp: "₦[amount] added to your Merchat wallet."

CUSTOMER USES WALLET AT CHECKOUT:
  → Checkout page shows wallet balance
  → Customer selects "Pay from wallet"
  → If balance >= total: full wallet payment
  → If balance < total: partial wallet + secondary payment method for remainder
  → On order payment:
    → wallet_transactions row: { type: 'debit', amount, destination: 'order_escrow', order_id }
    → available_balance -= amount paid from wallet
    → Order funds in escrow

REFUND TO WALLET (dispute resolved for customer):
  → wallet_transactions row: { type: 'credit', amount, source: 'refund', dispute_id }
  → IF return required: available_balance unchanged, locked_balance += amount
  → IF no return required: available_balance += amount immediately
  → WhatsApp: "₦[amount] added to your Merchat wallet."

WALLET DISCOUNT AT CHECKOUT:
  → On next purchase, checkout page detects available_balance > 0
  → Shows "Use wallet balance (₦[x] available)" option
  → Selected amount deducted from order total
  → Applied as a line item discount on checkout summary

MERCHANT PAYOUT (after cool-off):
  → payout row created: { merchant_id, order_id, amount, status: 'pending' }
  → Admin approves (bulk or individual) in /admin/payouts
  → Payout transferred to merchant's bank account via payment provider
  → payout.status → 'completed'
  → merchant_transactions row logged
  → WhatsApp to merchant: "₦[amount] has been paid to your bank account for Order #[ref]."
```

---

## Database Table Relationships

```
merchants (id, email, business_name, slug, status, score, marketplace_listed, ...)
  ↳ products (id, merchant_id, name, price, stock_quantity, ...)
      ↳ product_images (id, product_id, url, sort_order)
      ↳ order_items (id, order_id, product_id, quantity, price_at_purchase)
      ↳ wishlist_items (id, customer_id, product_id, merchant_id, saved_price, added_at)
  ↳ orders (id, merchant_id, customer_phone, customer_id?, status, total, ...)
      ↳ order_items (above)
      ↳ disputes (id, order_id, merchant_id, customer_phone, reason, status, ...)
      ↳ receipts (id, order_id, token, expires_at)
      ↳ payouts (id, order_id, merchant_id, amount, status)
  ↳ conversations (id, merchant_id, customer_phone, last_message_at, ...)
      ↳ messages (id, conversation_id, sender_type, content, is_ai, read, created_at)
  ↳ reviews (id, merchant_id, order_id, customer_id?, rating, text, created_at)
  ↳ promotions (id, merchant_id, category, slot, starts_at, ends_at, amount_paid, status)
  ↳ promotion_bids (id, merchant_id, category, amount, duration_days, status, created_at)
  ↳ notifications (id, recipient_type, recipient_id, event, channel, status, sent_at)
  ↳ support_tickets (id, merchant_id, subject, message, status, created_at)
  ↳ onboarding_tokens (id, merchant_id, token, current_step, expires_at)
  ↳ score_events (id, merchant_id, event_type, score_delta, new_score, reference_id, created_at)

customers (id, phone, email, full_name, created_at)
  ↳ customer_wallets (id, customer_id, available_balance, locked_balance)
      ↳ wallet_transactions (id, customer_id, type, amount, source, destination, created_at)
  ↳ wishlist_items (above)
  ↳ customer_addresses (id, customer_id, label, address, state, lga, landmark, is_default)

demo_requests (id, full_name, business_name, whatsapp_number, business_type, message, created_at)
marketplace_categories (id, name, icon, colour, sort_order, active)
admin_audit_log (id, admin_id, action, entity_type, entity_id, notes, created_at)
```

---

## API Route Map

| Route | Method | Called By | Purpose |
|-------|--------|-----------|---------|
| `/api/whatsapp/webhook` | GET | Meta/Twilio | Webhook verification |
| `/api/whatsapp/webhook` | POST | Meta/Twilio | Incoming WhatsApp messages |
| `/api/ai-agent` | POST | Webhook handler | Generate AI reply using Claude |
| `/api/ai-sandbox` | POST | Merchant dashboard | Test AI sandbox |
| `/api/assistant/search` | POST | /assistant page | Search products across merchants |
| `/api/orders/create` | POST | Storefront checkout | Create a new order |
| `/api/orders/[id]/status` | PATCH | Merchant dashboard | Update order status |
| `/api/receipts/generate` | POST | Order status handler | Generate shareable receipt |
| `/api/disputes/create` | POST | Customer account | Raise a dispute |
| `/api/disputes/[id]/respond` | POST | Merchant dashboard | Merchant responds to dispute |
| `/api/disputes/[id]/resolve` | POST | Admin dashboard | Admin resolves dispute |
| `/api/wallet/topup` | POST | Customer wallet | Initiate wallet top-up |
| `/api/wallet/pay` | POST | Checkout | Pay from wallet at checkout |
| `/api/wishlist/toggle` | POST | Storefront | Add/remove wishlist item |
| `/api/notifications/whatsapp` | POST | Internal | Send WhatsApp via Twilio |
| `/api/merchants/provision-whatsapp` | POST | Onboarding | Create Twilio subaccount |
| `/api/promotions/bid` | POST | Merchant dashboard | Place a promotion bid |
| `/api/promotions/award` | POST | Scheduled job | Award promotion slot at auction end |
| `/api/send-resume-email` | POST | Onboarding | Send onboarding resume link |
| `/api/reviews/create` | POST | WhatsApp handler | Save customer review from WhatsApp reply |
| `/api/admin/score-event` | POST | Internal | Log score change event |
| `/api/payouts/release` | POST | Admin dashboard | Release payout to merchant |

---

## Scheduled Jobs

These run on a time-based schedule (cron jobs via Vercel Cron or Supabase Edge Functions):

| Job | Frequency | Purpose |
|-----|-----------|---------|
| `release-mature-payouts` | Every hour | Release payouts where cool-off has passed and no dispute |
| `send-review-requests` | Every hour | Send WhatsApp review requests for orders delivered 48hrs ago |
| `auto-release-unreviewed` | Every hour | Auto-release payouts where review window has passed |
| `award-auction-winners` | Every hour | Check ended auctions, award slots to highest bidders |
| `expire-promotions` | Every hour | Mark expired promotions, notify merchants |
| `expire-receipts` | Daily | Mark receipts older than 30 days as expired |
| `expire-onboarding-tokens` | Daily | Mark onboarding resume tokens older than 7 days |
| `check-score-thresholds` | Every hour | Check if any merchant scores have crossed suspension/warning thresholds |
| `wishlist-price-alerts` | Every 6 hours | Check for price drops on wishlisted items, send WhatsApp alerts |
| `wishlist-restock-alerts` | Every hour | Check for restocked products with wishlisted customers, send alerts |

---

## Page Cross-Links (Navigation Between Parts)

| From | Action | To |
|------|--------|----|
| Landing page hero | "Get started" | /auth/signup (merchant) |
| Landing page nav | "Marketplace" | /marketplace |
| Landing page nav | "AI Assistant" | /assistant |
| Marketplace | "Visit Store" | /store/[slug] |
| Marketplace | Customer sign-in prompt | /auth/customer/login |
| Storefront | Wishlist heart (guest) | /auth/customer/login |
| Storefront | "Save to contacts" | vCard download (no navigation) |
| Storefront | "Order via WhatsApp" | wa.me link (external) |
| /assistant | "Proceed to Checkout" | /checkout/session/[id] |
| /checkout/session | Order confirmed | /account/orders (or /track/[id] if guest) |
| /track/[id] | "Sign in for full details" | /auth/customer/login |
| /receipt/[token] | "Sign in to save" | /auth/customer/login |
| /account/orders/[id] | "Raise a dispute" | dispute modal (same page) |
| /account/orders/[id] | "View Receipt" | /receipt/[token] (new tab) |
| Merchant dashboard | "View your storefront" | /store/[slug] (new tab) |
| Merchant dashboard | "Promote store" | /dashboard/promoted |
| /dashboard/promoted | Won promotion | /marketplace (merchant's card appears) |
| Admin /admin/disputes | "Resolve" | Triggers payout or wallet credit |
| Admin /admin/approvals | "Approve" | /marketplace listing goes live |
