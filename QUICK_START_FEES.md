# Quick Start: Dynamic Platform Fees

## 🚀 3-Step Setup

### Step 1: Set Your Platform Fees

Connect to your database and run:

```bash
psql -U postgres -d lookme -f set-platform-fees.sql
```

**Or** manually set fees based on your strategy:

```sql
-- High volume (70% platform fee)
UPDATE service_types SET platform_fee_percent = 70 
WHERE category_id IN (SELECT id FROM service_categories WHERE slug IN ('followers', 'likes', 'views'));

-- Reviews (40% platform fee)
UPDATE service_types SET platform_fee_percent = 40 
WHERE category_id IN (SELECT id FROM service_categories WHERE slug = 'reviews');
```

### Step 2: Restart Your Services

```bash
# Stop all
pkill -f "tsx src/index.ts"

# Start all
set -o allexport; source .env; set +o allexport
pnpm --filter @lookme/auth-service exec tsx src/index.ts &
pnpm --filter @lookme/catalog-service exec tsx src/index.ts &
pnpm --filter @lookme/order-service exec tsx src/index.ts &
pnpm --filter @lookme/task-service exec tsx src/index.ts &
pnpm --filter @lookme/wallet-service exec tsx src/index.ts &
pnpm --filter @lookme/api-gateway exec tsx src/index.ts &
```

### Step 3: Verify

```sql
-- Check fees are set
SELECT slug, name, platform_fee_percent FROM service_types WHERE is_active = true;
```

## ✅ Done!

Your platform now has:
- ✅ Dynamic fees per service type
- ✅ $5 minimum withdrawal (down from $10)
- ✅ Fees locked at order creation time
- ✅ Automatic worker payout calculation

## 📊 Recommended Settings

| Service Category | Platform Fee | Why |
|-----------------|-------------|-----|
| Followers, Likes, Views | 70% | High volume, low effort |
| Reviews | 40% | Quality work needed |
| Everything else | 50% | Balanced approach |

## 🎯 What This Achieves

**Before**: Worker needed 666 tasks @ $0.015 each to reach $10 minimum  
**After**: Worker needs 333 tasks @ $0.015 each to reach $5 minimum

**Result**: 50% faster time to first payout = better retention

## 📖 Full Documentation

- `DYNAMIC_PLATFORM_FEES.md` - Complete guide
- `SPLIT_MARGIN_IMPLEMENTATION.md` - Technical details
- `set-platform-fees.sql` - SQL configuration script
