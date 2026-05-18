# 🚀 LookMe Project - Quick Start Guide

## ✅ What's Already Done

1. ✅ **Dependencies Installed** - All 614 packages installed successfully
2. ✅ **Prisma Client Generated** - Database client ready
3. ✅ **Environment File Created** - `.env` configured with development settings
4. ✅ **Frontend App Scaffolded** - Client dashboard ready at `apps/web-client`
5. ✅ **Design System Created** - `@lookme/ui` package with unique components

---

## ⚠️ Required: Start PostgreSQL Database

The services need a PostgreSQL database to run. You have two options:

### Option 1: Using Docker (Recommended)

```bash
docker run -d \
  --name lookme-postgres \
  -e POSTGRES_USER=lookme \
  -e POSTGRES_PASSWORD=lookme \
  -e POSTGRES_DB=lookme \
  -p 5432:5432 \
  postgres:16
```

### Option 2: Using Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create database
createdb lookme

# Update .env with your connection string
# DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/lookme
```

---

## 📊 Run Database Migrations

Once PostgreSQL is running:

```bash
cd packages/database
npx prisma migrate dev --name initial_schema

# This creates all tables:
# - Users, Platforms, Services
# - Orders (with guest support)
# - Tasks, Wallets, Escrows
# - Trust scores, Audit logs
```

---

## 🚀 Start All Services

Open **7 terminal windows** and run each command:

### Terminal 1: API Gateway (Port 4000)
```bash
cd apps/api
npx pnpm dev
```

### Terminal 2: Auth Service (Port 5001)
```bash
cd services/auth
npx pnpm dev
```

### Terminal 3: Catalog Service (Port 5002)
```bash
cd services/catalog
npx pnpm dev
```

### Terminal 4: Order Service (Port 5003)
```bash
cd services/order
npx pnpm dev
```

### Terminal 5: Task Service (Port 5004)
```bash
cd services/task
npx pnpm dev
```

### Terminal 6: Wallet Service (Port 5005)
```bash
cd services/wallet
npx pnpm dev
```

### Terminal 7: Client Dashboard (Port 3001)
```bash
cd apps/web-client
npx pnpm dev
```

---

## 🌐 Access the Application

Once all services are running:

- **Client Dashboard**: http://localhost:3001
- **API Gateway**: http://localhost:4000
- **API Health**: http://localhost:4000/health

---

## 🧪 Test Guest Checkout Flow

1. Visit http://localhost:3001
2. Click "Browse Services"
3. Fill out the checkout form:
   - Quantity: 100
   - Target URL: https://instagram.com/test
   - Email: test@example.com
   - Name: Test User (optional)
4. Click "Continue to Payment"
5. You'll get a tracking token
6. Visit http://localhost:3001/track/[token] to see order progress

---

## 📝 Current Status

### ✅ Working
- All dependencies installed
- Prisma client generated
- Environment configured
- Frontend app ready
- Design system complete

### ⏳ Needs Setup
- PostgreSQL database (see above)
- Database migrations
- Services started

### 🔲 TODO (Backend)
- Complete guest order endpoint in Order Service
- Add Stripe webhook handler
- Implement order tracking endpoint
- Add email notifications

---

## 🐛 Troubleshooting

### "Missing required env var: DATABASE_URL"
→ PostgreSQL is not running. Start it using Docker or locally.

### "Cannot connect to database"
→ Check PostgreSQL is running on port 5432:
```bash
# If using Docker:
docker ps | grep lookme-postgres

# If using local:
psql -U lookme -d lookme
```

### Port already in use
→ Check if another process is using the port:
```bash
lsof -i :4000  # API Gateway
lsof -i :3001  # Client app
# Kill the process or change port in .env
```

### TypeScript errors
→ All lint errors should be resolved after `npx pnpm install`

---

## 📚 Key Endpoints

### API Gateway (http://localhost:4000)
- `GET /health` - Health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/catalog/platforms` - List platforms
- `POST /api/v1/orders/guest` - **Guest checkout** ⭐
- `GET /api/v1/orders/track/:token` - **Track guest order** ⭐
- `GET /api/v1/tasks/feed` - Worker task feed

---

## 🎯 Next Steps

1. **Start PostgreSQL** (see options above)
2. **Run migrations**: `cd packages/database && npx prisma migrate dev`
3. **Start all 7 services** (see commands above)
4. **Visit**: http://localhost:3001
5. **Test guest checkout!**

---

## 🎨 Design System

The app uses a custom design system (`@lookme/ui`):
- **Linear-inspired**: Sharp, precise
- **Unique layouts**: NO standard sidebar
- **Minimal colors**: Neutral + blue accent
- **Typography-driven**: Strong hierarchy

See `/packages/ui/README.md` for full documentation.

---

**Ready to launch! 🚀**

Start PostgreSQL, run migrations, then start all services.
