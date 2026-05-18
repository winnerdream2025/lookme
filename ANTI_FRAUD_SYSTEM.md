# Anti-Fraud System: The Golden Rule

## 🎯 The Problem

**SMM panels use cheap server bots** to generate fake views/traffic, which get wiped out by YouTube/Google Analytics every week. Your platform is different because you use **real people with real mobile phones on real mobile data networks**.

But there's a critical vulnerability: If you allow a worker to view the same link 100 times, YouTube and Google Analytics will see **100 views from the exact same IP address**. Google will mark it as spam, and the client's counter will drop back down to zero.

## 🛡️ The Golden Rule

```
1 Worker = 1 IP = 1 View per Campaign
```

**Translation**: Once a worker views "Video A," that video disappears from their available tasks list **forever**. To get 1,000 views, **1,000 different human beings** on your platform must complete the task.

## ✅ Implementation

### Database Schema

**`WorkerViewHistory` Table**
```sql
CREATE TABLE worker_view_history (
  id TEXT PRIMARY KEY,
  worker_id TEXT NOT NULL,
  target_url TEXT NOT NULL,
  order_id TEXT NOT NULL,
  task_id TEXT UNIQUE NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  viewed_at TIMESTAMP DEFAULT NOW(),
  duration INTEGER,  -- seconds stayed on page
  
  UNIQUE(worker_id, target_url),  -- GOLDEN RULE ENFORCEMENT
  FOREIGN KEY (worker_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
```

**Key Constraint**: `UNIQUE(worker_id, target_url)` - Same worker **cannot** view same URL twice, **EVER**.

### Service Type Configuration

**New Fields**:
- `requiresTimer` (boolean) - Whether task requires timed viewing
- `minViewDuration` (integer) - Minimum seconds worker must stay on page (default: 30)

```sql
-- Example: YouTube Views service
UPDATE service_types 
SET 
  requires_timer = true,
  min_view_duration = 30
WHERE slug = 'youtube-views';
```

### Backend Logic

#### 1. Task Feed Filtering

Workers **never see** URLs they've already viewed:

```typescript
// Get all URLs this worker has already viewed
const viewedUrls = await prisma.workerViewHistory.findMany({
  where: { workerId },
  select: { targetUrl: true },
});
const viewedUrlSet = new Set(viewedUrls.map(v => v.targetUrl));

// Filter out already-viewed URLs
const filteredTasks = tasks.filter(t => !viewedUrlSet.has(t.targetUrl));
```

#### 2. Accept Task Validation

When worker tries to accept a traffic task:

```typescript
const alreadyViewed = await prisma.workerViewHistory.findUnique({
  where: { workerId_targetUrl: { workerId, targetUrl: task.targetUrl } },
});

if (alreadyViewed) {
  throw new Error(
    "You have already viewed this URL. Each worker can only view a unique URL once."
  );
}
```

#### 3. Submit Proof Tracking

When worker submits proof for traffic task:

```typescript
await tx.workerViewHistory.create({
  data: {
    workerId,
    targetUrl: task.targetUrl,
    orderId: task.orderId,
    taskId: input.taskId,
    ipAddress: input.ipAddress,  // Captured from request
    userAgent: input.userAgent,
    duration: input.duration,    // How long they stayed
  },
});
```

## 🎬 How It Works (User Flow)

### For Traffic/View Tasks

1. **Worker clicks "Visit Website" button**
   - System opens client's link in specialized popup/iframe
   - Top banner displays timer (e.g., "30 seconds remaining")

2. **Worker must stay on page**
   - Timer counts down from 30 seconds
   - Worker cannot close window or navigate away
   - System tracks actual time spent

3. **Timer completes**
   - Window closes automatically
   - Worker gets paid
   - View history is recorded with IP address

4. **URL is permanently blocked for this worker**
   - This exact URL will never appear in their task feed again
   - Prevents YouTube/Google spam detection

### Example Scenario

**Client Orders**: 1,000 YouTube views for video "abc123"

**System Creates**: 1,000 individual tasks, all pointing to same URL

**Worker A**:
- Sees task in feed
- Accepts task
- Views video for 30 seconds
- Gets paid $0.02
- **Never sees this video again**

**Worker B**:
- Sees same task in feed (Worker A's completion doesn't affect them)
- Accepts task
- Views video for 30 seconds
- Gets paid $0.02
- **Never sees this video again**

**Result**: 1,000 different workers = 1,000 different IP addresses = **Legitimate views that YouTube won't flag**

## 📊 Why This Makes You Unstoppable

| SMM Panel Bots | Your Platform |
|----------------|---------------|
| Same IP addresses | 1,000 unique IPs |
| Server-based traffic | Real mobile devices |
| Views get deleted | Views stay permanent |
| Flagged as spam | Looks like organic traffic |
| Client loses money | Client gets real results |

## 🔒 Additional Anti-Fraud Measures

### 1. IP Address Tracking

Every view records the worker's IP address:
- Detect if same IP is used across multiple accounts
- Flag suspicious patterns
- Ban VPN/proxy users if needed

### 2. User Agent Tracking

Records browser/device information:
- Ensures diversity of devices
- Detects bot patterns
- Validates mobile vs desktop traffic

### 3. Duration Validation

Tracks how long worker actually stayed:
- Minimum 30 seconds for YouTube views
- Prevents quick "click and close" fraud
- Ensures quality engagement

### 4. Geolocation (Future Enhancement)

Track worker's country/city:
- Provide geo-targeted views
- Charge premium for specific countries
- Detect location spoofing

## 🚀 Migration Applied

**Migration**: `20260516180239_add_anti_fraud_view_tracking`

**Changes**:
- Created `worker_view_history` table
- Added `requiresTimer` to `service_types`
- Added `minViewDuration` to `service_types`
- Added unique constraint on `(worker_id, target_url)`

## 📝 Configuration Examples

### YouTube Views

```sql
UPDATE service_types 
SET 
  requires_timer = true,
  min_view_duration = 30,
  platform_fee_percent = 70,
  worker_reward = 0.02
WHERE slug = 'youtube-views';
```

### Website Traffic

```sql
UPDATE service_types 
SET 
  requires_timer = true,
  min_view_duration = 20,
  platform_fee_percent = 60,
  worker_reward = 0.015
WHERE slug = 'website-traffic';
```

### TikTok Views

```sql
UPDATE service_types 
SET 
  requires_timer = true,
  min_view_duration = 15,
  platform_fee_percent = 70,
  worker_reward = 0.01
WHERE slug = 'tiktok-views';
```

## ⚠️ Critical Implementation Notes

### 1. Never Allow URL Reuse

The `UNIQUE(worker_id, target_url)` constraint is **non-negotiable**. If you remove it:
- YouTube will detect spam
- Views will be deleted
- Clients will demand refunds
- Your platform will fail

### 2. Enforce Minimum Duration

Workers must stay on page for full duration:
- 30 seconds for YouTube (YouTube's view threshold)
- 20 seconds for websites (Google Analytics threshold)
- 15 seconds for TikTok (TikTok's view threshold)

### 3. Capture Real IP Addresses

Don't trust client-provided IPs:
- Use server-side IP detection
- Block known VPN/proxy ranges
- Validate IP geolocation

### 4. Monitor View Quality

Track these metrics:
- Average view duration
- IP diversity per order
- Device diversity per order
- Geographic distribution

## 🎯 Success Metrics

**Good Platform**:
- 1,000 views = 1,000 unique IPs
- Average duration > minimum required
- High device diversity
- Views stay permanent

**Bad Platform** (what you're preventing):
- 1,000 views = 10 IPs (100 views each)
- Average duration < 5 seconds
- All same device type
- Views deleted within 48 hours

## 🔮 Future Enhancements

### 1. Smart Pricing Based on IP Quality

Charge more for:
- US/UK/CA IP addresses
- Mobile device views
- Longer duration views
- Verified real accounts

### 2. View Retention Guarantee

Offer clients:
- "Views guaranteed for 30 days"
- Automatic refill if views drop
- Premium pricing for guaranteed retention

### 3. Analytics Dashboard for Clients

Show them:
- Geographic distribution of views
- Device breakdown (mobile vs desktop)
- Average view duration
- IP diversity score

## 📚 Related Documentation

- `DYNAMIC_PLATFORM_FEES.md` - Platform fee configuration
- `SPLIT_MARGIN_IMPLEMENTATION.md` - Worker payout strategy
- Migration: `20260516180239_add_anti_fraud_view_tracking`

---

**Implementation Date**: May 16, 2026  
**Status**: ✅ Backend Complete - Frontend Timer UI Pending
