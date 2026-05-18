# Frontend Page-by-Page Review

Built for manual testing the manual payout flow and all connected UX.

---

## ✅ / (Homepage)

**What it does:** Landing page with hero, company intro, value props, featured services, how-it-works.

**Trust signals:**
- "100% Real human workers" claim — ✓ matches backend (no bots)
- "Escrow until delivery confirmed" — ✓ matches escrow system
- "24/7 Support" — contact form exists in dashboard

**Issues for testing:**
- `FEATURED_PLATFORMS` has hardcoded prices (e.g., Instagram Followers "from $2.99") that may not match actual `services.ts` packages. Test that links work and prices match.
- No nav link to `/earnings` or `/my-tasks` — workers must discover via dashboard. Consider adding "Worker Login" CTA.

---

## ✅ /pricing (Service Catalog)

**What it does:** Full service browser with class sidebar, platform sub-filters, search, package previews.

**UX notes:**
- Clean filter system: class → platform → search. Reset button on active filters.
- Package cards show "starting from" and "most popular" prices. Links to `/services/[slug]`.

**Issues for testing:**
- `service.deliveryTime.split(",")[0]` — if deliveryTime has no comma, whole string shows. Fine for current data.
- Mobile: class selector is a `<select>`, desktop is sidebar buttons. Test both breakpoints.

---

## ✅ /services/[slug] (Service Detail + Order Form)

**What it does:** Two modes: **Review order** (3-step wizard) or **Standard package selector**.

### Review Mode (e.g., Google Reviews)
- **Step 1:** Business name, profile URL, country dropdown (48 countries), gender preference
- **Step 2:** Quantity pills (5/10/25/50/100/200/500) + custom, live price calculation, gender pills with hints
- **Step 3:** Star rating (driven by `reviewConfig.starOptions`), special instructions, email, order summary

**Trust signals:**
- "Each review is written by a real person from a real account" — ✓
- Gender preference hints: "Hair salons, nail spas…" for Female — helpful context
- Live price updates: `${finalQty} reviews × $${pricePerUnit}` — transparent

**Issues for testing:**
- **Step progress bar:** Clicking step 2 from step 3 requires `businessUrl` to be set — logic at line 303: `if (s < step || (s === 2 && businessUrl))` — but step 3 can't go back to step 2 without `businessUrl` which should always be true after step 1. OK.
- **Star rating in Step 3:** The star rating selector appears AFTER the order summary. The summary already shows `reviewRating` from initial state. If user changes stars in step 3, summary doesn't update. **Minor UX issue** — summary should react to `reviewRating` state change.
- **Gender default:** Defaults to "ANY" which is correct for most businesses.
- **Country:** Defaults to "US" (first in list). For non-US businesses this is a friction point — worker tasks filter by `businessCountry` so wrong country = no worker match.

### Standard Mode (e.g., Instagram Followers)
- Package selector with radio-style cards
- "Popular" badge on recommended package
- Summary box showing qty + price + delivery
- "Order [qty] [service name] — $[price]" CTA

**Issues for testing:**
- Link goes to `/order-review?service=...&qty=...&price=...` — this is the checkout page for non-review services too. Naming is slightly confusing but functional.

---

## ✅ /order-review (Checkout — Non-Review Services)

**What it does:** Guest checkout form for standard services (followers, likes, etc.).

**Fields:** Target URL, name (optional), email (required).
**Trust signals:**
- "Public account required" warning shown when `orderConfig.requiresPublicAccount`
- Green checkmarks on features included
- SSL encrypted badge

**Issues for testing:**
- Uses raw `fetch` instead of `apiGuestPost` — inconsistent with rest of app. Works but not following pattern.
- Payment section says "Secure payment via Stripe" but actual Stripe integration is placeholder (simulated payment). **Must be clearly marked during testing.**
- Price shown as `$${price.toFixed(2)}` — fine.
- **No order cancellation option** from this page — once submitted, user goes to `/order-confirm`.

---

## ✅ /order-confirm (Post-Checkout)

**What it does:** Two states — pre-payment (show order summary + pay button) and post-payment (success + account creation CTA).

**Pre-payment state:**
- Order summary card with service, qty, total
- "Secure Payment via Stripe" section with placeholder warning
- Simulated pay button (1200ms timeout)

**Post-payment state:**
- Success banner with green checkmark
- **Path A:** "Save my order to an account" → `/save-order?token=...`
- **Path B:** "Track this order as a guest" → `/track/[token]`
- Tracking link displayed

**Issues for testing:**
- **Placeholder payment is TOO easy to click** — no Stripe elements, just a button. For real testing, this will simulate payment immediately. **Document this as a known placeholder.**
- After simulated payment, `setPaid(true)` triggers re-render. No actual payment processing.
- `price` is computed from `order.totalPrice` which may be a Decimal string from Prisma — handled with `typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice)`. Should work.

---

## ✅ /save-order (Post-Checkout Account Creation)

**What it does:** Converts guest order into registered account.

**Flow:**
1. Extracts email + first name from order via `/orders/track/${token}`
2. Shows pre-filled email in green banner (read-only from order)
3. User enters password + optional first name
4. Registers as `role: "client"`, claims order via `/orders/claim`
5. Redirects to `/dashboard`

**Trust signals:**
- "Order found for [email]" — confirms identity
- Minimal form — only password required

**Issues for testing:**
- If order doesn't exist or token is wrong, shows "Invalid link" with no retry. OK for edge case.
- `firstName` is optional but auto-populated from `guestName.split(" ")[0]` — may be empty string if no guest name. Fine.
- **No "resend confirmation email" option** — not critical for MVP.

---

## ✅ /track/[token] (Order Tracking — Guest)

**What it does:** Real-time(ish) order tracking with auto-refresh every 30 seconds.

**Features:**
- Progress bar with percentage
- Order details grid (ID, qty, platform, service, date, status)
- Timeline with step completion checkmarks
- CTA to create account or sign in

**Trust signals:**
- Auto-refresh shows "live" status
- Timeline visualizes delivery pipeline
- "Manage your order in your dashboard" upsell

**Issues for testing:**
- Auto-refresh every 30s is good for demo but wasteful. Fine for testing.
- `progress` calculation: `Math.round((completedTasks / totalTasks) * 100)` — if `totalTasks` is 0, shows 0%. Edge case for new orders.
- **Timeline step "completed" only fires when status === "COMPLETED"** — what about "PARTIALLY_COMPLETED"? Shows as incomplete. Might confuse users.
- No estimated completion time shown. Would be nice: "Expected delivery: [deliveryTime]".

---

## ✅ /orders (Order Lookup by Email)

**What it does:** Public page — enter email, see all orders for that email.

**Features:**
- Email input + lookup button
- Results show order cards with progress bars, status pills, links to track pages
- "Create free account" upsell at bottom

**Trust signals:**
- No login required — frictionless for guest users
- Shows order count, pricing, dates

**Issues for testing:**
- Uses `STATUS_STYLES` from constants — if backend sends unknown status, falls back to processing style.
- Progress bar same calculation as track page.
- **No pagination** — if user has many orders, page gets long.

---

## ✅ /login

**What it does:** Authentication with redirect handling.

**Features:**
- Email + password
- "Forgot password?" link
- Redirect after login (preserves `?redirect=` and `?token=` for guest order claiming)
- Role-based redirect: workers → `/dashboard?view=worker`, clients → `/dashboard`

**Trust signals:**
- Clear error messages from API
- "Remember it? Sign in" helper text

**Issues for testing:**
- If `trackingToken` is present, auto-calls `/orders/claim` after login — test this flow end-to-end.
- `apiGuestPost` for login, `apiPost` for claim — correct separation.
- Password field has no "show password" toggle. Minor UX gap.

---

## ✅ /register

**What it does:** Account creation with role selection.

**Features:**
- Role selector: Client ("Grow my social presence") vs Worker ("Earn by completing tasks")
- First name, last name, email, password
- Worker-specific: terms agreement checkbox, gender selection (optional), worker agreement text

**Trust signals:**
- Worker agreement explicitly states "no bots, no automation, no fake proof"
- Gender marked as "optional — used for review task matching"
- Terms and Privacy links open in new tab

**Issues for testing:**
- Terms checkbox is **required** for workers but not for clients. This is correct per business logic.
- Gender buttons are toggle-able (click again to deselect) — good, it's optional.
- Password only requires 8 chars, no complexity indicator. Backend Zod schema may enforce more.

---

## ✅ /forgot-password

**What it does:** Email-based password reset request.

**Features:**
- Email input
- Success state: "Check your inbox" with email obfuscation

**Trust signals:**
- "If [email] has an account, we've sent a link" — doesn't reveal whether email exists. Good security.
- "Check spam folder too" — helpful

**Issues for testing:**
- Uses raw `fetch` instead of `apiGuestPost`. Inconsistent but works.
- Success state shows indefinitely (no auto-redirect). User must click "Back to sign in". OK.

---

## ✅ /reset-password

**What it does:** Password reset with token validation.

**Features:**
- Token from URL (`?token=`)
- New password + confirm password
- 8 character minimum
- Success state with auto-redirect to `/login` after 3 seconds

**Issues for testing:**
- No password strength meter.
- Auto-redirect after 3s is good UX.
- Token missing shows "Invalid link" with link to request new one.

---

## ✅ /dashboard (Client + Worker)

### Client View
- Stats: Total Orders, Active, Completed
- Order list with progress bars, status pills, "View details" links
- **Contact Form** (expandable accordion): message + optional order selector, sends to `/contact`
- "Place new order" CTA

**Trust signals:**
- Progress bars show real-time completion percentage
- Contact form has order context selector — shows we track relationships

**Issues for testing:**
- `order.totalPrice` may be Decimal from Prisma — displayed with `.toFixed(2)`. Fine.
- Contact form `apiPost("/contact", ...)` — this hits the gateway directly, not a service proxy. Gateway handles it. OK.
- Empty state shows "Browse Services" button.

### Worker View
- Stats: Available Tasks, In Progress, Completed
- Quick nav: "My Tasks" + "Earnings" buttons
- **Task Feed** (expandable cards):
  - Category badge, platform, review badge, gender badge
  - Instructions, business details, review requirements
  - Email input for review tasks (Gmail required, validated on backend)
  - "I understand — Accept Task" button

**Trust signals:**
- Gender badges: "♀ Suggested: Female" / "♂ Suggested: Male" — soft language, not enforced
- Review task email warning: "must not have reviewed this business before. It will be recorded." — clear consequence
- "I understand" prefix on accept button — acknowledges rules

**Issues for testing:**
- `inProgress` count: `myTasks.filter((t: any) => t.status === "ASSIGNED" || !t.status)` — the `!t.status` fallback is defensive but shouldn't happen with current API shape.
- **Gender badge shows on feed but doesn't actually filter tasks** — the backend `getFeed` doesn't filter by worker gender. The badge is informational only. Worker may accept a task requiring different gender. Backend doesn't enforce.
- **Task expiry timer not shown on dashboard** — only on `/my-tasks/[id]`. Workers can't see which tasks expire soon from the feed.
- **No earnings summary on worker dashboard** — just a link to `/earnings`. Would be nice to show "$X available" as a stat card.

---

## ✅ /my-tasks (Task List)

**What it does:** Worker's task management with tabs.

**Tabs:**
- **Active:** ASSIGNED tasks with live countdown timer
- **Submitted:** SUBMITTED tasks awaiting review
- **Completed:** PAID + REJECTED tasks

**Features:**
- Live countdown: "⏳ 14m 32s remaining" updates every second
- Task cards link to detail page
- Empty states with contextual messages + "Browse Task Feed" CTA

**Trust signals:**
- Timer creates urgency without being aggressive
- "Awaiting review" for submitted tasks sets expectation
- "✓ Paid — $X.XX" / "✗ Rejected" clear outcomes

**Issues for testing:**
- Timer: `formatTimeLeft` uses `expiresAt` string. If `expiresAt` is undefined, `new Date(undefined)` is "Invalid Date" and shows "Expired". Should handle missing `expiresAt`.
- **Tab counts:** `tasks.filter((task) => t.statuses.includes(task.status || ""))` — `task.status` from API is now a string (from `toTaskItem`). Should match.
- **Rejected tasks shown in "Completed" tab** — may confuse workers. Separate "Rejected" tab would be clearer.

---

## ✅ /my-tasks/[id] (Task Work Page)

**What it does:** Single task view with proof submission.

**States:**
- **Active + not expired:** Instructions + proof form (URL + text)
- **Active + expired:** "⏰ Expired — task will be reassigned soon"
- **Submitted:** Shows proof URL link, "awaiting admin review" message
- **Paid:** Green banner "✓ Verified & Paid" + amount credited
- **Rejected:** Red banner with rejection reason

**Trust signals:**
- Review requirements clearly displayed: star rating, content guidance
- Proof form has helpful placeholders: "Screenshot shows verified purchase badge"
- Expired state explains consequence (reassignment)

**Issues for testing:**
- Proof URL input accepts any text (type="url" validates format but not domain). Could accept broken links.
- **No image upload** — workers must use external image host (imgur, etc.). This is by design but adds friction.
- **After submit, page auto-refreshes task** — good.
- **No "cancel task" button** — if worker realizes they can't complete, they can't release it. They have to wait for expiry.

---

## 🔥 /earnings (MANUAL PAYOUT — NEW)

**What it does:** Central hub for worker earnings and withdrawals.

### Balance Section
- Available Balance (large number)
- Total Earned (green)
- Total Spent, Withdrawn, Pending (smaller stats)

### Withdraw Action
- CTA button: "Withdraw" (disabled if balance < $10, shows "Need $X.XX more")
- Collapsible form:
  - Amount input (min 10, max balance, step 0.01)
  - Method selector: PayPal / Mobile Money (toggle buttons)
  - Account details: PayPal email or Mobile Money number (label changes dynamically)
  - Submit: "Request $X.XX Withdrawal"

### Withdrawal History
- Cards per request with status badge:
  - **PENDING:** "Pending Review" (yellow)
  - **APPROVED:** "Approved — Awaiting Payment" (blue)
  - **REJECTED:** "Rejected — Refunded" (red) + admin notes
  - **PAID:** "Paid — Confirm Receipt" (green) + payment proof link + confirm/dispute buttons
  - **DISPUTED:** "Disputed" (red) + dispute reason
  - **RESOLVED:** "Resolved" (green)

### Confirmation/Dispute Flow
1. Worker clicks "Confirm Receipt" on PAID request
2. Two buttons appear: "Yes, Received" (green) / "No, Dispute" (red)
3. Dispute requires text reason (textarea)
4. Submit calls `/wallet/withdrawals/confirm`
5. History refreshes

### Transaction History
- DEPOSIT (blue), REWARD (green), WITHDRAWAL (red), ESCROW (neutral)
- Amount with +/- prefix
- Date + status

**Trust signals:**
- Minimum withdrawal prominently displayed: "$10.00 minimum"
- "Processed in 3-5 business days" sets expectation
- Status badges are color-coded and descriptive
- Payment proof link: "View Payment Proof →" — transparency
- Dispute flow requires explicit reason — prevents frivolous disputes

**Issues for testing:**
- **Amount field:** `parseFloat(amount)` — if user enters "abc", returns NaN and form error won't catch it (checks `!amt || amt < 10`). NaN is falsy so it shows "Minimum withdrawal is $10.00". Should explicitly check `isNaN(amt)`.
- **Account details:** No format validation. PayPal email accepts "not-an-email", mobile money accepts any string. Backend Zod should catch invalid emails.
- **Transaction `amount`:** Uses `tx.amount.toFixed(2)` — assumes number. If Prisma returns Decimal as string, this breaks. Backend service uses `Number()` in `toTaskItem` but transactions come from `wallet.me` which may have raw Prisma decimals. **Test this.**
- **Payment proof URL:** Links open in new tab. If admin hasn't uploaded proof yet, link may be broken. Should check `paymentProofUrl` exists before rendering link.
- **Withdrawal request amount deducted immediately from balance** — backend holds it in `pendingBalance`. UI shows `balance` from `wallet.me` which should already reflect deduction. Verify: after requesting $20 from $50, balance shows $30.
- **No "cancel withdrawal request" button** — worker can't cancel a pending request. If they made a mistake, they must wait for admin rejection.

---

## Shared Components

### Spinner.tsx
- `Spinner` (sm/md/lg) — used throughout
- `FullPageSpinner` — used on all loading states

### ErrorBanner.tsx
- Simple red banner with message
- Used on all error states

### NavBar (not reviewed but referenced)
- Should have links to `/dashboard`, `/pricing`, `/orders`
- Worker nav should show `/my-tasks`, `/earnings`
- No hamburger menu reviewed

---

## Type Safety Issues

1. **`TaskItem.proof`**: Type has `screenshotUrl?: string` but backend `toTaskItem` doesn't set it. Field is `proofUrl`. Frontend references `proofUrl` in my-tasks/[id] — correct. But type definition has unused `screenshotUrl`.

2. **`Order.serviceType`**: Type has nested `{ platform?: { name: string } }` but some pages access `order.platform` directly (string). Two shapes exist: one from Prisma (nested) and one from service transform (flat). **Ensure consistency.**

3. **`WithdrawalRequest`**: Type has `workerConfirmed: boolean` but backend model may return null/undefined for new requests. Default in transform should be `false`.

---

## Critical Test Scenarios

### Manual Payout Flow
1. Worker completes task → gets paid → balance increases
2. Worker visits `/earnings` → sees balance ≥ $10
3. Clicks "Withdraw" → enters $15, selects PayPal, enters email
4. Submits → balance decreases by $15, request shows "Pending Review"
5. Admin (via API or future admin UI) calls `POST /wallet/withdrawals/review` → approves
6. Request shows "Approved — Awaiting Payment"
7. Admin calls `POST /wallet/withdrawals/pay` with proof URL
8. Request shows "Paid — Confirm Receipt" + proof link
9. Worker clicks "Confirm Receipt" → "Yes, Received" → shows "Resolved"
10. **OR** worker clicks "No, Dispute" → enters reason → shows "Disputed"
11. Admin re-reviews, rejects → status "Rejected — Refunded", balance restored

### Edge Cases
- Balance < $10: button disabled, shows "Need $X.XX more"
- Request amount > balance: frontend validation catches, backend also validates
- Invalid PayPal email: backend Zod validates format
- Worker disputes without reason: frontend disables "No, Dispute" button until reason entered

---

## Recommendations (Post-Testing)

1. **Add worker earnings stat to dashboard** — "Available: $X.XX" card alongside task stats
2. **Show task expiry countdown on dashboard feed** — helps workers prioritize
3. **Add "Cancel withdrawal request"** for PENDING state — reduces support burden
4. **Estimated delivery time on track page** — "Expected by [date]"
5. **Password strength indicator** on register + reset
6. **Show password toggle** (eye icon) on all password fields
7. **Separate "Rejected" tab** on my-tasks for clarity
8. **Add payment method icons** (PayPal logo, mobile money icon) on withdrawal form
