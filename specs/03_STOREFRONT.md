# Merchat.io — Customer Storefront Spec
**File 3 of 7 | For Claude Design**  
**Reference:** 01_DESIGN_SYSTEM.md for all colours, typography, and component specs.

---

## Overview

The storefront is the customer-facing shopping experience. Customers land here from a merchant's shared link. There is no login required — it is fully public.

URL pattern: `/store/[merchant-slug]` (e.g. `/store/funkes-fashion`)  
Purpose: Let customers browse products and place orders via WhatsApp.  
Mobile-first: 90%+ of traffic will be on mobile. Design mobile first, then expand for desktop.

---

## Storefront Pages

1. Main storefront (product grid)
2. Product detail (modal / expanded view)
3. Scroll browse mode (TikTok-style)
4. Cart & checkout
5. Order placed confirmation

---

## Page 1: Main Storefront

### Header / Store Banner

**Background:** Navy Deep `#0B1221`  
**Height:** 200px on mobile, 240px on desktop  
**Layout:** Centred content, flex column

**Merchant logo:**  
Circular avatar, 72px diameter, white background, merchant's logo image inside (object-fit: cover). If no logo, show coloured circle with merchant's initials (2 letters), font Heading M, White.  
Border: 3px solid Merchat Green

**Store name:**  
Heading L (28px), White, 700 weight, centred. 12px below avatar.

**Tagline:**  
Body S, Grey 400, centred, italic. 4px below store name.

**WhatsApp contact row:**  
Small row: WhatsApp icon (WA Green, 18px) + phone number (Caption, Grey 400). Tap to open WhatsApp chat.

**Save to Contacts button:**  
UserPlus icon (16px, White) + "Save [Business Name]" — small pill button, semi-transparent white background  
On tap: downloads .vcf file with business name, WhatsApp number, and store URL  
Displayed below the WhatsApp row

**Verified Merchant badge:**  
If merchant is verified: Shield icon (16px, Info blue) + "Verified Merchant" — Caption, Info blue  
Shown inline next to the store name

**Customer sign-in prompt (shown if not logged in, subtle):**  
Dismissible bar below the store header (not sticky):  
"Sign in to save products, track orders, and get updates" — Caption, Grey 600  
"Sign in" link → /auth/customer/login | "×" dismiss button

**Scroll Browse Mode button:**  
Positioned top-right of header area. Pill button: semi-transparent white background, black text, small.  
Icon: Play (16px) + text "Browse Mode"  
Tapping this enters the full-screen scroll browse experience.

**Cart icon button:**  
Positioned top-right corner (above Browse Mode button on mobile).  
ShoppingCart icon, White, 24px. Badge: Merchat Green circle with item count (white text, 11px). Badge is absolutely positioned top-right of icon.

---

### Filter & Search Bar

**Background:** White  
**Position:** Sticky below header on scroll  
**Height:** 56px  
**Padding:** 0 16px

**Layout:** Search input left (takes remaining space), Filter button right

**Search input:**  
Icon: Search (Grey 400, 18px) inside input left  
Placeholder: "Search products..."  
Height: 40px, border-radius: full, background Grey 100, border: none

**Filter button:**  
Icon: SlidersHorizontal (20px) + "Filter" text  
Ghost button, Grey 800 text  
Opens filter drawer from bottom on mobile, dropdown on desktop

**Filter options (in drawer/dropdown):**
- Category (chips/pills): All, Fashion, Food, Electronics, Beauty, Home, Other
- Sort by: Newest, Price: Low to High, Price: High to Low, Most Popular
- Availability: All, In Stock Only
- Pay on delivery: toggle

Active filters show as green pills below the search bar with X to remove.

---

### Product Grid

**Background:** Grey 50  
**Padding:** 16px

**Grid:** 2 columns mobile, 3 columns tablet, 4 columns desktop  
**Gap:** 12px mobile, 16px desktop

#### Product Card

**Background:** White  
**Border radius:** xl (16px)  
**Shadow:** shadow-sm  
**Overflow:** hidden (so image fills top cleanly)

**Image area:**  
Height: 200px mobile, 220px desktop  
Object-fit: cover  
Background: Grey 100 (loading state)  
If multiple images: small dots indicator at bottom of image (3px circles, white)  
If out of stock: semi-transparent overlay "Out of Stock" in Caption, grey pill badge

**Badges (top-left of image, absolute positioned):**  
- "Pay on delivery" — small pill, Warning orange bg, white text, 10px font
- "New" — small pill, Merchat Green bg, white text

**Content area (padding 12px):**

Product name: Body S (14px), Grey 900, 600 weight, 2 lines max, ellipsis

Price: Heading S (18px), Grey 900, 700 weight  
If has original price: strikethrough original in Grey 400, sale price in Error red

Stock badge: if stock_quantity ≤ 5 and > 0: "Only [n] left" in Warning orange, Caption size

**Action button:**  
Full width  
Height: 36px  
Text: "Add to cart"  
Style: Primary green, border-radius full, Button size  
If out of stock: disabled, Grey 400 background, "Out of Stock" text

---

### Empty State

If merchant has no products:  
Centred flex column, 120px top padding  
Icon: Package (64px, Grey 300)  
Heading: "No products yet" — Heading M, Grey 600  
Body: "This store is still setting up. Check back soon!" — Body M, Grey 400

---

## Page 2: Product Detail

Opens as a bottom sheet on mobile, centred modal on desktop.

**Trigger:** Tapping anywhere on a product card (except the "Add to cart" button)

### Mobile Bottom Sheet

Slides up from bottom, covers ~90% of screen height.  
Background: White  
Border radius: 2xl top corners only (24px top-left, 24px top-right)  
Drag handle: 4px × 32px pill, Grey 300, centred top of sheet, margin 12px below  
Can be dismissed by dragging down or tapping overlay.

### Desktop Modal

Max-width 640px, centred, border-radius 2xl, shadow-xl.  
Overlay: `rgba(0,0,0,0.6)`, backdrop blur 4px.

### Product Detail Content

**Image carousel:**  
Height: 300px mobile, 360px desktop  
Full width of sheet/modal  
Horizontal swipe between images  
Dots indicator below: active dot Merchat Green, inactive Grey 300  
If only 1 image: no dots shown

**Content section (padding 20px):**

**Product name:** Heading L (28px), Grey 900, 700 weight

**Price row:**  
Primary price: Display M (36px), Grey 900, 800 weight  
If sale: original price strikethrough Grey 400 (20px), sale price in Error red  
"Pay on delivery available" pill badge (Warning orange) if enabled

**Stock indicator:**  
Green dot + "In stock ([n] available)" — Caption, Grey 600  
Orange dot + "Only [n] left" — Caption, Warning orange (if ≤ 5)  
Red dot + "Out of stock" — Caption, Error red (if 0)

**Description:**  
Body M, Grey 600, line height 1.7  
"Show more" link if > 3 lines

**Variants section** (if product has variants):  

Each variant type is a labelled group:

*Size variant:*  
Label: "Size" — Label, Grey 800  
Options as horizontal scroll of pills:  
Each pill: 48px min-width, 36px height, border-radius full  
Unselected: Grey 100 background, Grey 800 text, 1.5px Grey 200 border  
Selected: Merchat Green background, White text, no border  
Out-of-stock size: Grey 100 bg, Grey 400 text, strikethrough, disabled

*Colour variant:*  
Label: "Colour" — Label, Grey 800  
Options as circles, 32px diameter  
Actual colour fill  
Selected: 3px Merchat Green ring around circle  
A colour name label appears below selected circle

*Material/other text variants:*  
Same pill style as size

**Quantity selector:**  
Minus (–) button | Quantity number | Plus (+) button  
Buttons: 36px × 36px, border 1.5px Grey 200, border-radius md  
Number: Heading S, Grey 900, centred, min-width 48px  
Min quantity: 1, Max: stock_quantity

**Add to Cart button:**  
Full width, 52px height, Primary green, LG size  
Text: "Add to Cart · ₦[total for quantity]"  
Updates price dynamically as quantity changes

**Or Order Now button:**  
Full width, 48px height, Secondary outline (navy border)  
Icon: WhatsApp (WA Green, 20px) left of text  
Text: "Order via WhatsApp"  
Opens WhatsApp directly with pre-filled message for this product

---

## Page 3: Scroll Browse Mode

Full-screen immersive product browsing. Activated by "Browse Mode" button in header.

**Layout:** Exactly full viewport (100vw × 100vh). No scroll bar. No standard UI chrome.

**Background:** Black `#000000`

**Exit button:**  
Top-left: X icon, 40px × 40px, White, semi-transparent dark circle background  
Tapping exits scroll browse mode and returns to grid view

**Cart icon:**  
Top-right: ShoppingCart, White, badge with count (same as grid)

**Filter button:**  
Top-right below cart: SlidersHorizontal icon in pill button, semi-transparent

### Product Display (each "slide")

**Product image:**  
Full screen background image, object-fit: cover  
Dark gradient overlay from transparent (middle) to `rgba(0,0,0,0.7)` (bottom 40%)

**Content overlay (bottom, above gradient):**  
Padding: 24px  
Bottom padding: 40px (accounting for home indicator on iPhone)

Product name: Heading L (28px), White, 700 weight, 1 line, ellipsis

Price: Display M (36px), White, 800 weight

Stock info: Caption, `rgba(255,255,255,0.7)`, e.g. "12 left in stock"

**Variant quick-select** (if has size variants):  
Horizontal row of small pills, semi-transparent white background, white text  
Selected: solid white background, navy text

**Action row:**  
Horizontal flex, gap 12px

"Add to Cart" button: Merchat Green, pill, flex-1  
"Order on WhatsApp" button: WA Green, pill, icon only or icon + text

**Image dots/counter:**  
If product has multiple images: "2/4" indicator top-right below cart icon

**Navigation indicators:**  
Right side: subtle chevron-up and chevron-down (White, 20px opacity 0.4) showing swipe direction

### Swipe Interaction

Swipe UP → next product (slides current product up, next product slides in from bottom)  
Swipe DOWN → previous product  
Minimum swipe distance: 50px  
Animation: translateY transition, 300ms ease-out  
Out-of-stock products: skipped automatically (not shown in scroll mode)

---

## Page 4: Cart

Opens as a right-side drawer (desktop) or bottom sheet (mobile).  
Triggered by tapping cart icon.

### Cart Header

"My Cart" — Heading M, Grey 900  
"[n] items" — Body S, Grey 600  
Close button (X) top-right

### Cart Items List

Each cart item row:

**Product image:** 64px × 64px, border-radius lg, object-fit cover

**Product info (flex-1):**  
Product name: Body S, Grey 900, 600 weight  
Selected variants: Caption, Grey 600 (e.g. "Size: M · Colour: Red")

**Quantity control:**  
Minus | [n] | Plus — compact, 28px height, same style as product detail

**Price:** Body S, Grey 900, 700 weight (quantity × unit price)

**Remove button:** Trash2 icon, 16px, Grey 400, top-right of row

Swipe left on item row (mobile) to reveal red delete button

**Divider:** 1px Grey 100 between items

### Cart Footer

**Sticky bottom of cart drawer/sheet:**  
Divider top, background White, padding 20px

Order summary:  
"Subtotal" right: ₦[amount] — Body M, Grey 600  
"Delivery" right: "To be confirmed" — Body S, Grey 400, italic  
Divider  
"Total" right: ₦[subtotal] — Heading M, Grey 900, 700 weight

**"Order via WhatsApp" button:**  
Full width, 52px height, WA Green background  
Icon: WhatsApp logo (white, 24px) + "Order via WhatsApp"  
Tapping builds WhatsApp message and opens wa.me link

**Message format sent to WhatsApp:**
```
Hi! I'd like to place an order from [Store Name]:

🛍️ My Order:
• [Product 1 name] (Size: M) × 2 — ₦25,000
• [Product 2 name] × 1 — ₦8,500

💰 Total: ₦33,500

Please confirm availability and payment details. Thank you!
```

**"Continue shopping" link:** Ghost, centred below button, Grey 600

**Empty cart state:**  
ShoppingCart icon 48px, Grey 300  
"Your cart is empty" — Heading S, Grey 600  
"Browse products to add items" — Body S, Grey 400  
"Browse Products" — Primary green button

---

## Page 5: Order Placed Confirmation

Shown after customer taps "Order via WhatsApp" (as a screen before WhatsApp opens).

**Background:** White  
**Layout:** Centred, full screen, flex column, gap 24px, padding 32px

**Animation:** CheckCircle icon animates in with scale from 0 to 1, spring easing, 400ms

**Success icon:** CheckCircle, 80px, Merchat Green

**Heading:** "Order Sent!" — Display M, Grey 900, centred

**Body:** "Your order has been sent to [Store Name] on WhatsApp. They'll confirm availability and payment details shortly." — Body M, Grey 600, centred, max-width 320px

**Order reference** (if order was created in DB):  
"Reference: MCH-20240512-1234" — Mono font, Grey 600, centred  
Small pill, Grey 100 background

**Opening WhatsApp:** "Opening WhatsApp..." — Caption, Grey 400, centred  
WhatsApp icon spinning (loading) — WA Green

**Buttons:**  
"Continue shopping" — Secondary outline button, full width  
"Track my order" (if order tracking is available) — Ghost button, Merchat Green text

---

## Mobile-Specific Considerations

**Safe areas:** Respect iOS safe area insets — bottom padding on all fixed/sticky elements should account for home indicator (minimum 34px on iPhone X and above).

**Tap targets:** All interactive elements minimum 44px × 44px.

**Overscroll behaviour:** On the main product grid, pull-to-refresh shows a green loading spinner.

**Image loading:** All product images use skeleton loading (animated shimmer, Grey 100 base, Grey 200 shimmer).

**Offline state:** Show a banner "You appear to be offline. Some images may not load." — Warning orange, dismissible.

---

## Reviews Section (bottom of storefront)

Shown only if merchant has 5+ verified reviews.

**Section header:**  
"What customers say" — Heading M, Grey 900  
Star average display: filled stars (Warning orange) + "[n] reviews" — Body S, Grey 600

**Review cards (horizontal scroll on mobile, 3-column grid desktop):**

Each card — Dark Card (Navy Mid background):
- Stars: filled gold ★ (5 star scale)
- Review text: Body S, White, italic, max 3 lines, ellipsis with "Read more"
- Divider: 1px Navy Light
- Customer: first name + last initial only (e.g. "Tunde O.") — Caption, Grey 400
- "Verified Purchase" badge: Caption, Merchat Green

Show 6 reviews by default. "Show all reviews" link loads more (infinite scroll or pagination).

---

## Wishlist Integration (for logged-in customers)

On each product card, top-right corner:  
Heart icon (Heart, 20px) — unfilled Grey 300 if not in wishlist  
Heart filled (Merchat Green) if in wishlist  
Tap toggles: adds to / removes from wishlist (calls /api/wishlist endpoint)  
If not logged in, tapping heart shows: "Sign in to save to your wishlist" — small tooltip/toast with "Sign in" link

---

## Not Found State

If `/store/[slug]` doesn't match any merchant:

**Background:** White, centred content, full screen

Icon: Store (64px, Grey 300)  
Heading: "Store not found" — Display M, Grey 600  
Body: "This store doesn't exist or may have been moved. Double-check the link you were given." — Body M, Grey 400  
Button: "Visit Merchat.io" — Primary green → /

---

## SEO & Meta (dynamic per merchant)

```html
<title>[Store Name] — Shop on WhatsApp | Merchat</title>
<meta name="description" content="Browse and order from [Store Name]. [Tagline]. Powered by Merchat.io" />
<meta property="og:image" content="[merchant logo url]" />
```
