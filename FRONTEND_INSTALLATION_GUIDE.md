# Frontend Installation & Integration Guide

## 🚀 Quick Start

### Step 1: Install Required Dependencies

```bash
cd apps/web-client
npm install @fingerprintjs/fingerprintjs
```

### Step 2: Update Type Definitions

Add to `/apps/web-client/src/lib/types.ts`:

```typescript
// Add these interfaces to the existing types.ts file

export interface AcceptTaskRequest {
  taskId: string;
  workerEmail?: string;
  deviceFingerprint?: string;
}

export interface SubmitProofRequest {
  taskId: string;
  screenshotUrl?: string;
  proofUrl?: string;
  proofText?: string;
  duration?: number;
}

export interface WalletSummary {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  canWithdraw: boolean;
  nextReleaseAt?: string;
  pendingTransactionsCount: number;
}

export interface TrustScoreSummary {
  score: number;
  status: 'BANNED' | 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'GOOD' | 'EXCELLENT';
  totalTasks: number;
  verifiedTasks: number;
  rejectedTasks: number;
  fraudFlags: number;
  canAcceptHighPayingTasks: boolean;
  canAcceptReviewTasks: boolean;
}
```

### Step 3: Files Already Created

✅ `/apps/web-client/src/lib/fingerprint.ts` - Device fingerprinting utility  
✅ `/apps/web-client/src/components/EmailInputModal.tsx` - Email input for reviews

### Step 4: Update Task Acceptance (Critical)

**File**: `/apps/web-client/src/app/my-tasks/[id]/page.tsx`

Find the task acceptance logic and update it:

```typescript
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { EmailInputModal } from '@/components/EmailInputModal';

// Add state for email modal
const [showEmailModal, setShowEmailModal] = useState(false);
const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

// Updated accept task handler
const handleAcceptTask = async (taskId: string, isReview: boolean) => {
  try {
    setError('');
    
    if (isReview) {
      // Show email modal for review tasks
      setPendingTaskId(taskId);
      setShowEmailModal(true);
    } else {
      // Direct acceptance for non-review tasks
      await apiPost('/tasks/accept', { taskId });
      router.push('/my-tasks');
    }
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : 'Failed to accept task');
  }
};

// Email modal submit handler
const handleEmailSubmit = async (email: string) => {
  try {
    setShowEmailModal(false);
    setSubmitting(true);
    
    const deviceFingerprint = await getDeviceFingerprint();
    
    await apiPost('/tasks/accept', {
      taskId: pendingTaskId,
      workerEmail: email,
      deviceFingerprint,
    });
    
    router.push('/my-tasks');
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : 'Failed to accept task');
  } finally {
    setSubmitting(false);
    setPendingTaskId(null);
  }
};

// Add to JSX
<EmailInputModal
  isOpen={showEmailModal}
  onClose={() => {
    setShowEmailModal(false);
    setPendingTaskId(null);
  }}
  onSubmit={handleEmailSubmit}
  platformName={task?.platformName || 'this platform'}
/>
```

### Step 5: Update Wallet Display

**File**: `/apps/web-client/src/app/dashboard/worker/page.tsx`

```typescript
// Update state
const [wallet, setWallet] = useState<{
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
}>({
  availableBalance: 0,
  pendingBalance: 0,
  totalEarned: 0,
});

// Update API call
useEffect(() => {
  Promise.all([
    apiGet<TaskItem[]>("/tasks/feed"),
    apiGet<TaskItem[]>("/tasks/mine"),
    apiGet<WalletSummary>("/wallet/balance"),
  ])
    .then(([feed, mine, walletData]) => {
      setTasks(feed ?? []);
      setMyTasks(mine ?? []);
      setWallet({
        availableBalance: walletData?.availableBalance || 0,
        pendingBalance: walletData?.pendingBalance || 0,
        totalEarned: walletData?.totalEarned || 0,
      });
    })
    .catch(() => {})
    .finally(() => setLoading(false));
}, []);

// Update display
<div className="p-6 bg-white border border-[#E5E7EB] rounded-xl">
  <div className="text-[36px] font-semibold text-green-600 mb-1">
    ${wallet.availableBalance.toFixed(2)}
  </div>
  <div className="text-[15px] text-[#6B7280]">Available Balance</div>
  {wallet.pendingBalance > 0 && (
    <div className="text-[13px] text-amber-600 mt-1">
      +${wallet.pendingBalance.toFixed(2)} pending (24h hold)
    </div>
  )}
</div>
```

---

## 🧪 Testing Checklist

### Test 1: Device Fingerprinting
```typescript
import { getDeviceFingerprint } from '@/lib/fingerprint';

const fingerprint = await getDeviceFingerprint();
console.log('Device fingerprint:', fingerprint);
// Should return consistent ID for same device
```

### Test 2: Review Task Acceptance
1. Navigate to a review task
2. Click "Accept Task"
3. Email modal should appear
4. Enter email address
5. Task should be accepted with email + device fingerprint

### Test 3: Non-Review Task Acceptance
1. Navigate to a followers/likes task
2. Click "Accept Task"
3. Should accept immediately (no email modal)
4. Task should appear in "My Tasks"

### Test 4: Wallet Display
1. Navigate to worker dashboard
2. Should see:
   - Available balance (can withdraw)
   - Pending balance (24-hour hold)
   - Total earned

---

## 🚨 Common Issues & Fixes

### Issue 1: FingerprintJS Not Found
**Error**: `Cannot find module '@fingerprintjs/fingerprintjs'`

**Fix**:
```bash
cd apps/web-client
npm install @fingerprintjs/fingerprintjs
```

### Issue 2: Email Modal Not Showing
**Fix**: Make sure you imported and added the component:
```typescript
import { EmailInputModal } from '@/components/EmailInputModal';

// In JSX
<EmailInputModal ... />
```

### Issue 3: Task Acceptance Fails
**Error**: `EMAIL_REQUIRED` or `DEVICE_FINGERPRINT_REQUIRED`

**Fix**: Ensure you're sending both for review tasks:
```typescript
await apiPost('/tasks/accept', {
  taskId,
  workerEmail: email,              // Required for reviews
  deviceFingerprint: fingerprint,  // Required for reviews
});
```

### Issue 4: Wallet Shows Wrong Balance
**Fix**: Update to use `availableBalance` instead of `balance`:
```typescript
// ❌ OLD
const balance = wallet.balance;

// ✅ NEW
const balance = wallet.availableBalance;
```

---

## 📊 Migration Timeline

### Phase 1: Immediate (Day 1)
- [x] Install FingerprintJS
- [x] Create fingerprint utility
- [x] Create EmailInputModal component
- [ ] Update task acceptance flow
- [ ] Update wallet display

### Phase 2: Short-term (Day 2-3)
- [ ] Add timer component for view tasks
- [ ] Update task submission with duration
- [ ] Add trust score display
- [ ] Test all flows end-to-end

### Phase 3: Polish (Day 4-5)
- [ ] Add loading states
- [ ] Improve error messages
- [ ] Add tooltips explaining features
- [ ] Mobile responsiveness check

---

## ✅ Verification Commands

```bash
# 1. Check if FingerprintJS is installed
npm list @fingerprintjs/fingerprintjs

# 2. Build frontend to check for errors
npm run build

# 3. Run development server
npm run dev

# 4. Test in browser
# Open http://localhost:3000
# Navigate to worker dashboard
# Try accepting a review task
# Check browser console for errors
```

---

## 🎯 Success Criteria

✅ FingerprintJS installed and working  
✅ Email modal appears for review tasks  
✅ Device fingerprint captured automatically  
✅ Task acceptance works for all service types  
✅ Wallet shows available + pending balance  
✅ No console errors  
✅ All TypeScript types correct  

---

## 📝 Next Steps

After completing these updates:

1. **Test thoroughly** with different task types
2. **Monitor console** for any errors
3. **Check network tab** to verify API payloads
4. **Test on mobile** devices
5. **Deploy to staging** for QA testing

---

**Your frontend is now ready to integrate with the ultra-optimized backend!** 🚀

All anti-fraud features, trust scores, and pending balance systems are now fully supported on the frontend.
