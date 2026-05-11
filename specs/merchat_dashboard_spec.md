# Merchat.io — Merchant Dashboard Frontend Specification
## Onboarding Flow + Full Dashboard

> **For the builder:** This document covers the merchant-facing surfaces of Merchat.io — the multi-step onboarding flow and the full authenticated dashboard. Read alongside `merchat_website_spec.md` which covers the public website and storefront. The design system (colours, typography, spacing, components) defined in the website spec applies here too — do not redefine it. Build mobile-first; merchants primarily work from phones.

---

## 1. Design System (Inherited — Summary)

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#182E47` | Nav, headings, primary text |
| `accent` | `#D5652B` | CTAs, active states, highlights |
| `mid` | `#1E3D5C` | Subheadings, secondary nav |
| `gray-text` | `#6B7280` | Body text, labels |
| `gray-light` | `#F3F4F6` | Page background |
| `warm-tint` | `#F4EDE8` | Accent-adjacent backgrounds |
| `border` | `#E5E7EB` | Dividers, card borders |
| `success` | `#16A34A` | Paid, delivered, in-stock states |
| `warning` | `#D97706` | Pending, low-stock states |
| `danger` | `#EF4444` | Escalated, out-of-stock, error states |

Font: **Inter** or system-ui. Base size: 15px. All components from the website spec apply (buttons, inputs, cards, badges, skeletons).

---

## 2. Onboarding Flow (`/onboarding`)

The onboarding flow is a multi-step wizard. It runs before the merchant ever reaches the dashboard. Once completed, they land directly on the dashboard.

### 2.1 Onboarding Shell

**Full-screen layout.** No sidebar. No top nav.

**Top bar:** Fixed, height 56px, background `#FFFFFF`, border-bottom `#E5E7EB`.
- Left: Merchat.io wordmark
- Centre: Step progress bar — a horizontal bar spanning the full width between the wordmark and the step counter. Filled portion uses `#D5652B`. Height 4px, border-radius 2px. Below the bar: step label in 12px grey (e.g. `"Step 2 of 7 — Connect WhatsApp"`)
- Right: `"Save & exit"` text link in `#6B7280` — saves current progress and redirects to login

**Body:** Centred content card, max-width `560px`, padding `40px` desktop / `24px` mobile. Background `#FFFFFF`, border-radius 16px, box-shadow `0 4px 24px rgba(0,0,0,0.08)`. Vertically centred in viewport on desktop, top-aligned on mobile.

**Bottom button row:** Always visible at the bottom of the card — `Back` (secondary button, left) and `Continue` or step-specific label (primary button, right). On Step 1 (no back), hide the Back button.

---

### 2.2 Step 1 — Sign Up

**Heading:** `"Let's get your store set up"`  
**Subheading:** `"Takes under 10 minutes. No technical knowledge needed."`

Fields (vertical stack, full-width):
- `Business name` — text input, placeholder `"e.g. Fashion by Amina"`, required
- `Your name` — text input, placeholder `"e.g. Amina Bello"`, required
- `Phone number` — tel input, prefix selector `"🇳🇬 +234"` (static for MVP), placeholder `"0801 234 5678"`, required
- `Email address` — email input, placeholder `"you@example.com"`, required
- `Business category` — single-select dropdown with options: Fashion & Clothing, Food & Drinks, Beauty & Skincare, Electronics & Gadgets, Home & Furniture, Health & Wellness, Agriculture & Produce, General Merchandise, Other
- `Password` — password input with show/hide toggle, helper text: `"At least 8 characters"`, required

Below form: `"By continuing, you agree to our"` + links to Terms of Service and Privacy Policy. 13px, grey.

Primary button label: `"Create my account →"`

**If arriving from WhatsApp (query param `?source=whatsapp&phone=234xxx`):** Pre-fill phone number, show a green banner at top of card: `"✓ We got your number from WhatsApp — just fill in the rest."`

---

### 2.3 Step 2 — WhatsApp Number Provisioning

**Heading:** `"Setting up your WhatsApp business number"`  
**Subheading:** `"We're registering a dedicated WhatsApp number in your business name. This usually takes 2–8 minutes."`

This step is **automatic** — no user input required. Show a progress animation while the backend provisions the number.

**Progress states (sequential, polling backend every 5 seconds):**

State A — `Registering your business` (spinner + label)  
State B — `Creating your WhatsApp number` (spinner + label)  
State C — `Configuring your business profile` (spinner + label)  
State D — **Done** ✓

Each state: a vertical list of steps. Completed steps show a green checkmark circle (Lucide `CheckCircle2`, `#16A34A`). Current step shows an animated spinner (Lucide `Loader2`, spinning, `#D5652B`). Pending steps show a grey circle outline.

**On success:** State D shows:
- Lucide `CheckCircle2` icon, 48px, `#16A34A`
- `"Your number is live!"` — H3, `#182E47`
- Large display of the provisioned number: e.g. `+234 901 234 5678` in `#D5652B`, 24px, weight 700
- Subtext: `"Customers who message this number reach your store — in your business name."`
- Primary button activates: `"Continue →"`

**On error (timeout > 10 min or API failure):**
- Show error card: Lucide `AlertCircle`, `#EF4444`, 48px
- `"Something went wrong"` — H3
- `"We couldn't provision your number. Our team has been notified. You can continue setting up and we'll activate your number within the hour."`
- Primary button: `"Continue anyway →"` (marks provisioning as pending, dashboard shows a pending banner until resolved)

**Redirect message toolkit (shown below the success state, before the Continue button):**
- Section label: `"Tell your existing customers about your new number"`
- Two copy-ready text boxes (each with a one-tap copy button — Lucide `Copy` icon, turns to `Check` on copy):
  - WhatsApp Status text: *"🎉 I've upgraded my store! Message me on my new number for faster service, easier ordering, and 24/7 availability: [number]"*
  - Broadcast message: *"Hi! I've moved my business to a new WhatsApp number with an AI assistant that can answer your questions and take orders anytime: [number]. Save it now!"*
- Below: `"Share these now or find them anytime in your dashboard under Settings → Redirect Toolkit"`

---

### 2.4 Step 3 — Store Profile

**Heading:** `"Set up your store profile"`  
**Subheading:** `"This is what customers see when they visit your storefront page."`

Fields:
- `Store display name` — pre-filled with business name from Step 1, editable. Helper: `"This is the name your customers see."`
- `Store description` — textarea, max 200 chars, placeholder `"Tell customers what you sell and why they should buy from you"`. Below the textarea: a `"Suggest description ✨"` button in `#D5652B`, 13px. Clicking calls the AI API and streams a suggested description into the textarea. Merchant can edit freely.
- `Logo` — file upload. Drag-and-drop zone (dashed border `#D1D5DB`, icon Lucide `ImagePlus`, text `"Upload your logo"` + `"or tap to browse"`). Accepts PNG, JPG, max 5MB. On upload: show circular preview (80px), with `"Remove"` link below.
- `Brand colour` — colour picker. Show 6 preset swatches (orange `#D5652B`, navy `#182E47`, green `#16A34A`, purple `#7C3AED`, pink `#DB2777`, teal `#0D9488`) + a hex input field. Default: `#D5652B`.
- `Delivery areas` — free text input, placeholder `"e.g. Lagos Island, Victoria Island, Lekki Phase 1"`. Helper: `"Comma-separated areas. Your customers will see this."`
- `Delivery fee` — toggle: `"Free delivery"` (default off) + number input `₦` prefix for flat fee. If `"Free delivery"` is toggled on, disable and grey out the fee input.
- `Payment on delivery` — toggle (default off). Helper: `"Allow customers to pay cash when their order arrives."`

Live preview panel (desktop only, right side): A mini phone mockup showing a simplified storefront header updating in real-time as the merchant types — logo, name, description, brand colour. On mobile, hide this panel and add a `"Preview"` button that opens a bottom sheet with the preview.

---

### 2.5 Step 4 — Add Products

**Heading:** `"Add your products"`  
**Subheading:** `"Upload product photos and set prices. You can add more later."`

**Upload method tabs (three tabs):**
- `📷 Gallery upload` (default selected)
- `✏️ Manual entry`
- `📋 Price list photo` *(Post-MVP — show tab but disabled with tooltip: "Coming soon")*

**Tab: Gallery Upload**

Large dashed upload zone: `"Select up to 50 product photos"` + `"Tap to browse your gallery or drag photos here"` + supported formats note `"JPG, PNG, WebP — max 10MB each"`.

On file selection: Show a grid of image thumbnails (3 columns, square aspect ratio). Below each thumbnail:
- AI-generated product name (editable inline text field — single click to edit)
- Price input — `₦` prefix, number input, required
- `×` remove button (top-right corner of thumbnail)

Above the grid: `"AI has named your products. Review the names and add prices to continue."` — info banner in `#F4EDE8`, orange left border.

Validation: All visible products must have a price > 0 before Continue is enabled. Names can remain AI-generated — no requirement to edit.

**Tab: Manual Entry**

Single product form:
- `Product name` — text input, required
- `Price` — number input with `₦` prefix, required
- `Category` — dropdown matching the category list from Step 1
- `Description` — textarea. `"Suggest description ✨"` AI button same as Step 3.
- `Stock quantity` — number input, default `1`
- `Variants` — expandable section. `"Add variants"` link (Lucide `Plus`). Each variant group: label input (e.g. `"Size"`) + tag input for options (e.g. `"S"`, `"M"`, `"L"` — press Enter or comma to add each). Remove group with `×`.
- `Photos` — multi-image upload, same drag-drop zone, up to 5 images.
- `"Save product"` button — saves to list below. `"Add another product"` resets form.

Saved products appear as cards below the form — name, price, first thumbnail (or placeholder icon), with Edit and Remove actions.

**Minimum to continue:** At least 1 product with a price. A warning banner shows if no products are added: `"Add at least one product to continue. You can always add more from your dashboard."`

---

### 2.6 Step 5 — Configure Your AI

**Heading:** `"Set up your AI assistant"`  
**Subheading:** `"Your AI handles customer conversations in your name. Customise how it speaks."`

Fields:
- `AI name` — text input, default `"Assistant"`, placeholder `"e.g. Amina's Assistant, StoreBot"`. Helper: `"Customers will see this name when the AI introduces itself."`
- `Tone` — radio card group (3 options, equal-width cards):
  - **Friendly & Casual** — `"Warm, conversational, uses everyday language. Great for fashion, food, beauty."` (default selected)
  - **Professional & Formal** — `"Polished and businesslike. Good for electronics, services, B2B."` 
  - **Energetic & Salesy** — `"Enthusiastic, uses emojis, drives urgency. Great for promotions."`
  - Each card: border 2px, selected state border `#D5652B`, background `#FFF8F5`, checkmark icon top-right.
- `Working hours` — day-by-day toggle grid. 7 rows (Mon–Sun), each with an on/off toggle + two time pickers (From / To). Default: Mon–Fri 8am–8pm, Sat 9am–6pm, Sun off. Helper: `"Outside these hours, the AI uses your out-of-hours message."`
- `Out-of-hours message` — textarea, pre-filled with AI-suggested default: `"Hi! We're currently closed but your message has been received. We'll get back to you first thing tomorrow. 🙏"`. Editable.
- `AI handoff threshold` — segmented control: `"2 failed exchanges"` / `"3 failed exchanges"` (default) / `"4 failed exchanges"`. Helper: `"How many times the AI tries before handing off to you."`
- `Recovery discount` — optional. Toggle: `"Offer a discount for abandoned orders"`. If on: number input `%` suffix. Helper: `"Shown in the abandoned cart reminder sent 2 hours after an unpaid order."`

---

### 2.7 Step 6 — Meet Your AI

**Heading:** `"Meet your AI assistant"`  
**Subheading:** `"See exactly how your AI responds to customers before going live. You can go live now or adjust and rerun."`

**Layout:** A simulated WhatsApp chat interface. Not real — a static UI mock that shows 5 pre-generated message exchanges.

**Chat window:**
- Background: `#E5DDD5` (WhatsApp-style grey background)
- Incoming (customer) messages: white bubbles, left-aligned, border-radius 12px 12px 12px 0
- Outgoing (AI/merchant) messages: `#DCF8C6` green bubbles, right-aligned, border-radius 12px 12px 0 12px
- Timestamp below each bubble in grey 11px

**The 5 test messages (run against the merchant's real catalog from Step 4):**
1. Customer: `"Hello, what do you have?"` → AI: clarifying question based on merchant's category
2. Customer: generic follow-up → AI: returns 3 product names + prices from catalog
3. Customer: asks about a specific product → AI: confirms availability, states price
4. Customer: asks about delivery → AI: gives delivery area and fee from Step 3
5. Customer: `"I want to order"` → AI: restates order and says it will open an order form

Each exchange loads sequentially with a 400ms delay between messages and a typing indicator (three animated dots) before each AI response.

**Status pills above chat:** Five pills in a row, one per test: `Browse`, `Products`, `Product Q&A`, `Delivery`, `Order Intent`. Each turns green with a checkmark as its exchange completes.

**Below the chat:**
- `"Looking good!"` banner in `#F4EDE8` if all 5 pass (AI responded with catalog data). Orange border-left.
- `"Update inventory or settings"` — secondary button that takes them back to Step 4 or 5 (returns to Step 6 after saving)
- Primary button: `"Go live! 🚀"` (full-width, accent orange)
- Below button, small text: `"You can rerun this preview anytime from your dashboard under 'Test Your AI'."`

---

### 2.8 Step 7 — Go Live

**Heading:** `"You're live! 🎉"`  
**Subheading:** `"Your AI is running. Share your store link and start getting orders."`

**Content (centred):**

Large animated success graphic: Lucide `Rocket` icon, 64px, `#D5652B`, with a subtle bounce animation.

**Your WhatsApp number:**
- Displayed large: `+234 901 234 5678`
- One-tap copy button (Lucide `Copy`)
- `"Share on WhatsApp"` button — opens a share intent with the redirect message

**Your storefront link:**
- `merchat.io/fashionbyamina` displayed with a copy button
- `"Open storefront"` link (opens in new tab)

**Share cards — two side-by-side cards:**
- **WhatsApp Status card:** Orange icon, pre-written status text, one-tap `"Copy for WhatsApp Status"` button
- **Broadcast card:** Navy icon, pre-written broadcast text, one-tap `"Copy for Broadcast"` button

**Primary Button:** `"Go to my dashboard →"` — navigates to `/dashboard`

---

## 3. Dashboard Shell (Authenticated Layout)

All dashboard pages share this shell. Accessed at `/dashboard` and sub-routes.

### 3.1 Sidebar Navigation (Desktop)

**Width:** 240px. **Background:** `#182E47`. **Fixed** on the left.

**Top:** Merchat.io logo in white. Below it: merchant's business name in white 70%, 13px, truncated.

**Nav links (vertical stack):**

| Icon (Lucide) | Label | Route |
|---|---|---|
| `MessageSquare` | Conversations | `/dashboard/conversations` |
| `ShoppingBag` | Orders | `/dashboard/orders` |
| `Package` | Inventory | `/dashboard/inventory` |
| `BarChart2` | Analytics | `/dashboard/analytics` |
| `Settings` | Settings | `/dashboard/settings` |

Each link: padding `12px 20px`, border-radius `8px` (inside sidebar), font 15px weight 500, colour `rgba(255,255,255,0.7)`. Hover: background `rgba(255,255,255,0.08)`, colour `#FFFFFF`. **Active:** background `#D5652B`, colour `#FFFFFF`, weight 600.

**Bottom of sidebar:**
- `"Test Your AI"` button — outline white, small, opens the AI preview modal (rerun of Step 6 against current live catalog)
- Avatar + merchant name + `"Log out"` link

### 3.2 Mobile Navigation

**No sidebar on mobile.** Instead:
- **Top bar:** 56px, background `#182E47`. Left: hamburger icon (white). Centre: current page title (white, weight 600). Right: notification bell icon with unread dot.
- **Bottom tab bar:** Fixed bottom. 5 tabs matching sidebar links. Active tab: `#D5652B` icon + label. Inactive: `rgba(255,255,255,0.5)`. Background `#182E47`.
- Hamburger opens a full-height sidebar drawer (same as desktop sidebar, slides from left, backdrop overlay).

### 3.3 Top Bar (Desktop)

**Height:** 56px. Background `#FFFFFF`. Border-bottom `#E5E7EB`.  
- Left: current page title — H3, `#182E47`
- Right: notification bell (Lucide `Bell`) with unread count badge + avatar circle (merchant initials, `#D5652B` background) with dropdown (Profile, Settings, Log out)

### 3.4 Global Banners

Below the top bar (full-width, above page content):

**Provisioning pending banner** (shown if number provisioning failed during onboarding):
- Background `#FEF3C7`, border-bottom `#D97706`
- Icon `AlertCircle` in `#D97706` + text: `"Your WhatsApp number is still being set up. We'll notify you when it's ready — usually within the hour."` + `"Dismiss"` link

**Low stock banner** (if any product has stock ≤ 3):
- Background `#FEF3C7` + text: `"[N] products are running low on stock."` + `"View inventory →"` link

---

## 4. Conversations Page (`/dashboard/conversations`)

### 4.1 Layout

**Two-panel layout on desktop:** Left panel = thread list (340px fixed), Right panel = open thread. On mobile: thread list is full-screen; tapping a thread pushes to a full-screen thread view with a back button.

### 4.2 Thread List (Left Panel)

**Header:**
- `"Conversations"` — H3
- Filter tabs: `All` · `Active` · `Escalated` · `Resolved` — pill tabs. Active tab: `#182E47` background, white text. Others: transparent, grey text.
- Search input (Lucide `Search` prefix icon), searches by customer name or phone number.

**Thread items (vertical list, scrollable):**

Each thread item — height ~80px, padding `12px 16px`, border-bottom `#E5E7EB`. On hover: background `#F9FAFB`. Selected: background `#F4EDE8`, left border `3px solid #D5652B`.

Thread item anatomy:
- **Left:** Avatar circle — customer initials or phone number initials (2 chars), background `#E8EDF2`, `#182E47` text, 40px circle
- **Centre:**
  - Top row: Customer name or phone number (weight 600, 14px, `#182E47`) + timestamp (right-aligned, 12px, grey)
  - Bottom row: AI status badge + last message preview (truncated to 1 line, 13px, grey)
- **AI status badge** (small pill, left of preview):
  - `AI Active` — green pill
  - `Escalated` — red pill (Lucide `AlertCircle` micro-icon + `"Escalated"` text)
  - `Merchant Active` — orange pill
  - `Resolved` — grey pill

**Escalated threads:** Pinned at the top of the list regardless of filter. Red left border `3px solid #EF4444`.

**Empty state:** Lucide `MessageSquare` icon, grey, 48px. Text: `"No conversations yet"` + `"Share your WhatsApp number to start getting messages."`

### 4.3 Thread View (Right Panel)

**Header (thread-level):**
- Back arrow (mobile only, Lucide `ArrowLeft`)
- Customer avatar + name/phone
- AI status badge (same as list)
- Right: action buttons — `"Hand to AI"` or `"Take over"` (context-sensitive, see below) + Lucide `MoreVertical` dropdown (Mark resolved, View customer profile)

**Message Area (scrollable, fills available height):**
- Background: `#E5DDD5` (WhatsApp-style)
- Customer messages: white bubbles, left-aligned
- AI messages: `#DCF8C6` green bubbles, right-aligned, small `"AI"` label below in grey 11px
- Merchant messages (manual): `#D5E8FB` blue bubbles, right-aligned, small `"You"` label below
- Flow events: grey system message bubble centred — e.g. `"Order Confirmation Flow sent"`, `"Payment link delivered"`, `"Order confirmed — ₦23,000"`
- Timestamps: grey, 11px, shown per-group (not every message)
- Auto-scrolls to newest message

**Merchant Reply Bar (bottom of thread view):**
- Always visible regardless of AI status
- Textarea (auto-grow, max 4 lines), placeholder: `"Type a message to reply..."`
- Right of textarea: Send button (Lucide `Send`, `#D5652B`)
- Typing in this bar and sending **automatically pauses AI** for this thread. Thread badge changes to `"Merchant Active"`.
- Above textarea (only when AI is paused): Orange banner — `"AI is paused. You're handling this conversation."` + `"Hand back to AI"` button (inline, right). Clicking: confirms handoff, resumes AI, clears banner.

**AI takeover confirmation:** When merchant first types in a thread where AI is active, show a one-time tooltip: `"Sending this message will pause the AI for this conversation."` with a `"Got it"` dismiss.

---

## 5. Orders Page (`/dashboard/orders`)

### 5.1 Layout

Full-width page. Top: summary cards row. Below: Kanban board (desktop) or tabbed list (mobile).

### 5.2 Summary Cards

Four cards in a row (desktop) / 2×2 grid (mobile). Each card: white, border-radius 12px, border `#E5E7EB`, padding `16px 20px`.

| Card | Icon | Value | Subtext |
|---|---|---|---|
| New Orders | `ShoppingBag`, orange | Count of `New` orders | `"Awaiting confirmation"` |
| Revenue Today | `TrendingUp`, green | `₦[amount]` | `"Across [N] orders"` |
| Awaiting Payment | `CreditCard`, warning | Count of `Confirmed` unpaid | `"Payment links sent"` |
| Delivered Today | `CheckCircle`, green | Count of `Delivered` today | — |

### 5.3 Kanban Board (Desktop — ≥ 1024px)

Five columns. Each column: header with status label + count badge. Scrollable vertically within column.

**Columns (left to right):** `New` · `Confirmed` · `Paid` · `Dispatched` · `Delivered`

**Column header colours:**
- New: `#6B7280` (grey)
- Confirmed: `#D97706` (warning amber)
- Paid: `#16A34A` (success green)
- Dispatched: `#2563EB` (blue)
- Delivered: `#182E47` (navy)

**Order Card:**
- White, border-radius 10px, border `#E5E7EB`, padding `14px`, box-shadow subtle
- Top row: Order ref (`#ORD-0042` in `#182E47`, 13px, weight 600) + timestamp (grey, 12px, right-aligned)
- Customer name — 14px, weight 500
- Items summary — `"2× White Sneakers, 1× Black Belt"` — 13px, grey, 1 line truncated
- Total — `"₦47,000"` — 16px, weight 700, `#D5652B`
- Payment badge: `"Pay Now"` (green if paid, amber if pending) or `"Pay on Delivery"` (grey)
- Bottom: `"→ Advance"` button (small, secondary) — advances order to the next status. Clicking shows a confirmation popover.

**Popover on Advance (e.g. Paid → Dispatched):**
- `"Mark as Dispatched?"` + `Confirm` + `Cancel` buttons
- For `Dispatched → Delivered`: also show `"This will send a review request to the customer in 24 hours."` info text

**Auto-advance:** When Paystack/Flutterwave webhook fires, the card animates across to `Paid` column automatically (real-time via WebSocket).

### 5.4 Tabbed List (Mobile — < 1024px)

Five horizontal tabs matching the Kanban columns. Selected tab has `#D5652B` underline. Below tabs: vertical list of order cards (condensed — no advance button visible directly, tap card to expand).

**Expanded order card (tap to expand in-place):**
- Full item list
- Customer phone number (tappable → opens WhatsApp conversation)
- Delivery address
- `"Advance to [next status]"` primary button (full-width)

### 5.5 Order Detail Modal

Clicking the order ref or `"View details"` on any card opens a modal (or full-screen on mobile).

**Content:**
- Order reference + created timestamp
- Customer section: name, phone (tappable), delivery address, landmark
- Items table: product name | quantity | unit price | line total
- Totals: subtotal, delivery fee, **Total**
- Payment status: badge + payment method + paid timestamp (if paid)
- Order status timeline: horizontal stepper — New → Confirmed → Paid → Dispatched → Delivered. Completed steps filled `#D5652B`, current step pulsing, future steps grey.
- Action buttons: `"Advance status"` (primary) + `"Message customer"` (secondary, opens conversation in a drawer)

---

## 6. Inventory Page (`/dashboard/inventory`)

### 6.1 Layout

Full-width. Top bar with search + filter + add product button. Below: product grid or list view toggle.

**Top bar:**
- Left: `"Inventory"` H3 + product count badge (e.g. `"48 products"`)
- Right: View toggle (Lucide `LayoutGrid` / `List`) + `"Add product"` Primary Button

**Filters row (below top bar):**
- Category dropdown (multi-select)
- Stock status: `All` · `In Stock` · `Low Stock` · `Out of Stock` pill tabs
- Search input (filters by name)

### 6.2 Product Grid (Default View)

3 columns desktop, 2 tablet, 1 mobile. Gap 16px.

**Product Card:**
- Square image (aspect 1/1, object-fit cover). If multiple images: show count badge `"1/3"` top-right.
- Out-of-stock overlay: semi-transparent + `"Out of stock"` label
- Low stock ribbon: `"⚠ 2 left"` amber tag top-left
- Card body (padding 12px):
  - Product name — 14px, weight 600, `#182E47`, 2-line clamp
  - Price — 16px, weight 700, `#D5652B`
  - Stock: `"In stock: 14"` or `"Out of stock"` — 12px, colour coded
  - Inline edits (on hover — desktop only): price field becomes editable inline (click to edit, blur to save), stock quantity field becomes editable inline
  - Action icons row: Lucide `Pencil` (edit), `EyeOff` (deactivate / hide from storefront), `Trash2` (delete with confirmation)

### 6.3 Product List View

Table layout. Columns: Thumbnail (40px) | Name | Category | Price | Stock | Status | Actions

Inline editing for Price and Stock quantity: click the cell → becomes an input → blur or Enter to save via PATCH API.

Status toggle: Active / Inactive pill toggle. Inactive = hidden from storefront and AI won't offer it to customers.

### 6.4 Add / Edit Product Modal

Opens as a right-side drawer (560px) on desktop, full-screen on mobile.

**Sections:**
1. **Photos** — Multi-image upload zone (up to 5). Drag to reorder. First image = primary (shown in grid). Remove individual images with `×`.
2. **Details** — Name (required), Description (textarea + `"Suggest ✨"` AI button), Category (dropdown), Price `₦` (required)
3. **Variants** — `"Add size variants"` / `"Add colour variants"` / `"Add custom variant"` links. Each group: label + tags. Variant-level stock can be tracked per option if enabled.
4. **Stock** — Quantity input. `"Mark as out of stock"` toggle (overrides quantity).
5. **Visibility** — Toggle: `"Show in storefront"` (default on) + `"Offer in AI conversations"` (default on)

**Save button:** Fixed at bottom of drawer. `"Save product"` primary.

**Delete:** Red `"Delete product"` text link at the very bottom. Clicking shows a confirmation modal: `"Delete [Product Name]? This cannot be undone."` with `Confirm Delete` (red button) + `Cancel`.

---

## 7. Analytics Page (`/dashboard/analytics`)

### 7.1 Date Range Selector

Top of page. Segmented control: `Today` · `This week` · `This month` · `Custom`. Custom opens a date range picker popover (date-fns or similar).

### 7.2 KPI Summary Cards

6 cards in a 3×2 grid (desktop) / 2×3 (tablet) / 1 column (mobile).

| Metric | Icon | Format | Colour accent |
|---|---|---|---|
| Total Revenue | `TrendingUp` | `₦0,000` | Green |
| Total Orders | `ShoppingBag` | Number | Navy |
| Avg Order Value | `BarChart2` | `₦0,000` | Orange |
| Conversations | `MessageSquare` | Number | Blue |
| Conversion Rate | `Percent` | `00.0%` | Orange |
| AI Escalation Rate | `AlertCircle` | `00.0%` | Amber if > 25% |

Each card: white, border-radius 12px, padding `16px 20px`.  
Top row: icon (24px, accent colour) + metric label (13px, grey, right-aligned)  
Middle: value (28px, weight 700, `#182E47`)  
Bottom: trend vs previous period — e.g. `"↑ 12% vs last week"` (green if positive, red if negative, grey if no change)

### 7.3 Revenue Chart

Line chart. X-axis: days of selected range. Y-axis: ₦ revenue. Two lines: `Revenue` (navy) and `Orders` (orange, secondary Y-axis).

Use **Recharts** or equivalent. Tooltip on hover showing date, revenue, and order count.

Style: white card, border-radius 12px, padding `20px`. Chart area: 100% width, height `260px`.

### 7.4 Top Products Table

Title: `"Top products by orders"`.  
5 rows. Columns: Rank | Product (with thumbnail 32px) | Orders | Revenue.  
Alternating row shading (`#F9FAFB`). No borders.

### 7.5 Conversation Funnel

Horizontal funnel chart (or stacked bar):  
`Total conversations` → `Reached product stage` → `Order intent shown` → `Flow completed` → `Paid`

Each stage: label + count + percentage of top stage. Colour: gradient from grey → orange.

### 7.6 AI Performance Section

Two stats side by side:
- **AI handled:** `"X% of conversations fully handled by AI"` — progress arc or large number
- **Escalation breakdown:** Donut chart showing reasons (Frustration detected / Too many failures / Manual takeover / Unknown)

---

## 8. Settings Page (`/dashboard/settings`)

### 8.1 Layout

Settings uses a left sub-nav (tabs on mobile) + content area on the right.

**Sub-nav links:**
- AI Agent
- Store Profile
- Payment Gateway
- Notifications
- Redirect Toolkit
- Account

### 8.2 AI Agent Settings

**Section: Agent Identity**
- Agent name (text input)
- Tone (radio card group — same as onboarding Step 5)

**Section: Working Hours**
Day-by-day table: toggle on/off per day + From/To time selectors. Same as Step 5.

**Section: Handoff**
- Out-of-hours message (textarea)
- Handoff threshold (segmented control)

**Section: Recovery**
- Abandoned cart discount toggle + % input

Save button (sticky at bottom of content area on mobile, fixed bottom of content pane on desktop): `"Save AI settings"` primary.

### 8.3 Store Profile Settings

Same fields as onboarding Step 3 — name, description, logo, brand colour, delivery areas, delivery fee, POD toggle.

Additional field: `Storefront slug` — text input pre-filled with current slug (`fashionbyamina`). Shows live URL preview: `merchat.io/[slug]`. Slug format validation: lowercase, alphanumeric, hyphens only. On change: check availability via API, show green `"Available"` or red `"Taken"` inline.

### 8.4 Payment Gateway Settings

**Card: Paystack**
- Status badge: `"Connected"` (green) or `"Not connected"` (grey)
- If not connected: text input for Paystack Secret Key + `"Connect Paystack"` button. Helper: `"Get your secret key from"` + link to Paystack dashboard.
- If connected: show masked key `"sk_live_●●●●●●●●●abc123"` + `"Disconnect"` text link (red, confirmation required)

**Card: Flutterwave**
- Same pattern as Paystack.
- Note: `"You can connect both. Merchat will use Paystack as primary."`

### 8.5 Notifications Settings

Toggle list — each row: notification type | description | WhatsApp toggle | Email toggle.

| Notification | WhatsApp | Email |
|---|---|---|
| New order created | ✓ default on | ✓ default on |
| Conversation escalated | ✓ default on | ✓ default off |
| Payment received | ✓ default on | ✓ default on |
| Product out of stock | ✓ default on | ✓ default off |
| Daily order summary | ✗ default off | ✓ default on |

WhatsApp notifications go to the merchant's personal phone number (from signup). Email goes to signup email. Both are editable fields above the toggle list:
- `"WhatsApp notifications to:"` + phone input (pre-filled, editable)
- `"Email notifications to:"` + email input (pre-filled, editable)

### 8.6 Redirect Toolkit

Static section. No editable fields — just copy-paste resources.

Two copy cards (same as Step 2 success state):
- WhatsApp Status copy block
- Broadcast message copy block

Below: `"Your WhatsApp business number:"` displayed with copy button.  
Below: `"Your storefront link:"` displayed with copy button + `"Open storefront"` link.

### 8.7 Account Settings

- `"Full name"` — text input
- `"Email address"` — text input
- `"Change password"` — secondary button, opens inline form: current password, new password, confirm new password
- `"Delete account"` — red text link at bottom. Clicking opens a confirmation modal requiring the merchant to type `"DELETE"` to confirm. Warning: `"This will permanently delete your store, products, orders, and conversation history."`

---

## 9. Notification System (Global)

### 9.1 In-App Toast Notifications

Position: Top-right (desktop) / Top-centre (mobile). Stack up to 3 visible. Auto-dismiss after 5 seconds.

**Types:**
- **Success:** Green left border, Lucide `CheckCircle2` icon — e.g. `"Product saved"`, `"Order marked as Delivered"`
- **Info:** Blue left border, Lucide `Info` icon — e.g. `"AI has been paused for this conversation"`
- **Warning:** Amber left border, Lucide `AlertTriangle` — e.g. `"3 products are out of stock"`
- **Error:** Red left border, Lucide `XCircle` — e.g. `"Failed to save settings — please try again"`

Each toast: white background, border-radius 10px, box-shadow medium, padding `14px 16px`, width `360px` desktop / full-width mobile minus 32px padding. `×` dismiss button top-right.

### 9.2 Notification Bell (Dashboard Top Bar)

Clicking opens a dropdown panel (320px wide, max-height 480px, scrollable).

Notification item: icon + title (14px, weight 600) + description (13px, grey) + timestamp (12px, grey).

**Notification types with icons:**
- New order: Lucide `ShoppingBag`, orange
- Payment received: Lucide `CreditCard`, green
- Conversation escalated: Lucide `AlertCircle`, red (shown with red background pill on the bell badge)
- Low stock: Lucide `Package`, amber
- AI handoff complete: Lucide `Bot`, blue

Unread notifications: slightly highlighted background `#F9FAFB` with a small navy dot left of icon.  
Footer of dropdown: `"Mark all as read"` link (left) + `"View all"` link (right, routes to a full notifications page).

---

## 10. AI Preview Modal (`"Test Your AI"`)

Accessible from: sidebar bottom button + Settings → AI Agent section.

**Modal:** centred, max-width `560px`, max-height `80vh`, scrollable. Background white, border-radius 16px.

**Header:** `"Test Your AI"` H3 + `×` close button.

**Content:** Same 5-message simulation as onboarding Step 6 — runs against the merchant's **current live catalog** and **current AI settings**. Has a `"Run again"` button (Lucide `RefreshCw`) at the top-right of the chat area to re-run with fresh simulated inputs.

**Footer of modal:**
- `"Your AI settings look good"` green banner (if all 5 pass) or `"Update settings"` link
- `"Close"` secondary button

---

## 11. Empty States (All Pages)

Every page must define an empty state for when there is no data.

| Page | Icon | Primary text | Secondary text | CTA |
|---|---|---|---|---|
| Conversations | `MessageSquare` | `"No conversations yet"` | `"Share your WhatsApp number to receive your first message."` | Copy number button |
| Orders | `ShoppingBag` | `"No orders yet"` | `"When a customer completes an order, it appears here."` | — |
| Inventory | `Package` | `"No products yet"` | `"Add your first product to get started."` | `"Add product"` primary button |
| Analytics | `BarChart2` | `"No data yet"` | `"Analytics appear after your first order."` | — |

Empty state layout: centred vertically in the content area, icon 64px grey, H3 `#182E47`, body grey, CTA button below.

---

## 12. Responsive Behaviour Summary

| Element | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| Dashboard nav | Bottom tab bar + drawer | Bottom tab bar + drawer | Fixed left sidebar |
| Conversations | Thread list full-screen → thread full-screen | Thread list full-screen → thread full-screen | Two-panel split |
| Orders | Tabbed vertical list | Tabbed vertical list | Kanban columns |
| Inventory | 1-column product grid | 2-column product grid | 3-column grid |
| Analytics cards | 1-column | 2-column | 3-column |
| Settings | Full-screen sections with back nav | Tab sidebar | Sub-nav + content pane |
| Modals | Full-screen | Bottom sheet or centred | Centred modal |

---

## 13. API Interaction Conventions

The dashboard communicates with the Merchat backend via REST API. All endpoints require `Authorization: Bearer [token]` header.

**Optimistic updates:** For inventory edits, status changes, and toggle saves — update the UI immediately and roll back with an error toast if the API call fails.

**Real-time (WebSocket):** Conversations page and Orders page subscribe to a WebSocket channel for the authenticated merchant. Events: `new_message`, `conversation_escalated`, `order_created`, `order_status_changed`, `payment_received`. The notification bell updates in real-time via the same socket.

**Loading states:** All data-fetching views show skeleton loaders on initial load. Subsequent fetches (e.g. filter changes) show a subtle spinner in the filter bar, not a full skeleton.

**Error states:** API failures show an error card with Lucide `AlertCircle`, red, a brief message, and a `"Try again"` button that retries the last request.

---

## 14. Key Interactions Checklist

- [ ] Onboarding progress bar fills correctly across all 7 steps
- [ ] `"Save & exit"` preserves completed steps — merchant resumes from where they left off on next login
- [ ] Provisioning step polls every 5s and transitions states automatically
- [ ] Gallery upload shows AI-generated names immediately (optimistic) then confirms with API response
- [ ] `"Suggest description ✨"` streams AI response character-by-character into the textarea
- [ ] AI preview runs 5 messages with typing indicator delays and per-exchange status pills
- [ ] Sidebar active link updates on route change
- [ ] Escalated threads always pinned at top of conversation list
- [ ] Typing in conversation reply bar auto-pauses AI and shows the orange banner
- [ ] `"Hand back to AI"` button resumes AI and clears merchant-active state
- [ ] Kanban cards animate to next column on status advance (WebSocket-triggered)
- [ ] Inventory inline edit (price + stock) saves on blur with optimistic UI
- [ ] Analytics date range selector refreshes all data on change
- [ ] Payment gateway connection shows masked key after successful connection
- [ ] All copy buttons show `✓` checkmark for 2 seconds after copy
- [ ] All destructive actions (delete product, disconnect gateway, delete account) require confirmation
- [ ] Toast notifications stack correctly and dismiss after 5s
- [ ] Notification bell badge shows count with red background for escalations
- [ ] Empty states shown on every page with zero data
- [ ] Skeleton loaders on every initial data fetch

---

*End of Dashboard Spec — see `merchat_website_spec.md` for the public website and merchant storefront.*
