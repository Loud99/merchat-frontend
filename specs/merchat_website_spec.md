# Merchat.io — Website Frontend Specification
## Public-Facing Pages: Landing Page + Merchant Storefront

> **For the builder:** This document covers the two public-facing surfaces of Merchat.io — the marketing/landing page at `merchat.io` and the per-merchant storefront at `merchat.io/[merchantslug]`. Use this alongside `merchat_dashboard_spec.md` which covers the merchant dashboard. Build with React + Tailwind CSS or any modern component-based framework. All design decisions are specified; do not invent new patterns.

---

## 1. Design System

### 1.1 Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#182E47` | Primary navy — headings, nav, footers, primary buttons |
| `accent` | `#D5652B` | Merchat orange — CTAs, highlights, hover states, tags |
| `mid` | `#1E3D5C` | Slightly lighter navy — subheadings, secondary text on dark |
| `gray-text` | `#6B7280` | Body text, captions, meta |
| `gray-light` | `#F3F4F6` | Page backgrounds, alternating rows |
| `warm-tint` | `#F4EDE8` | Warm orange-tinted backgrounds for accent sections |
| `border` | `#E5E7EB` | Dividers, card borders |
| `white` | `#FFFFFF` | Card backgrounds, button labels |

### 1.2 Typography

Use **Inter** or **system-ui** as the primary font stack. No custom font installation required.

| Element | Size | Weight | Colour |
|---|---|---|---|
| H1 (hero) | 48px / 3rem | 800 | `primary` |
| H2 (section title) | 32px / 2rem | 700 | `primary` |
| H3 (card title) | 20px / 1.25rem | 700 | `primary` |
| Body large | 18px / 1.125rem | 400 | `gray-text` |
| Body | 16px / 1rem | 400 | `gray-text` |
| Caption / Label | 13px / 0.8125rem | 500 | `gray-text` |
| Button | 15px / 0.9375rem | 600 | — |

Mobile: reduce H1 to 32px, H2 to 24px.

### 1.3 Spacing

Base unit: 4px. Use multiples: 4, 8, 12, 16, 24, 32, 48, 64, 96px.  
Section vertical padding: 96px desktop, 64px mobile.  
Max content width: `1200px`, centred with `auto` horizontal margin.  
Side padding: `24px` mobile, `48px` tablet, `0` on desktop (contained by max-width).

### 1.4 Components

**Primary Button**
- Background: `#D5652B` (accent)
- Text: `#FFFFFF`, weight 600, 15px
- Padding: 14px 28px
- Border radius: 8px
- Hover: darken 10% (`#B54E20`)
- Active: scale 0.98

**Secondary Button**
- Background: transparent
- Border: 2px solid `#182E47`
- Text: `#182E47`, weight 600
- Same padding and radius as primary
- Hover: background `#182E47`, text `#FFFFFF`

**Ghost Button (on dark backgrounds)**
- Background: transparent
- Border: 2px solid `#FFFFFF`
- Text: `#FFFFFF`
- Hover: background `rgba(255,255,255,0.1)`

**Card**
- Background: `#FFFFFF`
- Border: 1px solid `#E5E7EB`
- Border radius: 12px
- Box shadow: `0 1px 4px rgba(0,0,0,0.06)`
- Hover (interactive cards): `0 4px 16px rgba(0,0,0,0.1)`, translateY(-2px)

**Badge / Tag**
- Padding: 4px 12px
- Border radius: 20px (pill)
- Font: 12px, weight 600
- Orange: background `#F4EDE8`, text `#D5652B`
- Navy: background `#E8EDF2`, text `#182E47`

**Input Field**
- Border: 1px solid `#D1D5DB`
- Border radius: 8px
- Padding: 12px 16px
- Font: 15px
- Focus: border-color `#182E47`, box-shadow `0 0 0 3px rgba(24,46,71,0.12)`
- Error: border-color `#EF4444`

### 1.5 Icons

Use **Lucide Icons** (open source, React-compatible). Stroke width: 1.5px. Size: 20px default, 24px for feature icons, 16px for inline.

### 1.6 Motion

Transitions: `200ms ease` for hover states, `300ms ease` for modals/drawers.  
Page load animations: fade-in + translateY(16px → 0), staggered 100ms per element.  
No heavy animations — merchants may be on slow connections.

---

## 2. Global Layout Elements

### 2.1 Navigation Bar

**Behaviour:** Fixed top, full-width. Height: 64px. Background: `#FFFFFF`. Border-bottom: 1px solid `#E5E7EB`. `z-index: 50`. On scroll past 64px, add box-shadow `0 2px 8px rgba(0,0,0,0.08)`.

**Left:** Merchat.io wordmark — text `MERCHAT` in `#182E47`, weight 800, 22px + `.io` in `#D5652B`. Clicking navigates to `/`.

**Centre (desktop only):** Navigation links — `How it works`, `Pricing`, `For Merchants`. Font 15px, weight 500, colour `#374151`. Hover colour: `#182E47`. Active page: `#182E47`, weight 600, underline in `#D5652B`.

**Right:** 
- `Log in` — ghost/text style button, colour `#182E47`
- `Start for free` — Primary Button (accent)

**Mobile:** Hide centre nav links. Show hamburger icon (Lucide `Menu`). Tap opens a full-screen drawer sliding from the right:
- Background: `#182E47`
- Links in white, 20px, weight 600, 48px tall tap targets
- `Start for free` Primary Button at the bottom of the drawer
- Close icon top-right (Lucide `X`, white)

### 2.2 Footer

Background: `#182E47`. Colour: `#FFFFFF`.  
Four columns on desktop, stacked on mobile.

**Col 1:** Merchat.io logo + tagline: *"AI-powered commerce for Nigerian SMEs"*. Below: "© 2026 Merchat.io"

**Col 2 — Product:** How it works, Features, Pricing, Merchant storefront (link to example store)

**Col 3 — Company:** About, Blog, Careers, Contact

**Col 4 — Legal:** Privacy Policy, Terms of Service, Refund Policy

Social icons row at the bottom: Twitter/X, Instagram, LinkedIn. Colour: `rgba(255,255,255,0.6)`, hover `#FFFFFF`.

---

## 3. Landing Page (`/`)

### 3.1 Hero Section

**Background:** Full-width, background colour `#182E47`. Minimum height: `100vh` on desktop, auto on mobile.

**Layout:** Two-column on desktop (text left, visual right), single column on mobile (text top, visual below).

**Left column — Text:**
- Small pill badge at top: orange badge reading `🇳🇬 Built for Nigerian SMEs`
- H1 (white): `"Run your entire WhatsApp business on autopilot."`
- Body (rgba white 0.75): `"Merchat gives your business an AI that talks to customers, closes orders, and manages your inventory — all inside WhatsApp. You focus on sourcing. We handle the rest."`
- Two buttons side by side: Primary `"Start for free →"` (links to `/onboarding`) + Ghost `"See how it works"` (smooth scroll to How It Works section)
- Below buttons: Trust bar — three micro-stats in a row: `"50+ merchants"` · `"24/7 AI coverage"` · `"0 coding required"`. Font 13px, white 60% opacity.

**Right column — Visual:**
A phone mockup (use a CSS/SVG phone frame) showing a WhatsApp conversation. The conversation is a static illustration — not real. Show:
- Customer message: *"Hello, what shoes do you have?"*
- AI response (merchant bubble style): *"Hi! 👋 Are you looking for something specific or should I show you our bestsellers?"*
- Customer: *"Show me sneakers under 25k"*
- AI sends 3 product image thumbnails (placeholder rectangles with product name + price overlaid in bottom-left)
- Customer: *"I want the white ones"*
- AI: *"Great choice! White Nike Air (Size?) — ₦23,000. Want to place an order?"*

The phone frame should have a subtle glow: `box-shadow: 0 0 60px rgba(213,101,43,0.3)`.

**Mobile:** Stack text above phone. Phone mockup scaled to 80% width, centred.

---

### 3.2 Social Proof Bar

**Background:** `#F4EDE8` (warm tint).  
**Height:** 72px.  
**Content:** Horizontally scrolling (on mobile) or static row of merchant names/categories with a subtle star rating.  
Example entries (static, illustrative): `⭐ Fashion by Amina — Lagos` · `⭐ Mama Chukwu's Kitchen — Abuja` · `⭐ Ikenna Electronics — Port Harcourt`  
Font 14px, `#182E47`, weight 500. Separated by a thin vertical line `#C4BBAF`.

---

### 3.3 Problem Section

**Background:** `#FFFFFF`.  
**Heading (H2):** `"You're losing money every day you manage WhatsApp manually."`  
**Subheading:** `"Every hour you spend copy-pasting prices and chasing payments is an hour you're not growing."` Body-large, grey.

**Content:** A 2×3 grid of problem cards on desktop, 1-column on mobile. Each card:
- Icon (Lucide, `#D5652B`, 24px)
- Title (H3, `#182E47`)
- Body (14px, grey)

Problem cards:
1. **Icon: `Clock`** — `"3–6 hours lost daily"` — *"Answering the same product questions, quoting prices, confirming orders. Every. Single. Day."*
2. **Icon: `AlertCircle`** — `"Orders fall through the gaps"` — *"Customers message when you're asleep, busy, or overwhelmed. No reply = no sale."*
3. **Icon: `CreditCard`** — `"Payments are missed"` — *"Bank transfers get sent to the wrong account. No follow-up means no payment."*
4. **Icon: `Package`** — `"Inventory errors damage trust"` — *"Selling items that are out of stock breaks customer relationships you worked hard to build."*
5. **Icon: `Users`** — `"No memory of your customers"` — *"Every conversation starts from scratch. You have zero data about what your customers buy."*
6. **Icon: `TrendingDown`** — `"You can't grow past yourself"` — *"Your business capacity is capped by how many messages you can personally reply to."*

---

### 3.4 Solution / How It Works Section

**Background:** `#182E47`.  
**Heading (H2, white):** `"Merchat runs your WhatsApp sales for you."`  
**Subheading (white 70%):** `"Set up once in under 10 minutes. Your AI handles the rest — 24/7."`

**Content:** Three large numbered steps, displayed as a vertical timeline on mobile, horizontal row with connecting line on desktop.

**Step 1 — Icon: `UserPlus`**
- Number badge: `01` in orange
- Title (white, H3): `"Sign up and connect in 10 minutes"`
- Body (white 70%): `"Add your products, configure your AI's name and tone, and Merchat provisions a dedicated WhatsApp Business number for your store — registered in your business name, not ours."`

**Step 2 — Icon: `Bot`**
- Number badge: `02`
- Title: `"Your AI handles every customer conversation"`
- Body: `"Customers message your number. The AI answers product questions, shows items, handles order confirmations, and sends payment links — in natural Nigerian English, including Pidgin."`

**Step 3 — Icon: `LayoutDashboard`**
- Number badge: `03`
- Title: `"You manage from your dashboard"`
- Body: `"Track orders, manage inventory, see your revenue, and jump into any conversation when needed. On your phone or computer — wherever you are."`

**CTA below steps:** Primary Button `"Start for free →"` centred, plus smaller text: `"No credit card required · Setup in under 10 minutes"`

---

### 3.5 Features Section

**Background:** `#FFFFFF`.  
**Heading (H2):** `"Everything your WhatsApp business needs."`

**Layout:** Alternating two-column rows on desktop (text + illustration), stacked on mobile.

**Feature 1 — AI Agent (text left, visual right)**
- Badge: `AI` orange pill
- H3: `"An AI that sells like your best staff member"`
- Body: `"Understands vague questions, asks one clarifying question, sends 3–5 product photos, confirms orders, and knows when to hand over to you. Works in English, Pidgin, and the way your customers actually talk."`
- Visual: Chat screenshot illustration (similar to hero, different conversation)

**Feature 2 — WhatsApp Flows (text right, visual left)**
- Badge: `Orders` orange pill
- H3: `"Structured order collection — no errors, no back-and-forth"`
- Body: `"When a customer is ready to order, they get a clean form inside WhatsApp. Name, delivery address, payment method. One flow. No missed details."`
- Visual: Phone mockup showing the Order Confirmation Flow UI (two-screen illustration)

**Feature 3 — Dashboard (text left, visual right)**
- Badge: `Dashboard` orange pill
- H3: `"Your orders, inventory, and conversations in one place"`
- Body: `"Manage everything from a mobile-first dashboard. See who ordered what, update stock, and read every AI conversation. Jump in when it matters."`
- Visual: A simplified dashboard screenshot illustration (card layout showing Orders, Conversations, and Analytics panels)

**Feature 4 — Abandoned Cart + Reviews (text right, visual left)**
- Badge: `Automation` orange pill
- H3: `"Automatically recover unpaid orders and collect reviews"`
- Body: `"2 hours after a customer doesn't pay, they get a reminder. After delivery, they get a review request — automatically, with zero effort from you."`
- Visual: Two phone screens side by side showing the Abandoned Cart Flow and Post-Delivery Review Flow

---

### 3.6 Pricing Section

**Background:** `#F4EDE8` (warm tint).  
**Heading (H2):** `"Simple, honest pricing."`  
**Subheading:** `"Start free. Pay as your business grows."`

Display **two pricing cards** side by side on desktop, stacked on mobile. The recommended card (Growth) is slightly elevated with an orange border.

**Card 1 — Starter**
- Label: `Starter`
- Price: `Free`
- Subtext: `"Perfect to get started"`
- Features list (checkmarks in orange):
  - Up to 50 products
  - AI agent included
  - 1 WhatsApp number
  - Order Confirmation Flow
  - Basic analytics
  - Community support
- CTA: Secondary Button `"Get started free"`

**Card 2 — Growth** *(recommended — highlighted)*
- Orange top border (4px), badge: `Most Popular`
- Label: `Growth`
- Price: `₦15,000/mo` (or `$10/mo`)
- Subtext: `"For merchants with real volume"`
- Features list:
  - Unlimited products
  - Everything in Starter
  - Abandoned Cart Recovery
  - Post-Delivery Reviews
  - Full analytics dashboard
  - Priority support via WhatsApp
  - Custom storefront URL
- CTA: Primary Button `"Start 14-day free trial"`

Note below cards (13px, grey): `"WhatsApp messaging costs (set by Meta) are passed through at cost. No Merchat markup."`

---

### 3.7 Testimonials Section

**Background:** `#182E47`.  
**Heading (H2, white):** `"Merchants using Merchat.io"`

Three testimonial cards in a row (desktop), carousel on mobile. Each card:
- Background: `rgba(255,255,255,0.08)`, border-radius 12px, padding 24px
- Quote (white, 16px, italic): Short 2–3 line quote
- Avatar: Initials-based avatar circle (`#D5652B` background, white text)
- Name (white, weight 600)
- Business type (white 60%, 13px)

Use placeholder content for now — mark clearly with `<!-- REPLACE WITH REAL TESTIMONIALS -->`.

---

### 3.8 FAQ Section

**Background:** `#FFFFFF`.  
**Heading (H2):** `"Questions merchants ask"`

Accordion component. Each item:
- Closed: Question in `#182E47`, weight 600, 16px + chevron-down icon (Lucide `ChevronDown`)
- Open: Answer in `#6B7280`, 15px, slides open with 200ms ease. Chevron rotates 180°.
- Border-bottom: 1px solid `#E5E7EB`

FAQ items:
1. **"Do my customers need to download anything?"** — No. Everything happens inside WhatsApp, which your customers already have. No app downloads, no account creation, no friction.
2. **"Will my customers see 'Merchat' instead of my business name?"** — No. Your dedicated WhatsApp number is registered under your own business name. Customers see your brand, not ours.
3. **"What happens to my existing customers when I join?"** — We provide a ready-made redirect message for your WhatsApp status and broadcast list. Most merchants migrate their active customer base in 24–48 hours.
4. **"Do I need technical knowledge to set up?"** — No. Setup takes under 10 minutes and requires no technical knowledge. If you can use WhatsApp, you can use Merchat.
5. **"How does the AI know about my products?"** — You upload your products during setup (photos from your gallery or manual entry). The AI reads your live inventory for every customer conversation.
6. **"What if the AI gets something wrong?"** — The AI hands conversations to you when it's uncertain. You get a notification, take over in your dashboard, and hand back to the AI when done. You're always in control.

---

### 3.9 Final CTA Section

**Background:** `#D5652B` (solid accent orange).  
**Content (centred):**
- H2 (white, 36px): `"Your AI salesperson is ready. Are you?"`
- Body (white 85%): `"Join merchants across Nigeria who've automated their WhatsApp sales. Setup takes 10 minutes."`
- Primary Button (white background, `#D5652B` text): `"Start for free →"`
- Ghost Button (white border, white text): `"Book a demo"`

---

## 4. Merchant Storefront Page (`/[merchantslug]`)

This is the public product page for each merchant. URL: `merchat.io/fashionbyamina` (example). Customer-facing. No login required.

### 4.1 Data Requirements

The page fetches:
```
GET /api/storefront/[merchantslug]
Response: {
  merchant: {
    displayName: string,
    description: string,
    logoUrl: string | null,
    primaryColour: string,          // merchant-chosen hex, default "#D5652B"
    deliveryAreas: string,
    deliveryFee: number | null,     // null = free delivery
    whatsappDeepLink: string,       // wa.me/[number]?text=shop+[code]
    slug: string
  },
  products: [
    {
      id: string,
      name: string,
      description: string,
      price: number,
      category: string,
      imageUrls: string[],
      inStock: boolean,
      variants: { label: string, options: string[] }[]
    }
  ]
}
```

### 4.2 Storefront Navigation Bar

**Not the main Merchat nav.** This is a merchant-specific mini-nav.

- Background: merchant's `primaryColour` (from merchant config, default `#D5652B`)
- Left: Merchant logo (if set) or initials avatar + merchant `displayName` in white, weight 700, 18px
- Right: `"Order on WhatsApp"` button — white background, merchant `primaryColour` text, 14px, weight 600, border-radius 20px (pill). Clicking opens `whatsappDeepLink` in a new tab.
- Height: 60px

Below the nav: A thin strip in merchant's `primaryColour` at 20% opacity showing: `"Free delivery to: [deliveryAreas]"` or `"Delivery fee: ₦[deliveryFee]"`. Font 13px, centred.

### 4.3 Store Header

**Background:** White.  
**Layout:** Centred, max-width 800px.

- Merchant logo (if set): 80px × 80px circle, border 3px solid merchant's `primaryColour`, object-fit cover. If no logo: initials avatar with merchant's `primaryColour` background, white text, 32px.
- Below logo: `displayName` — H2, `#182E47`, weight 800
- `description` — body, `#6B7280`, max 2 lines, truncated with "..." if longer
- Delivery info chips: Two small badges side by side showing delivery area summary and fee status

---

### 4.4 Product Grid

**Layout:** 3 columns desktop, 2 columns tablet, 1 column mobile. `gap: 16px`.  
**Max content width:** 1200px.

**Filter Bar (above grid):**
- Horizontally scrollable row of category pill buttons. `All` selected by default (merchant's `primaryColour` background, white text). Others: white background, `#374151` text, border `#E5E7EB`. Clicking a category filters the grid. Categories are derived from the products data.

**Product Card:**
- Border-radius: 12px
- Border: 1px solid `#E5E7EB`
- Overflow: hidden (image fills card top)

**Image area:**
- Aspect ratio: 1/1 (square)
- `object-fit: cover`
- If multiple images: show a dot indicator at the bottom (Swiper/carousel within the card on mobile swipe, or click arrows on desktop). Max 3 images shown.
- Out of stock overlay: semi-transparent black overlay with `"Out of stock"` label in white, centred.

**Card body (padding 12px):**
- Product name: 15px, weight 600, `#182E47`, max 2 lines (CSS line-clamp)
- Price: 18px, weight 700, merchant's `primaryColour`
- Variants summary (if any): 12px, `#6B7280` — e.g. `"Available in: S, M, L, XL"`
- `"Order via WhatsApp"` button: full-width, merchant's `primaryColour` background, white text, 13px, weight 600, border-radius 8px, height 40px. On click: opens the merchant's WhatsApp deep link with the product pre-referenced in the message text: `wa.me/[number]?text=Hi%2C+I%27m+interested+in+[Product+Name]`.

**Empty state (no products / all filtered out):**
- Centred illustration placeholder (simple SVG box with question mark)
- Text: `"No products in this category yet."` — `#6B7280`

---

### 4.5 Product Detail Overlay (on card click)

When user clicks the product image or name (not the "Order via WhatsApp" button), open a bottom sheet (mobile) or centred modal (desktop).

**Modal content:**
- Close button (Lucide `X`) top-right
- Full-width image carousel at top (swipeable, with dot indicators)
- Product name — H2, `#182E47`
- Price — 24px, weight 700, merchant `primaryColour`
- Description — body, `#6B7280`
- Variants: If variants exist, show labelled option groups. Each option is a pill button. Selected: merchant `primaryColour` background, white text. Unselected: white, border `#D1D5DB`. Out of stock combinations greyed.
- Stock status: Green dot + `"In stock"` or Red dot + `"Out of stock"`
- `"Order via WhatsApp"` — Primary Button (full-width), merchant `primaryColour`. Appends selected variant to the WhatsApp message.

**Backdrop:** `rgba(0,0,0,0.4)`. Click backdrop to close.  
**Animation:** Slide up (bottom sheet) or fade + scale from 0.95 (modal). 250ms ease.

---

### 4.6 Storefront Footer

Minimal. Background `#182E47`. Padding 24px.  
Centred content:
- `"Powered by"` in white 50%, 13px + `"Merchat.io"` in white, weight 600, linked to `merchat.io`
- `"Want a store like this?"` → `"Start for free →"` link in `#D5652B`

---

### 4.7 Storefront SEO

Each storefront page should set:
- `<title>`: `[Merchant Display Name] — Shop on WhatsApp | Merchat.io`
- `<meta name="description">`: `[Merchant description]`
- Open Graph `og:image`: Merchant logo or first product image
- Open Graph `og:title` and `og:description` matching above
- Canonical URL: `https://merchat.io/[slug]`

---

## 5. Authentication Pages

### 5.1 Login Page (`/login`)

**Layout:** Centred card, max-width 440px, vertically centred in viewport.  
**Background:** `#F3F4F6` page, white card.

Content:
- Merchat logo (top, centred)
- H2: `"Welcome back"`
- Body: `"Log in to your merchant dashboard"`
- Email input: label `"Business email"`, placeholder `"you@example.com"`
- Password input: label `"Password"`, placeholder `"••••••••"`, show/hide toggle (Lucide `Eye`/`EyeOff`)
- `"Forgot password?"` — right-aligned link in `#D5652B`, 13px
- Primary Button (full-width): `"Log in"`
- Divider: `"or"`
- Secondary Button (full-width): Google OAuth sign-in (if supported)
- Bottom link: `"Don't have an account?"` → `"Start for free"` in `#D5652B`

**Error state:** Red border on failed inputs, red error message below field: `"Incorrect email or password."` Font 13px, `#EF4444`.

### 5.2 Forgot Password Page (`/forgot-password`)

Simple centred card:
- H2: `"Reset your password"`
- Body: `"Enter your email and we'll send you a reset link."`
- Email input
- Primary Button (full-width): `"Send reset link"`
- Back link: `"← Back to log in"`

Success state (after submit): Replace form with:
- Lucide `MailCheck` icon in `#D5652B`, 48px
- `"Check your inbox"` — H3
- `"We sent a reset link to [email]. Check your spam folder if it doesn't arrive in 2 minutes."`
- Link: `"Resend email"` (greyed, with 60-second countdown before re-enabling)

---

## 6. Error & Loading States

### 6.1 404 Page

**Background:** `#182E47`. Full viewport.  
**Content (centred, white):**
- Large `"404"` in `#D5652B`, 120px, weight 800
- `"This page doesn't exist."` — H2, white
- `"If you're looking for a merchant store, double-check the link they shared with you."` — body, white 70%
- Primary Button: `"Go to Merchat.io home"`

### 6.2 Storefront Not Found

When `[merchantslug]` returns 404 from API, show within the normal storefront nav structure:
- `"This store isn't available."` — H2
- `"The merchant may have changed their link. Ask them for the latest one, or search on WhatsApp."` — body
- `"Start your own store →"` — link in `#D5652B`

### 6.3 Loading Skeletons

All data-fetching pages should show skeleton loaders (not spinners) while loading.

**Product card skeleton:**
- Grey rectangle (aspect 1/1) for image — `#E5E7EB`, animated shimmer (CSS animation)
- Two grey bars below for name and price

**General skeleton bar:** `background: #E5E7EB`, border-radius 4px, shimmer animation:
```css
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
background-size: 800px 100%;
animation: shimmer 1.4s infinite linear;
```

---

## 7. Responsiveness Summary

| Breakpoint | Width | Layout behaviour |
|---|---|---|
| Mobile | < 640px | Single column, hamburger nav, bottom-sheet modals |
| Tablet | 640px–1024px | 2-column product grid, centre nav hidden |
| Desktop | > 1024px | Full layout, 3-column grid, all nav visible |

All touch targets minimum 44×44px.  
WhatsApp deep links open in a new tab on desktop, native app on mobile via `target="_blank"`.

---

## 8. Key Interactions Checklist

- [ ] Navbar scroll shadow appears after 64px scroll
- [ ] Mobile drawer opens/closes with slide animation
- [ ] Hero CTA button scrolls to How It Works section (smooth scroll)
- [ ] FAQ accordion toggles with chevron rotation
- [ ] Pricing card hover elevates with shadow
- [ ] Storefront category filter updates grid without page reload
- [ ] Product card image carousel works with swipe (mobile) and arrow click (desktop)
- [ ] Product detail modal opens on image/name click, closes on backdrop click or X
- [ ] "Order via WhatsApp" button opens correct `wa.me` deep link with pre-filled message
- [ ] All skeleton loaders shown during data fetch
- [ ] Out-of-stock products have overlay and disabled button
- [ ] `og:` meta tags populated per storefront page

---

*End of Website Spec — see `merchat_dashboard_spec.md` for the merchant dashboard.*
