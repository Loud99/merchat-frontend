# Merchat.io — Merchant Dashboard Spec
**File 5 of 7 | For Claude Design**  
**Reference:** 01_DESIGN_SYSTEM.md for all colours, typography, and component specs.

---

## Overview

The dashboard is the merchant's command centre. It is accessed after login at `/dashboard`. Only authenticated merchants can access it.

**Dashboard pages:**
1. Overview (home)
2. Conversations
3. Orders
4. Inventory
5. Analytics
6. Finances
7. Settings (multiple sub-pages)
8. Promoted Slots (Marketplace Promotion)
9. Reviews (customer reviews received)

---

## Dashboard Shell

The dashboard shell wraps all pages. It includes the sidebar (desktop) or bottom navigation (mobile) and the top header.

### Sidebar (Desktop — width 240px)

**Background:** White  
**Border-right:** 1px Grey 200  
**Full viewport height, sticky**  
**Padding:** 20px 16px

**Logo section (top):**  
icon-dark.svg (28px) + wordmark-dark.svg  
Margin-bottom 32px

**Navigation sections:**

Section: "Main"

Nav items (each 44px height, border-radius lg, padding 0 12px):

| Icon | Label | Route |
|------|-------|-------|
| LayoutDashboard | Overview | /dashboard |
| MessageSquare | Conversations | /dashboard/conversations |
| ShoppingBag | Orders | /dashboard/orders |
| Package | Inventory | /dashboard/inventory |
| BarChart2 | Analytics | /dashboard/analytics |
| Wallet | Finances | /dashboard/finances |

Section: "Grow" (margin-top 16px)

| Icon | Label | Route |
|------|-------|-------|
| Star | Promote Store | /dashboard/promoted |
| Store | Marketplace Listing | /dashboard/marketplace |
| MessageCircle | Reviews | /dashboard/reviews |

Section: "Account" (margin-top 16px, separator)

| Icon | Label | Route |
|------|-------|-------|
| Settings | Settings | /dashboard/settings |
| HelpCircle | Help | opens support modal |
| LogOut | Log out | triggers signOut() |

**Active state:**  
Background: Green Subtle `#E8FAF0`  
Text and icon: Merchat Green  
Left border: 3px Merchat Green, border-radius 0 (full height of item)

**Hover state:**  
Background: Grey 50  
Text: Grey 900

**Notification badge on Conversations:**  
Red circle (16px), white number (Caption), absolutely positioned top-right of icon  
Only shows if there are unread messages

**Merchant info (bottom of sidebar):**  
Separator line above  
Avatar (32px circle, initials or photo)  
Business name: Body S, Grey 900, 600 weight  
Plan badge: Caption, pill — "Free" (Grey), "Starter" (Blue), "Pro" (Green), "Custom" (Navy)  
Clicking this area → /dashboard/settings/account

---

### Top Header

**Background:** White  
**Border-bottom:** 1px Grey 200  
**Height:** 64px  
**Padding:** 0 24px  
**Layout:** horizontal flex, space-between, items centred

**Left:** Page title — Heading M, Grey 900 (updates per page: "Overview", "Conversations", etc.)

**Right side items (flex row, gap 12px):**

1. **"Test Your AI" button** — Secondary outline button, SM size, Bot icon (16px) left  
   Opens AI sandbox modal

2. **Notification bell** — Icon button (Bell, 24px)  
   Red badge with count if unread notifications  
   Clicking opens notification dropdown panel

3. **Merchant avatar** — 36px circle, initials or photo  
   Clicking opens small dropdown: "Settings", "Log out"

**Mobile header:**  
Left: hamburger menu (Menu, 24px) — opens sidebar as overlay drawer  
Centre: logo (icon-dark.svg, 24px) + wordmark  
Right: notification bell + avatar

---

### Bottom Navigation (Mobile — ≤768px)

**Background:** White  
**Border-top:** 1px Grey 200  
**Height:** 64px + safe area inset  
**Position:** fixed bottom  
**5 items:**

| Icon | Label |
|------|-------|
| LayoutDashboard | Home |
| MessageSquare | Chats |
| ShoppingBag | Orders |
| Package | Inventory |
| BarChart2 | Analytics |

Active item: Merchat Green icon + label. Others: Grey 400.  
Label: Caption size below icon.

---

## Page 1: Overview (Dashboard Home)

**URL:** `/dashboard`

**Welcome banner (top of page):**  
Background: Navy Deep, border-radius 2xl, padding 24px 32px  
Left: "Good morning, Funke 👋" — Heading M, White  
Sub: "You have 3 new orders and 2 unread messages." — Body S, Grey 400  
Right: "Share your store →" button (White outline, SM) that copies store link with a "Copied!" toast

---

**Metric cards row (4 cards, horizontal, wrap on mobile):**

Each card: Metric Card component (white bg, border Grey 200, border-radius xl, padding 20px 24px)

Card 1 — Today's Revenue:  
Icon container: green (TrendingUp icon)  
Value: "₦47,500" — Display M, Grey 900  
Label: "Revenue today" — Caption, Grey 600  
Trend: "+12% vs yesterday" — Caption, Merchat Green, TrendingUp icon 14px

Card 2 — New Orders:  
Icon: ShoppingBag  
Value: "8"  
Label: "New orders"  
Trend: "3 pending payment"

Card 3 — Active Conversations:  
Icon: MessageSquare  
Value: "5"  
Label: "Active chats"  
Trend: "2 unread"

Card 4 — Low Stock:  
Icon: AlertCircle, Warning orange  
Value: "3"  
Label: "Low stock items"  
Trend: "< 5 units remaining" — Caption, Warning orange

---

**Two-column layout below metrics (desktop), stacked (mobile):**

**Left column (flex: 3) — Recent Orders:**

Section heading row: "Recent Orders" (Heading S, Grey 900) | "View all →" link (Body S, Merchat Green → /dashboard/orders)

Orders table (last 5 orders):

Columns: Order #, Customer, Amount, Status, Time

Order # — Mono font, Grey 800, Caption size  
Customer — Body S, Grey 900  
Amount — Body S, Grey 900, 600 weight  
Status — Badge (Success: Paid, Warning: Pending, Info: Shipped, Grey: Cancelled)  
Time — Caption, Grey 400 (relative: "2 hours ago")

Row hover: Grey 50 background  
Clicking row → opens order detail

Empty state: centred, ShoppingBag icon (48px, Grey 300), "No orders yet"

---

**Right column (flex: 2) — Recent Messages:**

Section heading: "Recent Conversations" | "View all →" → /dashboard/conversations

Conversation list (last 4):

Each row:  
Avatar (36px circle, customer initials, Grey 200 bg)  
Customer name (Body S, Grey 900, 600 weight) + last message preview (Caption, Grey 600, 1 line ellipsis)  
Time right (Caption, Grey 400)  
Unread badge (8px green dot, right) if unread

Clicking → opens that conversation in /dashboard/conversations

---

**AI Performance card (full width, below two-column):**

Background: Navy Mid, border-radius 2xl, padding 24px

"AI Agent Performance" — Heading S, White

3-column stats (White text):  
Conversations handled: "142" | Avg response time: "0.8s" | Customer satisfaction: "4.8★"

"Test your AI" button — Green, SM size, right-aligned

---

## Page 2: Conversations

**URL:** `/dashboard/conversations`

**Layout:** Two-panel (desktop) — conversation list left (360px), chat view right. Mobile: list only, tap to open full-screen chat.

### Left Panel — Conversation List

**Header:**  
"Conversations" — Heading M, Grey 900  
"[n] active" — Caption, Grey 600  
Search: input (Search icon, full width, height 40px, border-radius full, Grey 100 bg)

**Filter tabs:**  
"All | Active | Archived" — pill tabs (active tab: Merchat Green bg, white text; inactive: Grey 100 bg, Grey 600 text)

**Conversation items:**

Each item (80px height, padding 12px 16px, hover Grey 50):

Row layout: Avatar | Content | Meta

Avatar: 40px circle, customer initials, coloured (rotating through: Green Subtle, blue-subtle, orange-subtle backgrounds with matching darker initials colour)

Content:  
Customer name: Body S, Grey 900, 600 weight, 1 line  
Last message preview: Caption, Grey 600, 1 line ellipsis

Meta (right column, right-aligned):  
Timestamp: Caption, Grey 400  
Unread badge: Merchat Green circle, white count number (Caption), only if unread

Active/selected conversation: Green Subtle (subtle) left border 3px, slightly brighter background

Unread conversation: customer name Bold (700), background White (vs read: Grey 50)

**Dividers:** 1px Grey 100 between items

**Empty state:** MessageSquare (48px, Grey 300), "No conversations yet"

---

### Right Panel — Chat View

**Header (sticky):**  
Background: White, border-bottom Grey 200, height 64px, padding 0 20px  
Left: Back button (← ChevronLeft, 20px) — mobile only  
Customer avatar (36px) + name (Body M, Grey 900, 600 weight) + status (Caption, Grey 400 — "Via WhatsApp")  
Right: "View Profile" button (Ghost SM, User icon) + MoreVertical icon (options dropdown)

"View Profile" opens a right slide-over panel (320px) with:
- Customer name, phone (large, Body L)
- "Message on WhatsApp" button (WA Green)
- Stats: Total orders, Total spent, Last order date
- Order history list (compact rows: order #, date, amount, status)

**Options dropdown (MoreVertical):**  
Archive conversation | Mark as unread | Block customer (red)

---

**Messages area:**

Background: `#ECE5DD` (WhatsApp-style warm beige)  
Overflow: auto, scroll to bottom on new message  
Padding: 20px 16px

Timestamp dividers: "Today", "Yesterday", "12 May 2024" — Caption, `rgba(0,0,0,0.5)`, pill, centred, white background

**Received messages (left-aligned):**  
Background: White, border-radius 16px (flat top-left corner), max-width 80%, padding 10px 14px  
Message text: Body S, `#111B21`  
Timestamp: Caption, `rgba(0,0,0,0.45)`, bottom-right of bubble

**Sent messages (right-aligned — merchant or AI):**  
Background: `#D9FDD3` (WhatsApp sent green)  
Same border radius (flat top-right)  
AI tag: "✦ AI" — Caption, `rgba(0,0,0,0.45)`, italics, below timestamp if AI-sent  
Delivery status icon: single grey tick (sent), double grey tick (delivered), double blue tick (read)

**Message input area (sticky bottom):**  
Background: White, border-top Grey 200, padding 12px 16px  
Input row: Paperclip icon | Textarea (auto-expand, max 4 rows, placeholder "Type a message...") | Send button (green circle, ArrowUp icon)  
Send on Enter (Shift+Enter for new line)

Below input: "AI is handling this conversation" — Caption, Merchat Green, Bot icon. OR "AI paused — you're in control" — Caption, Grey 400. Toggle: click to switch between AI mode and manual mode.

---

## Page 3: Orders

**URL:** `/dashboard/orders`

### Header row

"Orders" — Heading M, Grey 900  
Right: date range picker + "Export" button (Download icon, Secondary outline SM)

### Filter tabs + search

Tabs: All | Pending | Paid | Shipped | Delivered | Cancelled  
Each tab shows count badge: e.g. "Pending (5)"  
Search: input, placeholder "Search by order #, customer name, or phone"

### Orders Table

Columns (desktop):

| Column | Content |
|--------|---------|
| Order # | Mono font, Caption, Grey 800, clickable |
| Customer | Avatar (28px) + Name (Body S) + Phone (Caption, Grey 400) |
| Products | "[n] items" — Caption, Grey 600 |
| Amount | Body S, Grey 900, 700 weight |
| Status | Badge |
| Date | Caption, Grey 400, relative |
| Actions | ··· icon button |

**Mobile:** Card layout instead of table. Each card shows: order # + status badge top row, customer name, amount, date, quick action button.

**Row hover:** Grey 50 background  
**Clicking row:** opens Order Detail

### Order Detail (Modal on desktop, full page on mobile)

**Modal:** max-width 640px, border-radius 2xl, shadow-xl

**Header:**  
"Order #MCH-240512-1234" — Heading M, Grey 900  
Status badge (large)  
Close button (X)

**Order info grid (2 columns):**  
Date placed, Payment method, Delivery state, WhatsApp number

**Customer section:**  
Heading S "Customer"  
Name, phone (with WhatsApp icon link)

**Items table:**  
Product name | Variant | Qty | Unit price | Subtotal  
Alternating row background (white / Grey 50)

**Order summary:**  
Right-aligned:  
Subtotal: ₦X  
Delivery: ₦Y / "To be confirmed"  
Divider  
Total: ₦Z (Heading S, 700 weight)

**Order status selector:**  
"Update status" — dropdown (Pending → Confirmed → Shipped → Delivered → Cancelled)  
"Save status" button — Primary green SM

**Actions section:**

For PAID orders:
- "View Receipt" button (FileText icon, Secondary outline)
- "Send Receipt" button (Send icon, WA Green)
- "Download PDF" button (Download icon, Ghost)

For UNPAID orders:
- "View Invoice" button
- "Send Invoice" button (WA Green)
- "Mark as Paid" button (Primary green)

**Receipt/Invoice Modal:**  
Clean white modal, centred  
Header: Merchat logo (icon-dark 24px) + "Receipt" or "Invoice" title  
Merchant info: store name, address, WhatsApp  
Customer info: name, phone  
Order # and date  
Items table: name, qty, unit, total  
Grand total  
Footer: "Thank you for shopping with [Store Name]" | "Powered by Merchat.io" — Caption, Grey 400  
Print button triggers window.print() with print-only styles

---

## Page 4: Inventory

**URL:** `/dashboard/inventory`

### Header row

"Inventory" — Heading M, Grey 900  
Right: "Add Product" — Primary green button (Plus icon + text)

### Filter + search row

Search: "Search products..."  
Filter chips: All | Active | Inactive | Low Stock  
Sort dropdown: Newest | Name A-Z | Price | Stock Level

### Product grid (desktop 3-column, tablet 2-column, mobile 1-column)

#### Product Card

**Image:** 160px height, object-fit cover, border-radius xl top corners  
Background Grey 100 (skeleton while loading)

**Status toggle (top-right of image, absolute):**  
Small toggle switch — Green (active) or Grey (inactive)  
Tapping toggles product status without opening edit form

**Low stock badge (top-left, if stock ≤ 5):**  
"Low Stock" — Warning orange pill

**Content (padding 16px):**

Product name: Body S, Grey 900, 600 weight, 2 lines max

Category: Caption, Grey 400

Price row: "₦12,500" — Body M, Grey 900, 700 weight

Stock row: Package icon (14px, Grey 400) + "[n] in stock" — Caption, Grey 600

Variant summary: if has variants, "Sizes: S, M, L · Colours: Red, Blue" — Caption, Grey 400, 1 line

**Action row (bottom of card, border-top Grey 100, padding 12px 16px):**  
"Edit" — Ghost SM (Edit2 icon) | "Delete" — Ghost SM, Error red (Trash2 icon)

### Add / Edit Product Form (right slide-over panel or full modal)

**Panel width:** 480px on desktop, full screen mobile  
Slides in from right with overlay

**Form sections:**

**Basic Info:**  
Product name * | Category *  
Description (textarea)

**Pricing:**  
Price (₦) * | Compare at price (optional)  
"Pay on delivery" toggle

**Images:**  
Label: "Product image URLs"  
Textarea, comma-separated URLs  
Below: image previews (60px × 60px squares, object-fit cover, border-radius md) rendered in real-time as URLs are typed/pasted  
Each preview has X button to remove that URL

**Inventory:**  
Stock quantity * | SKU (optional)

**Variants:**  
"Product has variants" — toggle  
If on: variant builder  

Variant builder:  
"Add variant type" — dropdown (Size, Colour, Material, Style, Weight, Pack Size)

Size: multi-select from chips: XS S M L XL XXL XXXL 3XL  
Colour: input field with colour preview swatch  
Material: chip builder (type + Enter to add)  
Style: chip builder  
Weight: number + unit (g, kg)  
Pack Size: number

"Add another variant type" — Ghost SM, Plus icon

Each added variant type shows as a collapsible section with remove button.

**Save button:** "Save Product" — Primary green, full width  
Cancel: "Discard changes" — Ghost, Grey 600, full width

---

## Page 5: Analytics

**URL:** `/dashboard/analytics`

### Header row

"Analytics" — Heading M, Grey 900  
Right: Date range dropdown (Last 7 days | Last 30 days | Last 3 months | Custom) + "Export" button  

Export dropdown: CSV | Excel (.xlsx) | PDF

### Metric cards (top row, 4 cards)

Card 1: Total Revenue — Display M (₦ value), "In selected period", green trend vs previous period  
Card 2: Total Orders — count, trend  
Card 3: Average Order Value — ₦ value  
Card 4: Repeat Customer Rate — percentage, Info icon with tooltip explaining calculation

### Charts row (2-column)

**Left: Revenue Over Time (line chart)**  
X-axis: dates, Y-axis: ₦ amounts  
Line: Merchat Green, 2px  
Fill below line: `rgba(0,200,83,0.08)`  
Hover tooltip: date + ₦ amount  
Toggle: Daily | Weekly | Monthly

**Right: Orders by Day of Week (bar chart)**  
7 bars, Mon-Sun  
Bar colour: Merchat Green for highest bar, `rgba(0,200,83,0.5)` for others  
Hover tooltip: day name + order count

### Charts row 2 (2-column)

**Left: Revenue by Category (donut chart)**  
Donut, 200px diameter  
Legend below: colour dot + category name + ₦ amount + percentage  
Colours: Merchat Green, Navy, Warning orange, Info blue, etc.

**Right: Top Products (horizontal bar chart or ranked list)**  
Top 5 products by revenue  
Each: product name (Body S) | green bar (proportional) | ₦ amount  
"Top Seller" crown icon next to #1

### Extra metrics row (3-column)

**Conversion Rate:**  
Gauge or big percentage number  
"[n]% of storefront visitors placed an order"

**New vs Returning Customers:**  
Simple donut or two big numbers  
New customers: [n] | Returning: [n]

**Average Days Between Orders:**  
Single metric card  
"Customers reorder every [n] days on average"

---

### AI Analyst Chat (bottom of page)

**Container:** White card, border Grey 200, border-radius 2xl, padding 0

**Header:**  
Background: Navy Deep, border-radius 2xl top, padding 16px 20px  
Bot icon (20px, Merchat Green) + "AI Analyst" — Heading S, White  
Subtext: "Ask anything about your store performance." — Caption, Grey 400

**Chat messages area:**  
Background: Grey 50, min-height 200px, max-height 300px, overflow auto, padding 16px

AI message bubble (left, white bg, border-radius lg):  
Bot icon (20px) + message text (Body S, Grey 800)  
Initial message: "Hi! I'm your AI analyst. Ask me anything — your best day this week, which product to restock, or why sales dipped on Wednesday."

User message bubble (right, Navy Mid bg):  
Text (Body S, White)

**Input row (bottom, border-top Grey 200, padding 12px 16px):**  
Textarea (auto-expand, placeholder "Ask your AI analyst...") | Send button (green circle, Send icon)

**Example prompts (shown as clickable pills above input if no conversation yet):**  
"What's my best selling product?" | "Which day gets the most orders?" | "When should I restock [product]?"

---

## Page 6: Finances

**URL:** `/dashboard/finances`

**Sub-navigation tabs (below header):**  
Overview | Transactions | Tax Helper | Export | Compliance

### Tab 1: Overview

**Revenue summary cards (3):**  
This Month | Last Month | Year to Date  
Each: ₦ amount (Display M, Grey 900), Label (Caption, Grey 600), mini trend line chart

**Quick stats row:**  
Paid orders: [n] | Unpaid orders: [n] | Cancelled (refunds): [n]

### Tab 2: Transactions

Paginated table of all paid orders:  
Date | Order # | Customer | Items | Gross Amount | VAT (7.5%) | Net Amount | Payment Method

20 rows per page, pagination at bottom  
Search: order # or customer  
Filter: date range, payment method

### Tab 3: Tax Helper

Info banner (blue): "This is for reference only. Consult a certified accountant for official tax filing."

**VAT Summary by Quarter:**  
Q1 | Q2 | Q3 | Q4 (current year)  
Each quarter: Total Revenue | VAT @ 7.5% | Net Revenue  
Table format

**VAT rate:** shown as editable field (default 7.5%) — "Adjust if your accountant advises a different rate"

**Annual summary:** total revenue, total estimated VAT, net

**"Download Tax Summary" button:** generates PDF

### Tab 4: Export

Label: "Export transaction data"

Format options (radio cards):  
CSV — "For spreadsheets and accounting software"  
Excel (.xlsx) — "For Microsoft Excel / Google Sheets"  
PDF Report — "For printing and records"

Date range picker  
"Include" checkboxes: Order details | Customer info | Product breakdown | VAT breakdown

"Export" button — Primary green, triggers download

### Tab 5: Compliance

**Business information:**  
Form with fields:  
CAC Registration Number | TIN (Tax Identification Number) | Registered Business Address  
Business type (Sole Proprietorship, Partnership, Limited Company)  
Year established

"Save" button  
Note: "This information is stored securely and used only for your records."

**Document vault (future feature):**  
"Upload compliance documents" — Upload area  
CAC Certificate | TIN Certificate | Proof of Address  
[Coming Soon badge]

---

## Page 7: Settings

**URL:** `/dashboard/settings`

**Settings sub-navigation (left sidebar within settings, or horizontal tabs on mobile):**  
Store Profile | Notifications | Account | WhatsApp | Team (Coming Soon)

---

### Settings: Store Profile

**Store name** | **Store slug** (with live preview URL)  
**Tagline** | **Description** (textarea)  
**Logo** (upload area, same as onboarding)  
**Store colour** (preset swatches + custom picker)

**Delivery areas:**  
"States you deliver to" — same 3-column checklist as onboarding  
"Select all" | "Clear all"

**Delivery time estimate** (dropdown)  
**Delivery note** (textarea)

**Save button** (sticky bottom, Primary green, full width)

---

### Settings: Notifications

**Card layout — grouped toggles:**

**Order notifications:**  
New order received — toggle (default: on)  
Order status changed — toggle  
Payment received — toggle

**Message notifications:**  
New customer message — toggle (default: on)  
Unread message reminder — toggle (and frequency: immediately / every hour / daily digest)

**Inventory notifications:**  
Low stock alert (< 5 units) — toggle (default: on)  
Out of stock alert — toggle

**Performance notifications:**  
Daily sales summary — toggle + time picker  
Weekly analytics digest — toggle

Each toggle: right-aligned, Merchat Green when on, Grey 300 when off

---

### Settings: Account

**Profile section:**  
Full name (editable) | Email (read-only, greyed out)  
Phone number (editable)  
Avatar upload

**Change password section:**  
Current password | New password | Confirm new password  
"Update password" button — Secondary outline

**Danger zone:**  
Red-bordered card  
"Delete account" — Ghost button, Error red  
Confirmation modal: type "DELETE" to confirm

**Plan & billing:**  
Current plan badge | "Upgrade" link  
Next billing date (if on paid plan)

---

### Settings: WhatsApp

**Current connection status:**  
Large status card:  
If connected: Green circle + "Connected" + phone number + "Active since [date]"  
If not connected: Grey circle + "Not connected"

**Connection guide:**  
Numbered steps with icons showing how to connect WhatsApp Business  

**Test connection button:** sends a test message to merchant's own number  

**Reconnect / Change number** — Secondary outline button

---

---

## Page 8: Promote Store

**URL:** `/dashboard/promoted`  
*(Full spec in File 07 — Admin Dashboard, under "Merchant Bid Flow". This page lives in the merchant dashboard.)*

Brief summary:
- Shows current active promotions (category, period, days remaining)
- Shows merchant's active bids (winning / outbid status)
- "Promote in a new category" flow: select category → view available slots → place bid with duration (7/14/30 days)
- Bid form shows current minimum bid and current highest bid
- Wallet or card payment on winning

**Marketplace Listing page (`/dashboard/marketplace`):**  
- Toggle: "List my store on the Merchat Marketplace" — on/off
- If off: explanation of benefits + eligibility checklist (same criteria as admin approval)
- If on and approved: "Your store is listed ✓" + "View on marketplace →" link
- If on and pending: "Under review — we'll notify you within 48 hours" + checklist of what's pending
- If on and rejected: rejection reason + what to fix + "Re-apply" button

---

## Page 9: Reviews

**URL:** `/dashboard/reviews`

**Header stats (3 cards):**  
Average rating (★ display, large) | Total reviews | Reviews this month

**Review list (newest first):**

Each review card:  
Star rating (5 stars, Warning orange filled)  
Review text (Body M, Grey 800, italic)  
Date (Caption, Grey 400) | "Verified Purchase" badge  
Customer: first name + last initial  

**Reply to review:**  
"Reply" button below each review  
Expands inline textarea: "Your public reply..."  
"Post reply" button — Primary green SM  
Reply is shown publicly on the storefront below the customer review  

**Filter:** All | 5★ | 4★ | 3★ | 2★ | 1★  
Sort: Newest | Oldest | Highest | Lowest

**Empty state:** MessageCircle (64px, Grey 300) + "No reviews yet. Reviews appear here after customers confirm delivery."

---

## Floating Elements (All Dashboard Pages)

### Notification Dropdown

Opens from bell icon in header.  
Width: 360px, max-height 480px, overflow auto  
Border-radius: 2xl, shadow-xl  
Background: White  
Header: "Notifications" | "Mark all read" — Caption, Merchat Green

Notification item (each):  
Icon (36px circle, semantic colour) | text content | timestamp (Caption, Grey 400)  
Unread: White background | Read: Grey 50 background  
Click: marks as read + navigates to relevant page

Types with icons:
- New order: ShoppingBag (green)
- New message: MessageSquare (blue)
- Low stock: AlertCircle (orange)
- Payment: CheckCircle (green)
- System: Info (grey)

"View all notifications" — link at bottom

---

### Contact Support Button (Floating)

**Position:** Fixed bottom-right, 24px from edges, above any other floating elements  
**Appearance:** 52px × 52px circle, Navy Deep background, MessageCircle icon (24px, White)  
**Hover:** scale(1.05) + shadow-lg  
**Tooltip on hover:** "Contact Support" — Caption, white text, Navy Dark bg

**Support Modal (opens on click):**  
Title: "Contact Support" — Heading M  
Pre-filled: merchant name and email (read-only, greyed)  
Subject: dropdown (Technical Issue, Billing Question, Feature Request, General Question)  
Message: textarea, required, min 20 characters  
"Send Message" button — Primary green, full width

**Success state (replaces form):**  
CheckCircle (48px, Merchat Green)  
"Message sent!" — Heading M, Grey 900  
"Our team will respond within 2 hours." — Body M, Grey 600  
Auto-closes modal after 3 seconds

---

### AI Sandbox Modal

Triggered by "Test Your AI" button in header.

**Modal:** max-width 560px, height 640px, border-radius 2xl, shadow-xl

**Header:**  
Background: WA Dark `#128C7E`, border-radius 2xl top  
WA Green circle avatar (40px) with Bot icon inside  
"[Store Name] AI" — Body M, White  
"Sandbox — testing mode" — Caption, `rgba(255,255,255,0.7)`  
X close button (White)

**Chat area:**  
Background: `#ECE5DD` (WhatsApp beige)  
Overflow auto, flex column, gap 12px, padding 16px

Initial AI bubble (received): "Hi! I'm your AI assistant. Ask me anything about your products — just like a customer would."

Message bubbles: same WhatsApp styling as conversations page

**Info banner (below header, in chat area):**  
Caption, `rgba(0,0,0,0.5)`, centred:  
"This is a sandbox. Real customers won't see this conversation."

**Input row:**  
Same as conversations chat input  
Placeholder: "Type as if you're a customer..."

**"Clear conversation" link:** Caption, Grey 400, centred below input

---

## Empty States

All dashboard pages should have thoughtful empty states when there's no data:

**Conversations:** MessageSquare icon (64px, Grey 300) + "No conversations yet" + "Share your store link and customers will start messaging you." + "Copy store link" button (Primary green)

**Orders:** ShoppingBag icon + "No orders yet" + "Orders will appear here when customers buy from your storefront." + "View your storefront" button

**Inventory:** Package icon + "No products yet" + "Add your first product to get started." + "Add Product" button (Primary green)

**Analytics:** BarChart2 icon + "Not enough data yet" + "Analytics will populate once you start getting orders." (no button — just informational)

---

## Loading States

Every data-loading section uses skeleton screens (not spinners) for first load:

Skeleton element: `#F1F3F5` background, `rgba(0,0,0,0.04)` shimmer animation (gradient sweeps left to right, 1.5s loop)

Skeleton shapes match the real content shape:
- Text line: height 16px, border-radius full, varying widths (60-90% of container)
- Card: full card dimensions
- Avatar: circle
- Table row: 4 skeleton text lines

After data loads, skeleton fades out (opacity 0 → 0, 200ms) and real content fades in.
