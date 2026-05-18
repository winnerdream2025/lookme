# Dynamic Platform Fee Strategy

## Overview

The platform now supports **dynamic platform fees** based on task difficulty and quality requirements. This allows you to optimize your take-rate while keeping workers motivated.

## Fee Structure

### Recommended Split-Margin Strategy

| Task Type | Platform Fee | Worker Gets | Use Case |
|-----------|-------------|-------------|----------|
| **High Volume** (Follows, Likes, Retweets) | **70%** | 30% | Low effort, high volume tasks |
| **Medium Tasks** (App Downloads, Searches) | **50%** | 50% | Moderate effort required |
| **Quality Tasks** (Custom Reviews) | **40%** | 60% | High quality, aged accounts needed |

### Default

- **Default platform fee**: 30% (worker gets 70%)
- This applies to any service type where `platformFeePercent` is not explicitly set

## How It Works

### 1. Database Schema

Each `ServiceType` now has a `platformFeePercent` field (integer, 0-100):

```sql
-- Example: Instagram Followers (high volume)
UPDATE service_types 
SET platform_fee_percent = 70 
WHERE slug = 'instagram-followers';

-- Example: Google Reviews (quality required)
UPDATE service_types 
SET platform_fee_percent = 40 
WHERE slug = 'google-positive-review';
```

### 2. Order Creation

When an order is placed, the `platformFeePercent` is **locked** from the service type at that moment. This ensures:
- Pricing consistency for existing orders
- You can adjust fees for new orders without affecting old ones

### 3. Worker Payout Calculation

```typescript
const platformFeePct = Number(order.platformFeePercent ?? 30) / 100;
const workerPayout = taskReward * (1 - platformFeePct);
```

**Example**:
- Task reward: $0.05
- Platform fee: 70%
- Worker gets: $0.05 × (1 - 0.70) = **$0.015**

## Withdrawal Threshold

**Lowered from $10 to $5** to help workers reach payout faster.

### Why This Matters

With a 70% platform fee on high-volume tasks:
- Old threshold: Worker needed **666 tasks** at $0.015 each to reach $10
- New threshold: Worker needs **333 tasks** to reach $5
- **Faster psychological win** → better retention

## Setting Platform Fees

### Option 1: Direct Database Update

```sql
-- High volume tasks (70% platform fee)
UPDATE service_types 
SET platform_fee_percent = 70 
WHERE category_id IN (
  SELECT id FROM service_categories WHERE slug IN ('followers', 'likes', 'views')
);

-- Medium tasks (50% platform fee)
UPDATE service_types 
SET platform_fee_percent = 50 
WHERE category_id IN (
  SELECT id FROM service_categories WHERE slug IN ('downloads', 'traffic')
);

-- Quality tasks (40% platform fee)
UPDATE service_types 
SET platform_fee_percent = 40 
WHERE category_id IN (
  SELECT id FROM service_categories WHERE slug = 'reviews'
);
```

### Option 2: Admin API (Future)

Create an admin endpoint to update service types:

```typescript
PATCH /admin/service-types/:id
{
  "platformFeePercent": 70
}
```

## Migration Applied

- **Migration**: `20260516175355_add_dynamic_platform_fee`
- **Fields added**:
  - `service_types.platform_fee_percent` (default: 30)
  - `orders.platform_fee_percent` (default: 30)

## Files Modified

### Backend
- `packages/database/prisma/schema.prisma` - Schema changes
- `services/task/src/services/task.service.ts` - Dynamic fee calculation
- `services/order/src/services/order.service.ts` - Lock fee at order time
- `services/wallet/src/services/wallet.service.ts` - $5 minimum
- `packages/config/src/index.ts` - $5 minimum config
- `packages/validation/src/wallet.schema.ts` - $5 validation

### Frontend
- `apps/web-client/src/app/earnings/page.tsx` - $5 UI updates
- `apps/web-client/src/app/dashboard/earnings/page.tsx` - Dynamic minimum
- `apps/web-client/src/app/terms/page.tsx` - Terms updated

## Testing

### 1. Verify Platform Fee Application

```sql
-- Check current service type fees
SELECT slug, name, platform_fee_percent 
FROM service_types 
WHERE is_active = true;

-- Check if orders are locking the fee
SELECT id, service_type_id, platform_fee_percent, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

### 2. Test Worker Payout

1. Create an order for a service with 70% platform fee
2. Worker completes task
3. Verify wallet transaction shows correct amount (30% of task reward)

### 3. Test Withdrawal

1. Worker earns $5.00
2. Attempt withdrawal - should succeed
3. Worker with $4.99 - should fail with "Minimum withdrawal is $5"

## Recommendations

### Start Conservative

Begin with these settings and monitor worker retention:

```sql
-- Conservative approach
UPDATE service_types SET platform_fee_percent = 50 WHERE category_id IN (
  SELECT id FROM service_categories WHERE slug IN ('followers', 'likes', 'views')
);

UPDATE service_types SET platform_fee_percent = 40 WHERE category_id IN (
  SELECT id FROM service_categories WHERE slug = 'reviews'
);
```

### Monitor Metrics

Track these KPIs:
- **Worker retention rate** (% who complete 10+ tasks)
- **Time to first payout** (days from signup to $5)
- **Task completion rate** (% of assigned tasks completed)
- **Platform revenue per order**

### Adjust Gradually

If workers are completing tasks quickly and retention is high:
- Increase high-volume task fees to 60-70%
- Keep quality task fees at 40% to ensure good reviews

If workers are abandoning tasks:
- Lower fees to 40-50%
- Consider increasing task rewards instead

## Critical Warning

⚠️ **Do NOT set platform fee above 70% for any task type**

At 70%+ platform fees:
- Workers earn too little per task
- Motivation drops significantly
- Platform reputation suffers
- You'll spend more on customer acquisition than you save on fees

The sweet spot is **40-70%** depending on task difficulty.
