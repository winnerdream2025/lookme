# LookMe — Platform Architecture

> Social Engagement Marketplace — Followers, Likes, Views, Reviews,
> Downloads, Streams & Traffic across every major platform.
> Built as a modern, scalable SaaS with clean domain separation.

---

## 1. Business Model

### What We Sell

**Clients** (businesses, influencers, marketers) purchase engagement packages.
**Workers** complete micro-tasks (follow, like, review, visit) and earn rewards.
**LookMe** takes a platform fee on every transaction.

### Platform & Service Catalog

```
PLATFORMS                    SERVICE CATEGORIES
─────────────────────────    ──────────────────────────────
Instagram .................. Followers · Likes · Views
TikTok ..................... Followers · Likes · Views
Facebook ................... Page Followers · Likes · Views · Reviews
YouTube .................... Subscribers · Likes · Views
X (Twitter) ................ Followers · Likes · Retweets
Google Business ............ Reviews (Positive / Negative)
Yelp ....................... Reviews (Positive / Negative)
Apple App Store ............ Downloads · Reviews
Google Play Store .......... Downloads · Reviews
Apple Music ................ Streams
Spotify .................... Streams · Followers
WhatsApp ................... Channel Followers
Reddit ..................... Upvotes
Website .................... Traffic Visits
```

> The catalog is **admin-managed** and **fully extensible** — new platforms
> and services can be added without code changes.

### Service Categories (normalized)

| Category        | Slug          | Example                          |
|-----------------|---------------|----------------------------------|
| Followers       | `followers`   | Instagram Followers, TikTok Followers |
| Likes           | `likes`       | YouTube Likes, Facebook Post Likes    |
| Views           | `views`       | TikTok Views, YouTube Views           |
| Reviews         | `reviews`     | Google 5-Star Review, Yelp Negative   |
| Downloads       | `downloads`   | App Store Download, Play Store DL     |
| Streams         | `streams`     | Apple Music Streams, Spotify Streams  |
| Traffic         | `traffic`     | Website Visit (30s+ dwell time)       |
| Subscribers     | `subscribers` | YouTube Subscribers                   |
| Engagement      | `engagement`  | Reddit Upvotes, Twitter Retweets      |

---

## 2. System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                                 │
│  ┌──────────────────┐  ┌───────────────────┐  ┌──────────────────────┐  │
│  │  Client Dashboard │  │  Worker App        │  │   Admin Panel        │  │
│  │  (Next.js)        │  │  (Next.js)         │  │   (Next.js)          │  │
│  │  Port: 3001       │  │  Port: 3002        │  │   Port: 3003         │  │
│  └────────┬──────────┘  └────────┬───────────┘  └────────┬─────────────┘  │
│           │                      │                       │               │
└───────────┼──────────────────────┼───────────────────────┼───────────────┘
            │                      │                       │
            ▼                      ▼                       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY (Express)                             │
│                           Port: 4000                                     │
│  ┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Helmet   │ │ CORS   │ │ Rate   │ │ Auth MW  │ │ Request Logger   │  │
│  │          │ │        │ │ Limiter│ │ + RBAC   │ │ + Request ID     │  │
│  └──────────┘ └────────┘ └────────┘ └──────────┘ └──────────────────┘  │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVICES                                  │
│                                                                          │
│  ┌───────────────┐  ┌─────────────────┐  ┌────────────────────────────┐ │
│  │ Auth Service   │  │ Catalog Service  │  │ Order Service              │ │
│  │ Port: 5001     │  │ Port: 5002       │  │ Port: 5003                 │ │
│  │                │  │                  │  │                            │ │
│  │ • Register     │  │ • Platforms      │  │ • Place order              │ │
│  │ • Login        │  │ • Categories     │  │ • Order lifecycle          │ │
│  │ • JWT/Refresh  │  │ • Service types  │  │ • Auto-create tasks        │ │
│  │ • Profiles     │  │ • Pricing tiers  │  │ • Track progress           │ │
│  └───────────────┘  └─────────────────┘  └────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │ Task Service                   │  │ Wallet Service                   │ │
│  │ Port: 5004                     │  │ Port: 5005                       │ │
│  │                                │  │                                  │ │
│  │ • Worker task feed             │  │ • Deposit (Stripe)               │ │
│  │ • Accept / assign tasks        │  │ • Escrow lock / release          │ │
│  │ • Submit proof                 │  │ • Worker payouts                 │ │
│  │ • Auto-verify / admin review   │  │ • Transaction history            │ │
│  │ • Trust score computation      │  │ • Platform fee calculation       │ │
│  └───────────────────────────────┘  └──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
              │                  │                   │
              ▼                  ▼                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│  ┌───────────────┐  ┌──────────────────┐  ┌────────────────────────────┐ │
│  │ PostgreSQL 16  │  │   Redis 7        │  │   S3 / MinIO              │ │
│  │ (Primary DB)   │  │ (Cache · Queue · │  │  (Screenshots · Proofs)   │ │
│  │                │  │  Rate-limit)     │  │                           │ │
│  └───────────────┘  └──────────────────┘  └────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Monorepo Structure

```
lookme/
├── apps/
│   ├── web-client/            # Client (buyer) dashboard
│   ├── web-worker/            # Worker (earner) app
│   ├── web-admin/             # Internal admin panel
│   └── api/                   # API Gateway (Express proxy)
│
├── services/
│   ├── auth/                  # Authentication & user management
│   ├── catalog/               # Platform & service catalog
│   ├── order/                 # Order placement & lifecycle
│   ├── task/                  # Task distribution, proofs, verification
│   └── wallet/                # Payments, escrow, payouts
│
├── packages/
│   ├── database/              # Prisma schema + client
│   ├── server/                # Shared Express app factory + middleware
│   ├── types/                 # Shared TypeScript interfaces & enums
│   ├── validation/            # Zod schemas (shared FE ↔ BE contracts)
│   ├── config/                # Env / config loader
│   ├── logger/                # Pino structured logging
│   ├── utils/                 # Common helpers (pagination, dates, etc.)
│   └── ui/                    # Shared React components (planned)
│
├── docker-compose.yml
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .env.example
└── README.md
```

---

## 4. Technology Stack

| Layer          | Technology                           |
|----------------|--------------------------------------|
| **Frontend**   | Next.js 14, React 18, TailwindCSS    |
| **UI Library** | shadcn/ui, Lucide Icons              |
| **State**      | Zustand (client), TanStack Query     |
| **Forms**      | React Hook Form + Zod                |
| **API Gateway**| Express.js + http-proxy-middleware    |
| **Services**   | Express.js (MVC+S pattern)           |
| **ORM**        | Prisma 5                             |
| **Database**   | PostgreSQL 16                        |
| **Cache**      | Redis 7 (cache, rate-limit, queues)  |
| **Auth**       | JWT (access 15m + refresh 7d)        |
| **Payments**   | Stripe (charges + Connect payouts)   |
| **Validation** | Zod (shared between FE + BE)         |
| **Build**      | Turborepo + pnpm workspaces          |
| **Testing**    | Vitest + Playwright                  |
| **Logging**    | Pino (structured JSON)               |
| **Infra**      | Docker Compose (dev), Railway/AWS    |

---

## 5. Service Architecture Pattern (MVC+S)

Every backend service follows the same internal structure:

```
services/<name>/
├── src/
│   ├── index.ts              # Entrypoint — uses createApp() from @lookme/server
│   ├── routes/
│   │   └── <resource>.routes.ts
│   ├── controllers/          # Thin — parse request, call service, respond
│   │   └── <resource>.controller.ts
│   ├── services/             # Thick — all business logic lives here
│   │   └── <resource>.service.ts
│   ├── repositories/         # Data access only — Prisma queries
│   │   └── <resource>.repository.ts
│   └── types/                # Service-local types (if needed)
│       └── index.ts
├── package.json
└── tsconfig.json
```

### Request Flow

```
Client → API Gateway → [Auth MW] → [Rate Limit] → Proxy
                                                     │
Service:  Route → [Validate MW] → Controller → Service → Repository → DB
                                      │              │
                                      │              ├→ Redis (cache)
                                      │              └→ External API
                                      ▼
                                  Response
```

### Rules

- **Routes** — Wire HTTP methods to middleware + controller. No logic.
- **Controllers** — Parse request, call service, format response. Zero business logic.
- **Services** — All business logic. Testable in isolation. Can call other service layers.
- **Repositories** — Pure Prisma queries. No logic. Easily swappable.
- **Middleware** — Shared via `@lookme/server`. Per-service middleware only when truly unique.

---

## 6. Data Model

### Entity Relationship Diagram

```
┌──────────┐
│   User   │──────────────────────────────────────────┐
└──────┬───┘                                          │
       │ 1:1           1:N                            │ 1:1
       ▼               ▼                              ▼
┌──────────────┐  ┌──────────┐                  ┌──────────┐
│ UserProfile  │  │  Order   │                  │  Wallet  │
└──────────────┘  └──────┬───┘                  └──────┬───┘
                         │ 1:N                         │ 1:N
                         ▼                             ▼
                   ┌──────────┐               ┌──────────────┐
                   │   Task   │               │ Transaction  │
                   └──────┬───┘               └──────────────┘
                          │ 1:1
                          ▼
                   ┌──────────────┐
                   │  TaskProof   │
                   └──────────────┘

┌──────────────┐  ┌───────────────┐  ┌──────────────┐
│   Platform   │──│  ServiceType  │──│ PricingTier  │
└──────────────┘  └───────────────┘  └──────────────┘
                         │
                         │ referenced by
                         ▼
                   ┌──────────┐
                   │  Order   │
                   └──────────┘
```

### Key Models

| Model              | Domain    | Purpose                                         |
|--------------------|-----------|--------------------------------------------------|
| `User`             | Auth      | Client, Worker, or Admin account                 |
| `UserProfile`      | Auth      | Extended profile (country, language, device)      |
| `Session`          | Auth      | Refresh token sessions                           |
| `Platform`         | Catalog   | Instagram, TikTok, Google, Yelp, etc.            |
| `ServiceCategory`  | Catalog   | Followers, Likes, Views, Reviews, etc.           |
| `ServiceType`      | Catalog   | Platform + Category combo with pricing           |
| `PricingTier`      | Catalog   | Speed/quality tiers (Standard, Express, Premium) |
| `Order`            | Order     | Client's purchase of X units on platform Y       |
| `Task`             | Task      | Individual micro-task assigned to a worker       |
| `TaskProof`        | Task      | Worker's proof of completion (screenshot, link)  |
| `Wallet`           | Wallet    | User's balance container                         |
| `Transaction`      | Wallet    | Credit / debit record                            |
| `Escrow`           | Wallet    | Locked funds per order                           |
| `TrustScore`       | Task      | Computed reliability metrics per worker          |
| `AuditLog`         | System    | System-wide audit trail                          |

---

## 7. Core Flows

### A. Client Places an Order

```
Client                         System                        Worker
  │                              │                              │
  │── Browse catalog ──────────▶ │                              │
  │◀─ Service types + pricing ── │                              │
  │                              │                              │
  │── Place order ─────────────▶ │                              │
  │   (serviceTypeId, qty,       │                              │
  │    targetUrl, tier)          │                              │
  │                              │── Validate input             │
  │                              │── Calculate total price      │
  │                              │── Charge wallet / Stripe     │
  │                              │── Lock escrow                │
  │                              │── Create N tasks             │
  │◀─ Order confirmed ────────── │                              │
  │                              │                              │
  │                              │── Distribute to feed ──────▶ │
```

### B. Worker Completes a Task

```
Worker                         System                        Client
  │                              │                              │
  │── Browse task feed ────────▶ │                              │
  │◀─ Available tasks ────────── │                              │
  │                              │                              │
  │── Accept task ─────────────▶ │                              │
  │                              │── Mark as ASSIGNED           │
  │                              │── Start expiry timer         │
  │                              │                              │
  │   (worker follows, likes,    │                              │
  │    reviews, visits, etc.)    │                              │
  │                              │                              │
  │── Submit proof ────────────▶ │                              │
  │   (screenshot / link / text) │                              │
  │                              │── Auto-verify proof          │
  │                              │── If PASS → credit worker    │
  │                              │── If FAIL → reject           │
  │                              │── If UNCLEAR → admin queue   │
  │                              │                              │
  │                              │── Update order progress ───▶ │
  │◀─ Payment received ──────── │                              │
```

### C. Order Lifecycle

```
PENDING ──▶ PROCESSING ──▶ IN_PROGRESS ──▶ COMPLETED
  │                              │              │
  ▼                              ▼              ▼
CANCELLED                  PARTIALLY_COMPLETED  REFUNDED
```

### D. Task Lifecycle

```
AVAILABLE ──▶ ASSIGNED ──▶ SUBMITTED ──▶ VERIFIED ──▶ PAID
                 │             │             │
                 ▼             ▼             ▼
              EXPIRED       REJECTED    FLAGGED → ADMIN_REVIEW
```

---

## 8. API Gateway Routing

Single entry point. The gateway authenticates, rate-limits, and proxies.

```
/api/v1/auth/*       → Auth Service     (5001)
/api/v1/catalog/*    → Catalog Service  (5002)
/api/v1/orders/*     → Order Service    (5003)
/api/v1/tasks/*      → Task Service     (5004)
/api/v1/wallet/*     → Wallet Service   (5005)
```

### Middleware Stack

```
1. requestId()         → UUID per request for tracing
2. helmet()            → Security headers
3. cors()              → Whitelist frontend origins
4. rateLimiter()       → Per-IP + per-user limits
5. requestLogger()     → Pino structured JSON logging
6. authMiddleware()    → JWT verify (skip public routes)
7. rbacMiddleware()    → Role check per route group
8. proxyRouter()       → Proxy to target service
```

---

## 9. Authentication & Authorization

### Auth Flow

```
1. POST /auth/register → Create account (client or worker)
2. POST /auth/login    → Validate credentials → Return { accessToken, refreshToken }
3. Subsequent requests → Authorization: Bearer <accessToken>
4. POST /auth/refresh  → Exchange refreshToken for new pair
5. POST /auth/logout   → Revoke session
```

### JWT Payload

```typescript
{
  sub: string;       // user ID (cuid)
  role: 'client' | 'worker' | 'admin';
  email: string;
  iat: number;
  exp: number;       // access: 15m, refresh: 7d
}
```

### RBAC Rules

| Route Group      | Allowed Roles            |
|------------------|--------------------------|
| `/auth/*`        | Public (register, login) |
| `/catalog/*`     | Public (read), Admin (write) |
| `/orders/*`      | Client (CRUD), Admin (all) |
| `/tasks/*`       | Worker (feed, accept, submit), Admin (all) |
| `/wallet/*`      | Authenticated (own wallet) |

---

## 10. Verification Engine

```
Proof Submitted
    │
    ▼
┌──────────────────────────────────┐
│       VERIFICATION PIPELINE      │
│                                  │
│  1. Proof Present?               │
│     └─ Screenshot / link / text  │
│                                  │
│  2. Time Check                   │
│     └─ Not too fast (< 10s)?    │
│                                  │
│  3. Duplicate Check              │
│     └─ Same proof used before?   │
│     └─ Same worker + same order? │
│                                  │
│  4. Fraud Signals                │
│     └─ IP/device pattern         │
│     └─ Rapid-fire submissions    │
│     └─ Trust score too low?      │
│                                  │
│  Result: VERIFIED / REJECTED /   │
│          FLAGGED (admin review)  │
└──────────────────────────────────┘
```

---

## 11. Wallet & Escrow

### Money Flow

```
1. Client deposits funds         → Wallet balance increases
2. Client places order           → Funds moved to Escrow (locked)
3. Worker completes task         → Escrow portion released to worker wallet
4. Platform fee deducted         → (e.g., 15% of task reward)
5. Order fully completed         → Remaining escrow released
6. Worker withdraws              → Stripe payout to bank
7. Order cancelled               → Escrow refunded to client wallet
```

### Transaction Types

```
DEPOSIT         — Client adds funds via Stripe
ESCROW_LOCK     — Funds locked when order placed
ESCROW_RELEASE  — Portion released per completed task
ESCROW_REFUND   — Funds returned on cancellation
REWARD          — Worker credited for completed task
PLATFORM_FEE    — LookMe's commission
WITHDRAWAL      — Worker payout via Stripe Connect
```

---

## 12. Frontend Architecture

```
apps/web-<name>/
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── (auth)/           # Public: login, register
│   │   ├── (dashboard)/      # Protected: main app
│   │   │   ├── layout.tsx
│   │   │   └── [feature]/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/               # shadcn/ui
│   │   ├── layouts/
│   │   └── [feature]/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts            # Axios + interceptors
│   │   └── auth.ts
│   ├── stores/               # Zustand
│   └── types/
├── tailwind.config.ts
├── next.config.js
└── package.json
```

### Frontend Apps

| App              | Audience | Key Features                                   |
|------------------|----------|------------------------------------------------|
| **web-client**   | Buyers   | Browse catalog, place orders, track progress   |
| **web-worker**   | Earners  | Task feed, accept tasks, submit proofs, wallet |
| **web-admin**    | Internal | Manage catalog, review proofs, analytics       |

---

## 13. Error Handling

### Standard Error Response

```typescript
{
  success: false,
  error: {
    status: number;          // HTTP status
    code: string;            // e.g., ORDER_INSUFFICIENT_FUNDS
    message: string;         // Human-readable
    details?: unknown;       // Validation errors array
    requestId: string;       // For tracing
  }
}
```

### Error Code Prefixes

```
AUTH_*       — Authentication / authorization errors
CATALOG_*   — Platform / service catalog errors
ORDER_*     — Order lifecycle errors
TASK_*      — Task assignment / proof errors
WALLET_*    — Payment / escrow errors
SYSTEM_*    — Infrastructure errors
```

---

## 14. Security

| Measure              | Implementation                          |
|----------------------|-----------------------------------------|
| **HTTPS**            | Enforced at load balancer               |
| **CORS**             | Whitelist frontend origins only         |
| **Rate Limiting**    | Per-IP + per-user (Redis-backed)        |
| **Input Validation** | Zod on every route (shared FE ↔ BE)    |
| **SQL Injection**    | Prisma parameterized queries            |
| **XSS**             | React auto-escaping + CSP via Helmet    |
| **Auth**             | JWT short-lived (15m) + refresh (7d)    |
| **Secrets**          | Env vars only — never in code           |
| **Escrow**           | Funds locked before tasks go live       |
| **Audit Trail**      | Every state change → AuditLog table     |
| **Proof Storage**    | S3 with signed URLs (no direct access)  |

---

## 15. Business Rules — Service Type Policies

This section defines the exact rules the platform enforces per service category
to protect client accounts from banning and to prevent fraud.

---

### 15.1 Reviews (Google, Yelp, Facebook, App Store, Play Store)

Reviews are the **highest-risk** service type. Posting too many reviews in a short
period triggers spam filters and can result in the client's business being penalized
or removed. These rules are enforced automatically by the platform.

#### Daily Rate Cap
```
DEFAULT: 10 reviews released per day per order
REASON:  Posting 50+ reviews in 24h is a strong spam signal on Google/Yelp.
         Spreading delivery over multiple days looks organic.
STORAGE: Order.dailyLimit (default 10 for review service types)
EXAMPLE: Client orders 100 reviews → tasks split into 10 batches of 10, each
         batch scheduled 1 day apart (Task.scheduledFor).
```

#### Worker-Per-Order Uniqueness
```
RULE:   A single worker cannot complete more than ONE review task per order.
REASON: The same person leaving multiple reviews for the same business is a
        clear fraud pattern and gets flagged by Google.
CHECK:  Before accepting: WorkerEmailUsage.@@unique([workerId, orderId])
ERROR:  "You have already submitted a review for this business."
```

#### Email Address Tracking
```
RULE:   Workers must declare the email account they will use for the review
        before accepting the task (Task.workerEmail).
REASON: Google associates reviews with the Gmail account — if the same account
        reviews the same business twice, both reviews are removed.
CHECK:  WorkerEmailUsage.@@unique([email, targetUrl])
ERROR:  "This email has already been used to review this business. 
         Please use a different Google account."
```

#### Review Content Requirements
```
Specified by client at order time (Order.reviewContent):
  - Minimum length: 3 sentences (enforced client-side + server-side)
  - Sentiment: POSITIVE / NEGATIVE / NEUTRAL
  - Rating: 1-5 stars
  - Language: match profile language or client-specified
Workers must submit the actual review text as proof (TaskProof.proofText).
```

#### Task Lifecycle for Reviews
```
1. Order placed with quantity=100
2. System creates 100 Tasks with scheduledFor dates:
   Tasks 1-10:   scheduledFor = today
   Tasks 11-20:  scheduledFor = today + 1 day
   ...
   Tasks 91-100: scheduledFor = today + 9 days
3. Task feed only returns tasks where scheduledFor <= NOW()
4. Worker claims task → provides workerEmail → accepts terms
5. Worker posts review, submits: proofText + screenshotUrl
6. System verifies proof present → auto-approve or flag
7. Escrow releases worker reward
8. Daily batch unlocks next day automatically
```

---

### 15.2 Followers (Instagram, TikTok, YouTube, Twitter, Spotify)

Followers are **low-risk** with no daily cap. High volume is normal for promoted accounts.

```
RULES:
  - One worker can follow per order (no repeat follow from same account)
  - Worker submits their username as proof (TaskProof.proofText)
  - Expiry: worker must submit within 30 minutes of accepting
  - No daily limit: all tasks available immediately

ANTI-SPAM:
  - Worker cannot claim 2 tasks targeting the same username in any order
  - This prevents a worker from using the same account to follow/unfollow
  CHECK: WorkerEmailUsage-equivalent check on (workerId, targetUsername)
```

---

### 15.3 Views (YouTube, TikTok, Instagram Reels, Spotify)

Views require **time verification** to ensure genuine viewing.

```
RULES:
  - Worker must open the video in an embedded player (iframe in-app)
  - Minimum watch time is enforced server-side:
      YouTube:    minimum 30 seconds
      TikTok:     minimum 10 seconds (short-form)
      Long videos: minimum 60 seconds
  - Timer starts when worker opens the video
  - Task cannot be submitted before minWatchSeconds has elapsed
  - Worker submits screenshot of video progress bar as proof

FIELDS:
  - ServiceType.metadata = { minWatchSeconds: 30 }
  - TaskProof.proofUrl = link to video timestamp screenshot

ANTI-SPAM:
  - Same IP cannot complete more than 5 view tasks per hour
  - Same worker can do view tasks for the same video: YES (different "views")
    but limited to 1 view per 24h per worker per video URL
```

---

### 15.4 Likes (Instagram, TikTok, YouTube, Facebook, Twitter)

Likes are **simple** with minimal fraud risk.

```
RULES:
  - Worker submits their username as proof
  - One like per account per post (enforced by checking username+targetUrl)
  - No daily limit
  - Expiry: 30 minutes after accept

ANTI-SPAM:
  - Worker cannot like the same URL twice across any orders
```

---

### 15.5 Downloads (App Store, Google Play)

```
RULES:
  - Worker downloads the app and submits their App Store / Play Store username
  - For incentivized installs: worker must keep app installed for 72h
    (enforced by delayed payment release)
  - Country matching: client may require specific country installs
```

---

### 15.6 Streams (Spotify, Apple Music)

```
RULES:
  - Worker must stream for at minimum 30 seconds (Spotify counts after 30s)
  - Worker submits screenshot of Spotify "Recently Played"
  - Same account cannot stream same song more than 1x per 24h for payment
  - Spotify's algorithm detects looping — we stagger task distribution
```

---

### 15.7 Website Traffic (Traffic category)

```
RULES:
  - Worker visits the URL via in-app browser (tracked)
  - Minimum dwell time: 30 seconds
  - Worker must scroll (scroll-depth ≥ 30%)
  - Screenshot of page as proof
  - Same worker can visit same URL: max 1x per 24h
```

---

### 15.8 General Task Rules (All Types)

```
QUOTA LOCK:   When completedTasks == order.quantity, no new claims accepted.
              Task feed hides fully-filled orders automatically.
              Only ADMIN can re-open a completed order.

EXPIRY:       Worker has 30 minutes to submit proof after accepting.
              On expiry: task returns to AVAILABLE, worker gets warning on TrustScore.

TRUST SCORE:  Workers start at 50/100.
              Verified submission:   +2 points
              Rejected submission:   -5 points
              Expired task:          -3 points
              Score < 20:            worker suspended, tasks re-queued
              Score > 80:            worker gets priority access to higher-reward tasks

PROOF REVIEW:
  Auto-approve if:
    - Proof text / screenshot present
    - Time between accept and submit > minSeconds
    - No duplicate proof hash
  Flag for admin if:
    - Suspiciously fast submission (< 10s for any task)
    - Duplicate IP submitting same proof
    - Worker trust score < 30
```

---

## 16. Worker Registration & Terms

Workers must complete the following before accessing the task feed:

```
1. Create account (role = WORKER)
   - First name, last name, email, password
   - Country selection (affects task availability)

2. Read & accept Terms of Service
   - Checkbox: "I agree to the Worker Terms of Service"
   - Checkbox: "I have read the Privacy Policy"
   - Stored in: User.termsAcceptedAt (DateTime)

3. Email verification (optional Phase 2)

4. First task: read instructions carefully
   - Task detail page shows full instructions before accept
   - Worker must click "I understand, Accept Task" — not just "Accept"
```

---

## 17. Phase Roadmap

### Phase 1 — Foundation (Weeks 1–2)
- [x] Monorepo structure (Turborepo + pnpm)
- [x] Database schema (Prisma)
- [x] Shared packages (config, logger, types, validation, utils, server)
- [x] Auth service (register, login, JWT, refresh, logout)
- [x] Catalog service (platforms, categories, service types, pricing)
- [ ] Basic client dashboard (browse catalog, register)

### Phase 2 — Order System (Weeks 3–4)
- [ ] Order service (place, track, cancel)
- [ ] Auto task generation from orders
- [ ] Wallet service (deposit, balance, transactions)
- [ ] Escrow lock on order placement
- [ ] Client order tracking UI

### Phase 3 — Worker Flow (Weeks 5–6)
- [ ] Task service (feed, accept, submit proof)
- [ ] Worker app (task feed, proof submission)
- [ ] Basic verification (proof present, no duplicates)
- [ ] Auto-approve + credit worker
- [ ] Worker wallet + withdrawal request

### Phase 4 — Payments & Verification (Weeks 7–8)
- [ ] Stripe integration (charges + Connect payouts)
- [ ] Advanced verification rules
- [ ] Admin review queue
- [ ] Trust score computation
- [ ] Fraud detection (IP, speed, duplicates)

### Phase 5 — Polish & Scale (Weeks 9–10)
- [ ] Admin panel (catalog management, analytics, reviews)
- [ ] Real-time order progress (WebSocket / polling)
- [ ] Worker matching (country, trust score, capacity)
- [ ] Analytics dashboard
- [ ] Monitoring + alerts

---

## 16. Service Ports

| Service        | Port | Description                    |
|----------------|------|--------------------------------|
| API Gateway    | 4000 | Single entry point for clients |
| Auth Service   | 5001 | Users, JWT, sessions           |
| Catalog Service| 5002 | Platforms, services, pricing   |
| Order Service  | 5003 | Client orders & lifecycle      |
| Task Service   | 5004 | Worker tasks, proofs, verify   |
| Wallet Service | 5005 | Payments, escrow, payouts      |

---

## 17. Environment Configuration

```bash
NODE_ENV=development
DATABASE_URL=postgresql://lookme:lookme@localhost:5432/lookme
REDIS_URL=redis://localhost:6379

JWT_SECRET=<random-64-chars>
JWT_REFRESH_SECRET=<random-64-chars>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

API_GATEWAY_PORT=4000
AUTH_SERVICE_PORT=5001
CATALOG_SERVICE_PORT=5002
ORDER_SERVICE_PORT=5003
TASK_SERVICE_PORT=5004
WALLET_SERVICE_PORT=5005

CORS_ORIGINS=http://localhost:3001,http://localhost:3002,http://localhost:3003

PLATFORM_FEE_PERCENT=15
MIN_DEPOSIT=5
MIN_WITHDRAWAL=10
```
