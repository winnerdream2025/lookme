# Universal Anti-Fraud System

## 🎯 One System, All Services

The anti-fraud middleware automatically applies the correct protection based on service category. **No manual configuration needed** - it just works!

## 🛡️ How It Works

### Automatic Detection

When a worker tries to accept a task, the middleware:

1. **Detects the service category** (views, reviews, followers, etc.)
2. **Applies appropriate anti-fraud checks** automatically
3. **Blocks the worker** if they've already interacted with this content
4. **Allows the task** if all checks pass

### Service Categories & Protection

| Category | Services | Protection Applied |
|----------|----------|-------------------|
| **Views** | YouTube, TikTok, Instagram Reels | URL-based (1 Worker = 1 View) |
| **Traffic** | Website visits, Landing pages | URL-based (1 Worker = 1 Visit) |
| **Streams** | Spotify, Apple Music, SoundCloud | URL-based (1 Worker = 1 Stream) |
| **Reviews** | Google, Yelp, Facebook, Trustpilot | 3-Layer (Email + Device + URL) |
| **Followers** | Instagram, Twitter, TikTok | URL-based (1 Worker = 1 Follow) |
| **Likes** | Instagram, Facebook, Twitter | URL-based (1 Worker = 1 Like) |
| **Subscribers** | YouTube, Newsletter signups | URL-based (1 Worker = 1 Subscribe) |

---

## 📊 Protection Layers by Category

### Layer 1: URL-Based Protection
**Applies to**: Views, Traffic, Streams, Followers, Likes, Subscribers

```typescript
// GOLDEN RULE: 1 Worker = 1 View per URL
if (worker has viewed this URL before) {
  throw Error("You have already viewed this video");
}
```

**Example Scenarios**:

| Service | URL | Rule |
|---------|-----|------|
| YouTube Views | `youtube.com/watch?v=abc123` | Worker can only view this video once |
| TikTok Views | `tiktok.com/@user/video/123` | Worker can only view this TikTok once |
| Instagram Followers | `instagram.com/username` | Worker can only follow this account once |
| Spotify Streams | `spotify.com/track/xyz789` | Worker can only stream this track once |

### Layer 2: Email Protection
**Applies to**: Reviews only

```typescript
// RULE: 1 Email = 1 Review per Business
if (this email has reviewed this business before) {
  throw Error("This email has already reviewed this business");
}
```

**Why**: Google, Yelp, Facebook all track email accounts. Same email reviewing twice = instant deletion.

### Layer 3: Device Protection (CRITICAL!)
**Applies to**: Reviews only

```typescript
// RULE: 1 Device = 1 Review per Business
if (this device has reviewed this business before) {
  throw Error("This device has already reviewed this business");
}
```

**Why**: This is the **most important** layer. Google tracks device hardware IDs. If 5 reviews come from the same iPhone, **all 5 get deleted**.

**Real-world scenario**:
- Worker has 1 iPhone
- Worker has 5 different Gmail accounts
- Worker tries to post 5 reviews for "Joe's Pizza"
- **Our system blocks attempts 2-5** ✅
- Without our system: All 5 reviews deleted by Google ❌

---

## 💻 Implementation

### Middleware Integration

The middleware is automatically applied to the `/accept` endpoint:

```typescript
// services/task/src/routes/task.routes.ts
router.post("/accept", 
  validate(acceptTaskSchema), 
  antiFraudMiddleware,  // ← Automatic protection!
  controller.accept
);
```

### How It Detects Service Type

```typescript
// Fetch task with service type
const task = await prisma.task.findUnique({
  where: { id: taskId },
  include: {
    order: {
      include: {
        serviceType: {
          include: { category: true }
        }
      }
    }
  }
});

const categorySlug = task.order.serviceType.category.slug;

// Apply appropriate checks
if (categorySlug === 'views') {
  // YouTube, TikTok, Instagram views
  checkUrlAntifraud();
}
else if (categorySlug === 'reviews') {
  // Google, Yelp, Facebook reviews
  checkEmailAntifraud();
  checkDeviceAntifraud();  // CRITICAL!
  checkWorkerOrderAntifraud();
}
```

### Error Messages

The middleware provides **user-friendly error messages** that explain why they're blocked:

#### YouTube Views
```
"You have already viewed this video. Each worker can only view a unique URL once to prevent spam detection."
```

#### Google Reviews
```
"This device has already been used to review this business on Google. Google tracks device hardware IDs and will delete duplicate reviews from the same device. Please use a different physical device (phone or tablet)."
```

#### Email Already Used
```
"The email john@gmail.com has already been used to review this business on Yelp. Please use a different account."
```

---

## 🎬 User Flow Examples

### Example 1: YouTube Views (URL Protection)

**Worker A**:
1. Accepts task to view `youtube.com/watch?v=abc123`
2. Watches video for 30 seconds
3. Gets paid ✅
4. Tries to accept another task for same video
5. **BLOCKED**: "You have already viewed this video" ❌

**Worker B**:
1. Accepts task to view `youtube.com/watch?v=abc123`
2. **ALLOWED** ✅ (different worker, same URL is OK)

### Example 2: Google Reviews (3-Layer Protection)

**Worker A** (iPhone 13, email: alice@gmail.com):
1. Accepts task to review "Joe's Pizza"
2. Posts review ✅
3. Tries to accept another review for "Joe's Pizza" with bob@gmail.com
4. **BLOCKED**: "This device has already reviewed this business" ❌

**Worker B** (Samsung Galaxy, email: charlie@gmail.com):
1. Accepts task to review "Joe's Pizza"
2. **ALLOWED** ✅ (different device, different email)

### Example 3: Instagram Followers (URL Protection)

**Worker A**:
1. Accepts task to follow `instagram.com/brandname`
2. Follows account ✅
3. Tries to accept another follow task for same account
4. **BLOCKED**: "You have already followed this account" ❌

---

## 🔧 Adding New Services

### Step 1: Create Service Type in Database

```sql
INSERT INTO service_types (
  platform_id, 
  category_id, 
  slug, 
  name,
  requires_timer,
  min_view_duration
) VALUES (
  (SELECT id FROM platforms WHERE slug = 'tiktok'),
  (SELECT id FROM service_categories WHERE slug = 'views'),
  'tiktok-views',
  'TikTok Views',
  true,
  15  -- 15 seconds minimum
);
```

### Step 2: That's It!

The anti-fraud middleware **automatically** applies the correct protection based on the category:

- Category = `views` → URL protection ✅
- Category = `reviews` → 3-layer protection ✅
- Category = `followers` → URL protection ✅

**No code changes needed!**

---

## 📊 Database Tracking

### WorkerViewHistory Table
Tracks URL-based interactions (views, traffic, followers, likes, streams):

```sql
CREATE TABLE worker_view_history (
  id TEXT PRIMARY KEY,
  worker_id TEXT NOT NULL,
  target_url TEXT NOT NULL,
  order_id TEXT NOT NULL,
  task_id TEXT UNIQUE NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  duration INTEGER,
  viewed_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(worker_id, target_url)  -- GOLDEN RULE
);
```

### WorkerEmailUsage Table
Tracks review-based interactions (Google, Yelp, Facebook, etc.):

```sql
CREATE TABLE worker_email_usages (
  id TEXT PRIMARY KEY,
  worker_id TEXT NOT NULL,
  email TEXT NOT NULL,
  target_url TEXT NOT NULL,
  order_id TEXT NOT NULL,
  task_id TEXT UNIQUE NOT NULL,
  device_fingerprint TEXT,
  ip_address TEXT,
  used_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(email, target_url),                -- Layer 1
  UNIQUE(device_fingerprint, target_url),   -- Layer 2 (CRITICAL!)
  UNIQUE(worker_id, order_id)               -- Layer 3
);
```

---

## 🧪 Testing

### Test URL Protection (YouTube)

```bash
# Worker 1 accepts YouTube view task
curl -X POST http://localhost:4000/api/v1/tasks/task_123/accept \
  -H "Authorization: Bearer $WORKER1_TOKEN" \
  -d '{"taskId":"task_123"}'

# Response: ✅ Success

# Worker 1 tries to accept another task for SAME video
curl -X POST http://localhost:4000/api/v1/tasks/task_456/accept \
  -H "Authorization: Bearer $WORKER1_TOKEN" \
  -d '{"taskId":"task_456"}'

# Response: ❌ URL_ALREADY_VIEWED
```

### Test Device Protection (Google Reviews)

```bash
# Worker 1 accepts review with device ABC
curl -X POST http://localhost:4000/api/v1/tasks/task_123/accept \
  -H "Authorization: Bearer $WORKER1_TOKEN" \
  -d '{
    "taskId":"task_123",
    "workerEmail":"alice@gmail.com",
    "deviceFingerprint":"device-abc-123"
  }'

# Response: ✅ Success

# Worker 2 tries to accept review for SAME business with SAME device
curl -X POST http://localhost:4000/api/v1/tasks/task_456/accept \
  -H "Authorization: Bearer $WORKER2_TOKEN" \
  -d '{
    "taskId":"task_456",
    "workerEmail":"bob@gmail.com",
    "deviceFingerprint":"device-abc-123"  # SAME DEVICE!
  }'

# Response: ❌ DEVICE_ALREADY_USED
```

---

## 📈 Success Metrics

### Good Platform (With Universal Anti-Fraud)
- ✅ YouTube views retention: 99%+
- ✅ Google reviews retention: 99%+
- ✅ Unique IPs per order: 100%
- ✅ Unique devices per business: 100%
- ✅ Zero duplicate violations

### Bad Platform (Without Anti-Fraud)
- ❌ YouTube views retention: 5%
- ❌ Google reviews retention: 5%
- ❌ Same IP repeated 1,000x
- ❌ Same device repeated 100x
- ❌ Platform banned

---

## 🎯 Why This Makes You Unstoppable

### Competitors

**SMM Panels**:
- Manual configuration per service
- Easy to forget protection
- Inconsistent enforcement
- Views/reviews deleted

**Your Platform**:
- **Automatic protection** for all services
- **Impossible to forget** - it's built-in
- **Consistent enforcement** across all platforms
- **Views/reviews permanent**

### Adding New Platforms

**Competitors**:
1. Add new service
2. Write custom anti-fraud logic
3. Test extensively
4. Hope nothing breaks

**Your Platform**:
1. Add new service to database
2. **That's it!** Anti-fraud works automatically ✅

---

## 🚀 Supported Services (Current & Future)

### Currently Supported
- ✅ YouTube Views
- ✅ TikTok Views
- ✅ Instagram Views/Followers/Likes
- ✅ Google Reviews
- ✅ Yelp Reviews
- ✅ Facebook Reviews
- ✅ Website Traffic
- ✅ Spotify Streams

### Future Services (Zero Code Changes Needed!)
- ⏳ Twitter/X Followers
- ⏳ LinkedIn Connections
- ⏳ Trustpilot Reviews
- ⏳ Apple Music Streams
- ⏳ Pinterest Saves
- ⏳ Reddit Upvotes
- ⏳ Medium Claps

**All will automatically get anti-fraud protection!**

---

**The Formula**: `Universal Middleware + Category Detection = Automatic Protection for All Services`

This is what makes your platform **scalable** and **unstoppable**! 🚀
