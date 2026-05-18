# 🚀 LookMe - Quick Start Guide

## ⚡ Fast Start (3 Steps)

### Step 1: Start PostgreSQL

**Option A - Using Docker** (Recommended)
```bash
docker run -d \
  --name lookme-postgres \
  -e POSTGRES_USER=lookme \
  -e POSTGRES_PASSWORD=lookme \
  -e POSTGRES_DB=lookme \
  -p 5432:5432 \
  postgres:16
```

**Option B - Using Local PostgreSQL**
```bash
createdb lookme
```

### Step 2: Run Database Migrations
```bash
cd /Users/winner/lookme/packages/database
npx prisma migrate dev --name initial_schema
```

### Step 3: Start All Services
```bash
# Open 7 terminal tabs and run each:

# Tab 1 - API Gateway (Port 4000)
cd /Users/winner/lookme/apps/api && npx pnpm dev

# Tab 2 - Auth Service (Port 5001)
cd /Users/winner/lookme/services/auth && npx pnpm dev

# Tab 3 - Catalog Service (Port 5002)
cd /Users/winner/lookme/services/catalog && npx pnpm dev

# Tab 4 - Order Service (Port 5003)
cd /Users/winner/lookme/services/order && npx pnpm dev

# Tab 5 - Task Service (Port 5004)
cd /Users/winner/lookme/services/task && npx pnpm dev

# Tab 6 - Wallet Service (Port 5005)
cd /Users/winner/lookme/services/wallet && npx pnpm dev

# Tab 7 - Client App (Port 3001)
cd /Users/winner/lookme/apps/web-client && npx pnpm dev
```

---

## 🌐 Access Points

Once running:
- **Client App**: http://localhost:3001
- **API Gateway**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

---

## ✅ What's Ready

- ✅ Dependencies installed (614 packages)
- ✅ Prisma client generated
- ✅ Environment configured (.env)
- ✅ Client app scaffolded
- ✅ Guest checkout page built
- ✅ Order tracking page built
- ✅ Design system ready

---

## 🎯 Test Guest Checkout

1. Visit http://localhost:3001
2. Click "Browse Services"
3. Fill checkout form (no login!)
4. Pay with Stripe test card: `4242 4242 4242 4242`
5. Get tracking link
6. Track order progress

---

**Ready to launch! 🚀**
