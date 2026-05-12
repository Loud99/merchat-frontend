# Merchat.io — Admin Dashboard Spec
**File 7 of 7 | For Claude Design**  
**Reference:** 01_DESIGN_SYSTEM.md for all colours, typography, and component specs.

---

## Overview

The Merchat admin dashboard is an internal tool used exclusively by the Merchat operations team. It is not accessible to merchants or customers. It is the command centre for running the platform — approving merchants, resolving disputes, managing promoted slots, monitoring platform health, and configuring system settings.

**URL:** `/admin` (separate subdomain recommended in production: `admin.merchat.io`)  
**Access:** Merchat staff only, role-based access control  
**Design tone:** Dense, functional, information-rich. Less decorative than the public site. Dark sidebar, clean white content area. Optimised for desktop — admin work happens on computers.

---

## Admin Roles

| Role | Access |
|------|--------|
| Super Admin | Full access — all sections, system config, user management |
| Operations | Merchant approval, dispute resolution, marketplace management |
| Finance | Wallet management, payouts, transaction oversight |
| Support | Read-only access to merchants, customers, orders, disputes |

Role badge shown next to admin name in sidebar.

---

## Admin Shell

### Sidebar (width 256px)

**Background:** Navy Deep `#0B1221`  
**Full height, sticky**  
**Padding:** 20px 16px

**Top:**  
logo-light.svg (icon + wordmark, 140px)  
"Admin Console" — Caption, Grey 400, uppercase, letter-spacing 2px  
Divider (Navy Light)

**Navigation sections:**

**Platform:**
| Icon | Label | Route |
|------|-------|-------|
| LayoutDashboard | Overview | /admin |
| Users | Merchants | /admin/merchants |
| UserCheck | Customers | /admin/customers |
| ShoppingBag | Orders | /admin/orders |
| AlertTriangle | Disputes | /admin/disputes |

**Marketplace:**
| Icon | Label | Route |
|------|-------|-------|
| Store | Marketplace | /admin/marketplace |
| Star | Promoted Slots | /admin/promoted |
| CheckSquare | Approvals | /admin/approvals |

**Finance:**
| Icon | Label | Route |
|------|-------|-------|
| Wallet | Wallets | /admin/wallets |
| ArrowUpDown | Payouts | /admin/payouts |
| Receipt | Transactions | /admin/transactions |

**System:**
| Icon | Label | Route |
|------|-------|-------|
| Settings | Configuration | /admin/config |
| BarChart2 | Analytics | /admin/analytics |
| Bell | Notifications | /admin/notifications |
| Shield | Admin Users | /admin/users |

**Active state:** Merchat Green left border (3px) + Green Subtle background + Merchat Green icon/text  
**Hover:** `rgba(255,255,255,0.06)` background

**Bottom of sidebar:**  
Admin name + role badge  
Logout button (Ghost, White)

---

### Top Header

**Background:** White  
**Border-bottom:** 1px Grey 200  
**Height:** 60px  
**Padding:** 0 24px  
**Layout:** Page title (left) | Search (centre, 360px) | Notifications + Admin avatar (right)

**Global search:** Searches across merchants, customers, orders, disputes simultaneously. Results dropdown shows grouped results with type labels.

---

## Page 1: Admin Overview

**URL:** `/admin`

### Platform Health Cards (top row, 4 cards)

| Metric | Value | Trend |
|--------|-------|-------|
| Active Merchants | [n] | +[n] this week |
| Total Orders (30d) | [n] | vs previous 30d |
| GMV (30d) | ₦[amount] | Gross Merchandise Value |
| Open Disputes | [n] | [n] critical (>48hrs) |

Cards: same Metric Card component but with admin-specific colour coding — disputes card shows Warning orange if any critical disputes.

---

### Two-column layout

**Left — Activity Feed (real-time):**  
Heading: "Live Activity"  
Live-updating list (WebSocket or polling every 30s):  

Each activity item:  
Coloured dot (type colour) | Description | Time (relative)  

Types:
- 🟢 New merchant signup
- 🔵 New order placed
- 🟡 Dispute raised
- 🔴 Dispute escalated (>48hrs without merchant response)
- ⚪ Merchant approved
- 🟠 Payout processed

---

**Right — Alerts & Actions Required:**  
Heading: "Needs Attention"  
Background: Warning orange tinted card if any items

Alert items (priority order):

1. **Critical disputes** (>48 hours, no merchant response):  
   "[n] disputes need Merchat review" — Error red  
   "Review now →" — button

2. **Pending merchant approvals:**  
   "[n] merchants awaiting approval"  
   "Review applications →"

3. **Promoted slot auctions ending:**  
   "[n] slots expiring in 24 hours"  
   "View auctions →"

4. **Large payouts pending:**  
   "₦[amount] in payouts pending release"  
   "Review payouts →"

Empty state: CheckCircle (32px, Merchat Green) + "All clear — no actions needed" — Body S, Grey 600

---

### Charts (bottom section)

**GMV Over Time** — line chart, 30 days, daily  
**Orders by Category** — horizontal bar chart  
**New Merchants by Week** — bar chart  
**Dispute Rate** — line chart (disputes / orders %, ideally trending down)

---

## Page 2: Merchant Management

**URL:** `/admin/merchants`

### Filter & Search

Search: business name, email, phone, store slug  
Filter tabs: All | Active | Pending Approval | Suspended | On Marketplace

Status filter pills: Free | Starter | Pro | Custom  
Date range: joined date

### Merchants Table

Columns:
| Column | Content |
|--------|---------|
| Merchant | Logo (28px) + Business name + Slug |
| Contact | Email + WhatsApp |
| Plan | Badge (colour-coded) |
| Status | Badge: Active / Pending / Suspended |
| Marketplace | "Listed" badge or "Not listed" |
| Orders (30d) | Number |
| GMV (30d) | ₦ amount |
| Internal Score | [see below] |
| Joined | Date |
| Actions | ··· |

---

### Internal Merchant Score System (Admin-Only)

**The score is never shown to merchants or customers.** It is used internally to rank merchants in marketplace results (non-promoted), flag at-risk merchants, and trigger reviews.

**Score: 0–100, starting at 70 for new merchants**

**Score modifiers:**

| Event | Score Change |
|-------|-------------|
| Order fulfilled on time | +1 (max +20/month) |
| Positive customer review (4–5★) | +2 |
| Neutral review (3★) | 0 |
| Negative review (1–2★) | -3 |
| Dispute raised against merchant | -5 |
| Dispute resolved by merchant (customer satisfied) | +3 |
| Dispute escalated to Merchat | -8 |
| Dispute resolved against merchant (Merchat decision) | -10 |
| Merchant failed to refund after adverse decision | -15 |
| Merchant responds to dispute within 24hrs | +2 |
| No response to dispute within 48hrs | -5 |

**Score thresholds:**

| Score | Status | Action |
|-------|--------|--------|
| 80–100 | Excellent | Eligible for marketplace featured banner (organic) |
| 60–79 | Good | Standard marketplace listing |
| 40–59 | At Risk | Warning notification sent to merchant, support team alerted |
| 20–39 | Poor | Marketplace listing suspended, team review triggered |
| 0–19 | Critical | Platform suspension, funds frozen, Merchat review required |

**Score display in admin table:**  
Coloured pill: Green (80+) | Blue (60-79) | Orange (40-59) | Red (20-39) | Dark Red (0-19)

**Score history (in merchant detail):**  
Timeline chart showing score over time, with event annotations ("Dispute raised", "Dispute resolved", etc.)

---

### Merchant Detail Page

**URL:** `/admin/merchants/[merchant-id]`

**Header:**  
Merchant logo (64px) + Business name (Heading L) + Status badge  
Internal Score badge (prominent, coloured)  
Action buttons: "Suspend Merchant" (Error red) | "Send Warning" (Warning orange) | "Approve for Marketplace" (Primary green)

**Tabs:** Overview | Orders | Disputes | Transactions | Score History | Notes

**Overview tab:**  
Business info: name, type, email, phone, WhatsApp, store slug  
Plan and billing info  
Joined date, last active  
Marketplace status: listed / not listed / pending approval  
Promoted slots: active promotions  

**Orders tab:**  
Full paginated orders table filtered to this merchant  

**Disputes tab:**  
All disputes involving this merchant, status, resolution  

**Transactions tab:**  
All financial transactions — orders paid, payouts, wallet movements  

**Score History tab:**  
Line chart of score over time  
Event log: each score change with reason, date, linked order/dispute  

**Notes tab:**  
Internal notes by admin team (not visible to merchant)  
Add note: textarea + "Add Note" button  
Notes show: author (admin name) + timestamp + note content  

---

## Page 3: Merchant Approvals (Marketplace)

**URL:** `/admin/approvals`

### Approval Queue

**Heading:** "Marketplace Applications" — Heading M  
"[n] pending review" — Caption, Grey 600

Filter tabs: Pending | Approved | Rejected

### Application Card

Each pending application:

**Merchant info block:**  
Logo | Business name | Category | Date applied  
Plan badge | Store slug (clickable → opens storefront in new tab)

**Automated checklist** (shown with pass/fail for each criterion):
- ✅ / ❌ Active products (minimum 5)
- ✅ / ❌ Profile complete (logo, tagline, description, phone, delivery areas)
- ✅ / ❌ Minimum orders (at least 10 completed orders)
- ✅ / ❌ No disputes in last 30 days
- ✅ / ❌ No recent disputes unresolved
- ✅ / ❌ Internal score > 60

**Auto-approve:** If all criteria pass AND score > 70, show "Eligible for auto-approval" badge. Admin can click "Auto-approve all eligible" at top of queue.

**Admin actions:**  
"Approve" — Primary green button  
"Reject" — Ghost, Error red, requires rejection reason dropdown:  
- Insufficient products
- Incomplete profile
- Recent disputes
- Score too low
- Manual review required

"Request more info" — Secondary outline, sends WhatsApp to merchant asking them to complete missing criteria

Approval/rejection triggers WhatsApp notification to merchant.

---

## Page 4: Disputes

**URL:** `/admin/disputes`

### Overview

**4 stat cards:**  
Open disputes | Resolved this week | Avg resolution time | Escalated to Merchat

### Dispute Queue

**Priority order:** Critical (>48hrs, merchant no response) → Escalated → Active → Resolved

**Filter:** All | Open | Escalated | Resolved | Closed (auto-released)  
Search: order #, customer phone, merchant name

### Dispute Row

| Column | Content |
|--------|---------|
| Dispute # | Reference |
| Order # | Linked order |
| Merchant | Name |
| Customer | Name + phone |
| Reason | Badge (Wrong item, Damaged, Not received, etc.) |
| Raised | Date |
| Deadline | Merchant response deadline + countdown |
| Status | Open / Merchant Responded / Escalated / Resolved |
| Funds | ₦ amount frozen |
| Action | "Review" button |

**Critical row highlighting:** Red left border (4px) + Warning orange row background tint for disputes past 48hr merchant deadline

---

### Dispute Detail Page

**URL:** `/admin/disputes/[dispute-id]`

**Header:**  
"Dispute #D-2024-1234" — Heading L  
Status badge | Funds frozen badge (₦ amount)  
"Created [date]" | "Merchant deadline: [date + countdown]"

**Two-column layout:**

**Left column:**

*Customer's claim:*  
Reason | Description (full text) | Photos uploaded (clickable to expand)  
Customer WhatsApp — "Contact" button

*Merchant's response* (if submitted):  
Response text | Photos (if any)  
"No response yet — deadline: [date]" (Warning orange if approaching/passed)

*Order details:*  
Mini order summary (items, amount, delivery address, merchant)  
Delivery address confirmed? Status

*Timeline:*  
Event log: dispute raised, merchant notified, merchant responded, escalated, etc.

---

**Right column:**

*Frozen funds:*  
Amount: ₦[x] — large, Warning orange  
Currently held since: [date]

*Admin actions:*

**If merchant has responded and customer is satisfied:**  
"Release funds to merchant" — Primary green  
Funds released, order closed

**If merchant has NOT responded within 72 hours:**  
Red alert: "Merchant missed deadline. Merchat review required."  
"Rule in favour of customer (full refund)" — Error red  
"Rule in favour of merchant (release funds)" — Primary green  
"Extend deadline by 24 hours" — Warning orange (with reason required)

**If requiring partial resolution:**  
"Issue partial refund" — shows amount input  
"₦[x] refund to customer | ₦[y] to merchant"

**Ruling notes:**  
Textarea: "Admin ruling notes (not shown to parties)"  
These notes save to the dispute record and affect the merchant's internal score automatically.

**Score impact preview:**  
"This ruling will affect [Merchant Name]'s score by [+/-X] points. New score: [Y]"  
Shown before confirming ruling.

*After ruling:*  
WhatsApp notifications sent automatically to both merchant and customer.  
If refund: customer wallet credited (locked until return confirmed if return required).

---

### Return Confirmation

When a refund requires a return, admin sees a "Pending Return" status:  
Return requested on: [date]  
Return deadline: [date + 7 days]  
Merchant confirmation: "Confirm item received" button (or merchant does this in their dashboard)  
On confirmation: wallet unlocked, customer notified

---

## Page 5: Promoted Slots (Marketplace)

**URL:** `/admin/promoted`

### Overview

**3 stat cards:**  
Active promotions | Revenue this month (from promotions) | Available slots

### Slots by Category

For each category, a section showing:

Category name + icon | "3 slots max"

**Slot grid (3 slots):**

Each slot card:

**Occupied slot:**  
Background: Green Subtle  
Merchant logo + name  
"Active" badge — Merchat Green  
Period: "14 days · Ends [date]"  
Amount paid: ₦[x]  
"End early" button (Ghost, Error red) | "View merchant" link

**Empty slot:**  
Background: Grey 50, dashed border  
"Available" — Caption, Grey 400  
"No active bid" or "[n] bids in auction"  
"View bids" button (if bids exist)

---

### Auction Management

**URL:** `/admin/promoted/auctions`

**Active auctions table:**

| Column | Content |
|--------|---------|
| Category | Name |
| Slot | #1, #2, or #3 |
| Current high bid | ₦[amount] |
| Merchant | Highest bidder |
| Bids | Count |
| Minimum bid | ₦[config] |
| Ends | Date/time |
| Status | Active / Closing soon / Ended |

Clicking an auction → opens auction detail:  
Full bid history (newest first): Merchant name | Bid amount | Time | Duration selected  
"Award slot" button — assigns slot to highest bidder (auto on auction end, or manual)  
"Cancel auction" — Ghost, Error red

---

### Merchant Bid Flow (Merchant Dashboard → Promoted Slots)

This is the merchant-side interface (inside /dashboard/promoted):

**Heading:** "Promote your store on the Merchat marketplace"

**Category selector:**  
"Select a category to promote in:" — your business category is pre-selected  
Other categories can also be selected (in case merchant sells across categories)

**Available slots display (per selected category):**  
3 slot cards:  
Occupied: greyed out + "Taken until [date]"  
Available: green border + "Available now"

**Bid form (for available slots):**

Current minimum bid: "₦10,000 minimum" — Heading S, Warning orange  
Current highest bid: "₦[x]" (shown to encourage competitive bidding)  
Your bid: ₦ input (must be > current highest + ₦500 increment minimum)

**Duration selector:**  
3 radio cards:  
7 days — ₦[bid amount] | 14 days — ₦[bid × 1.8] | 30 days — ₦[bid × 3.5]  
(14 and 30 day multipliers configured in admin)

**Bid summary:**  
"Your bid: ₦[amount] for [duration]"  
"If you win, payment of ₦[amount] will be charged from your Merchat balance or card."  
"Place Bid" — Primary green

**Active bids section:**  
If merchant has active bids: "Your current bids" table  
Category | Bid amount | Duration | Status (Winning / Outbid / Won | Active)  
"Increase bid" button if outbid

**Active promotions section:**  
If merchant has won slots: "Your active promotions"  
Category | Started | Ends | Days remaining | ₦ paid  

---

### Promotion Configuration

**URL:** `/admin/config/promotions`

Admin configurable settings:

| Setting | Default | Description |
|---------|---------|-------------|
| Minimum bid | ₦10,000 | Per slot, per auction |
| Minimum bid increment | ₦500 | Minimum raise per bid |
| Max slots per category | 3 | Promoted slots shown |
| Duration options | 7, 14, 30 days | Available to merchants |
| 14-day multiplier | 1.8× | Relative to 7-day bid |
| 30-day multiplier | 3.5× | Relative to 7-day bid |
| Auto-award on auction end | On | Automatically assigns slot |
| Auction cooldown (after slot expires) | 24 hours | Before next auction starts |

---

## Page 6: Wallet & Finance Management

**URL:** `/admin/wallets`

### Overview Cards

Total wallet balances held (customers) | Locked funds (in dispute) | Pending payouts (merchants) | Platform revenue (promotion fees + any platform cut)

### Customer Wallets

Search: customer name or phone  
Table: Customer | Balance | Locked amount | Last topped up | Last spent

Customer wallet detail (on click):  
Full transaction history  
Manual adjustment (with required reason) — Super Admin only  
"Freeze wallet" option if fraud suspected

---

### Merchant Payouts

**URL:** `/admin/payouts`

The cool-off period means merchant funds are held by Merchat for 48 hours after delivery confirmation.

**Pending payouts table:**

| Column | Content |
|--------|---------|
| Merchant | Name |
| Order # | Linked order |
| Amount | ₦ |
| Delivered | Date merchant marked delivered |
| Review sent | Date WhatsApp review sent to customer |
| Release date | Delivery date + 48hrs |
| Status | Cooling off / Ready to release / Released / Frozen (dispute) |

**Bulk release:** "Release all eligible payouts" — Primary green  
Releases all payouts where:
- Cool-off period has passed (48 hours)
- Customer confirmed delivery OR 48hr window expired with no dispute
- No active dispute on the order

**Individual release:** "Release" button per row (if eligible)

**Frozen payouts (dispute active):** Warning orange row | "View dispute" link

**Payout method:** Bank transfer to merchant's registered account (configured in merchant settings)

---

### Transaction Ledger

**URL:** `/admin/transactions`

Full platform transaction log:

Filter: Date range | Type | Merchant | Customer | Status

| Column | Content |
|--------|---------|
| Ref # | Transaction reference |
| Type | Order Payment / Payout / Refund / Wallet Top-up / Promotion Fee |
| From | Customer / Merchat / Merchant |
| To | Merchant / Customer / Merchat |
| Amount | ₦ |
| Date | Timestamp |
| Status | Completed / Pending / Failed |

Export: CSV | Excel

---

## Page 7: Customer Management

**URL:** `/admin/customers`

Search: name, email, WhatsApp number  
Table: Name | WhatsApp | Email | Orders | Total spent | Wallet balance | Joined | Status

**Customer detail:**  
Full profile, order history, wallet transactions, dispute history, reviews submitted

**Admin actions:**  
Freeze account (if fraud) | View linked orders | Manually credit/debit wallet (with reason, Super Admin only)

---

## Page 8: System Configuration

**URL:** `/admin/config`

### General Settings

| Setting | Value | Notes |
|---------|-------|-------|
| Fund cool-off period | 48 hours | Hours between delivery and payout |
| Dispute window | 48 hours | Customer time to raise dispute |
| Merchant dispute response time | 72 hours | Before Merchat intervenes |
| Return window | 7 days | Customer time to return item |
| Receipt expiry | 30 days | After order delivery |
| Onboarding token expiry | 7 days | Save-and-continue link lifespan |
| Minimum wallet top-up | ₦1,000 | Customer wallet |
| Minimum merchant score for marketplace | 60 | Below = auto-removed from listing |
| Merchant score for suspension | 20 | Below = platform suspension |

Each setting: label + current value + edit button (opens inline edit with confirmation)

### Notification Templates

Edit the WhatsApp message templates sent for each event:  
Order confirmed | Shipped | Delivered | Review request | Dispute raised | Dispute resolved | Refund | Payout | Low score warning

Each template: textarea with variable placeholders (`{{merchant_name}}`, `{{amount}}`, etc.)  
"Preview" button shows sample with dummy data  
"Save" saves to database

### Marketplace Categories

Add / edit / reorder marketplace categories  
Each: name, icon (Lucide icon name), colour, sort order, active toggle

### Admin User Management

**URL:** `/admin/users`

Table of admin users: Name | Email | Role | Last active | Status  
"Add admin user" — Primary green  
Role assignment: dropdown per user  
"Deactivate" — removes access without deleting record

---

## Page 9: Platform Analytics

**URL:** `/admin/analytics`

### Time range selector (top right)

Today | 7 days | 30 days | 90 days | Custom range

### Metric cards (top row, 6)

GMV | Orders | New merchants | New customers | Dispute rate | Platform revenue

### Charts

**GMV Over Time** — line chart, daily granularity  
**Orders by Category** — horizontal bar (Fashion leads, etc.)  
**Merchant Growth** — bar chart (new merchants per week)  
**Customer Growth** — bar chart  
**Dispute Rate Over Time** — line chart (% of orders disputed — target <2%)  
**Marketplace vs Direct** — donut (orders from marketplace vs direct store links)  
**Promotion Revenue** — bar chart (monthly promotion fees collected)  
**Geographic Distribution** — horizontal bar chart (orders by state)

### Cohort Analysis

**Merchant retention:**  
Table showing % of merchants who are still active at 1 month, 3 months, 6 months after joining

**Customer repeat purchase:**  
% of customers who placed a 2nd order within 30 days, 60 days, 90 days

---

## Design Notes for Admin Dashboard

**Density:** Admin tables are information-dense. Use smaller type (Body S / Caption) for table content. Row height: 48px. Compact padding.

**Colour coding:** Use semantic colours consistently across the admin:
- Merchat Green: positive, confirmed, approved, released
- Warning orange: pending, at-risk, approaching deadline
- Error red: critical, overdue, suspended, fraud
- Info blue: informational, neutral status

**Data tables:** All tables support:
- Column sorting (click header)
- Pagination (25 rows default, adjustable to 50/100)
- Row selection checkboxes (for bulk actions)
- CSV export of current view

**Empty states:** Same icon + message pattern as merchant dashboard, but with admin context.

**Confirmation modals:** All destructive actions (suspend merchant, release funds, override dispute) require a confirmation modal listing what will happen and who will be notified. Log all admin actions with admin name + timestamp.

**Audit log:** Every significant admin action is logged to an immutable audit trail (admin name, action, affected entity, timestamp). Accessible at `/admin/audit`.
