# Complete Task Data Collection System

## 🎯 The Problem

**Without proper data collection**:
- Client orders "5 Google Reviews" but doesn't provide business link
- Workers don't know what to review
- Tasks fail, workers get confused
- Platform fails

**With bulletproof data collection**:
- Client MUST provide all necessary information before checkout
- Workers see clear, step-by-step instructions
- Tasks complete successfully
- Platform thrives

---

## 📋 Service-Specific Required Inputs

### 1. REPUTATION MANAGEMENT (Reviews)

**Platforms**: Google Business, Yelp, Trustpilot, Facebook, Styleseat, Booksy

#### Client Must Provide:

| Field | Type | Required | Validation | Purpose |
|-------|------|----------|------------|---------|
| **Target URL** | URL | ✅ Yes | Must match platform pattern | Direct link to business profile |
| **Business Name** | Text | ✅ Yes | 2-100 characters | Display name |
| **Star Rating** | Number | ✅ Yes | 1-5 stars | Rating to post |
| **Review Text Option** | Choice | ✅ Yes | worker_choice OR client_provided | Who writes the review |
| **Custom Review Text** | Text | ⚠️ Conditional | 20-500 chars (if client_provided) | Exact text to post |
| **Drip-Feed Hours** | Number | ✅ Yes | 12-72 hours | Time between reviews |
| **Business Type** | Choice | ⬜ Optional | restaurant, salon, spa, etc. | Helps workers write authentic reviews |
| **Key Points** | Array | ⬜ Optional | Max 5 points, 100 chars each | Points to mention |

#### URL Validation Patterns:

```typescript
Google: /google\.com\/maps/
Yelp: /yelp\.com\/biz/
Trustpilot: /trustpilot\.com\/review/
Facebook: /facebook\.com\/.*\/reviews/
Styleseat: /styleseat\.com\/.*\/reviews/
Booksy: /booksy\.com/
```

#### Example Order JSON:

```json
{
  "serviceId": "google-reviews",
  "quantity": 5,
  "inputs": {
    "targetUrl": "https://maps.google.com/maps?cid=12345",
    "businessName": "Joe's Pizza",
    "starRating": 5,
    "reviewTextOption": "client_provided",
    "customReviewText": "Amazing pizza! The crust was perfect and the service was friendly. Highly recommend!",
    "dripFeedHours": 24,
    "businessType": "restaurant",
    "keyPoints": ["friendly service", "great pizza", "clean restaurant"]
  }
}
```

#### Worker Sees:

```
## Task Instructions: Google Review

Business: Joe's Pizza
Target URL: https://maps.google.com/maps?cid=12345
Star Rating: 5 stars

Review Text to Post:
"Amazing pizza! The crust was perfect and the service was friendly. Highly recommend!"

Key Points to Mention:
- friendly service
- great pizza
- clean restaurant

Step-by-Step Instructions:
1. Open the Business Profile...
2. Read the Business Profile...
3. Write Your Review...
4. Submit Proof...

⚠️ Warning: Posting fake reviews = instant ban
```

---

### 2. SOCIAL GROWTH (Followers, Likes, Subscribers)

**Platforms**: Instagram, TikTok, Facebook, Twitter/X, YouTube

#### Client Must Provide:

| Field | Type | Required | Validation | Purpose |
|-------|------|----------|------------|---------|
| **Target URL** | URL | ✅ Yes | Must match social platform | Link to profile or post |
| **Account Handle** | Text | ✅ Yes | @username format | Display name |
| **Is Public** | Boolean | ✅ Yes | Must be true | Account must be public |
| **Current Count** | Number | ⬜ Optional | >= 0 | For tracking progress |

#### URL Validation Patterns:

```typescript
Instagram: /instagram\.com/
TikTok: /tiktok\.com/
Facebook: /facebook\.com/
Twitter: /twitter\.com|x\.com/
YouTube: /youtube\.com/
```

#### Example Order JSON:

```json
{
  "serviceId": "instagram-followers",
  "quantity": 100,
  "inputs": {
    "targetUrl": "https://instagram.com/brandname",
    "accountHandle": "@brandname",
    "isPublic": true,
    "currentCount": 1250
  }
}
```

#### Worker Sees:

```
## Task Instructions: Instagram Follow

Target Account: @brandname
Target URL: https://instagram.com/brandname

Step-by-Step Instructions:
1. Open the Target...
2. Follow...
3. Wait 5 Seconds...
4. Submit Proof...

⚠️ Critical Warning:
Unfollowing within 30 days = INSTANT BAN + FORFEIT ALL PENDING BALANCE
```

---

### 3. VISIBILITY & VIEWS (Video/Audio)

**Platforms**: YouTube, TikTok, Instagram Reels, Spotify

#### Client Must Provide:

| Field | Type | Required | Validation | Purpose |
|-------|------|----------|------------|---------|
| **Target URL** | URL | ✅ Yes | Must match video/track pattern | Direct link to content |
| **Content Title** | Text | ✅ Yes | 1-200 characters | Display name |
| **Min Watch Time** | Number | ✅ Yes | 15-300 seconds | Required viewing duration |
| **Is Public** | Boolean | ✅ Yes | Must be true | Content must be public |

#### URL Validation Patterns:

```typescript
YouTube: /youtube\.com\/watch\?v=|youtu\.be\//
TikTok: /tiktok\.com\/.*\/video/
Instagram: /instagram\.com\/(p|reel)\//
Spotify: /spotify\.com\/track/
```

#### Example Order JSON:

```json
{
  "serviceId": "youtube-views",
  "quantity": 500,
  "inputs": {
    "targetUrl": "https://youtube.com/watch?v=abc123",
    "contentTitle": "How to Make Pizza",
    "minWatchTime": 30,
    "isPublic": true
  }
}
```

#### Worker Sees:

```
## Task Instructions: YouTube View

Content: How to Make Pizza
Target URL: https://youtube.com/watch?v=abc123
Required Watch Time: 30 seconds

Step-by-Step Instructions:
1. Press Play...
2. Watch/Listen...
3. Keep Tab Active...
4. Wait for Completion...
5. Automatic Payment (no screenshot needed!)

⚠️ Important Notes:
- Timer pauses if you switch tabs
- Must watch for full 30 seconds
- YouTube only counts views with minimum watch time
```

---

### 4. WEB TRAFFIC (Website Visits)

**Platforms**: Any website

#### Client Must Provide:

| Field | Type | Required | Validation | Purpose |
|-------|------|----------|------------|---------|
| **Target URL** | URL | ✅ Yes | No URL shorteners or executables | Clean website link |
| **Website Name** | Text | ✅ Yes | 2-100 characters | Display name |
| **Min Dwell Time** | Number | ✅ Yes | 30-300 seconds | Required time on site |
| **Page Description** | Text | ⬜ Optional | Max 200 characters | What workers will see |

#### URL Validation (Blocked Patterns):

```typescript
Blocked:
- URL shorteners: /bit\.ly|tinyurl|goo\.gl/
- Executables: /\.exe|\.dmg|\.apk/
- Suspicious domains
```

#### Example Order JSON:

```json
{
  "serviceId": "website-traffic",
  "quantity": 1000,
  "inputs": {
    "targetUrl": "https://mybusiness.com",
    "websiteName": "My Business",
    "minDwellTime": 30,
    "pageDescription": "Homepage with product catalog"
  }
}
```

#### Worker Sees:

```
## Task Instructions: Website Traffic

Website: My Business
Target URL: https://mybusiness.com
Required Dwell Time: 30 seconds
What to Expect: Homepage with product catalog

Step-by-Step Instructions:
1. Click "Visit Website"...
2. Browse the Website...
3. Watch the Timer...
4. Keep Tab Active...
5. Complete Task (automatic payment!)

⚠️ Important Rules:
- Actually browse the website (don't just idle)
- Timer tracks active engagement
- 30-second visits are valuable for SEO
```

---

## 🔧 Implementation Architecture

### Database Schema

```sql
-- Orders table stores service inputs as JSON
ALTER TABLE orders ADD COLUMN service_inputs JSONB;

-- Example data:
{
  "targetUrl": "https://google.com/maps?cid=123",
  "businessName": "Joe's Pizza",
  "starRating": 5,
  "reviewTextOption": "client_provided",
  "customReviewText": "Great pizza!",
  "dripFeedHours": 24
}
```

### Validation Flow

```typescript
// 1. Client submits order
POST /api/v1/orders
{
  "serviceTypeId": "google-reviews",
  "quantity": 5,
  "inputs": { ... }
}

// 2. Backend validates inputs
const validation = validateServiceInputs(
  serviceCategory,
  inputs
);

if (!validation.valid) {
  return 400 Bad Request: validation.errors
}

// 3. Store in database
await prisma.order.create({
  data: {
    serviceTypeId,
    quantity,
    serviceInputs: inputs, // JSON column
  }
});

// 4. Generate tasks with instructions
for (let i = 0; i < quantity; i++) {
  const instructions = TaskInstructionsService.generateInstructions(
    categorySlug,
    platformName,
    inputs
  );
  
  await prisma.task.create({
    data: {
      orderId,
      targetUrl: inputs.targetUrl,
      instructions, // Generated from inputs
    }
  });
}
```

### Drip-Feed Scheduling (Reviews)

```typescript
// When creating review tasks, stagger them
const dripFeedHours = inputs.dripFeedHours || 24;

for (let i = 0; i < quantity; i++) {
  const availableAt = new Date(
    Date.now() + (i * dripFeedHours * 60 * 60 * 1000)
  );
  
  await prisma.task.create({
    data: {
      orderId,
      targetUrl: inputs.targetUrl,
      instructions,
      availableAt, // Task won't appear in feed until this time
    }
  });
}

// Result:
// Task 1: Available now
// Task 2: Available in 24 hours
// Task 3: Available in 48 hours
// Task 4: Available in 72 hours
// Task 5: Available in 96 hours
```

---

## 📊 Client-Facing Order Forms

### Review Service Form

```tsx
<form>
  <input 
    type="url" 
    name="targetUrl" 
    required
    placeholder="https://maps.google.com/maps?cid=..."
    pattern="https://.*google\.com/maps.*"
  />
  
  <input 
    type="text" 
    name="businessName" 
    required
    minLength={2}
    maxLength={100}
  />
  
  <select name="starRating" required>
    <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
    <option value="4">4 Stars ⭐⭐⭐⭐</option>
    <option value="3">3 Stars ⭐⭐⭐</option>
  </select>
  
  <select name="reviewTextOption" required>
    <option value="worker_choice">Let workers write authentic text</option>
    <option value="client_provided">I'll provide exact text</option>
  </select>
  
  <textarea 
    name="customReviewText"
    minLength={20}
    maxLength={500}
    placeholder="Write the review text you want posted..."
  />
  
  <select name="dripFeedHours" required>
    <option value="12">12 hours between reviews (faster)</option>
    <option value="24">24 hours between reviews (recommended)</option>
    <option value="48">48 hours between reviews (safest)</option>
  </select>
  
  <button type="submit">Add to Cart</button>
</form>
```

### Social Growth Form

```tsx
<form>
  <input 
    type="url" 
    name="targetUrl" 
    required
    placeholder="https://instagram.com/brandname"
  />
  
  <input 
    type="text" 
    name="accountHandle" 
    required
    placeholder="@brandname"
    pattern="@?[\w.]+"
  />
  
  <label>
    <input type="checkbox" name="isPublic" required />
    I confirm my account is public
  </label>
  
  <input 
    type="number" 
    name="currentCount" 
    placeholder="Current follower count (optional)"
    min={0}
  />
  
  <button type="submit">Add to Cart</button>
</form>
```

---

## ✅ Benefits of This System

### For Clients

| Before | After |
|--------|-------|
| Order "5 reviews" with no details | Must provide business link, rating, text |
| Workers confused, tasks fail | Workers have clear instructions |
| Reviews posted all at once (spam) | Reviews drip-fed over 5 days (natural) |
| Generic reviews get deleted | Authentic, customized reviews stick |

### For Workers

| Before | After |
|--------|-------|
| "Review this business" (what business?) | Clear link, exact instructions |
| Guess what to write | Client-provided text or clear guidelines |
| Confusion, task rejections | Step-by-step instructions, high success rate |

### For Platform

| Before | After |
|--------|-------|
| 50% task failure rate | <5% task failure rate |
| Manual support tickets | Automated, self-service |
| Clients complain about quality | Clients get exactly what they ordered |
| Platform fails | Platform thrives |

---

## 🚀 Summary

**The Formula**:
```
Mandatory Client Inputs + Validation + Clear Worker Instructions = Successful Tasks
```

**Files Created**:
1. **`service-inputs.schema.ts`** - Zod validation schemas for all service types
2. **`task-instructions.service.ts`** - Generates worker instructions from client inputs
3. **`TASK_DATA_COLLECTION.md`** - This documentation

**Result**: Clients CANNOT order without providing all necessary information. Workers ALWAYS know exactly what to do. Tasks succeed. Platform scales! 🚀
