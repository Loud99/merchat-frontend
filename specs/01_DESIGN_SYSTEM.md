# Merchat.io — Design System
**File 1 of 5 | For Claude Design**

Read this file first. Every other file references the tokens, components, and rules defined here.

---

## Brand Identity

**Product:** Merchat.io — AI-powered WhatsApp commerce for Nigerian SMEs  
**Tagline:** "Your store on WhatsApp"  
**Tone:** Confident, modern, Nigerian-context aware. Not corporate. Not startup-jargony. Direct and warm.  
**Visual personality:** Clean and premium but accessible. Dark navy with bright green accents. Feels like a fintech product built for real people.

---

## Logo

The Merchat logo is a stylised meerkat (the animal) — upright, alert, forward-looking. It represents vigilance, community, and being on the lookout for opportunities.

**Logo variants (all exist as SVG files in /public/images/):**
- `logo-light.svg` — full logo (icon + wordmark) on dark backgrounds
- `logo-dark.svg` — full logo on light backgrounds
- `wordmark-light.svg` — text only "merchat" on dark backgrounds
- `wordmark-dark.svg` — text only "merchat" on light backgrounds
- `icon-light.svg` — meerkat icon only on dark backgrounds
- `icon-dark.svg` — meerkat icon only on light backgrounds

**Usage rules:**
- On navy/dark backgrounds: use light variants
- On white/light backgrounds: use dark variants
- Minimum icon size: 32px × 32px
- Minimum wordmark size: 100px wide
- Never stretch, recolour, or add effects to the logo
- Always maintain clear space equal to the height of the "m" in merchat around the logo

---

## Colour Palette

### Primary

| Name | Hex | Usage |
|------|-----|-------|
| Navy Deep | `#0B1221` | Primary background, hero sections, dark UI |
| Navy Mid | `#0F1A2E` | Cards on dark background, secondary dark surfaces |
| Navy Light | `#1A2B4A` | Hover states on dark surfaces, borders on dark |

### Accent

| Name | Hex | Usage |
|------|-----|-------|
| Merchat Green | `#00C853` | Primary CTA buttons, success states, active indicators |
| Green Hover | `#00B348` | Hover state of green buttons |
| Green Subtle | `#E8FAF0` | Light green tint backgrounds, success banners |

### Neutrals

| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Light backgrounds, card surfaces |
| Grey 50 | `#F8F9FA` | Page backgrounds on light sections |
| Grey 100 | `#F1F3F5` | Input backgrounds, table alternating rows |
| Grey 200 | `#E9ECEF` | Borders, dividers on light surfaces |
| Grey 400 | `#ADB5BD` | Placeholder text, disabled states |
| Grey 600 | `#6C757D` | Secondary text, captions, helper text |
| Grey 800 | `#343A40` | Body text on light backgrounds |
| Grey 900 | `#212529` | Headings on light backgrounds |

### Semantic

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#00C853` | Confirmations, completed states |
| Warning | `#FF9800` | Low stock, pending states |
| Error | `#F44336` | Errors, failed states, destructive actions |
| Info | `#2196F3` | Informational banners, tips |

### WhatsApp Brand

| Name | Hex | Usage |
|------|-----|-------|
| WA Green | `#25D366` | WhatsApp-specific elements, WA buttons, WA chat UI |
| WA Dark | `#128C7E` | WA chat header background |
| WA Light | `#DCF8C6` | Sent message bubble background |
| WA Received | `#FFFFFF` | Received message bubble background |

---

## Typography

---

## Additional Colour Tokens (Customer & Admin)

| Name | Hex | Usage |
|------|-----|-------|
| Gold Light | `#FFF8E1` | Promoted merchant banner background |
| Gold Border | `#FF9800` | Promoted merchant card border |
| Dispute Orange | `#FFF3E0` | Dispute status card background |
| Score Green | `#E8FAF0` | Admin score badge 80+ |
| Score Blue | `#E3F2FD` | Admin score badge 60-79 |
| Score Orange | `#FFF3E0` | Admin score badge 40-59 |
| Score Red | `#FFEBEE` | Admin score badge 0-39 |

---

## Additional Components (Customer & Admin)

### Wallet Balance Card
- Background: Navy Deep `#0B1221`
- Border-radius: 2xl (24px)
- Padding: 28px 32px
- "Merchat Wallet" label: Label, Grey 400, uppercase, letter-spacing 1.5px
- Balance: Display L, White, 800 weight
- "Available to spend" sub-label: Caption, Grey 400
- Locked funds sub-row (when dispute active): Lock icon + Warning orange text

### vCard / Save to Contacts Button
- Style: Secondary outline, SM size
- Icon: UserPlus (16px) left of text
- Text: "Save [Name]'s number"
- On click: triggers .vcf download
- Full vCard spec: name, WhatsApp number, store URL

### Verified Merchant Badge
- Shield icon (16px, Info blue `#1565C0`)
- Text: "Verified Merchant" — Caption, Info blue
- Inline pill, no background fill
- Tooltip: "Verified by Merchat — active products, completed profile, good order history."

### Star Rating Display
- 5 stars using ★ character or SVG stars
- Filled star: Warning orange `#FF9800`
- Empty star: Grey 200
- Half star: gradient fill (left half orange, right half Grey 200)
- Size: 16px inline, 20px standalone

### Dispute Status Card
- Background: `#FFF3E0` (orange tint)
- Border-left: 4px Warning orange
- Border-radius: lg (12px)
- Padding: 16px
- Header: AlertTriangle icon (Warning orange) + status text

### Promoted Merchant Card
- Border: 2px solid Warning orange `#FF9800`
- Border-radius: xl (16px)
- "Sponsored" badge: top-right, Caption, Warning orange, Grey 100 background
- Otherwise same structure as regular merchant card

### Admin Score Badge
- Pill shape, border-radius: full
- Padding: 4px 12px
- Score 80+: Green Subtle bg, Merchat Green text
- Score 60-79: `#E3F2FD` bg, `#1565C0` text
- Score 40-59: `#FFF3E0` bg, `#E65100` text
- Score 20-39: `#FFEBEE` bg, Error red text
- Score 0-19: Error red bg, White text

### OTP Input (6-box)
- 6 individual inputs, each 48px wide × 56px tall
- Border: 1.5px solid Grey 200
- Border-radius: md (8px)
- Focus: Merchat Green border, 2px glow
- Filled: Grey 900 text, Grey 100 background
- Auto-advance on input, auto-back on delete
- Gap between boxes: 8px

### Dispute Timeline (Horizontal/Vertical Stepper)
- Completed step: Merchat Green circle (24px) + white checkmark
- Current step: Navy Deep circle + pulsing green ring animation (keyframe: scale 1 → 1.4, opacity 1 → 0, 1.5s loop)
- Future step: Grey 200 circle + Grey 400 number
- Connector line: 2px, Grey 200 (completed: Merchat Green)
- Step label: Body S, Grey 900 (current: 600 weight), Grey 400 (future)
- Step subtitle: Caption, Grey 600

---

**Primary font:** Inter (Google Fonts)  
**Monospace font:** JetBrains Mono (for code, order numbers, tokens)

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display XL | 64px | 800 | 1.1 | Hero headline (desktop) |
| Display L | 48px | 800 | 1.15 | Hero headline (mobile), section heroes |
| Display M | 36px | 700 | 1.2 | Page titles, major section headings |
| Heading L | 28px | 700 | 1.3 | Card titles, modal headings |
| Heading M | 22px | 600 | 1.35 | Sub-section headings |
| Heading S | 18px | 600 | 1.4 | Card headings, sidebar items |
| Body L | 18px | 400 | 1.6 | Lead paragraphs, hero subtext |
| Body M | 16px | 400 | 1.6 | Default body text |
| Body S | 14px | 400 | 1.5 | Secondary text, descriptions |
| Caption | 12px | 400 | 1.4 | Labels, timestamps, metadata |
| Label | 12px | 600 | 1 | Form labels, badges, tags |
| Button | 15px | 600 | 1 | All button text |
| Mono | 13px | 400 | 1.4 | Order numbers, codes |

---

## Spacing System

Based on a 4px base unit.

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, tight spacing |
| sm | 8px | Between related elements |
| md | 16px | Component internal padding |
| lg | 24px | Between components |
| xl | 32px | Section internal spacing |
| 2xl | 48px | Between sections |
| 3xl | 64px | Major section separators |
| 4xl | 96px | Page-level section gaps |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Tags, badges, small buttons |
| md | 8px | Input fields, small cards |
| lg | 12px | Cards, modals, dropdowns |
| xl | 16px | Large cards, feature boxes |
| 2xl | 24px | Hero elements, prominent cards |
| full | 9999px | Pills, avatar circles, toggle switches |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | `0 1px 3px rgba(0,0,0,0.08)` | Subtle lift on cards |
| shadow-md | `0 4px 12px rgba(0,0,0,0.10)` | Dropdowns, tooltips |
| shadow-lg | `0 8px 24px rgba(0,0,0,0.12)` | Modals, popovers |
| shadow-xl | `0 16px 48px rgba(0,0,0,0.16)` | Hero elements, prominent cards |
| shadow-green | `0 4px 20px rgba(0,200,83,0.25)` | Green CTA buttons on hover |
| shadow-navy | `0 8px 32px rgba(11,18,33,0.40)` | Dark cards on light backgrounds |

---

## Components

### Buttons

**Primary (Green)**
- Background: Merchat Green `#00C853`
- Text: White, Button size, 600 weight
- Padding: 14px 28px
- Border radius: full (pill)
- Hover: Green Hover `#00B348` + shadow-green
- Active: scale(0.97)
- Loading: spinner replaces text, disabled opacity

**Secondary (Outline)**
- Background: transparent
- Border: 1.5px solid current text colour
- Text: matches context (white on dark, navy on light)
- Padding: 13px 27px (1px less to account for border)
- Border radius: full
- Hover: 10% fill of border colour

**Ghost**
- Background: transparent, no border
- Text: Grey 600 or white depending on context
- Hover: Grey 100 background (light context) or Navy Light (dark context)

**Destructive**
- Background: Error `#F44336`
- Text: White
- Same sizing as Primary

**WhatsApp Button**
- Background: WA Green `#25D366`
- Text: White
- Icon: WhatsApp logo SVG, 20px, left of text
- Padding: 14px 24px
- Border radius: full

**Icon Button**
- Square: 40px × 40px
- Border radius: lg (12px)
- Background: transparent
- Hover: Grey 100 (light) or Navy Light (dark)
- Icon size: 20px

**Sizes:**
- SM: padding 10px 20px, font 13px
- MD: padding 14px 28px, font 15px (default)
- LG: padding 16px 36px, font 16px

---

### Input Fields

- Height: 48px
- Background: Grey 100 `#F1F3F5`
- Border: 1.5px solid Grey 200
- Border radius: md (8px)
- Padding: 0 16px
- Font: Body M, Grey 800
- Placeholder: Grey 400
- Focus: border becomes Merchat Green, 2px glow `rgba(0,200,83,0.15)`
- Error: border Error red, error message below in Error colour, Caption size
- Label: Label size, Grey 800, 8px above input
- Helper text: Caption, Grey 600, 4px below input

**Textarea:** same as input but min-height 120px, padding 12px 16px, resize: vertical

**Select dropdown:** same as input, chevron icon right-aligned

---

### Cards

**Default Card**
- Background: White
- Border: 1px solid Grey 200
- Border radius: xl (16px)
- Padding: 24px
- Shadow: shadow-sm

**Dark Card (on navy backgrounds)**
- Background: Navy Mid `#0F1A2E`
- Border: 1px solid Navy Light `#1A2B4A`
- Border radius: xl (16px)
- Padding: 24px

**Feature Card**
- Background: White
- Border radius: 2xl (24px)
- Padding: 32px
- Shadow: shadow-md
- Top accent bar: 3px, Merchat Green, full width, border-radius top

**Metric Card (Dashboard)**
- Background: White
- Border: 1px solid Grey 200
- Border radius: xl
- Padding: 20px 24px
- Icon container: 40px × 40px, Green Subtle background, border-radius lg, icon Merchat Green

---

### Badges & Tags

- Border radius: full (pill)
- Padding: 4px 12px
- Font: Label size

| Variant | Background | Text |
|---------|------------|------|
| Success | Green Subtle | Merchat Green |
| Warning | `#FFF3E0` | `#E65100` |
| Error | `#FFEBEE` | Error |
| Info | `#E3F2FD` | `#1565C0` |
| Neutral | Grey 100 | Grey 600 |
| Dark | Navy Deep | White |

---

### Navigation Bar (Public Site)

- Height: 72px
- Background: transparent (scrolled: White with shadow-sm and backdrop blur)
- Logo: left-aligned, icon-dark.svg + wordmark-dark.svg on light sections, light variants on dark
- Nav links: Body M, Grey 800, hover Merchat Green
- Active link: Merchat Green, 600 weight
- Right side: "Log in" ghost button + "Get started" Primary button
- Mobile: hamburger menu (≤768px), slides in from right

**Dark variant (on hero):**
- Background: transparent, all text White
- On scroll: Navy Deep `#0B1221` with bottom border Navy Light

---

### Footer

- Background: Navy Deep `#0B1221`
- Text: White/Grey 400
- Columns: 4 (logo+tagline, Product, Company, Legal)
- Bottom bar: divider line, copyright left, social icons right
- Social icons: 32px circles, Grey 600 background, white icons

---

### Forms

- Label above input, always
- Error messages below input
- Submit button full-width on mobile, auto-width on desktop
- Required fields marked with asterisk in Merchat Green
- Section dividers: 1px Grey 200 horizontal rule

---

### Modals

- Overlay: `rgba(0,0,0,0.6)` backdrop blur 4px
- Container: White, border-radius 2xl (24px), max-width 520px
- Header: padding 24px 24px 0, title Heading L, close button top-right
- Body: padding 24px
- Footer: padding 0 24px 24px, flex row, right-aligned buttons
- Animation: scale from 0.95 + fade in, 200ms ease-out

---

### Toast Notifications

- Position: top-right, 16px from edges
- Width: 320px
- Border radius: lg (12px)
- Shadow: shadow-lg
- Duration: 4 seconds
- Icon left, message text, optional action link, dismiss X

---

## Layout Grid

**Desktop:** 12-column, 1280px max-width container, 24px gutters, 32px side margins  
**Tablet:** 12-column, fluid, 20px gutters, 24px side margins  
**Mobile:** 4-column, fluid, 16px gutters, 16px side margins  

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px – 1024px
- Desktop: > 1024px
- Wide: > 1280px (content caps at 1280px)

---

## Animation & Motion

**Principle:** Purposeful, fast, never decorative for its own sake.

| Type | Duration | Easing |
|------|----------|--------|
| Micro (hover, focus) | 120ms | ease-out |
| Standard (show/hide) | 200ms | ease-out |
| Enter (modals, panels) | 250ms | cubic-bezier(0.34, 1.56, 0.64, 1) (slight spring) |
| Page transition | 300ms | ease-in-out |
| Scroll animations | 400ms | ease-out |

**Scroll animations:** Elements animate in from 20px below with fade-in as they enter viewport. Use Intersection Observer. One-time only (don't repeat on scroll back).

---

## Icons

Use **Lucide React** icon set throughout. Size: 20px default, 16px small contexts, 24px large contexts. Stroke width: 1.5px. Colour: inherits from parent text colour unless specified.

Key icons used:
- WhatsApp integration: use WhatsApp SVG logo (not in Lucide)
- Navigation: Menu, X, ChevronDown, ChevronRight
- Dashboard: LayoutDashboard, MessageSquare, ShoppingBag, Package, BarChart2, Settings
- Actions: Plus, Edit2, Trash2, Download, Upload, Copy, ExternalLink
- Status: CheckCircle, AlertCircle, XCircle, Clock, Truck
- Commerce: ShoppingCart, Tag, Star, TrendingUp, DollarSign

---

## Responsive Behaviour

**Text scales:**
- Display XL (64px desktop) → Display L (48px tablet) → Display M (36px mobile)
- Display L (48px desktop) → Display M (36px tablet) → Heading L (28px mobile)

**Layout shifts:**
- 3-column grids → 2 columns tablet → 1 column mobile
- Side-by-side sections → stacked mobile
- Horizontal navigation → hamburger mobile

**Touch targets:** minimum 44px × 44px on mobile for all interactive elements

---

## Dark Mode

The dashboard uses a light-mode default. The public landing page uses a mixed dark/light approach — hero is dark navy, feature sections are white, pricing is light grey.

Do not implement a dark mode toggle — design to the fixed themes above.
