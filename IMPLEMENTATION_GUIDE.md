# 🚀 LookMe Implementation Guide

**Complete step-by-step guide to continue development**

---

## 📦 STEP 1: Install All Dependencies

```bash
cd /Users/winner/lookme

# Install all workspace dependencies
npx pnpm install

# This installs:
# - All service dependencies (Express, Prisma, etc.)
# - All package dependencies (Zod, Pino, etc.)
# - UI package dependencies (React, Tailwind utils, etc.)
# - Dev dependencies (TypeScript, tsx, etc.)
```

**Expected output**: ~200+ packages installed across workspace

---

## 🗄️ STEP 2: Setup Database

### A. Start PostgreSQL (if not running)
```bash
# Using Docker
docker run -d \
  --name lookme-postgres \
  -e POSTGRES_USER=lookme \
  -e POSTGRES_PASSWORD=lookme \
  -e POSTGRES_DB=lookme \
  -p 5432:5432 \
  postgres:16
```

### B. Generate Prisma Client
```bash
cd packages/database
npx prisma generate
```

### C. Create Migration
```bash
cd packages/database
npx prisma migrate dev --name initial_schema

# This creates tables for:
# - Users, UserProfiles, Sessions
# - Platforms, ServiceCategories, ServiceTypes, PricingTiers
# - Orders (with guest support)
# - Tasks, TaskProofs
# - Wallets, Transactions, Escrows
# - TrustScores, AuditLogs
```

### D. Seed Database (Optional)
```bash
cd packages/database
npx prisma db seed
```

---

## 🎨 STEP 3: Scaffold Frontend Apps

### A. Client Dashboard

```bash
cd apps

npx create-next-app@latest web-client \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git

cd web-client
```

**Install additional dependencies:**
```bash
pnpm add @lookme/ui @lookme/types @lookme/validation
pnpm add axios zustand @tanstack/react-query
pnpm add react-hook-form @hookform/resolvers
pnpm add lucide-react
```

**Update `tailwind.config.ts`:**
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // Include UI package
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // blue-600
          50: "#eff6ff",
          100: "#dbeafe",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

**Create API client (`src/lib/api.ts`):**
```ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

**Create first page (`src/app/page.tsx`):**
```tsx
import { Display, Title, Body, Button } from "@lookme/ui";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <Display>LookMe</Display>
        <Title>Social Engagement Marketplace</Title>
        <Body size="lg" className="max-w-2xl mx-auto">
          Buy followers, likes, views, and reviews across every major platform.
          Or earn money by completing simple tasks.
        </Body>
        
        <div className="flex gap-4 justify-center">
          <Link href="/pricing">
            <Button variant="primary" size="lg">
              Browse Services
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
```

---

### B. Worker App

```bash
cd apps

npx create-next-app@latest web-worker \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git

cd web-worker
pnpm add @lookme/ui @lookme/types @lookme/validation
pnpm add axios zustand @tanstack/react-query
pnpm add react-hook-form @hookform/resolvers
pnpm add lucide-react
```

**Update `tailwind.config.ts` with emerald accent:**
```ts
colors: {
  primary: {
    DEFAULT: "#10b981", // emerald-600
    50: "#ecfdf5",
    100: "#d1fae5",
    600: "#10b981",
    700: "#059669",
    900: "#064e3b",
  },
},
```

---

### C. Admin Panel

```bash
cd apps

npx create-next-app@latest web-admin \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git

cd web-admin
pnpm add @lookme/ui @lookme/types @lookme/validation
pnpm add axios zustand @tanstack/react-query
pnpm add react-hook-form @hookform/resolvers
pnpm add lucide-react recharts
```

**Update `tailwind.config.ts` with purple accent:**
```ts
colors: {
  primary: {
    DEFAULT: "#9333ea", // purple-600
    50: "#faf5ff",
    100: "#f3e8ff",
    600: "#9333ea",
    700: "#7e22ce",
    900: "#581c87",
  },
},
```

---

## 🔧 STEP 4: Complete Backend Services

### A. Order Service - Guest Checkout

**Create guest order service method:**

```ts
// services/order/src/services/order.service.ts

import Stripe from "stripe";
import { nanoid } from "nanoid";

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2023-10-16",
});

async placeGuestOrder(input: PlaceGuestOrderInput) {
  // Calculate pricing
  const serviceType = await prisma.serviceType.findUnique({
    where: { id: input.serviceTypeId },
    include: { pricingTiers: true },
  });

  if (!serviceType || !serviceType.isActive) {
    throw AppError.notFound("SERVICE_NOT_FOUND");
  }

  const unitPrice = calculateUnitPrice(serviceType, input.pricingTierId);
  const totalPrice = unitPrice * input.quantity;

  // Generate tracking token
  const trackingToken = nanoid(16);

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalPrice * 100), // cents
    currency: "usd",
    metadata: {
      orderType: "guest",
      guestEmail: input.guestEmail,
      trackingToken,
    },
  });

  // Create order (PENDING_PAYMENT)
  const order = await prisma.order.create({
    data: {
      clientId: null,
      guestEmail: input.guestEmail,
      guestName: input.guestName || null,
      trackingToken,
      serviceTypeId: input.serviceTypeId,
      pricingTierId: input.pricingTierId || null,
      quantity: input.quantity,
      targetUrl: input.targetUrl,
      targetUsername: input.targetUsername || null,
      unitPrice,
      totalPrice,
      workerReward: Number(serviceType.workerReward),
      paymentMethod: "STRIPE",
      stripePaymentId: paymentIntent.id,
      status: "PENDING_PAYMENT",
      instructions: input.instructions || null,
    },
  });

  // TODO: Send email with tracking link

  return {
    order,
    clientSecret: paymentIntent.client_secret,
    trackingUrl: `${config.frontendUrl}/track/${trackingToken}`,
  };
}
```

**Add Stripe webhook handler:**

```ts
// services/order/src/routes/webhook.routes.ts

import { Router } from "express";
import { WebhookController } from "../controllers/webhook.controller";

const router = Router();
const controller = new WebhookController();

router.post("/stripe", express.raw({ type: "application/json" }), controller.handleStripe);

export { router as webhookRoutes };
```

```ts
// services/order/src/controllers/webhook.controller.ts

import Stripe from "stripe";

const stripe = new Stripe(config.stripe.secretKey);

async handleStripe(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"]!;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    // Find order
    const order = await prisma.order.findFirst({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (order && order.status === "PENDING_PAYMENT") {
      // Update order & create tasks
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "PROCESSING" },
        });

        // Create tasks
        const tasks = Array.from({ length: order.quantity }, () => ({
          orderId: order.id,
          targetUrl: order.targetUrl,
          instructions: order.instructions || "",
          rewardAmount: order.workerReward,
          status: "AVAILABLE",
        }));

        await tx.task.createMany({ data: tasks });
      });

      // TODO: Send confirmation email
    }
  }

  res.json({ received: true });
}
```

---

## 🚀 STEP 5: Run Everything

### Terminal 1: API Gateway
```bash
cd apps/api
pnpm dev
# Runs on http://localhost:4000
```

### Terminal 2: Auth Service
```bash
cd services/auth
pnpm dev
# Runs on http://localhost:5001
```

### Terminal 3: Catalog Service
```bash
cd services/catalog
pnpm dev
# Runs on http://localhost:5002
```

### Terminal 4: Order Service
```bash
cd services/order
pnpm dev
# Runs on http://localhost:5003
```

### Terminal 5: Task Service
```bash
cd services/task
pnpm dev
# Runs on http://localhost:5004
```

### Terminal 6: Wallet Service
```bash
cd services/wallet
pnpm dev
# Runs on http://localhost:5005
```

### Terminal 7: Client Dashboard
```bash
cd apps/web-client
pnpm dev
# Runs on http://localhost:3001
```

### Terminal 8: Worker App
```bash
cd apps/web-worker
pnpm dev
# Runs on http://localhost:3002
```

### Terminal 9: Admin Panel
```bash
cd apps/web-admin
pnpm dev
# Runs on http://localhost:3003
```

---

## 🧪 STEP 6: Test Guest Checkout Flow

1. **Browse catalog** → `http://localhost:3001/pricing`
2. **Select service** → Click "Order Now"
3. **Checkout page** → Enter details (no login required)
4. **Pay with Stripe** → Use test card `4242 4242 4242 4242`
5. **Get tracking link** → Check email or copy link
6. **Track order** → `http://localhost:3001/track/[token]`
7. **Watch progress** → See tasks being completed

---

## 📚 Key Files Reference

### Backend
- **Order Service**: `/services/order/src/services/order.service.ts`
- **Task Service**: `/services/task/src/services/task.service.ts`
- **Webhook Handler**: `/services/order/src/controllers/webhook.controller.ts`

### Frontend
- **Client App**: `/apps/web-client/src/app/`
- **Worker App**: `/apps/web-worker/src/app/`
- **Admin App**: `/apps/web-admin/src/app/`

### Shared
- **Design System**: `/packages/ui/`
- **Types**: `/packages/types/`
- **Validation**: `/packages/validation/`
- **Database**: `/packages/database/`

---

## 🎯 Next Priorities

1. ✅ Install dependencies
2. ✅ Setup database
3. ✅ Scaffold frontend apps
4. 🔲 Build guest checkout page
5. 🔲 Build order tracking page
6. 🔲 Build worker task feed
7. 🔲 Complete Stripe integration
8. 🔲 Add email notifications

---

**Ready to build! 🚀**
