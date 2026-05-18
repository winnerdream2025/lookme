# 🧪 END-TO-END TEST PLAN - COMPLETE WORKFLOW

## **TEST ENVIRONMENT SETUP**

### **Prerequisites:**
```bash
# 1. Start all services
docker compose up -d
set -o allexport; source .env; set +o allexport

# 2. Start backend services
pnpm --filter @lookme/auth-service exec tsx src/index.ts &
pnpm --filter @lookme/catalog-service exec tsx src/index.ts &
pnpm --filter @lookme/order-service exec tsx src/index.ts &
pnpm --filter @lookme/task-service exec tsx src/index.ts &
pnpm --filter @lookme/wallet-service exec tsx src/index.ts &

# 3. Start frontend
pnpm --filter @lookme/web-client dev
```

### **Test Users:**
```sql
-- Admin User
INSERT INTO users (id, email, "passwordHash", role, "isActive", "isVerified", "createdAt", "updatedAt")
VALUES (
  'admin_test_001',
  'admin@lookme.com',
  '$2b$10$...',  -- Password: Admin123!
  'admin',
  true,
  true,
  NOW(),
  NOW()
);

-- Worker User
INSERT INTO users (id, email, "passwordHash", role, "isActive", "isVerified", "createdAt", "updatedAt")
VALUES (
  'worker_test_001',
  'worker@lookme.com',
  '$2b$10$...',  -- Password: Worker123!
  'worker',
  true,
  true,
  NOW(),
  NOW()
);

-- Create wallet for worker
INSERT INTO wallets ("userId", balance, "pendingBalance", "totalEarned", "totalWithdrawn", "createdAt", "updatedAt")
VALUES ('worker_test_001', 0, 0, 0, 0, NOW(), NOW());

-- Create trust score for worker
INSERT INTO trust_scores ("userId", score, "totalTasks", "verifiedTasks", "rejectedTasks", "flaggedTasks", "createdAt", "updatedAt")
VALUES ('worker_test_001', 50, 0, 0, 0, 0, NOW(), NOW());
```

---

## **TEST SCENARIO 1: ADMIN LOGIN FLOW**

### **Test 1.1: Admin Login**
**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter email: `admin@lookme.com`
3. Enter password: `Admin123!`
4. Click "Sign In"

**Expected Result:**
- ✅ Redirects to `/admin` dashboard
- ✅ Shows admin panel link in navbar
- ✅ Session stored in localStorage
- ✅ Cookie `lookme_logged_in=admin` set

**Verification:**
```javascript
// In browser console
localStorage.getItem('accessToken')  // Should have JWT
localStorage.getItem('userRole')     // Should be 'admin'
document.cookie                       // Should include lookme_logged_in=admin
```

---

### **Test 1.2: Admin Dashboard Loads**
**Steps:**
1. After login, verify on `/admin` page
2. Wait for stats to load

**Expected Result:**
- ✅ Shows 4 stat cards (Pending Tasks, Verified Tasks, Pending Withdrawals, Ready to Pay)
- ✅ Shows quick action buttons
- ✅ Auto-refreshes every 30 seconds
- ✅ No errors in console

**Verification:**
```bash
# Check API calls in Network tab
GET http://localhost:5004?status=SUBMITTED&limit=1  → 200 OK
GET http://localhost:5004?status=VERIFIED&limit=1   → 200 OK
GET http://localhost:5005/withdrawals/pending       → 200 OK
```

---

### **Test 1.3: Admin Task Queue**
**Steps:**
1. Click "Review Tasks" from dashboard
2. Verify redirects to `/admin/tasks`
3. Check task list loads

**Expected Result:**
- ✅ Shows submitted tasks (if any)
- ✅ Shows checkboxes for selection
- ✅ Shows "Select All" option
- ✅ Shows bulk action buttons

**Verification:**
```bash
# Check API call
GET http://localhost:5004?status=SUBMITTED&limit=50  → 200 OK
```

---

### **Test 1.4: Bulk Approve Tasks**
**Steps:**
1. Select 2-3 tasks using checkboxes
2. Click "Approve X" button
3. Confirm in dialog
4. Wait for result

**Expected Result:**
- ✅ Shows processing state
- ✅ Shows success alert with counts
- ✅ Task list refreshes
- ✅ Selected tasks move to "Verified" tab

**Verification:**
```bash
# Check API call
POST http://localhost:5004/bulk-review
{
  "taskIds": ["id1", "id2"],
  "status": "VERIFIED"
}
→ 200 OK
{
  "success": true,
  "data": {
    "approved": 2,
    "rejected": 0,
    "duplicates": 0,
    "failed": []
  }
}
```

---

### **Test 1.5: CSV Export**
**Steps:**
1. From dashboard, click "Export Payouts"
2. Wait for download

**Expected Result:**
- ✅ Downloads CSV file
- ✅ Filename: `payouts-YYYY-MM-DD.csv`
- ✅ Contains approved withdrawals
- ✅ Correct format: Email,Amount,Currency,Method,Account Details

**Verification:**
```bash
# Check API call
GET http://localhost:5005/withdrawals/export-csv  → 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="payouts-2026-05-16.csv"
```

---

### **Test 1.6: Admin Logout**
**Steps:**
1. Click user menu in navbar
2. Click "Sign out"

**Expected Result:**
- ✅ Redirects to `/login`
- ✅ localStorage cleared
- ✅ Cookie cleared
- ✅ Can't access `/admin` anymore

**Verification:**
```javascript
localStorage.getItem('accessToken')  // null
localStorage.getItem('userRole')     // null
```

---

## **TEST SCENARIO 2: WORKER LOGIN FLOW**

### **Test 2.1: Worker Login**
**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter email: `worker@lookme.com`
3. Enter password: `Worker123!`
4. Click "Sign In"

**Expected Result:**
- ✅ Redirects to `/dashboard/worker`
- ✅ Shows worker dashboard
- ✅ Shows "My Earnings" link in navbar
- ✅ Session stored with role=worker

---

### **Test 2.2: Worker Dashboard**
**Steps:**
1. Verify on `/dashboard/worker` page
2. Check stats display

**Expected Result:**
- ✅ Shows available tasks count
- ✅ Shows in-progress tasks
- ✅ Shows completed tasks
- ✅ Shows current balance
- ✅ Quick action links visible

---

### **Test 2.3: Worker Earnings Page**
**Steps:**
1. Click "My Earnings" from navbar
2. Verify redirects to `/dashboard/earnings`

**Expected Result:**
- ✅ Shows available balance
- ✅ Shows pending balance
- ✅ Shows pending tasks with countdown
- ✅ Shows transaction history
- ✅ Withdraw button enabled/disabled based on balance

**Verification:**
```bash
GET http://localhost:5005/me  → 200 OK
{
  "balance": 0,
  "pendingBalance": 0,
  "totalEarned": 0,
  "minimumWithdrawal": 10,
  "pendingTasks": []
}
```

---

### **Test 2.4: Worker Withdrawal Request**
**Steps:**
1. From earnings page, click "Withdraw"
2. Enter amount: $15
3. Select method: PayPal
4. Enter account: worker@paypal.com
5. Click "Request Withdrawal"

**Expected Result:**
- ✅ Shows success message
- ✅ Redirects to withdrawals history
- ✅ New request appears with PENDING status

**Verification:**
```bash
POST http://localhost:5005/withdrawals/request
{
  "amount": 15,
  "method": "PAYPAL",
  "accountDetails": "worker@paypal.com"
}
→ 200 OK
```

---

### **Test 2.5: Worker Withdrawal History**
**Steps:**
1. Navigate to `/dashboard/withdrawals`
2. Check withdrawal list

**Expected Result:**
- ✅ Shows all withdrawal requests
- ✅ Shows status (PENDING, APPROVED, PAID)
- ✅ Shows timeline
- ✅ "Confirm Receipt" button for PAID requests

---

## **TEST SCENARIO 3: COMPLETE WORKFLOW**

### **Test 3.1: Task Creation → Approval → Payment**

**Step 1: Create Test Task**
```sql
INSERT INTO tasks (
  id, "orderId", "workerId", status, "rewardAmount",
  "targetUrl", "createdAt", "updatedAt"
)
VALUES (
  'test_task_e2e_001',
  'test_order_001',
  'worker_test_001',
  'SUBMITTED',
  0.50,
  'https://instagram.com/test',
  NOW(),
  NOW()
);

INSERT INTO task_proofs (
  "taskId", "screenshotUrl", status, "createdAt", "updatedAt"
)
VALUES (
  'test_task_e2e_001',
  'https://example.com/proof.jpg',
  'PENDING',
  NOW(),
  NOW()
);
```

**Step 2: Admin Approves Task**
1. Admin logs in
2. Goes to `/admin/tasks`
3. Sees task in list
4. Selects task
5. Clicks "Approve"

**Expected:**
- ✅ Task status → VERIFIED
- ✅ Worker wallet pendingBalance += $0.35 (70% of $0.50)
- ✅ Transaction created with status PENDING
- ✅ Task expiresAt set to NOW + 24h

**Step 3: Wait for Hold to Expire**
```bash
# Manually trigger cron or wait 24 hours
# For testing, update expiresAt to past:
UPDATE tasks SET "expiresAt" = NOW() - INTERVAL '1 hour' WHERE id = 'test_task_e2e_001';

# Then trigger cron manually or wait 15 minutes
```

**Expected:**
- ✅ Cron job runs
- ✅ pendingBalance → balance
- ✅ Task status → PAID
- ✅ Transaction status → COMPLETED

**Step 4: Worker Withdraws**
1. Worker logs in
2. Goes to `/dashboard/earnings`
3. Sees available balance: $0.35
4. Clicks "Withdraw"
5. Requests $0.35 withdrawal

**Expected:**
- ✅ Withdrawal request created
- ✅ Balance deducted
- ✅ Status: PENDING

**Step 5: Admin Approves Withdrawal**
1. Admin goes to `/admin/withdrawals` (when built)
2. Sees pending withdrawal
3. Clicks "Approve"

**Expected:**
- ✅ Withdrawal status → APPROVED
- ✅ Shows in CSV export

**Step 6: Admin Exports CSV & Pays**
1. Admin clicks "Export CSV"
2. Downloads CSV
3. Processes payment via PayPal
4. Marks as paid (when UI built)

**Expected:**
- ✅ CSV contains worker email and amount
- ✅ Withdrawal status → PAID

---

## **TEST SCENARIO 4: ERROR HANDLING**

### **Test 4.1: Invalid Login**
**Steps:**
1. Try login with wrong password
2. Try login with non-existent email

**Expected:**
- ✅ Shows error message
- ✅ Doesn't redirect
- ✅ No session created

---

### **Test 4.2: Insufficient Balance**
**Steps:**
1. Worker tries to withdraw more than available

**Expected:**
- ✅ Shows error: "Insufficient available balance"
- ✅ Shows pending balance separately

---

### **Test 4.3: Minimum Withdrawal**
**Steps:**
1. Worker tries to withdraw $5

**Expected:**
- ✅ Shows error: "Minimum withdrawal amount is $10"

---

### **Test 4.4: Unauthorized Access**
**Steps:**
1. Worker tries to access `/admin`
2. Non-logged-in user tries to access `/dashboard`

**Expected:**
- ✅ Redirects to `/login`
- ✅ Preserves redirect URL

---

## **TEST SCENARIO 5: REAL-TIME UPDATES (WEBSOCKET)**

### **Test 5.1: Admin Dashboard Real-Time**
**Steps:**
1. Admin opens dashboard
2. Worker submits task (in another browser)
3. Watch admin dashboard

**Expected:**
- ✅ Pending tasks count updates immediately
- ✅ No page refresh needed
- ✅ WebSocket connection active

---

### **Test 5.2: Worker Earnings Real-Time**
**Steps:**
1. Worker opens earnings page
2. Admin approves task (in another browser)
3. Watch worker earnings

**Expected:**
- ✅ Pending balance updates immediately
- ✅ Pending tasks list updates
- ✅ Countdown timer updates

---

## **AUTOMATED TEST SCRIPT**

```bash
#!/bin/bash
# File: test-e2e.sh

echo "=== END-TO-END TEST SUITE ==="

# Test 1: Admin Login
echo "Test 1: Admin Login"
ADMIN_TOKEN=$(curl -s -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lookme.com","password":"Admin123!"}' \
  | jq -r '.data.accessToken')

if [ -n "$ADMIN_TOKEN" ]; then
  echo "✅ Admin login successful"
else
  echo "❌ Admin login failed"
  exit 1
fi

# Test 2: Admin Dashboard Stats
echo "Test 2: Admin Dashboard Stats"
STATS=$(curl -s http://localhost:5004?status=SUBMITTED&limit=1 \
  -H "x-user-role: admin" \
  | jq '.data.total')

echo "✅ Pending tasks: $STATS"

# Test 3: Worker Login
echo "Test 3: Worker Login"
WORKER_TOKEN=$(curl -s -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"worker@lookme.com","password":"Worker123!"}' \
  | jq -r '.data.accessToken')

if [ -n "$WORKER_TOKEN" ]; then
  echo "✅ Worker login successful"
else
  echo "❌ Worker login failed"
  exit 1
fi

# Test 4: Worker Wallet
echo "Test 4: Worker Wallet"
BALANCE=$(curl -s http://localhost:5005/me \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  | jq '.data.balance')

echo "✅ Worker balance: $BALANCE"

# Test 5: CSV Export
echo "Test 5: CSV Export"
CSV=$(curl -s http://localhost:5005/withdrawals/export-csv \
  -H "x-user-role: admin")

if [ -n "$CSV" ]; then
  echo "✅ CSV export successful"
else
  echo "❌ CSV export failed"
fi

echo "=== ALL TESTS COMPLETE ==="
```

---

## **CHECKLIST**

### **Admin Flow**
- [ ] Admin can login
- [ ] Dashboard loads with stats
- [ ] Task queue shows tasks
- [ ] Can bulk approve tasks
- [ ] CSV export downloads
- [ ] Auto-refresh works
- [ ] Can logout

### **Worker Flow**
- [ ] Worker can login
- [ ] Dashboard shows stats
- [ ] Earnings page loads
- [ ] Can request withdrawal
- [ ] Withdrawal history shows
- [ ] Can confirm receipt
- [ ] Can logout

### **Complete Workflow**
- [ ] Task approval → pending balance
- [ ] Hold expires → available balance
- [ ] Withdrawal request → pending
- [ ] Admin approves → approved
- [ ] CSV export → contains data
- [ ] Mark as paid → paid status

### **Real-Time**
- [ ] WebSocket connects
- [ ] Admin sees live updates
- [ ] Worker sees live updates
- [ ] Reconnects on disconnect

---

## **NEXT: WEBSOCKET IMPLEMENTATION**

Ready to implement WebSocket for real-time updates! 🚀
