# Merchat.io — Authentication & Onboarding Spec
**File 4 of 7 | For Claude Design**  
**Reference:** 01_DESIGN_SYSTEM.md for all colours, typography, and component specs.

---

## Overview

This file covers **merchant** authentication and onboarding only.

**Customer authentication** is a separate flow documented in File 06 (Customer Experience) at `/auth/customer/signup` and `/auth/customer/login`. The two auth systems are entirely separate — merchants and customers have different accounts and different dashboards.

Auth URL structure:
- `/auth/login` — merchant login
- `/auth/signup` — merchant signup
- `/auth/forgot-password` — merchant password reset
- `/auth/customer/login` — customer login
- `/auth/customer/signup` — customer signup

This file covers:
1. Merchant login page
2. Merchant signup page
3. Forgot password page
4. Reset password page
5. 7-step onboarding wizard
6. Save & continue later screen
7. Resume onboarding page

All auth and onboarding pages share a consistent two-column layout on desktop, single column on mobile.

---

## Shared Auth Layout

**Desktop:** Two-column split (50/50).  
Left column: dark decorative panel (Navy Deep background with visual elements).  
Right column: white with the form content.

**Mobile:** Single column. No left panel — just the form on white.

### Left Panel (desktop only)

**Background:** Navy Deep `#0B1221`  
**Full height** of viewport  
**Flex column, centred content**  

**Content:**  
Logo: logo-light.svg (icon + wordmark), 160px wide, centred, margin-bottom 48px

**Rotating testimonial** (changes every 5 seconds, fade transition):  
Quote: Body L, White, italic, centred, max-width 280px  
Attribution: Caption, Grey 400, centred, margin-top 16px

Testimonial examples:
- "Set up in 20 minutes, first order that same evening." — Tunde O., Lagos
- "The AI handles my DMs better than I ever could." — Funke A., Abuja
- "Revenue up 40% in 6 weeks. No extra staff." — Amaka C., PH

**Decorative element:**  
At bottom of left panel, a ghost illustration of the meerkat icon (icon-light.svg), 240px, very low opacity (0.06), partially clipped by panel bottom.

**Dots indicator** at bottom-centre: 3 dots, active dot White, inactive dots `rgba(255,255,255,0.3)`, 8px each, gap 6px.

### Right Panel

**Background:** White  
**Overflow:** auto (scrollable if form is taller than viewport)  
**Padding:** 48px on desktop, 24px on mobile  
**Max-width of form:** 400px, centred in panel

**Top of right panel:**  
On mobile: logo-dark.svg, 140px, centred, margin-bottom 32px  
On desktop: no logo (it's on the left panel)  
"Already have an account? Log in" / "Don't have an account? Sign up" — right-aligned, Body S, Merchat Green link

---

## Page 1: Login

**URL:** `/auth/login`

**Form heading:** "Welcome back" — Heading L, Grey 900  
**Subtext:** "Log in to your Merchat dashboard." — Body M, Grey 600  
**Margin-bottom before form:** 32px

### Form Fields

**Email address**  
Label: "Email address"  
Input: type email, placeholder "you@example.com"  
Autocomplete: email

**Password**  
Label: "Password"  
Input: type password, placeholder "Your password"  
Right side of input: Eye/EyeOff toggle to show/hide password  
Autocomplete: current-password

**Row below password:**  
Left: "Remember me" — checkbox (green when checked) + Body S label  
Right: "Forgot password?" — Body S, Merchat Green link → /auth/forgot-password

**Submit button:**  
"Log in" — Primary green, full width, LG size  
Loading state: spinner + "Logging in..."

**Error state:**  
Red banner below button (not field-level for security):  
Error icon (16px) + "Incorrect email or password. Please try again."  
Background: `#FFEBEE`, border-left 3px Error red, border-radius md, padding 12px 16px

**Divider:**  
"— or —" — Caption, Grey 400, centred, margin 24px 0

**Social login (future):**  
"Continue with Google" — outline button, full width, Google logo SVG left (if implemented)  
Note: mark as "Coming soon" and disabled if not yet implemented

**Bottom link:**  
"Don't have an account? **Sign up free**" — Body S, Grey 600, "Sign up free" in Merchat Green → /auth/signup

---

## Page 2: Signup

**URL:** `/auth/signup`

**Form heading:** "Create your account" — Heading L, Grey 900  
**Subtext:** "Start selling on WhatsApp in 15 minutes." — Body M, Grey 600

### Form Fields

**Full name**  
Label: "Full name"  
Placeholder: "Tunde Okafor"  
Autocomplete: name

**Business name**  
Label: "Business name"  
Placeholder: "Tunde's Electronics"  
Helper text: "This will be your store's display name."

**Email address**  
Label: "Email address"  
Placeholder: "tunde@business.com"  
Autocomplete: email

**Password**  
Label: "Password"  
Placeholder: "At least 8 characters"  
Show/hide toggle  
**Strength indicator:** 4-segment bar below input  
Segment colours: Error (weak), Warning (fair), Merchat Green (strong), Merchat Green (very strong)  
Label below bar: "Weak / Fair / Strong / Very strong"

**Confirm password**  
Label: "Confirm password"  
Placeholder: "Re-enter your password"  
Inline validation: green check icon if matches, red X if doesn't match

**Terms checkbox:**  
"I agree to Merchat's **Terms of Service** and **Privacy Policy**"  
Body S, Grey 600. Bold links in Merchat Green.  
Checkbox must be ticked to enable submit button.

**Submit button:**  
"Create account" — Primary green, full width, LG  
Disabled (Grey 400) until all fields valid and terms ticked  
Loading: spinner + "Creating your account..."

**Success state (brief, before redirect):**  
Full-width green banner: CheckCircle icon + "Account created! Taking you to setup..."  
Redirects to /onboarding after 1.5 seconds

**Bottom link:**  
"Already have an account? **Log in**" — Body S, → /auth/login

---

## Page 3: Forgot Password

**URL:** `/auth/forgot-password`

**Form heading:** "Reset your password" — Heading L, Grey 900  
**Subtext:** "Enter your email and we'll send you a link to reset your password." — Body M, Grey 600

### Form

**Email address**  
Label: "Email address"  
Placeholder: "you@example.com"

**Submit button:** "Send reset link" — Primary green, full width

**Success state** (replaces form):  
Large MailCheck icon (48px, Merchat Green)  
Heading: "Check your email" — Heading M, Grey 900  
Body: "We've sent a password reset link to **[email]**. Check your spam folder if you don't see it." — Body M, Grey 600  
Link: "Resend email" — Caption, Merchat Green (with 60-second cooldown: "Resend in 45s")  
Link: "← Back to login" — Caption, Grey 600 → /auth/login

---

## Page 4: Reset Password

**URL:** `/auth/reset-password`  
(Accessed via link in email — contains token in URL)

**Form heading:** "Set a new password" — Heading L, Grey 900  
**Subtext:** "Choose a strong password for your Merchat account." — Body M, Grey 600

### Form

**New password** + strength indicator (same as signup)  
**Confirm password** + match validation

**Submit button:** "Update password" — Primary green, full width

**Success state:**  
CheckCircle icon (48px, Merchat Green)  
Heading: "Password updated!" — Heading M, Grey 900  
Body: "You can now log in with your new password." — Body M, Grey 600  
Button: "Go to login" — Primary green → /auth/login (auto-redirect after 3 seconds)

**Expired link state:**  
AlertCircle icon (48px, Warning orange)  
Heading: "Link expired" — Heading M, Grey 900  
Body: "This password reset link has expired. Request a new one." — Body M, Grey 600  
Button: "Request new link" → /auth/forgot-password

---

## Page 5: Onboarding Wizard

**URL:** `/onboarding`  
**Access:** Authenticated merchants who haven't completed setup (status = 'pending_onboarding')

### Wizard Layout

**Full page — two columns (desktop), single column (mobile)**

**Left sidebar (desktop only, width 280px):**  
Background: Grey 50  
Top: logo-dark.svg, 140px, padding 32px  
Step list: numbered vertical steps  

Each step in sidebar:
- Step number: 24px circle  
- Completed: Merchat Green circle, white checkmark icon  
- Current: Navy Deep circle, white number  
- Upcoming: Grey 200 circle, Grey 400 number  
- Step name: Body S, Grey 800 (current: Grey 900, 600 weight), (completed: Grey 600)  
- Connector line: 1px, Grey 200 (completed: Merchat Green), vertical between circles  

Steps:
1. Business Info
2. Store Setup
3. Add Products
4. Delivery
5. Payment
6. WhatsApp
7. Review & Go Live

**Right content area:**  
Background: White  
Padding: 48px desktop, 24px mobile  
Max-width: 560px, left-aligned within the area

**Mobile step indicator:**  
Horizontal progress bar at top of page  
Merchat Green fill, Grey 200 track, height 4px, border-radius full  
Below bar: "Step [n] of 7 — [Step Name]" — Caption, Grey 600, centred

**Top right (all steps):**  
"Save & continue later" — Ghost button, Grey 600 → triggers save-and-continue flow

---

### Step 1: Business Info

**Heading:** "Tell us about your business" — Heading L, Grey 900  
**Subtext:** "This helps us personalise your AI and storefront." — Body M, Grey 600

**Fields:**

**Business name** *  
Pre-filled if entered during signup  
Placeholder: "Funke's Fashion"

**Business type** *  
Dropdown select  
Options: Fashion & Clothing, Food & Beverages, Electronics & Gadgets, Beauty & Health, Home & Living, Books & Stationery, Kids & Toys, Sports & Fitness, Other

**Business description** *  
Textarea, min-height 100px  
Placeholder: "We sell affordable ankara and ready-to-wear fashion for working women in Lagos."  
Helper: "Your AI will use this to answer customer questions. Be specific about what you sell."  
Character count: "[n]/300 characters"

**Business phone number** *  
Placeholder: "+234 800 000 0000"  
Helper: "Your customers will contact this number. Can be your WhatsApp number."

**City / State**  
Two fields side by side: City text input | State dropdown (36 Nigerian states + FCT)

---

### Step 2: Store Setup

**Heading:** "Set up your storefront" — Heading L, Grey 900  
**Subtext:** "Your storefront is where customers browse and shop." — Body M, Grey 600

**Fields:**

**Store name** *  
Placeholder: "Funke's Fashion Store"  
Helper: "This is what customers see at the top of your storefront."

**Store URL / Slug** *  
Label: "Your store link"  
Prefix: "merchat.io/store/" (shown as prefix outside input, non-editable)  
Input: slug only, e.g. "funkes-fashion"  
Helper: "Only letters, numbers, and hyphens."  
Real-time availability check: green "✓ Available!" or red "✗ Taken" shown as user types  
Auto-suggested from store name (slugified)

**Store tagline**  
Placeholder: "Affordable ankara for every occasion"  
Helper: "A short sentence that describes what you sell. Optional."  
Max 80 characters

**Store logo**  
Upload area: dashed border, Grey 200, border-radius xl, centred content  
Icon: Upload (32px, Grey 400)  
Text: "Click to upload or drag and drop" — Body S, Grey 600  
Sub-text: "PNG, JPG or SVG · Max 2MB" — Caption, Grey 400  
After upload: image preview (120px × 120px circle), "Remove" link

**Store colour** (optional, advanced)  
Label: "Accent colour"  
Helper: "Shown on your storefront buttons."  
Colour swatch options: 6 preset colours (Merchat Green, Navy, Purple, Pink, Orange, Red) + custom colour picker  
Selected: ring border Merchat Green

---

### Step 3: Add Products

**Heading:** "Add your first products" — Heading L, Grey 900  
**Subtext:** "Add at least one product to launch your store. You can add more later." — Body M, Grey 600

**Info banner:**  
Blue info banner: "Your AI will automatically learn about every product you add, including prices, variants, and availability."

**Product list:**  
Cards for each added product:  
Mini card showing: first image thumbnail (40px), product name, price, edit (Edit2 icon) and delete (Trash2 icon) buttons

**"Add Product" button:** + icon, Merchat Green outline button, full width

**Add Product Form (inline expansion or modal):**

Product name *  
Category * (same dropdown as business type)  

Price (₦) *  
Two-column row: Price input | Compare at price (optional, for showing a sale)

Description  
Textarea, placeholder "Describe this product..."

Product images *  
Label: "Product images"  
Helper: "Paste image URLs separated by commas. Use Google Drive, Cloudinary, or any public image host."  
Textarea, placeholder: "https://... , https://... , https://..."

Stock quantity *  
Number input, default 1, min 0

Variants section:  
"Does this product have variants?" — toggle switch  
If on: show variant builder  

Variant builder:
- "Add variant type" dropdown: Size, Colour, Material, Style, Weight, Pack Size
- After selecting type, input appears for the options:
  - Size: multi-select chips (XS, S, M, L, XL, XXL, XXXL)
  - Colour: text inputs with colour picker
  - Others: free text, comma separated
- "Add another variant type" link

Pay on delivery toggle:  
"Accept pay on delivery for this product" — toggle, default off  
When on: small badge preview shows "Pay on delivery available"

Save Product button (Merchat Green) | Cancel (Ghost)

**Minimum:** 1 product required before "Next" is enabled.  
"Skip for now" — Ghost link below Next button (allowed but shows warning: "You won't be able to launch until you have at least one product.")

---

### Step 4: Delivery

**Heading:** "Where do you deliver?" — Heading L, Grey 900  
**Subtext:** "Customers outside your delivery areas will still be able to browse." — Body M, Grey 600

**Delivery areas:**  
Label: "States you deliver to"  
Multi-select checklist of all 36 states + FCT Abuja  
Layout: 3-column grid (desktop), 2-column (mobile)  
Each: checkbox + state name (Body S)  
"Select all" link (right-aligned, Merchat Green) | "Clear all" link  
Selected states show as green pill summary at bottom: "12 states selected"

**Delivery time estimate:**  
Label: "Typical delivery time"  
Dropdown: Same day, 1-2 days, 3-5 days, 1-2 weeks, Varies

**Delivery note:**  
Textarea, optional  
Placeholder: "We use GIG Logistics for deliveries. Delivery fee is calculated at checkout."  
Helper: "This is shown to customers on your storefront."

---

### Step 5: Payment

**Heading:** "How will you accept payment?" — Heading L, Grey 900  
**Subtext:** "Select all that apply. You can update this anytime." — Body M, Grey 600

**Payment method checkboxes (card-style):**

Each payment method is a selectable card:  
Selected: Merchat Green border (2px), green checkmark badge top-right  
Unselected: Grey 200 border, no badge  

Cards:

**Bank Transfer**  
Icon: Building2  
Title: "Bank Transfer"  
Body: "Customers transfer to your account. Most popular in Nigeria."  
[Selected by default]

When selected, expands to show:  
Bank name dropdown (GTBank, Access, Zenith, First Bank, UBA, Fidelity, Sterling, Opay, Kuda, other)  
Account number input  
Account name (auto-populated ideally, otherwise text input)

**Pay on Delivery**  
Icon: Truck  
Title: "Pay on Delivery"  
Body: "Customers pay cash when their order arrives."

**Paystack**  
Icon: CreditCard  
Title: "Paystack"  
Body: "Accept cards, USSD, and bank transfers via Paystack."  
When selected: "You'll connect Paystack in your dashboard settings."  
[Coming Soon badge if not yet integrated]

**Flutterwave**  
Icon: CreditCard  
Title: "Flutterwave"  
Body: "Accept global payments via Flutterwave."  
[Coming Soon badge]

At least one payment method must be selected.

---

### Step 6: WhatsApp Connection

**Heading:** "Connect your WhatsApp" — Heading L, Grey 900  
**Subtext:** "Your AI needs a WhatsApp number to talk to your customers." — Body M, Grey 600

**WhatsApp number field:**  
Label: "Your WhatsApp Business number"  
Placeholder: "+234 800 000 0000"  
Helper: "This is the number customers will message. It should be a WhatsApp Business number."

**Two paths:**

**Path A — I have a WhatsApp Business account:**  
Radio: "I already have WhatsApp Business" (default)  
Shows: number field above  
Link: "How to set up WhatsApp Business →" (external, opens in new tab)

**Path B — Set it up for me:**  
Radio: "Help me set it up"  
Shows info box:  
"Our team will reach out within 24 hours to help you connect your WhatsApp Business account. You can continue and launch your store in the meantime."

**Connection status indicator:**  
Pending: Grey dot + "Not yet connected" — Caption, Grey 400  
Connected: Green dot + "Connected ✓" — Caption, Merchat Green  
(Connected state only shown if API detects successful connection)

**Info callout (blue banner):**  
"Your customers will see your business name when your AI replies — not 'Merchat'. Your brand stays front and centre."

---

### Step 7: Review & Go Live

**Heading:** "You're ready to launch! 🚀" — Heading L, Grey 900  
**Subtext:** "Review your setup before going live." — Body M, Grey 600

**Review cards (summary of all steps):**

Each section is a summary card (White, border Grey 200, border-radius xl, padding 20px):

Header row: section name (Label, Merchat Green) | "Edit" link (Body S, Grey 600, → back to that step)

**Business** card: Business name, type, phone  
**Store** card: Store name, slug (shown as full URL), tagline, logo preview  
**Products** card: "[n] products added", list of product names (first 3, + "and [n] more")  
**Delivery** card: Delivery states listed (condensed), delivery time  
**Payment** card: Payment methods selected  
**WhatsApp** card: Number, connection status

**Launch checklist:**  
Small checklist of required items with green checks or red X:
- ☑ Business info complete
- ☑ At least 1 product added
- ☑ Payment method selected
- ☑ Delivery area selected
- ☐ WhatsApp connected (shows orange warning if not yet connected — can still launch)

**"Go Live" button:**  
Extra large — 60px height, full width, Merchat Green  
Text: "Launch My Store 🚀"  
Subtle glow: shadow-green  
Loading state: "Setting up your store..."

**What happens after clicking:**  
1. Merchant status set to 'active' in database  
2. Redirect to /dashboard  
3. Confetti animation (300 green particles, 1.5 seconds)  
4. Welcome toast: "🎉 Your store is live! Share your link to start getting orders."

---

## Page 6: Save & Continue Later

Shown as a full-screen overlay when "Save & continue later" is clicked.

**Background:** White  
**Layout:** Centred, flex column, padding 48px

**Icon:** Bookmark (64px, Merchat Green), animated pop-in

**Heading:** "Progress saved!" — Heading L, Grey 900, centred

**Body:**  
"You can continue setting up your store anytime using this link:" — Body M, Grey 600, centred

**Resume link display:**  
Full-width box: Grey 50 background, border Grey 200, border-radius lg, padding 16px  
The full resume URL in Mono font, Grey 800, word-break: break-all  
Copy button (Copy icon, 20px, Merchat Green) right-aligned inside box  
Click to copy — icon changes to CheckCircle for 2 seconds + "Copied!" tooltip

**Email confirmation:**  
Info row: MailCheck icon (20px, Merchat Green) + Body S, Grey 600:  
"We've also sent this link to **[merchant@email.com]**"

**Expiry note:**  
Caption, Grey 400, centred: "This link expires in 7 days."

**Buttons:**  
"Continue now" — Primary green, full width (returns to wizard)  
"Go to homepage" — Ghost, Grey 600 → /

---

## Page 7: Resume Onboarding

**URL:** `/onboarding/resume/[token]`

**Loading state:** Full-screen spinner (Merchat Green) + "Resuming your setup..."

**Valid token:** Redirect to /onboarding at the step they left off (with data pre-filled)  
Small toast at top: "Welcome back! Your progress has been restored." — Green toast, 4 seconds

**Expired token (>7 days old):**  
Centred layout:  
AlertCircle (64px, Warning orange)  
Heading: "This link has expired" — Heading L, Grey 900  
Body: "For security, resume links expire after 7 days. Log in to continue your setup." — Body M, Grey 600  
Button: "Log in to continue" — Primary green → /auth/login

**Invalid token (not found):**  
Same treatment but: "This link is invalid or has already been used."

---

## Form Validation Rules

**Across all forms:**
- Required fields marked with * in Merchat Green
- Validation fires on field blur (not on every keystroke, except slug availability and password strength)
- Error messages appear below the field, Caption size, Error red
- Submit button disabled while any required field has an error
- On submit, if errors: scroll to first error and focus it

**Specific validation:**
- Email: must contain @ and valid TLD
- Password: minimum 8 characters
- Phone: Nigerian format (+234 or 0XXXXXXXXXX)
- Store slug: 3-50 characters, only letters/numbers/hyphens, must be available
- Business name: 2-80 characters
- Price: positive number, max 999999999
- Stock quantity: integer, 0 or above
