# 🗺️ LookMe Platform - Complete Navigation Flow & Pages

## 📱 Three Applications Overview

| App | Port | Audience | Primary Goal | Auth Required |
|-----|------|----------|--------------|---------------|
| **Client Dashboard** | 3001 | Buyers/Clients | Purchase social engagement | ❌ NO - Completely public |
| **Worker App** | 3002 | Earners/Workers | Complete tasks, earn money | ✅ YES - Required |
| **Admin Panel** | 3003 | Internal Staff | Manage platform, review proofs | ✅ YES - Required |

---

## 🔵 CLIENT DASHBOARD (Port 3001)

**Target Users**: Anyone who wants to buy followers, likes, views, reviews, etc.

**🔓 COMPLETELY PUBLIC - NO LOGIN REQUIRED!**

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT DASHBOARD                          │
│                  (100% PUBLIC ACCESS)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ALL PAGES PUBLIC (No Auth Required)                         │
│  ├─ / (Landing)                                             │
│  ├─ /pricing (Public Catalog)                               │
│  ├─ /checkout (Guest Checkout) ⭐                           │
│  ├─ /track/[token] (Order Tracking) ⭐                      │
│  └─ /orders (All My Orders - via email lookup)             │
│                                                              │
│  NO LOGIN/REGISTER PAGES                                     │
│  ❌ No /login                                               │
│  ❌ No /register                                            │
│  ❌ No authentication required                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Page Details

#### 1. **Landing Page** (`/`) ✅ CREATED
**Purpose**: First impression, explain value proposition
**Layout**: Full-screen hero
**Components**:
- Hero section with brand name "LookMe"
- Value proposition: "Social Engagement Marketplace"
- Two CTAs: "Browse Services" → `/checkout`, "Sign In" → `/login`
- Social proof: Platform count, 24/7 support, 100% secure
**Auth**: None required
**Design**: Minimal, typography-driven, high contrast

#### 2. **Public Catalog** (`/pricing`)
**Purpose**: Browse available services without login
**Layout**: Grid canvas with filters
**Components**:
- Platform filter (Instagram, TikTok, YouTube, etc.)
- Category filter (Followers, Likes, Views, Reviews)
- Service cards with:
  - Platform icon + name
  - Service type
  - Price per unit
  - Delivery time estimate
  - "Order Now" CTA → `/checkout?service=[slug]`
**Auth**: None required
**API**: `GET /api/v1/catalog/services`

#### 3. **Guest Checkout** (`/checkout`) ✅ CREATED
**Purpose**: Purchase without account (main differentiator!)
**Layout**: Split layout (40% info, 60% form)
**Components**:
- Service summary (left panel)
- Order form (right panel):
  - Quantity slider
  - Target URL input
  - Guest email (required)
  - Guest name (optional)
  - Special instructions (optional)
  - Price calculator
  - Stripe payment button
- Trust signals footer
**Auth**: None required
**API**: `POST /api/v1/orders/guest`
**Flow**:
1. User selects service from catalog
2. Fills form with target URL + email
3. Pays via Stripe
4. Receives tracking link via email
5. Can optionally create account later

#### 4. **Guest Order Tracking** (`/track/[token]`) ✅ CREATED
**Purpose**: Track order progress without login
**Layout**: Centered card with timeline
**Components**:
- Order status badge
- Progress bar (completed/total tasks)
- Order details grid
- Timeline visualization
- CTA to create account
**Auth**: None required (public via token)
**API**: `GET /api/v1/orders/track/:token`
**Updates**: Auto-refresh every 30 seconds

#### 5. **My Orders** (`/orders`)
**Purpose**: View all orders placed from this browser/email
**Layout**: Centered card with email lookup
**Components**:
- Email input form:
  - "Enter your email to view orders"
  - Email input
  - "View Orders" button
- Order list (after email submitted):
  - Order cards with:
    - Service name
    - Status badge
    - Progress bar
    - Tracking link
    - Created date
    - Total price
- No authentication needed
**Auth**: None required
**API**: `GET /api/v1/orders?email=guest@example.com`
**Note**: Uses email as identifier, no password needed

---

**That's it! Only 5 pages for the Client Dashboard.**

#### 🔵 Client Dashboard (5 pages - ALL PUBLIC)
- **Public**: 5 pages (Landing, Pricing, Checkout, Tracking, My Orders)
- **Authenticated**: NONE - No login/register pages!
- **Main Feature**: Guest checkout flow ⭐
- **Philosophy**: Frictionless purchasing, no accounts needed

---

## 🟢 WORKER APP (Port 3002)

**Target Users**: People who want to earn money by completing tasks

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      WORKER APP                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PUBLIC (No Auth Required)                                   │
│  ├─ / (Landing - How to Earn)                              │
│  ├─ /login                                                  │
│  └─ /register                                               │
│                                                              │
│  AUTHENTICATED (Requires Login)                              │
│  ├─ /dashboard (Overview)                                   │
│  ├─ /dashboard/tasks (Task Feed) ⭐ MAIN FEATURE           │
│  │   ├─ Available tasks grid                               │
│  │   └─ Filter by platform/category                        │
│  ├─ /dashboard/tasks/active (My Active Tasks)              │
│  ├─ /dashboard/tasks/[id] (Task Detail & Proof Submission) │
│  ├─ /dashboard/wallet (Earnings & Payouts)                 │
│  │   ├─ Balance                                             │
│  │   ├─ Earnings history                                   │
│  │   └─ Withdrawal request                                 │
│  ├─ /dashboard/performance (Trust Score & Stats)           │
│  └─ /dashboard/settings (Account Settings)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Page Details

#### 1. **Landing Page** (`/`)
**Purpose**: Explain how to earn money
**Layout**: Full-screen hero
**Components**:
- Hero: "Earn Money Completing Simple Tasks"
- How it works (3 steps)
- Earnings potential calculator
- CTAs: "Start Earning" → `/register`, "Sign In" → `/login`
**Auth**: None required

#### 2. **Login/Register** (`/login`, `/register`)
**Purpose**: Worker authentication
**Layout**: Same as client app
**Note**: Workers register with WORKER role
**API**: `POST /api/v1/auth/register` (role: WORKER)

#### 3. **Dashboard Overview** (`/dashboard`)
**Purpose**: Worker home
**Layout**: Command bar + stats grid
**Components**:
- Welcome message
- Quick stats:
  - Available tasks
  - Tasks completed today
  - Earnings this week
  - Trust score
- Recent activity
- Quick action: "Browse Tasks"
**Auth**: Required (WORKER role)

#### 4. **Task Feed** (`/dashboard/tasks`) ⭐ MAIN FEATURE
**Purpose**: Browse and accept available tasks
**Layout**: Grid canvas with filters
**Components**:
- Filter bar:
  - Platform (Instagram, TikTok, etc.)
  - Category (Follow, Like, View, etc.)
  - Min reward
- Task cards:
  - Platform icon
  - Task type
  - Reward amount
  - Estimated time
  - Instructions preview
  - "Accept Task" button
- Pagination
**Auth**: Required (WORKER role)
**API**: `GET /api/v1/tasks/feed`
**Real-time**: Updates when tasks are claimed

#### 5. **Active Tasks** (`/dashboard/tasks/active`)
**Purpose**: View tasks in progress
**Layout**: List with status
**Components**:
- Task list:
  - Task type
  - Status (Assigned, Submitted, Verified)
  - Time remaining
  - Reward
  - Action button
**Auth**: Required (WORKER role)
**API**: `GET /api/v1/tasks/mine`

#### 6. **Task Detail** (`/dashboard/tasks/[id]`)
**Purpose**: Complete task and submit proof
**Layout**: Centered card with steps
**Components**:
- Task instructions
- Target URL (clickable)
- Requirements checklist
- Proof submission form:
  - Screenshot upload
  - Proof URL input
  - Notes (optional)
- "Submit Proof" button
**Auth**: Required (WORKER role)
**API**: 
- `POST /api/v1/tasks/:id/accept`
- `POST /api/v1/tasks/:id/submit`

#### 7. **Wallet** (`/dashboard/wallet`)
**Purpose**: View earnings and request payouts
**Layout**: Split layout
**Components**:
- Balance card
- Earnings chart (last 30 days)
- Withdrawal form (min $10)
- Transaction history
**Auth**: Required (WORKER role)
**API**: 
- `GET /api/v1/wallet`
- `POST /api/v1/wallet/withdraw`

#### 8. **Performance** (`/dashboard/performance`)
**Purpose**: View trust score and stats
**Layout**: Stats dashboard
**Components**:
- Trust score gauge (0-100)
- Performance metrics:
  - Total tasks completed
  - Verification rate
  - Average completion time
  - Rejection rate
- Recent feedback
**Auth**: Required (WORKER role)
**API**: `GET /api/v1/users/me/trust-score`

---

## 🟣 ADMIN PANEL (Port 3003)

**Target Users**: Internal staff managing the platform

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      ADMIN PANEL                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PUBLIC (No Auth Required)                                   │
│  └─ /login (Admin Login)                                    │
│                                                              │
│  AUTHENTICATED (Requires ADMIN role)                         │
│  ├─ /admin (Dashboard)                                      │
│  ├─ /admin/catalog (Catalog Management)                     │
│  │   ├─ /admin/catalog/platforms (Manage Platforms)        │
│  │   ├─ /admin/catalog/categories (Manage Categories)      │
│  │   ├─ /admin/catalog/services (Manage Services)          │
│  │   └─ /admin/catalog/pricing (Manage Pricing Tiers)      │
│  ├─ /admin/review (Proof Review Queue) ⭐ MAIN FEATURE     │
│  │   ├─ Flagged tasks                                      │
│  │   └─ Manual review interface                            │
│  ├─ /admin/users (User Management)                          │
│  │   ├─ Clients list                                       │
│  │   ├─ Workers list                                       │
│  │   └─ User detail/actions                                │
│  ├─ /admin/orders (Order Monitoring)                        │
│  ├─ /admin/analytics (Platform Analytics)                   │
│  │   ├─ Revenue charts                                     │
│  │   ├─ Order volume                                       │
│  │   ├─ Worker performance                                 │
│  │   └─ Platform breakdown                                 │
│  └─ /admin/settings (Platform Settings)                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Page Details

#### 1. **Admin Login** (`/login`)
**Purpose**: Secure admin authentication
**Layout**: Centered form
**Components**:
- Email input
- Password input
- 2FA code input (if enabled)
- "Sign in" button
**Auth**: None required
**API**: `POST /api/v1/auth/login` (validates ADMIN role)

#### 2. **Admin Dashboard** (`/admin`)
**Purpose**: Platform overview
**Layout**: Grid dashboard
**Components**:
- Key metrics cards:
  - Total revenue (today/week/month)
  - Active orders
  - Tasks pending review
  - Active workers
- Charts:
  - Revenue trend
  - Order volume
- Recent activity feed
**Auth**: Required (ADMIN role)

#### 3. **Platform Management** (`/admin/catalog/platforms`)
**Purpose**: Add/edit platforms
**Layout**: Table with modal
**Components**:
- Platforms table
- Add/Edit modal:
  - Name, slug, icon, color
  - Active toggle
  - Sort order
**Auth**: Required (ADMIN role)
**API**: 
- `GET /api/v1/catalog/platforms`
- `POST /api/v1/catalog/platforms`
- `PATCH /api/v1/catalog/platforms/:id`

#### 4. **Service Management** (`/admin/catalog/services`)
**Purpose**: Manage service types
**Layout**: Table with filters
**Components**:
- Service table
- Add/Edit form:
  - Platform, category
  - Name, description
  - Base price, worker reward
  - Min/max quantity
  - Delivery estimate
  - Proof requirements
**Auth**: Required (ADMIN role)
**API**: `POST /api/v1/catalog/services`

#### 5. **Proof Review Queue** (`/admin/review`) ⭐ MAIN FEATURE
**Purpose**: Review flagged task submissions
**Layout**: Split layout (list + detail)
**Components**:
- Flagged tasks list (left)
- Review panel (right):
  - Task details
  - Proof image viewer
  - Proof URL
  - Worker info
  - Actions:
    - Approve
    - Reject (with reason)
    - Flag for fraud
**Auth**: Required (ADMIN role)
**API**: 
- `GET /api/v1/tasks?status=FLAGGED`
- `POST /api/v1/tasks/:id/verify`

#### 6. **User Management** (`/admin/users`)
**Purpose**: Manage users
**Layout**: Tabs (Clients/Workers) + table
**Components**:
- User table:
  - Name, email, role
  - Trust score (workers)
  - Total spent (clients)
  - Status
  - Actions (View, Suspend, Delete)
**Auth**: Required (ADMIN role)
**API**: `GET /api/v1/users`

#### 7. **Analytics** (`/admin/analytics`)
**Purpose**: Platform insights
**Layout**: Dashboard with charts
**Components**:
- Revenue charts (Recharts)
- Order volume by platform
- Worker performance leaderboard
- Conversion funnel
- Export data button
**Auth**: Required (ADMIN role)
**API**: `GET /api/v1/analytics/*`

---

## 🔄 User Flows

### Flow 1: Guest Checkout (Only Way to Order)
```
1. Visit http://localhost:3001
2. Click "Browse Services" → /pricing
3. Select "Instagram Followers"
4. Click "Order Now" → /checkout?service=instagram-followers
5. Fill form:
   - Quantity: 500
   - Target: https://instagram.com/myaccount
   - Email: guest@example.com
6. Pay with Stripe ($75)
7. Receive tracking link: /track/abc123xyz
8. Check email for tracking link
9. Visit tracking page (no login needed!)
10. See progress: 150/500 complete (30%)
11. Done! Order completes automatically
```

### Flow 2: View All My Orders (Email Lookup)
```
1. Visit http://localhost:3001
2. Click "My Orders" → /orders
3. Enter email: guest@example.com
4. Click "View Orders"
5. See all orders placed with that email:
   - Order #1: Instagram Followers (Completed)
   - Order #2: TikTok Likes (In Progress)
   - Order #3: YouTube Views (Pending)
6. Click tracking link on any order
7. View detailed progress
```

### Flow 3: Worker Task Completion
```
1. Visit http://localhost:3002
2. Sign in as worker
3. Go to /dashboard/tasks (task feed)
4. Filter: Platform = Instagram, Type = Follow
5. See available task: "Follow @targetaccount, $0.15"
6. Click "Accept Task"
7. Redirect to /dashboard/tasks/[id]
8. Read instructions
9. Complete task (follow account)
10. Take screenshot
11. Upload proof + submit
12. Wait for verification (auto or manual)
13. Receive $0.15 to wallet
14. Check /dashboard/wallet for earnings
```

### Flow 4: Admin Proof Review
```
1. Visit http://localhost:3003
2. Admin login
3. See notification: "5 tasks flagged for review"
4. Go to /admin/review
5. See flagged task list
6. Click task to review
7. View proof image
8. Check if proof is valid
9. Decision:
   - Approve → Worker gets paid
   - Reject → Worker doesn't get paid, task reassigned
   - Flag fraud → Worker trust score decreases
10. Move to next task
```

---

## 🎨 Design System Usage Across Apps

### Client Dashboard (Blue Accent)
- Primary color: `#2563eb` (blue-600)
- Use cases: CTAs, progress bars, links
- Mood: Trustworthy, professional

### Worker App (Emerald Accent)
- Primary color: `#10b981` (emerald-600)
- Use cases: Earnings, success states, task cards
- Mood: Growth, money, opportunity

### Admin Panel (Purple Accent)
- Primary color: `#9333ea` (purple-600)
- Use cases: Admin actions, charts, highlights
- Mood: Authority, control, analytics

### Common Components
All apps share:
- `SplitLayout` - Asymmetrical 40/60 grid
- `CommandBarLayout` - Top command bar
- `GridCanvas` - Clean grids
- `Stack` - Vertical rhythm
- Typography system
- Button variants
- Badge variants

---

## 📊 Page Priority Matrix

### MUST HAVE (MVP - Week 1-3)
- ✅ Client: Landing, Checkout, Tracking (DONE!)
- ⏳ Client: Pricing, My Orders (email lookup)
- ⏳ Worker: Login, Register, Task Feed, Task Detail
- ⏳ Admin: Login, Proof Review

### SHOULD HAVE (Week 4-5)
- Worker: Dashboard, Active Tasks, Wallet
- Admin: Dashboard, User Management

### NICE TO HAVE (Week 6+)
- Worker: Performance, Settings
- Admin: Analytics, Catalog Management

---

## 🚀 Implementation Order

1. **Week 1**: Client guest checkout (✅ DONE)
2. **Week 2**: Auth pages (login/register) for all apps
3. **Week 3**: Worker task feed + submission
4. **Week 4**: Client dashboard + orders
5. **Week 5**: Admin proof review
6. **Week 6**: Wallets + analytics

---

**Navigation flow complete! Ready for full implementation. 🎯**
