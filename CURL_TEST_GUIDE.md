# Anti-Fraud System - Manual Curl Test Guide

## Quick Start

Run the automated test script:

```bash
./test-anti-fraud.sh
```

Or follow the manual steps below to understand how the anti-fraud system works.

---

## Manual Testing Steps

### Prerequisites

1. **Start your backend services**:
```bash
docker compose up -d
set -o allexport; source .env; set +o allexport
pnpm --filter @lookme/auth-service exec tsx src/index.ts &
pnpm --filter @lookme/catalog-service exec tsx src/index.ts &
pnpm --filter @lookme/order-service exec tsx src/index.ts &
pnpm --filter @lookme/task-service exec tsx src/index.ts &
pnpm --filter @lookme/wallet-service exec tsx src/index.ts &
pnpm --filter @lookme/api-gateway exec tsx src/index.ts &
```

2. **Set environment variables**:
```bash
export API_URL="http://localhost:4000"
```

---

## Step 1: Register/Login as Worker

```bash
# Register a new worker
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testworker@example.com",
    "password": "password123",
    "role": "WORKER"
  }' | jq '.'
```

**Save the access token** from the response:
```bash
export TOKEN="your_access_token_here"
```

Or login if already registered:
```bash
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testworker@example.com",
    "password": "password123"
  }' | jq '.'
```

---

## Step 2: Get Task Feed (Before Viewing)

```bash
curl -X GET "$API_URL/tasks/feed" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

**Expected Response**:
```json
{
  "data": [
    {
      "id": "task_abc123",
      "targetUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "categorySlug": "views",
      "rewardAmount": 0.015,
      "instructions": "Watch this video for 30 seconds"
    }
  ]
}
```

**Save a task ID and URL**:
```bash
export TASK_ID="task_abc123"
export VIDEO_URL="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

---

## Step 3: Accept Task (First Time - Should Succeed)

```bash
curl -X POST "$API_URL/tasks/$TASK_ID/accept" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "task_abc123",
    "status": "ASSIGNED",
    "workerId": "worker_xyz789",
    "assignedAt": "2026-05-16T18:00:00.000Z",
    "expiresAt": "2026-05-16T18:30:00.000Z"
  }
}
```

✅ **Task accepted successfully!**

---

## Step 4: Submit Proof (Records View History)

```bash
curl -X POST "$API_URL/tasks/submit-proof" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 203.0.113.42" \
  -d "{
    \"taskId\": \"$TASK_ID\",
    \"proofUrl\": \"$VIDEO_URL\",
    \"ipAddress\": \"203.0.113.42\",
    \"userAgent\": \"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)\",
    \"duration\": 35
  }" | jq '.'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_abc123",
      "status": "SUBMITTED",
      "submittedAt": "2026-05-16T18:05:00.000Z"
    },
    "proof": {
      "status": "PENDING",
      "proofUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  }
}
```

🎯 **View history recorded!** The system now knows this worker viewed this URL.

---

## Step 5: Get Task Feed Again (URL Should Be Filtered)

```bash
curl -X GET "$API_URL/tasks/feed" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

**Expected Response**:
```json
{
  "data": [
    {
      "id": "task_def456",
      "targetUrl": "https://www.youtube.com/watch?v=DIFFERENT_VIDEO",
      "categorySlug": "views"
    }
  ]
}
```

✅ **ANTI-FRAUD WORKING!** The original video URL is **no longer in the feed** for this worker.

---

## Step 6: Try to Accept Same URL Again (Should Fail)

If there's another task with the same URL:

```bash
# Find another task with same URL (if exists)
export TASK_ID_2="another_task_with_same_url"

curl -X POST "$API_URL/tasks/$TASK_ID_2/accept" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
```

**Expected Response**:
```json
{
  "success": false,
  "error": "URL_ALREADY_VIEWED",
  "message": "You have already viewed this URL. Each worker can only view a unique URL once to prevent spam detection by YouTube/Google Analytics."
}
```

🚫 **ANTI-FRAUD WORKING!** Worker is **blocked** from viewing the same URL twice.

---

## Step 7: Verify in Database

Check the view history was recorded:

```bash
psql -U postgres -d lookme -c "
  SELECT 
    worker_id,
    target_url,
    ip_address,
    duration,
    viewed_at
  FROM worker_view_history
  WHERE target_url = '$VIDEO_URL'
  ORDER BY viewed_at DESC
  LIMIT 5;
"
```

**Expected Output**:
```
           worker_id            |                  target_url                   |   ip_address   | duration |         viewed_at
--------------------------------+-----------------------------------------------+----------------+----------+---------------------------
 worker_xyz789                  | https://www.youtube.com/watch?v=dQw4w9WgXcQ  | 203.0.113.42   |       35 | 2026-05-16 18:05:00
```

---

## What This Proves

### ✅ The Golden Rule is Enforced

1. **Worker can view URL once** ✓
2. **URL disappears from their feed** ✓
3. **Worker cannot accept same URL again** ✓
4. **View is recorded with IP address** ✓

### 🛡️ Anti-Fraud Protection

- **1 Worker = 1 IP = 1 View per URL**
- Same worker **cannot** view same YouTube video 100 times
- YouTube sees **1,000 unique IPs** instead of 1 IP repeated 1,000 times
- Views **stay permanent** instead of being flagged as spam

### 🚀 Why This Makes You Unstoppable

| SMM Panel Bots | Your Platform |
|----------------|---------------|
| 1 IP × 1,000 views = SPAM | 1,000 IPs × 1 view each = ORGANIC |
| Views deleted by YouTube | Views stay forever |
| Client loses money | Client gets real results |

---

## Testing with Multiple Workers

To fully test the system, create multiple worker accounts:

```bash
# Worker 1
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "worker1@test.com", "password": "pass123", "role": "WORKER"}'

# Worker 2
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "worker2@test.com", "password": "pass123", "role": "WORKER"}'

# Worker 3
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "worker3@test.com", "password": "pass123", "role": "WORKER"}'
```

Then have each worker:
1. View the same YouTube video
2. Verify each gets paid
3. Verify each has unique IP recorded
4. Verify none can view it again

**Result**: 3 workers = 3 unique views = 3 unique IPs ✅

---

## Troubleshooting

### "No tasks available"

Create a test traffic order:

```bash
# First, login as a client
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "client@test.com", "password": "pass123"}'

# Then create an order (requires wallet balance)
curl -X POST "$API_URL/orders" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceTypeId": "youtube-views",
    "quantity": 100,
    "targetUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }'
```

### "Task not found"

Make sure you're using a valid task ID from the feed response.

### "Unauthorized"

Your access token may have expired. Login again to get a fresh token.

---

## Quick Test Script

For automated testing, use:

```bash
./test-anti-fraud.sh
```

This script will:
1. ✅ Login as worker
2. ✅ Get task feed
3. ✅ Accept a traffic task
4. ✅ Submit proof (record view)
5. ✅ Verify URL is filtered from feed
6. ✅ Verify worker cannot accept same URL again

---

**The Golden Rule**: `1 Worker = 1 IP = 1 View per URL`

This is what makes your platform **legitimate** and **unstoppable**! 🚀
