# Merchat.io — Customer Experience Spec
**File 6 of 7 | For Claude Design**  
**Reference:** 01_DESIGN_SYSTEM.md for all colours, typography, and component specs.

---

## Overview

The customer experience is a parallel world to the merchant dashboard. Customers are people who discover Merchat merchants through shared links, the marketplace, or the AI assistant. They can browse anonymously or create a Merchat account to unlock order history, wallet, wishlist, and the AI shopping assistant.

**Customer-facing pages:**
1. Customer signup & login
2. Customer profile & dashboard
3. Marketplace (merchat.io/marketplace)
4. AI Shopping Assistant (merchat.io/assistant)
5. Order tracking page
6. Bundled checkout page (multi-merchant)
7. Receipt / Invoice page (shareable URL)
8. Dispute flow
9. Merchat wallet
10. Wishlist
11. Post-delivery review flow

**Key principles:**
- Anonymous browsing always works — account is a value-add, never a gate
- Every page is mobile-first — customers are primarily on phones
- WhatsApp is the primary notification channel for all events
- The experience feels like a premium Nigerian consumer app, not a generic e-commerce clone

---

## Page 1: Customer Signup & Login

### Entry Points
Customers are prompted to sign up from:
- The marketplace ("Sign in to save products to your wishlist")
- A storefront ("Sign in to view your order history here")
- The AI assistant ("Sign in for personalised recommendations")
- An order tracking page ("Sign in to see all your orders")
- A receipt page ("Sign in to save this to your order history")

Signup is never forced — always dismissible with "Continue as guest."

---

### Signup Page — `/auth/customer/signup`

**Layout:** Centred single column, max-width 400px, white background, vertical padding 48px.

**Header:**  
logo-dark.svg (icon + wordmark), 140px, centred, margin-bottom 32px

**Heading:** "Join Merchat" — Heading L, Grey 900, centred  
**Subtext:** "Save your orders, track deliveries, and shop smarter." — Body M, Grey 600, centred

---

**Two signup paths presented as cards:**

**Card A — Sign up with WhatsApp**  
WA Green border (2px), border-radius xl, padding 20px  
WhatsApp logo (32px, WA Green) centred  
"Continue with WhatsApp" — Heading S, Grey 900, centred  
"We'll send you a one-time code" — Caption, Grey 600, centred  
Button: "Use WhatsApp" — WA Green, full width, WhatsApp icon left

**Card B — Sign up with Email**  
Grey 200 border, border-radius xl, padding 20px  
Mail icon (32px, Grey 600) centred  
"Continue with Email" — Heading S, Grey 900, centred  
"Email and password" — Caption, Grey 600, centred  
Button: "Use Email" — Secondary outline, full width

Divider: "or" between cards

---

**WhatsApp signup flow:**

Step 1 — Phone input:  
Label: "Your WhatsApp number"  
Input: +234 prefix locked, rest editable  
Placeholder: "800 000 0000"  
"Send OTP" button — WA Green, full width

Step 2 — OTP verification (replaces phone screen):  
Label: "Enter the 6-digit code sent to +234 [number] on WhatsApp"  
6 individual digit input boxes (36px × 48px each, border-radius md, Grey 200 border, focus: Merchat Green)  
Auto-advances between boxes on input  
"Resend code" — Caption, Merchat Green link (60-second cooldown timer: "Resend in 45s")  
"Wrong number? Change it" — Caption, Grey 600

On verify success:
- System checks if phone number matches any existing anonymous orders
- If matches found: "We found 3 previous orders linked to this number. They've been added to your profile." — Green toast
- Redirects to profile completion screen

Step 3 — Profile completion:  
"Almost done — tell us your name"  
Full name field *  
Email address field (optional — "For order receipts via email")  
"Finish setup" button — Primary green

---

**Email signup flow:**

Fields: Full name * | Email * | Password * (with strength meter) | Confirm password *

OTP verification screen:  
"We've sent a 6-digit code to [email]"  
Same 6-box OTP input  
On verify: profile created, redirect to customer dashboard

---

### Login Page — `/auth/customer/login`

**Heading:** "Welcome back" — Heading L, Grey 900

Two tabs: "WhatsApp" | "Email & Password"

**WhatsApp tab:** Phone number input → OTP → in  
**Email tab:** Email + password, "Forgot password?" link

**Bottom:** "Don't have an account? Join Merchat" → signup

---

## Page 2: Customer Profile & Dashboard

**URL:** `/account`  
**Access:** Authenticated customers only

### Layout

**Mobile:** Single column, tab-based navigation at top  
**Desktop:** Two-column — left sidebar (220px) + main content area

### Left Sidebar (desktop)

Customer avatar (56px circle, initials or uploaded photo)  
Customer name — Heading S, Grey 900  
"[n] orders · [n] merchants" — Caption, Grey 600  
Wallet balance: "₦[amount]" — Body M, Merchat Green, 600 weight  

Nav items:
- Overview
- My Orders
- My Wishlist
- Wallet
- Addresses
- Notifications
- Account Settings

---

### Overview Tab

**Welcome row:**  
"Hi [name] 👋" — Heading M, Grey 900  
"Here's a summary of your shopping activity." — Body S, Grey 600

**Stats cards (3, horizontal row):**  
Total orders: [n] | Total spent: ₦[amount] | Merchants shopped: [n]

**Recent orders (last 3):**  
Section heading "Recent Orders" | "View all →"  
Compact order cards (see My Orders for full detail)

**Merchants you shop from:**  
Horizontal scroll row of merchant cards (logo + name + "View store" link)  
Section heading "Your Merchants" | "Explore more →" → /marketplace

**Wishlist preview:**  
Section heading "Saved Items" | "View all →"  
Horizontal scroll of product mini-cards (image, name, price)

---

### My Orders Tab

**URL:** `/account/orders`

**Filter tabs:** All | Active | Delivered | Cancelled  
**Search:** order # or merchant name

#### Order Card (each order in list)

**Single-merchant order:**  
Card: White, border Grey 200, border-radius xl, padding 20px  

Header row:  
Merchant logo (28px circle) + Merchant name (Body S, 600 weight) | Order # (Mono, Caption) | Status badge

Order items preview (first 2):  
Product image (40px square, border-radius md) + name + variant + qty — Body S, Grey 700

If more than 2: "+[n] more items" — Caption, Merchat Green

Footer row:  
Total amount (Body M, 700 weight) | Date (Caption, Grey 400) | "Track Order →" link

**Bundled session order** (multi-merchant from AI assistant):  
Card: Navy Mid background (dark), White text  
Header: Bot icon + "AI Shopping Session" + session date  
Sub-cards for each merchant order inside (same structure as single-merchant, but compact)  
Footer: "Total across [n] merchants: ₦[amount]"  
Status shows per-merchant individually

---

#### Order Detail Page — `/account/orders/[order-id]`

**Header:**  
Back arrow | "Order #MCH-240512-1234" — Heading M  
Status badge (large, centred or right)

**Status timeline (vertical stepper):**  
4 steps: Order Placed → Confirmed → Shipped → Delivered  
Completed steps: Merchat Green circle + checkmark + date/time  
Current step: Navy Deep circle + pulsing green ring animation  
Future steps: Grey 200 circle + Grey 400 number  
Each step has a subtitle: e.g. "Merchant confirmed your order on 12 May at 2:34pm"

**Merchant info card:**  
Logo + business name + "Verified Merchant" badge if applicable  
Phone number with "Save to contacts" button (vCard download) and WhatsApp icon link  
Store link: "merchat.io/store/[slug]" — Caption, Merchat Green

**Save to Contacts button:**  
On click: downloads a .vcf file containing business name, WhatsApp number, and store URL  
The vCard format:  
```
BEGIN:VCARD
VERSION:3.0
FN:[Business Name]
TEL;TYPE=WHATSAPP:[phone number]
URL:https://merchat.io/store/[slug]
END:VCARD
```
On iOS/Android this opens native "Add Contact" flow

**Order items table:**  
Product image (48px) | Name + variant | Qty | Unit price | Subtotal  
Alternating rows Grey 50 / White

**Order summary:**  
Subtotal | Delivery (if applicable) | Wallet discount (if any) | Total

**Delivery address:**  
Address card showing the delivery address used

**Payment info:**  
Method | Status badge (Paid / Pending) | Date paid

**Actions:**  
"View Receipt" → opens receipt page in new tab  
"Get help with this order" → mailto link or WhatsApp to support

**Dispute section (shows only if order is in delivered state and within cool-off window):**  
Orange banner: "Funds are in a 48-hour review period. Is everything okay with your order?"  
Two buttons: "Yes, everything is fine ✓" | "Raise a dispute ⚠"  
Confirming "fine" releases the funds to the merchant immediately  
"Raise a dispute" → opens dispute flow

---

### My Wishlist Tab

**URL:** `/account/wishlist`

Grid: 2-column mobile, 3-column desktop  
Product cards (same as storefront grid) with:  
Heart icon (filled, Merchat Green) top-right of image — click to remove  
"Out of Stock" overlay if stock = 0  
"Back in Stock" notification toggle (Bell icon, top-left) — WhatsApp notification when restocked  
"Price dropped" — green badge if price lower than when saved

Empty state: Heart icon (64px, Grey 300) + "No saved items yet" + "Browse the marketplace →" button

---

### Wallet Tab

**URL:** `/account/wallet`

**Balance card:**  
Background: Navy Deep, border-radius 2xl, padding 28px 32px  
"Merchat Wallet" — Label, Grey 400, uppercase  
Balance: "₦12,500.00" — Display L, White, 800 weight  
"Available to spend" — Caption, Grey 400  

Two buttons below balance:  
"Top Up" — WA Green, SM | "Transaction History" — Secondary outline white, SM

**Locked funds row** (if any dispute is pending):  
Warning orange banner inside card:  
Lock icon + "₦5,000 locked — pending return confirmation"  
"View dispute" link

---

**Top Up flow (bottom sheet / modal):**

Amount input: ₦ prefix, number input  
Minimum: ₦1,000 (shown as helper text)  
Quick amount chips: ₦1,000 | ₦2,500 | ₦5,000 | ₦10,000

Payment method selector:  
Radio cards: Bank Transfer | Card (Paystack) | USSD  

"Top Up" button — Primary green, full width  

Bank Transfer selected: shows Merchat's bank details with "Copy account number" button  
Card selected: opens Paystack checkout modal  
USSD selected: shows USSD string to dial

---

**Transaction History:**  
Filter: All | Credits | Debits  

Each transaction row:  
Left: icon (ArrowDownLeft = credit green | ArrowUpRight = debit red) in circle  
Centre: description (e.g. "Refund — Order #MCH-240512-1234") + date  
Right: amount (green for credit, red for debit)  

Empty state: "No transactions yet"

---

### Addresses Tab

**URL:** `/account/addresses`

**Address cards:**  
Each saved address: Name tag (e.g. "Home", "Office") | Full address | "Default" badge if default  
Edit (Edit2 icon) | Delete (Trash2 icon) per card  
"Add new address" card — dashed border, Plus icon, Merchat Green

**Add/Edit address form:**  
Address label (Home / Office / Other — text input if Other)  
Full address (textarea)  
State (dropdown — 36 states + FCT)  
LGA / City  
Landmark (optional)  
"Set as default delivery address" toggle  
Save button

---

### Account Settings Tab

**Profile section:**  
Avatar upload | Full name | Email | WhatsApp number (read-only if used for signup)

**Change password** (email accounts only)

**Notification preferences:**  
WhatsApp notifications: toggle per event type  
Order updates | Wishlist price drops | Wishlist restocks | Promotional offers from merchants I follow

**Danger zone:**  
"Delete my account" — Ghost, Error red  
Confirmation: "All your order history, wallet balance, and saved data will be permanently deleted. Wallet balance must be ₦0 before deletion."

---

## Page 3: Marketplace

**URL:** `/marketplace`  
**Access:** Public — no login required

### Page Header

**Background:** Navy Deep, padding 64px 0 48px  
**Heading:** "Discover great products" — Display M, White, centred  
**Subtext:** "Shop from verified Nigerian merchants, all in one place." — Body L, Grey 400, centred  
**Search bar:** 560px wide, centred, White background, border-radius full, height 52px  
Icon: Search (Grey 400) | Placeholder: "Search products, stores, or categories..." | "Search" button (Merchat Green, pill, inside right of bar)

**Logged-in state:** Show "Hi [name]" + wallet balance badge top-right of header

---

### Category Cards Row

Horizontal scrollable row of category cards (desktop: grid 4-col, mobile: scroll)

Each category card:  
Background: gradient (dark overlay over category-specific colour)  
Icon (40px, white)  
Category name: Heading S, White  
"[n] merchants" — Caption, `rgba(255,255,255,0.7)`  
Border-radius: 2xl  
Height: 120px  
Hover: slight scale(1.02) + shadow-lg  

Categories:
| Icon | Name | Colour |
|------|------|--------|
| Shirt | Fashion & Clothing | Purple `#7B2D8B` |
| UtensilsCrossed | Food & Beverages | Orange `#E65100` |
| Smartphone | Electronics | Blue `#1565C0` |
| Sparkles | Beauty & Health | Pink `#AD1457` |
| Home | Home & Living | Teal `#00695C` |
| Book | Books & Stationery | Brown `#4E342E` |
| Baby | Kids & Toys | Yellow `#F57F17` |
| Dumbbell | Sports & Fitness | Red `#B71C1C` |

---

### Promoted Merchants Banner (per category, or on homepage)

**Background:** Subtle gold gradient `#FFF8E1` to `#FFFDE7`, border-radius 2xl, padding 20px  
**Header row:** Star icon (Warning orange) + "Featured Merchants" — Heading S, Grey 900 | "Sponsored" — Caption pill, Grey 600, Grey 100 bg

**3 promoted merchant cards (horizontal, equal width):**

Each promoted card:  
Background: White, border 2px solid Warning orange `#FF9800`, border-radius xl  
Top-right badge: "Sponsored" — Caption, Warning orange  
Merchant logo (56px circle)  
Business name: Heading S, Grey 900  
Category: Caption, Grey 600  
Tagline: Body S, Grey 700, 1 line  
"Verified Merchant" badge (blue shield icon + "Verified") if verified  
Product preview: 3 product image thumbnails (40px squares)  
"Visit Store →" button — Primary green, full width, SM size

---

### Active Filter Bar (below categories when a category is selected)

**Filter chips (horizontal scroll):**  
"All" (active: Merchat Green fill) | "Verified Only" | "Fast Delivery" | "Pay on Delivery"  

**Sort dropdown:** Most Popular | Newest | Most Orders | A–Z

**Search within category:** input, same style as header search but smaller

---

### Merchant Grid

**Layout:** 3-column desktop, 2-column tablet, 1-column mobile  
**After promoted banner:** regular merchant cards

#### Regular Merchant Card

Background: White, border Grey 200, border-radius xl, shadow-sm  
Hover: shadow-md, translateY(-2px)

**Header:** Merchant banner image (160px height) OR solid colour bg with logo centred  
Merchant logo: 52px circle, white border (2px), overlapping bottom edge of banner (pulled up with negative margin)

**Content (padding 16px, padding-top 28px to account for overlapping logo):**

Business name: Heading S, Grey 900, 600 weight  
Category: Caption, Grey 400  
Tagline: Body S, Grey 600, 2 lines max  

**Badges row:**  
"Verified Merchant" — shield icon (16px, Info blue) + "Verified" — Caption, Info blue  
"Fast Delivery" — Zap icon (16px, Merchat Green) + Caption if applicable  

**Stats row:**  
Star icon (Warning orange, 14px) + "[avg rating from reviews]" — Caption, Grey 600  
"[n] orders" — Caption, Grey 600  
Dot separator  

**Footer (padding-top 12px, border-top Grey 100):**  
"[n] products" — Caption, Grey 400  
"View Store →" — Body S, Merchat Green, 600 weight, right-aligned

---

### Marketplace Search Results

**URL:** `/marketplace/search?q=[query]`

**Header:** "Results for '[query]'" — Heading M, Grey 900  
"[n] products from [m] merchants" — Body S, Grey 600

**Two tabs:** Products | Merchants

**Products tab:**  
Grid of product cards (same as storefront grid) with merchant name below product name  
Clicking product → opens the merchant's storefront at that product

**Merchants tab:**  
List of merchant cards matching the search  

**No results state:**  
Search icon (64px, Grey 300)  
"No results for '[query]'" — Heading M, Grey 600  
"Try different keywords or browse categories" — Body M, Grey 400  
"Browse Categories" button → scrolls to category row

---

## Page 4: AI Shopping Assistant

**URL:** `/assistant`  
**Access:** Public (limited) — authenticated customers get full features

### Page Layout

**Background:** Navy Deep full page  
**Max-width:** 720px centred  
**Height:** Full viewport

### Header

logo-light.svg (icon only, 28px) + "AI Shopping Assistant" — Heading S, White  
Subtext: "Find products across all Merchat merchants and order with ease." — Caption, Grey 400  
Right: "Sign in" link (Grey 400, Caption) if not logged in

---

### Chat Interface

**Messages area:**  
Background: `rgba(255,255,255,0.04)` — very subtle  
Border: 1px solid `rgba(255,255,255,0.08)`, border-radius 2xl  
Overflow: auto, flex-column  
Padding: 20px

**AI message (left-aligned):**  
Avatar: 32px circle, Navy Mid background, Bot icon (16px, Merchat Green)  
Bubble: `rgba(255,255,255,0.08)` background, border-radius 16px (flat top-left), White text, padding 12px 16px

**User message (right-aligned):**  
Bubble: Merchat Green background, White text, border-radius 16px (flat top-right)

**Opening message:**  
"Hi! I'm your Merchat shopping assistant. I can help you find products across all our merchants, compare options, and place orders for you. What are you looking for today?"

**Suggested prompts (shown initially, disappear after first message):**  
4 pill buttons: "Find ankara fabric under ₦5,000" | "Best phone cases in Lagos" | "Looking for baby clothes size 0-3 months" | "Compare running shoes"

---

### Product Search Results (in chat)

When the AI finds products, it shows them as inline product cards within the chat:

**Product result card (inside AI bubble):**  
Background: `rgba(255,255,255,0.08)`, border-radius xl, padding 16px  
Horizontal layout: Product image (64px square, border-radius lg) | content  
Product name: Body S, White, 600 weight  
Merchant: Caption, Grey 400 + "Verified" badge if applicable  
Price: Body M, Merchat Green, 700 weight  
"View Store" — Ghost SM, White border | "Add to Session Cart" — Primary green SM

Multiple results shown as a vertical stack of these cards.

**"Add to Session Cart" behaviour:**  
Adds product to a floating session cart (shows as a cart icon badge in header)  
AI acknowledges: "Added! Shall I find anything else, or are you ready to checkout?"

---

### Session Cart (floating, right side on desktop / bottom sheet on mobile)

**Trigger:** Cart icon in top-right of assistant page

**Cart panel:**  
Heading: "Your cart" — Heading S  
Grouped by merchant:

**Merchant group header:**  
Merchant logo (24px) + name | "[n] items · ₦[subtotal]"

Items within group: compact rows (image 36px | name | qty | price)

**Footer:**  
"[n] merchants · [n] items total"  
Grand total: ₦[amount]  
"Proceed to Checkout" — Primary green, full width

---

### Checkout Handoff

When customer taps "Proceed to Checkout" from the AI session cart, they are taken to the bundled checkout page (Page 6). The AI session reference is passed along so all orders are linked.

**For orders with delivery > 48 hours:**  
Before checkout, AI shows a confirmation screen:  
"Just to confirm — here's what you're ordering:"  
List of all items grouped by merchant with estimated delivery times  
"Confirm & Checkout" | "Change something"

---

### Guest vs Signed-In Experience

**Guest:**  
Can search, browse AI results, add to session cart  
At checkout: prompted to sign up or enter phone number (for WhatsApp order updates)  
Order history not saved to profile

**Signed-In:**  
Saved addresses pre-fill at checkout  
Wallet balance shown and applicable  
Orders automatically added to profile  
AI has context: "Based on your past orders, you usually buy from Lagos merchants — should I prioritise those?"

---

## Page 5: Order Tracking

**URL:** `/track/[order-id]` (publicly accessible with the link)

**Also:** `/account/orders/[order-id]` for logged-in customers (more detail)

### Public Tracking Page

**Header:**  
Merchat logo-dark (centred, 140px)  
"Order Tracking" — Heading M, Grey 900, centred

**Order summary card:**  
Border-radius 2xl, shadow-md, padding 28px  

"Order #MCH-240512-1234" — Heading S, Grey 900  
Merchant name + logo  
Date placed — Caption, Grey 600

**Status timeline:** (same vertical stepper as in account/orders detail)  
Order Placed → Confirmed → Shipped → Delivered  
Current step pulses gently with Merchat Green ring

**Items summary:**  
Product name + variant + qty for each item  
Total: ₦[amount]

**Delivery address:** shown (truncated for privacy — "Ikeja, Lagos State")

**"Sign in to see full details" banner** (if not logged in):  
Merchat Green tinted banner: "Sign in with your WhatsApp number to see your full order history and receipt."  
"Sign in" button — Primary green, SM

**Footer:**  
"Need help? Contact [Merchant Name] directly: [WhatsApp button]"

---

## Page 6: Bundled Checkout Page

**URL:** `/checkout/session/[session-id]`  
Generated by the AI shopping assistant for multi-merchant carts.

### Layout

**Background:** Grey 50  
**Two-column desktop (60/40), single column mobile**

### Left — Order Summary

**Heading:** "Your order" — Heading M, Grey 900

For each merchant in the session:

**Merchant section card:**  
Header: Merchant logo (32px) + Business name — Heading S, Grey 900  
Items table: image | name + variant | qty | price  
Merchant subtotal: right-aligned, Body M, 700 weight  
Delivery address for this merchant:  
Default address pre-filled (if logged in)  
"Use a different address for this merchant" — link, expands address form  
Estimated delivery: Caption, Grey 600, italic

**Session total:**  
Divider  
Per-merchant subtotals  
Wallet discount: `-₦[amount]` (green, if wallet balance applied)  
Grand total: Display M, Grey 900, 800 weight

---

### Right — Payment

**Sticky on desktop**

**Payment method card:**  
Heading: "Payment" — Heading S, Grey 900

Radio options:

**Wallet** (if logged in and has balance):  
"Pay from wallet (₦[balance] available)"  
If balance covers full total: "Your wallet covers this order ✓" — green  
If partial: "Wallet covers ₦[x]. Pay ₦[remainder] via:"  
Shows secondary payment method selector below

**Bank Transfer:**  
Shows consolidated Merchat bank account  
"Transfer ₦[total] to: GTBank · 0123456789 · Merchat Technologies Ltd"  
"Copy account details" button  
Note: "Your order will be confirmed once payment is received (usually within 15 minutes)."

**Card (Paystack):**  
Opens Paystack modal on "Pay now"

**Order note (optional):**  
Textarea: "Any special instructions for your merchants?"

**"Place Order" button:**  
Primary green, full width, LG size  
"By placing this order you agree to Merchat's Terms of Service."

**Security badge row:**  
Lock icon + "Secure payment" | Shield icon + "Buyer protection" — Caption, Grey 400

---

### Order Confirmation Screen (after payment)

Full-page centred:

Confetti animation (green particles, 1.5 seconds)  
CheckCircle (80px, Merchat Green)  
"Orders placed! 🎉" — Display M, Grey 900, centred  
"You'll receive WhatsApp updates for each merchant as they confirm and ship your items." — Body M, Grey 600, centred

Session summary:  
"[n] orders placed across [n] merchants"  
Total paid: ₦[amount]

Buttons:  
"Track my orders" → /account/orders (or /track/[session-id] if guest)  
"Continue shopping" → /marketplace

---

## Page 7: Receipt / Invoice Page

**URL:** `/receipt/[order-id]`  
**Access:** Anyone with the link (public) | Expires 30 days after order delivery date

### Receipt Page Layout

**Background:** White  
**Max-width:** 640px, centred  
**Padding:** 40px  
**Print-optimised:** Clean layout that prints/saves as PDF correctly

---

### Receipt Header

Merchat logo-dark (icon + wordmark), 140px wide  
Thin green line (3px, Merchat Green, full width) below logo  

"RECEIPT" or "INVOICE" — Display M, Grey 900, letter-spacing 3px, right-aligned  
Receipt #: Mono font, Grey 600, right-aligned

---

### Two-column info block

**Left — From:**  
"From" — Label, Grey 400, uppercase  
Merchant business name — Heading S, Grey 900  
WhatsApp number — Body S, Grey 600  
merchat.io/store/[slug] — Body S, Merchat Green

**Right — To:**  
"To" — Label, Grey 400, uppercase  
Customer name — Heading S, Grey 900  
Customer WhatsApp — Body S, Grey 600  
Delivery address — Body S, Grey 600

---

### Date & Reference block

Date issued: [date] | Order #: [Mono font]  
Payment status: large badge (Paid — Green | Pending — Warning)  
Payment method: [method]

---

### Items Table

| Product | Variant | Qty | Unit Price | Total |
|---------|---------|-----|------------|-------|
| [name] | Size: M | 2 | ₦12,500 | ₦25,000 |

Alternating row: white / Grey 50  
Border-bottom: 1px Grey 200 on each row

**Totals block (right-aligned):**  
Subtotal: ₦[x]  
Delivery: ₦[y] / "Free"  
Discount (wallet): -₦[z] (green, only if applicable)  
Thick divider  
**Total: ₦[amount]** — Heading M, Grey 900, 700 weight

---

### Footer

"Thank you for shopping with [Merchant Name]" — Body M, Grey 600, centred, italic  
Thin divider  
"Powered by Merchat.io" — Caption, Grey 400, centred  
Merchat icon-dark (16px, inline) left of text

---

### Action Bar (sticky bottom, not printed)

"Download PDF" — Primary green, Download icon | "Share receipt" — Secondary outline, Share2 icon | "Copy link" — Ghost, Copy icon

**Download PDF:** triggers window.print() with print-only CSS hiding the action bar  
**Share receipt:** opens native share sheet on mobile (Web Share API)  
**Copy link:** copies the full URL to clipboard

---

**Expired page state (after 30 days):**  
Centred: Clock icon (64px, Grey 300)  
"This receipt has expired" — Heading M, Grey 600  
"For records, please contact [Merchant Name] on WhatsApp." — Body M, Grey 400  
WhatsApp button to merchant

---

## Page 8: Dispute Flow

**Entry point:** Order detail page → "Raise a dispute" button (only visible during 48-hour cool-off window)

### Step 1 — Select Dispute Reason

**Modal / full-screen on mobile**  
Heading: "What's the issue with your order?" — Heading M, Grey 900

Reason cards (radio-card style, select one):

| Icon | Reason |
|------|--------|
| Package | Item not received |
| X | Wrong item sent |
| AlertCircle | Item damaged or defective |
| Minus | Missing item(s) from order |
| HelpCircle | Other |

"Next →" button — Primary green, disabled until reason selected

---

### Step 2 — Describe the Issue

Heading: "Tell us more" — Heading M  
Subtext: "The merchant will see this. Be specific about what went wrong." — Body S, Grey 600

Textarea: "Describe your issue..." — min 30 characters required  
Character count: "[n]/500"

**Photo evidence:**  
"Add photos (optional but recommended)"  
Upload area: dashed border, Camera icon, "Tap to add photos"  
Max 5 photos, each max 5MB  
Uploaded photos shown as 60px squares with X to remove

"Submit Dispute" button — Error red (to signal seriousness), full width

---

### Step 3 — Dispute Submitted Confirmation

AlertCircle icon (64px, Warning orange)  
"Dispute submitted" — Heading M, Grey 900  
"The merchant has 72 hours to respond and resolve the issue. Your funds remain frozen during this period." — Body M, Grey 600

**What happens next:**  
Numbered list:
1. Merchant is notified and has 72 hours to respond
2. If resolved: funds returned via Merchat wallet
3. If unresolved: Merchat reviews and decides
4. You'll receive WhatsApp updates throughout

"View order" button | "Back to orders" link

---

### Dispute Status Tracking (in order detail)

**Dispute status card** (appears in order detail when dispute is active):

Background: Warning orange `#FFF3E0`, border-left 4px Warning orange, border-radius lg, padding 16px

Status: "Under Review" | "Merchant Responded" | "Resolved — Refund Issued" | "Closed — No Refund"

Timeline:  
Dispute raised: [date]  
Merchant deadline: [date + 72hrs]  
Resolution: [date if resolved]

"View merchant's response" — link (shows merchant's reply)  
"Escalate to Merchat" — Ghost button, Error red (only if 72hrs passed with no response)

---

### Return Process (if refund approved, requires return)

**WhatsApp message to customer:**  
"Your dispute has been approved. To receive your ₦[amount] refund, please return the item to:  
[Merchant Name]  
[Return address]  
Return by: [date — 7 days]  
Reply RETURNED when you've sent it back."

**On merchant confirming receipt of return:**  
Wallet credited  
WhatsApp notification: "Your refund of ₦[amount] has been added to your Merchat wallet."

**Return cost:** Split 50/50 between merchant and customer. Customer shows receipt for their half. If merchant was fully at fault (Merchat decision), merchant bears 100%.

---

## Page 9: Post-Delivery Review Flow

**Trigger:** 48 hours after merchant marks order as delivered, a WhatsApp message is sent to the customer.

### WhatsApp Review Request Message

```
Hi [Customer Name]! 👋

Your order from [Merchant Name] was marked as delivered.

Did you receive everything okay?

Reply:
✅ YES - Everything is great
⚠️ ISSUE - I have a problem
```

---

### If Customer Replies "YES":

**WhatsApp follow-up:**
```
Great! We'd love to hear your feedback 🌟

How would you rate [Merchant Name]?
Reply with a number:
1 ⭐ - Poor
2 ⭐⭐ - Fair  
3 ⭐⭐⭐ - Good
4 ⭐⭐⭐⭐ - Very Good
5 ⭐⭐⭐⭐⭐ - Excellent
```

After rating:
```
Thanks! Any comments you'd like to share? 
(Optional — reply SKIP to finish)
```

After comment or SKIP:
```
Thanks for your feedback! Your review has been shared with [Merchant Name]. 

Funds have been released to the merchant. Happy shopping! 🛍️
```

---

### Review Display on Storefront

**On merchant storefront (below store header):**

Review summary row:  
Star average (e.g. ★★★★☆ 4.3) | "[n] reviews"  
Only shows if merchant has 5+ reviews

**Review cards (bottom of storefront, expandable section):**

Each card: Stars (gold) | Review text (Body S, Grey 800, italic) | Date (Caption, Grey 400) | "Verified Purchase" badge (green)  
Customer name: first name + last initial only (privacy)  
Show 3 most recent, "Show all reviews" link

---

### If Customer Replies "ISSUE":

**WhatsApp message:**
```
Sorry to hear that! Let's get this sorted.

Please visit this link to raise a dispute:
[dispute URL for this order]

You have 48 hours to raise a dispute before funds are released.
```

Dispute URL → `/account/orders/[order-id]#dispute` — opens dispute flow directly

---

## Storefront Enhancements (Customer-Facing)

### Save Merchant to Contacts

On every merchant storefront, below the store header:

**"Save to Contacts" button:**  
vCard icon (or Person+ icon) + "Save [Business Name]'s number"  
Style: Secondary outline, SM, full width on mobile  
On click: downloads .vcf file containing:  
- Business name
- WhatsApp number
- Store URL (merchat.io/store/[slug])

The saved contact appears in the customer's phone as "[Business Name] · Merchat"

### Verified Merchant Badge

On storefront header (next to store name):  
Shield icon (18px, Info blue `#1565C0`) + "Verified Merchant" — Caption, Info blue  
Tooltip on hover/tap: "This merchant has been verified by Merchat. Active products, completed profile, and good order history."

Only shown for merchants who have passed the marketplace review process.

---

## Customer Notifications (All via WhatsApp)

| Event | Message |
|-------|---------|
| Order confirmed by merchant | "✅ [Merchant] confirmed your order #[ref]. Estimated delivery: [date]." |
| Order shipped | "🚚 Your order from [Merchant] is on its way! [tracking if available]" |
| Order delivered | "📦 [Merchant] marked your order as delivered. Was everything okay? [link]" |
| Review request | Sent 48 hours after delivery (see review flow above) |
| Dispute update | "⚠️ Update on your dispute with [Merchant]: [status]" |
| Refund approved | "💚 Your refund of ₦[amount] has been added to your Merchat wallet." |
| Wishlist back in stock | "🔔 [Product] from [Merchant] is back in stock! [store link]" |
| Wishlist price drop | "📉 Price drop! [Product] from [Merchant] is now ₦[new price] (was ₦[old price]). [store link]" |
| Wallet topped up | "💰 ₦[amount] added to your Merchat wallet. New balance: ₦[total]." |
| Promoted merchant in your category | "🌟 [Merchant] — a top merchant in [category you've shopped] — is now on Merchat. [store link]" |
