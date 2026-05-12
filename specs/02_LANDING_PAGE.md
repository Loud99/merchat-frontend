# Merchat.io — Landing Page Spec
**File 2 of 7 | For Claude Design**  
**Reference:** 01_DESIGN_SYSTEM.md for all colours, typography, and component specs.

---

## Page Overview

URL: `/` (homepage)  
Purpose: Convert visiting Nigerian SME owners into signed-up merchants.  
Primary CTA: "Get started free" → /auth/signup  
Secondary CTA: "Book a demo" → /book-demo  

**Page sections (top to bottom):**
1. Navigation Bar
2. Hero Section
3. Social Proof Bar
4. How It Works
5. Features Section
6. Storefront Preview / Product Demo
7. Testimonials (auto-scroll)
8. Pricing
9. FAQ
10. Final CTA Banner
11. Footer

---

## 1. Navigation Bar

**Behaviour:** Starts transparent, becomes white with shadow on scroll past 80px.

**Layout (desktop):** horizontal flex row, 72px height, 1280px max-width, centred.

**Left:** Merchat logo — icon-dark.svg (32px) + wordmark-dark.svg. Gap: 10px between icon and wordmark.

**Centre nav links:** (spaced evenly, Body M, Grey 800)
- Features → /features
- Marketplace → /marketplace
- Pricing → #pricing (smooth scroll)
- AI Assistant → /assistant
- Blog → /blog

**Right:**
- "Shop the marketplace" → Ghost button, Grey 800 → /marketplace
- "Log in" → ghost button → /auth/login (merchant login)
- "Get started" → Primary green button → /auth/signup (merchant signup)

**Note on dual auth:** The nav "Log in" and "Get started" are for merchants. Customers have their own auth at /auth/customer/login and /auth/customer/signup — linked from the marketplace and storefront pages, not the main nav.

**Mobile (< 768px):** Logo left, hamburger icon (Menu, 24px) right. Hamburger opens full-screen overlay nav with all links stacked vertically, each 56px tall. Overlay background Navy Deep. Close button (X) top right. Bottom of overlay: "Get started" full-width green button.

---

## 2. Hero Section

**Background:** Navy Deep `#0B1221` with animated gradient overlay. The gradient subtly shifts between navy tones — `#0B1221` to `#0F1A2E` to `#0B1221` — in a slow 8-second loop, creating depth without distraction.

**Layout:** Full viewport height (100vh minimum). Two-column on desktop (50/50), stacked on mobile.

### Left Column (text)

**Eyebrow tag** (above headline):  
Small pill badge — background `rgba(0,200,83,0.15)`, border `1px solid rgba(0,200,83,0.3)`, text Merchat Green.  
Content: "✦ AI-powered WhatsApp commerce"

**Headline:**  
Display XL (64px), White, 800 weight, line height 1.1.  
Two lines:  
Line 1: "Your store,"  
Line 2: "on WhatsApp." — where "WhatsApp." is in Merchat Green.

**Subheadline:**  
Body L (18px), Grey 400, 400 weight, line height 1.6.  
Max width 480px.  
Content: "Turn your WhatsApp number into a full commerce engine. AI handles the selling — you handle the fulfilment."

**CTA group** (horizontal flex, gap 16px, margin top 40px):
- "Get started free" — Primary green button, LG size
- "See how it works" — Secondary outline button (white border, white text), LG size, smooth scrolls to #how-it-works

**Trust line** (below CTAs, margin top 20px):  
Caption size, Grey 400.  
Content: "Free to start · No credit card required · Set up in 15 minutes"  
Three items separated by · (middot)

### Right Column (visual)

A floating phone mockup showing a WhatsApp conversation.

**Phone frame:** Dark rounded rectangle, 280px wide, slight 3D tilt (rotateY -8deg, rotateX 5deg). Shadow: shadow-xl.

**Screen content (WhatsApp chat UI):**

Header bar: WA Dark green `#128C7E`, merchant avatar (placeholder circle, initials "FK"), business name "Funke's Fashion", green dot (online).

Chat messages (from bottom up, scroll upward):

Customer (left bubble, white bg):
"Hi! Do you have the ankara dress in size M?"

AI/Merchant (right bubble, WA Light `#DCF8C6`):
"Yes! We have it in S, M, and L 🎉
The M is ₦12,500. Want me to reserve one for you?"

Customer:
"Yes please! How do I pay?"

AI/Merchant:
"You can pay via bank transfer or on delivery 💳
Shall I send you the account details?"

Customer:
"Yes, send it"

AI/Merchant:
"Perfect! Here are the details:
Bank: GTBank
Account: 0123456789
Name: Funke Adeyemi
Amount: ₦12,500

Reply PAID when done and I'll process your order 🛍️"

A small "Merchat AI" label in Caption size, Grey 400, below the last bubble.

**Floating elements around the phone:**
- Top-left: small card showing "🛍️ New Order · ₦12,500" with green dot, slide-in animation
- Bottom-right: small card showing "⚡ AI Reply · 0.8s" with lightning bolt icon
- Cards: White background, border-radius lg, shadow-md, Caption text

**Animation:** The phone floats subtly — translateY oscillating between 0 and -8px over 4 seconds. The cards appear with a staggered fade-in (300ms delay between each).

---

## 3. Social Proof Bar

**Background:** Navy Mid `#0F1A2E`  
**Height:** 80px  
**Layout:** horizontal flex, space-between, 1280px max-width, vertically centred

**Content — 4 stats separated by vertical dividers (1px Navy Light):**

| Stat | Label |
|------|-------|
| 500+ | Merchants |
| ₦2.4B+ | Orders Processed |
| 4.8★ | Merchant Rating |
| 15 min | Average Setup Time |

Each stat: number in Heading L, White, 700 weight. Label in Caption, Grey 400, below number.

**Mobile:** 2×2 grid instead of horizontal row.

---

## 4. How It Works

**Background:** White  
**Section ID:** `how-it-works`  
**Padding:** 96px top and bottom

**Section header (centred):**  
Eyebrow: "Simple by design" — Label size, Merchat Green, uppercase, letter-spacing 1.5px  
Heading: "Up and selling in 15 minutes" — Display M, Grey 900  
Subtext: "No developers. No complicated setup. Just your products and WhatsApp." — Body L, Grey 600, max-width 480px, centred

**Steps — horizontal 3-column grid (desktop), stacked (mobile):**

Each step card:
- Step number: large numeral (80px, 800 weight, `rgba(0,200,83,0.12)` colour, positioned top-left of card as background text)
- Icon: 48px × 48px container, Green Subtle background, Merchat Green icon inside
- Heading: Heading S, Grey 900
- Body: Body S, Grey 600, line height 1.6

**Step 1 — Add Your Products**  
Icon: Package  
"Upload your product catalogue in minutes. Add photos, prices, variants, and stock levels. Your AI learns your inventory instantly."

**Step 2 — Share Your Link**  
Icon: Share2  
"Get your unique Merchat storefront link. Share it on Instagram, Twitter, WhatsApp Status — anywhere your customers already are."

**Step 3 — AI Handles the Rest**  
Icon: Bot  
"Customers browse, ask questions, and order — all on WhatsApp. Your AI replies 24/7, processes orders, and sends receipts automatically."

**Connector arrows** between steps on desktop: dashed green arrow line, 2px, `rgba(0,200,83,0.4)`

---

## 5. Features Section

**Background:** Grey 50 `#F8F9FA`  
**Padding:** 96px top and bottom

**Section header (centred):**  
Eyebrow: "Everything your business needs"  
Heading: "One platform. Every tool." — Display M, Grey 900  
Subtext: "Built specifically for Nigerian SMEs selling on WhatsApp." — Body L, Grey 600

**Decorative background:** The logo icon (`icon-light.svg`) appears 5 times as ghost watermarks behind the content — very low opacity (0.04), various sizes (80px to 180px), various rotations (-20deg, 15deg, 45deg, -10deg, 30deg), scattered across the section. They sit behind the cards and create visual depth in the white space.

**Features grid — 3 columns desktop, 2 tablet, 1 mobile:**

Each feature card uses the Feature Card component (white bg, 2xl radius, shadow-md, green top accent bar).

**Feature 1 — AI Sales Agent**  
Icon: Bot (24px, Merchat Green)  
Title: "AI That Sells For You"  
Body: "Your personal AI handles customer questions, recommends products, processes orders, and follows up — all via WhatsApp. Replies in under 1 second."  
Footer tag: "24/7 availability"

**Feature 2 — Beautiful Storefront**  
Icon: Store  
Title: "Your Branded Storefront"  
Body: "Customers can browse your full catalogue in a beautiful mobile-first storefront — or scroll through products TikTok-style. Fully branded with your logo."  
Footer tag: "No app needed"

**Feature 3 — Order Management**  
Icon: ClipboardList  
Title: "Orders Tracked Automatically"  
Body: "Every order from WhatsApp is logged, tracked, and organised. Send receipts and invoices with one click. See your full order history anytime."  
Footer tag: "Real-time updates"

**Feature 4 — Analytics & Insights**  
Icon: BarChart2  
Title: "Know Your Numbers"  
Body: "Revenue, top products, customer behaviour, repeat purchase rate — all in one dashboard. Ask your AI analyst questions in plain English."  
Footer tag: "AI-powered insights"

**Feature 5 — Multi-Product Catalogue**  
Icon: Package  
Title: "Full Inventory Control"  
Body: "Manage hundreds of products with variants (size, colour, material). Set stock levels, get low-stock alerts, and your AI automatically marks sold-out items."  
Footer tag: "Variant support"

**Feature 6 — Nigerian Payment Ready**  
Icon: CreditCard  
Title: "Payments That Work Here"  
Body: "Bank transfer, pay on delivery, Paystack, Flutterwave — accept payments the way your customers prefer. Track what's paid and what's pending."  
Footer tag: "₦ First"

---

## 6. Storefront Preview

**Background:** Navy Deep  
**Padding:** 96px top and bottom

**Layout:** Two-column, equal width. Text left, visual right (reversed on mobile — visual first).

**Left — Text:**  
Eyebrow: "Customer experience" — Label, Merchat Green  
Heading: "Your customers will love shopping this way" — Display M, White  
Body: "When a customer clicks your Merchat link, they land on your branded storefront. They can browse, swipe through products, add to cart, and order — all without leaving their phone." — Body L, Grey 400  

Feature bullets (list with green check icons):
- Browse products without WhatsApp
- TikTok-style scroll mode for impulse buying
- Cart with real-time availability
- Order via WhatsApp with one tap
- Works on any phone, any browser

CTA: "See a live storefront" — Secondary outline button (white border)  
→ opens a sample storefront in new tab

**Right — Visual:**  
Two phones side by side, slight overlap, different heights for depth.

Phone 1 (product grid view):  
Shows the standard storefront grid — product cards with images, names, prices, green "Add to cart" buttons.

Phone 2 (scroll browse mode):  
Full-screen product image with overlay — product name, price at bottom, cart icon top-right, swipe indicator. Looks like TikTok but for shopping.

Both phones have the same dark frame, slight drop shadow, and subtle float animation.

---

## 7. Testimonials

**Background:** White  
**Padding:** 80px top and bottom

**Section header (centred):**  
Heading: "Merchants using Merchat.io" — Display M, Grey 900  
Subtext: "Real results from real Nigerian businesses." — Body L, Grey 600

**Auto-scrolling carousel:**  
- Infinite horizontal scroll, smooth, 3-second interval per card
- Pauses on hover (desktop) or touch (mobile)
- No dots or arrows — the motion itself signals scrollability

Each testimonial card (Dark Card variant — Navy Mid background):
- Star rating: 5 stars, WA Green (★★★★★)
- Quote text: Body M, White, italic, line height 1.7, max 3 lines
- Divider: 1px Navy Light, margin 16px 0
- Merchant info row: avatar (circle, 40px, coloured placeholder with initials), name (Body S, White, 600 weight), business type (Caption, Grey 400)
- Business result tag: pill badge, Green Subtle bg, Merchat Green text (e.g. "₦340K first month")

**Testimonials (show at least 6):**

1. "Before Merchat, I was copying and pasting prices into DMs all day. Now my AI handles it and I focus on packaging orders. Revenue went up 40% in 6 weeks."  
   — Funke A., Fashion Boutique, Lagos · **₦340K first month**

2. "My customers love that they can browse like a real shop. The scroll feature is a game changer — people spend way more time looking at products."  
   — Tunde O., Electronics Retailer, Abuja · **120+ orders/month**

3. "Setup took me 20 minutes on a Sunday evening. By Monday morning I had 3 orders. No developer, nothing. Just me and the app."  
   — Amaka C., Food & Snacks, Port Harcourt · **3 orders day one**

4. "The AI knows all my products and responds to customers faster than I ever could. Even at 2am when I'm asleep, sales are happening."  
   — Biodun K., Beauty & Skincare, Lagos · **24/7 sales**

5. "I was spending ₦30K/month on a social media manager just for DMs. Merchat replaced that entirely and costs less."  
   — Sola M., Home Décor, Ibadan · **Saved ₦30K/month**

6. "My customers kept asking 'do you have X in Y colour?' Now the AI answers that instantly with the right stock info. Order errors dropped to zero."  
   — Chisom E., Children's Clothing, Enugu · **Zero order errors**

---

## 8. Pricing

**Background:** Grey 50  
**Section ID:** `pricing`  
**Padding:** 96px top and bottom

**Section header (centred):**  
Eyebrow: "Pricing"  
Heading: "Start free. Scale as you grow." — Display M, Grey 900  
Subtext: "No hidden fees. No contracts. Cancel anytime." — Body L, Grey 600

**Toggle:** Monthly / Yearly — pill toggle switch. Yearly shows "Save 20%" badge.

**4-column pricing grid (desktop), 1-column stacked (mobile):**

---

**Tier 1 — Free**  
Badge: none  
Price: ₦0/month  
Subtext: "Perfect for getting started"  
Divider  
Feature list (grey check icons):
- Up to 50 orders/month
- Product catalogue (up to 20 products)
- Basic AI replies
- Merchat storefront link
- Email support

CTA: "Start for free" — Secondary outline button (navy border/text)  
Fine print: "No credit card required"

---

**Tier 2 — Starter**  
Badge: none  
Price: ₦15,000/month (₦12,000/month yearly)  
Subtext: "For growing businesses"  
Divider  
Feature list:
- Unlimited orders
- Unlimited products
- Full AI agent (24/7 replies)
- Order tracking & management
- Payment link integration
- Analytics dashboard
- Priority email support

CTA: "Get started" — Primary green button

---

**Tier 3 — Pro** ← **MOST POPULAR**  
Badge: "Most Popular" — pill, Merchat Green background, white text, positioned top-right of card  
Card: elevated — shadow-xl, slightly larger (scale 1.02), green top border 3px  
Price: ₦35,000/month (₦28,000/month yearly)  
Subtext: "For serious merchants"  
Divider  
Feature list (everything in Starter plus):
- Multi-AI agent support
- Custom AI trained on your catalogue & brand voice
- Advanced analytics + AI insights chat
- Custom storefront branding (your logo, colours)
- Export data (CSV, Excel, PDF)
- Nigerian state delivery management
- Finances & VAT tracker
- WhatsApp Business API connection
- Priority chat support

CTA: "Go Pro" — Primary green button

---

**Tier 4 — Custom**  
Badge: "Enterprise"  
Background: Navy Deep (dark card)  
Price: "Let's talk"  
Subtext: "Built around your business"  
Divider (Navy Light)  
Feature list (white check icons, everything in Pro plus):
- Dedicated onboarding team
- AI trained specifically on your catalogue, tone, and policies
- SLA-backed response time guarantee
- Logistics & delivery partner integrations
- Full API access for custom integrations
- White-label option (remove Merchat branding)
- Paystack/Flutterwave custom setup
- Dedicated account manager
- CAC & compliance documentation support

CTA: "Talk to us about your setup" — White outline button  
→ /book-demo

Fine print (Grey 400, Caption): "Typically for merchants doing 500+ orders/month or needing bespoke infrastructure."

---

**FAQ below pricing (light accordion, centred, max-width 640px):**

Q: Can I upgrade or downgrade anytime?  
A: Yes. Changes take effect at your next billing cycle. No penalties.

Q: Is my data secure?  
A: All data is encrypted at rest and in transit. We never share your customer data with third parties.

Q: Do I need a WhatsApp Business account already?  
A: No. We help you set it up during onboarding — it's part of the 15-minute setup.

---

## 9. FAQ Section

**Background:** White  
**Padding:** 80px top and bottom

**Section header (centred):**  
Heading: "Questions merchants ask" — Display M, Grey 900, centred

**Accordion — max-width 720px, centred on page:**

Each item: 
- Question: Heading S, Grey 900, 600 weight
- Answer: Body M, Grey 600, line height 1.7
- Expand/collapse: ChevronDown icon rotates 180deg on open
- Border: bottom border Grey 200 between items
- Open state: question Merchat Green

Questions:

1. **How does the AI know about my products?**  
"When you add products to your Merchat catalogue, the AI is automatically trained on them — names, descriptions, prices, variants, and stock levels. Every update you make is instantly reflected in the AI's knowledge."

2. **What happens when a product is out of stock?**  
"The AI knows your stock levels in real time. It will inform customers a product is unavailable and suggest alternatives from your catalogue. Out-of-stock items are hidden from your storefront automatically."

3. **Can my customers pay directly on WhatsApp?**  
"Yes. You can send payment links via WhatsApp. Customers can pay via bank transfer, Paystack, or Flutterwave. You can also offer pay-on-delivery per product."

4. **What if I already have a WhatsApp Business account?**  
"You can connect your existing number. We'll guide you through the process during onboarding."

5. **Is there a limit on how many products I can add?**  
"Free plan: 20 products. Starter and above: unlimited products."

6. **How do customers find my store?**  
"You get a shareable link (merchat.io/store/your-name) that you post anywhere — Instagram bio, WhatsApp Status, Twitter. Customers click and land on your storefront without downloading anything."

7. **What if I have questions during setup?**  
"Our support team responds within 2 hours on weekdays. Pro and Custom merchants get priority live chat support."

---

## 10. Final CTA Banner

**Background:** Merchat Green `#00C853`  
**Padding:** 80px top and bottom  
**Layout:** Centred, max-width 640px

**Headline:** "Start selling on WhatsApp today." — Display M, White, 800 weight, centred  
**Subtext:** "Join 500+ Nigerian merchants already using Merchat." — Body L, White, 70% opacity, centred  
**CTA:** "Get started free" — White background button, Navy Deep text, LG size, pill shape  
**Secondary:** "or Book a demo →" — text link, White, Body M, underline on hover

---

## 11. Footer

**Background:** Navy Deep `#0B1221`  
**Padding:** 64px top, 32px bottom  
**Layout:** 4-column grid (desktop), 2-column (tablet), 1-column (mobile)

**Column 1 — Brand:**  
logo-light.svg (icon + wordmark, 140px wide)  
Body S, Grey 400, max-width 220px:  
"AI-powered WhatsApp commerce for Nigerian businesses."  
Social icons row (gap 12px): Twitter/X, Instagram, LinkedIn, WhatsApp  
Each icon: 36px circle, `rgba(255,255,255,0.08)` background, white icon 18px

**Column 2 — Product:**  
Heading: "Product" — Label, Grey 400, uppercase, letter-spacing 1.5px  
Links (Body S, Grey 400, hover White):
- Features
- Marketplace
- AI Shopping Assistant
- Pricing
- Storefront
- Dashboard
- API (coming soon)

**Column 3 — Company:**  
Heading: "Company"  
Links:
- About Us
- Blog
- Careers
- Press
- Contact

**Column 4 — Legal:**  
Heading: "Legal"  
Links:
- Privacy Policy
- Terms of Service
- Cookie Policy
- Data Processing Agreement

**Bottom bar** (margin top 48px, padding top 24px, border-top 1px Navy Light):  
Left: "© 2024 Merchat Technologies Ltd. All rights reserved." — Caption, Grey 600  
Right: "Made in Nigeria 🇳🇬" — Caption, Grey 600

---

## SEO & Meta

```html
<title>Merchat.io — AI-Powered WhatsApp Commerce for Nigerian SMEs</title>
<meta name="description" content="Turn your WhatsApp into a full commerce engine. AI handles customer replies, orders, and receipts. Set up in 15 minutes. Free to start." />
<meta property="og:image" content="/og-image.png" />
```

OG image: 1200×630px, Navy Deep background, logo centred, tagline below, green accent elements.
