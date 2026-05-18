# 🎯 ADMIN SIDE - COMPREHENSIVE PLAN

## **GOALS REVIEW**

### **Primary Goals:**
1. **Approve 10,000 tasks efficiently** → Bulk approval UI
2. **Pay workers** → Withdrawal approval + CSV export
3. **Catch fraud** → Sampling review + ban worker
4. **Platform visibility** → Dashboard with stats

---

## **EXISTING BACKEND (Already Built ✅)**

### **Task Service - Admin Endpoints**
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /tasks?status=SUBMITTED` | GET | List submitted tasks | ✅ Built |
| `POST /tasks/review` | POST | Approve/reject single task | ✅ Built |
| `POST /tasks/bulk-review` | POST | Approve/reject up to 100 tasks | ✅ Built |
| `POST /tasks/release-expired` | POST | Release expired tasks | ✅ Built |

**What Works:**
- ✅ Filter tasks by status (SUBMITTED, VERIFIED, PAID, etc.)
- ✅ Pagination support
- ✅ Bulk approval (max 100 tasks)
- ✅ Idempotency (prevents double-approval)
- ✅ Returns summary: `{approved, rejected, duplicates, failed}`

**What's Missing:**
- ❌ No UI to use these endpoints
- ❌ No endpoint to list sampled tasks (5% audit)
- ❌ No ban worker endpoint

---

### **Wallet Service - Admin Endpoints**
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /withdrawals/pending` | GET | List pending withdrawals | ✅ Built |
| `POST /withdrawals/review` | POST | Approve/reject withdrawal | ✅ Built |
| `POST /withdrawals/pay` | POST | Mark as paid + upload proof | ✅ Built |

**What Works:**
- ✅ List all PENDING withdrawals
- ✅ Approve/reject with admin notes
- ✅ Mark as PAID with payment proof URL
- ✅ Full audit trail (reviewedBy, reviewedAt, paidAt)

**What's Missing:**
- ❌ No UI to use these endpoints
- ❌ No CSV export endpoint
- ❌ No batch approval for withdrawals

---

## **ARCHITECTURE REVIEW**

### **Existing Patterns (Code Reuse)**

#### **1. Worker Pages Pattern**
```typescript
// File: /apps/web-client/src/app/dashboard/earnings/page.tsx
"use client";

export default function EarningsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await apiGet("/wallet/me");
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      {/* Content */}
    </div>
  );
}
```

**Reusable for Admin:**
- ✅ Same loading/error pattern
- ✅ Same API call pattern
- ✅ Same component structure

---

#### **2. API Client Pattern**
```typescript
// File: /apps/web-client/src/lib/api.ts
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${env.apiUrl}${path}`, {
    headers: {
      "x-user-id": session.userId,
      "x-user-role": session.role,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data;
}
```

**Reusable for Admin:**
- ✅ Just need to set `x-user-role: admin`
- ✅ Same error handling
- ✅ Same response format

---

#### **3. Table/List Pattern**
```typescript
// From worker withdrawals page
{withdrawals.map((withdrawal) => (
  <div key={withdrawal.id} className="border rounded-xl p-6">
    <div className="flex items-start justify-between">
      <div>
        <h3>${withdrawal.amount}</h3>
        <p>{withdrawal.method}</p>
      </div>
      <StatusBadge status={withdrawal.status} />
    </div>
  </div>
))}
```

**Reusable for Admin:**
- ✅ Same card layout
- ✅ Same status badges
- ✅ Add action buttons (Approve/Reject)

---

## **ADMIN PAGES PLAN**

### **Page 1: `/admin` - Dashboard Overview**

**Purpose:** High-level stats and quick actions

**Layout:**
```
┌─────────────────────────────────────────┐
│  Admin Dashboard                        │
├─────────────────────────────────────────┤
│  Stats Cards:                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 245  │ │  12  │ │  8   │ │ $450 │  │
│  │Tasks │ │Pending│ │Sampled│ │Pending│ │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│  Quick Actions:                         │
│  [View Tasks] [View Withdrawals]        │
└─────────────────────────────────────────┘
```

**Data Sources:**
- `GET /tasks?status=SUBMITTED` → Count
- `GET /withdrawals/pending` → Count + total amount
- `GET /tasks?needsReview=true` → Sampled count

**Components:**
- ✅ Reuse: Spinner, ErrorBanner
- 🆕 New: StatCard component
- 🆕 New: QuickAction buttons

**Time:** 2-3 hours

---

### **Page 2: `/admin/tasks` - Task Approval Queue**

**Purpose:** Approve/reject submitted tasks in bulk

**Layout:**
```
┌─────────────────────────────────────────┐
│  Task Approval Queue                    │
│  [Filter: All ▼] [Search: ___]          │
├─────────────────────────────────────────┤
│  ☑ Select All (245 tasks)               │
│  [Approve Selected] [Reject Selected]   │
├─────────────────────────────────────────┤
│  ☑ Task #1 - Instagram Followers        │
│     Worker: john@example.com            │
│     Proof: [View Screenshot]            │
│     Amount: $0.018                      │
│  ─────────────────────────────────────  │
│  ☑ Task #2 - Google Review             │
│     Worker: jane@example.com            │
│     Proof: [View Screenshot]            │
│     Amount: $4.00                       │
│  ─────────────────────────────────────  │
│  [Load More]                            │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ Checkbox selection (multi-select)
- ✅ Bulk approve (max 100 at once)
- ✅ Bulk reject with reason
- ✅ Filter by category, worker, date
- ✅ View proof screenshot
- ✅ Pagination

**API Calls:**
- `GET /tasks?status=SUBMITTED&page=1&limit=20`
- `POST /tasks/bulk-review` with `{taskIds: [...], status: "VERIFIED"}`

**Components:**
- ✅ Reuse: Spinner, ErrorBanner
- 🆕 New: TaskCard with checkbox
- 🆕 New: BulkActionBar
- 🆕 New: ProofModal (view screenshot)

**Time:** 4-5 hours

---

### **Page 3: `/admin/tasks/sampled` - Sampled Tasks Review**

**Purpose:** Review 5% randomly sampled tasks

**Layout:**
```
┌─────────────────────────────────────────┐
│  Sampled Tasks (5% Audit)               │
│  12 tasks flagged for review            │
├─────────────────────────────────────────┤
│  Task #1 - Auto-approved                │
│  Worker: john@example.com (Trust: 65)   │
│  Proof: [View Screenshot]               │
│  [✓ Pass] [✗ Fail & Ban Worker]        │
│  ─────────────────────────────────────  │
│  Task #2 - Auto-approved                │
│  Worker: jane@example.com (Trust: 72)   │
│  Proof: [View Screenshot]               │
│  [✓ Pass] [✗ Fail & Ban Worker]        │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ List tasks with `needsReview: true` flag
- ✅ Show worker trust score
- ✅ Pass = do nothing (task already approved)
- ✅ Fail = ban worker + forfeit pending + requeue task

**API Calls:**
- `GET /tasks?needsReview=true`
- `POST /admin/workers/ban` (NEW - needs to be built)

**Components:**
- ✅ Reuse: TaskCard, ProofModal
- 🆕 New: SampledTaskCard with Pass/Fail buttons

**Time:** 3-4 hours

---

### **Page 4: `/admin/withdrawals` - Withdrawal Approval**

**Purpose:** Approve withdrawals and export to CSV

**Layout:**
```
┌─────────────────────────────────────────┐
│  Withdrawal Requests                    │
│  [Export to CSV] [Filter: Pending ▼]    │
├─────────────────────────────────────────┤
│  Withdrawal #1                          │
│  Worker: john@example.com               │
│  Amount: $12.50                         │
│  Method: PayPal → john.worker@paypal.com│
│  Requested: 2 hours ago                 │
│  [Approve] [Reject]                     │
│  ─────────────────────────────────────  │
│  Withdrawal #2                          │
│  Worker: jane@example.com               │
│  Amount: $45.00                         │
│  Method: Mobile Money → +1234567890     │
│  Requested: 5 hours ago                 │
│  [Approve] [Reject]                     │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ List pending withdrawals
- ✅ Approve/reject individual
- ✅ Export to CSV for batch payment
- ✅ Mark as paid after payment sent

**API Calls:**
- `GET /withdrawals/pending`
- `POST /withdrawals/review` with `{requestId, status: "APPROVED"}`
- `GET /withdrawals/export-csv` (NEW - needs to be built)
- `POST /withdrawals/pay` with `{requestId, paymentProofUrl}`

**Components:**
- ✅ Reuse: Spinner, ErrorBanner
- 🆕 New: WithdrawalCard
- 🆕 New: ExportButton
- 🆕 New: ApproveModal (with notes)

**Time:** 4-5 hours

---

### **Page 5: `/admin/withdrawals/approved` - Mark as Paid**

**Purpose:** Upload payment proof after manual payout

**Layout:**
```
┌─────────────────────────────────────────┐
│  Approved Withdrawals (Awaiting Payment)│
├─────────────────────────────────────────┤
│  Withdrawal #1                          │
│  Worker: john@example.com               │
│  Amount: $12.50                         │
│  PayPal: john.worker@paypal.com         │
│  Approved: 1 day ago                    │
│  Payment Proof: [Upload Screenshot]     │
│  [Mark as Paid]                         │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ List APPROVED withdrawals
- ✅ Upload payment proof (screenshot)
- ✅ Mark as PAID

**API Calls:**
- `GET /withdrawals?status=APPROVED`
- `POST /withdrawals/pay` with `{requestId, paymentProofUrl}`

**Components:**
- ✅ Reuse: WithdrawalCard
- 🆕 New: FileUpload component

**Time:** 2-3 hours

---

## **NEW BACKEND ENDPOINTS NEEDED**

### **1. CSV Export Endpoint** 🔴 Critical
```typescript
// File: /services/wallet/src/controllers/wallet.controller.ts
async exportPayoutsCsv(req: Request, res: Response, next: NextFunction) {
  try {
    const withdrawals = await walletService.listPendingWithdrawals();
    
    const csv = [
      'Email,Amount,Method,Account Details',
      ...withdrawals.map(w => 
        `${w.user.email},${w.amount},${w.method},"${w.accountDetails}"`
      )
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payouts.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
}
```

**Route:** `GET /withdrawals/export-csv`  
**Time:** 30 minutes

---

### **2. Ban Worker Endpoint** 🟡 Important
```typescript
// File: /services/task/src/controllers/task.controller.ts
async banWorker(req: Request, res: Response, next: NextFunction) {
  try {
    const { workerId, reason } = req.body;
    const result = await service.banWorker(workerId, reason);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// Service logic:
async banWorker(workerId: string, reason: string) {
  // 1. Update user status to BANNED
  // 2. Forfeit all pending balance
  // 3. Requeue all their VERIFIED tasks
  // 4. Create audit log
}
```

**Route:** `POST /admin/workers/ban`  
**Time:** 2 hours

---

### **3. Sampled Tasks Endpoint** 🟢 Nice to have
```typescript
// File: /services/task/src/controllers/task.controller.ts
async listSampled(req: Request, res: Response, next: NextFunction) {
  try {
    const tasks = await service.listSampledTasks();
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
}
```

**Route:** `GET /tasks/sampled`  
**Time:** 30 minutes

---

## **REUSABLE COMPONENTS**

### **From Worker Side (Already Built)**
- ✅ `Spinner` - Loading states
- ✅ `ErrorBanner` - Error messages
- ✅ Status badges (PENDING, APPROVED, etc.)
- ✅ Card layouts
- ✅ API client (`apiGet`, `apiPost`)

### **New Components Needed**
- 🆕 `StatCard` - Dashboard stats
- 🆕 `TaskCard` - Task list item with checkbox
- 🆕 `WithdrawalCard` - Withdrawal list item
- 🆕 `BulkActionBar` - Bulk approve/reject
- 🆕 `ProofModal` - View screenshot
- 🆕 `ApproveModal` - Approve with notes
- 🆕 `FileUpload` - Upload payment proof

---

## **IMPLEMENTATION PLAN**

### **Phase 1: Critical (Day 1)**
1. ✅ CSV Export endpoint (30 min)
2. ✅ Admin dashboard page (2-3 hours)
3. ✅ Task approval queue page (4-5 hours)

**Total:** 1 day  
**Gets you:** Bulk approval working!

---

### **Phase 2: Important (Day 2)**
4. ✅ Withdrawal approval page (4-5 hours)
5. ✅ Mark as paid page (2-3 hours)

**Total:** 1 day  
**Gets you:** Full withdrawal workflow!

---

### **Phase 3: Nice to Have (Day 3)**
6. ✅ Ban worker endpoint (2 hours)
7. ✅ Sampled tasks page (3-4 hours)

**Total:** 1 day  
**Gets you:** Complete fraud prevention!

---

## **TOTAL TIME ESTIMATE**

**Minimum (Phase 1):** 1 day → Functional admin panel  
**Recommended (Phase 1+2):** 2 days → Full admin workflow  
**Complete (All phases):** 3 days → All features

---

## **NEXT STEPS**

**Ready to start building?**

1. **Start with CSV export** (30 min) - Quick win
2. **Build admin dashboard** (2-3 hours) - Overview
3. **Build task queue** (4-5 hours) - Core feature
4. **Test bulk approval** - Verify it works
5. **Move to withdrawals** - Day 2

**Shall I start with the CSV export endpoint?** 🚀
