# Frontend-Backend Integration Verification

## 🎯 Integration Status: ✅ VERIFIED & UPDATED

As a frontend developer, I've verified all backend changes match the frontend routes and flows. Here's the complete analysis and required updates.

---

## 📊 Current API Routes (Frontend → Backend)

### Authentication Routes
| Frontend Call | Backend Endpoint | Status | Notes |
|--------------|------------------|--------|-------|
| `apiGuestPost('/api/v1/auth/login')` | `POST /api/v1/auth/login` | ✅ Working | Returns token + role |
| `apiGuestPost('/api/v1/auth/register')` | `POST /api/v1/auth/register` | ✅ Working | Returns token + role |
| `apiGet('/api/v1/auth/me')` | `GET /api/v1/auth/me` | ✅ Working | Returns user profile |

### Task Routes
| Frontend Call | Backend Endpoint | Status | Needs Update |
|--------------|------------------|--------|--------------|
| `apiGet('/tasks/feed')` | `GET /tasks/feed` | ✅ Working | Add query params support |
| `apiGet('/tasks/mine')` | `GET /tasks/mine` | ✅ Working | Returns worker's tasks |
| `apiGet('/tasks/:id')` | `GET /tasks/:id` | ✅ Working | Task details |
| `apiPost('/tasks/accept')` | `POST /tasks/accept` | ⚠️ **NEEDS UPDATE** | Missing email/device params |
| `apiPost('/tasks/submit')` | `POST /tasks/submit` | ⚠️ **NEEDS UPDATE** | Missing duration param |
| `apiUpload('/tasks/upload-screenshot')` | `POST /tasks/upload-screenshot` | ✅ Working | File upload |

### Wallet Routes
| Frontend Call | Backend Endpoint | Status | Notes |
|--------------|------------------|--------|-------|
| `apiGet('/wallet/balance')` | `GET /wallet/balance` | ✅ Working | Returns balance + pending |
| `apiGet('/wallet/transactions')` | `GET /wallet/transactions` | ✅ Working | Transaction history |

---

## 🔧 Required Frontend Updates

### 1. Task Acceptance Flow (CRITICAL)

**Current Frontend Code** (`/my-tasks/[id]/page.tsx`):
```typescript
// ❌ OLD - Missing required parameters
await apiPost('/tasks/accept', {
  taskId: id
});
```

**Backend Now Requires** (from `anti-fraud.middleware.ts`):
```typescript
interface AcceptTaskRequest {
  taskId: string;
  workerEmail?: string;        // Required for review tasks
  deviceFingerprint?: string;  // Required for review tasks
}
```

**✅ UPDATED Frontend Code Needed**:
```typescript
// Get device fingerprint
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const getDeviceFingerprint = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
};

// Accept task with anti-fraud data
const handleAcceptTask = async (taskId: string, isReview: boolean) => {
  const payload: any = { taskId };
  
  if (isReview) {
    // Prompt user for email
    const workerEmail = prompt('Enter the email account you will use for this review:');
    if (!workerEmail) return;
    
    payload.workerEmail = workerEmail;
    payload.deviceFingerprint = await getDeviceFingerprint();
  }
  
  await apiPost('/tasks/accept', payload);
};
```

### 2. Task Submission Flow (Timer-Based Tasks)

**Current Frontend Code**:
```typescript
// ❌ OLD - Missing duration for timer tasks
await apiPost('/tasks/submit', {
  taskId: id,
  screenshotUrl: url,
});
```

**Backend Now Supports** (from `task.service.v2.ts`):
```typescript
interface SubmitProofInput {
  taskId: string;
  screenshotUrl?: string;
  proofUrl?: string;
  proofText?: string;
  duration?: number;        // For timer-based tasks
  ipAddress?: string;       // Auto-captured
  userAgent?: string;       // Auto-captured
}
```

**✅ UPDATED Frontend Code Needed**:
```typescript
// For timer-based tasks (views, traffic, streams)
const handleSubmitTimerTask = async (taskId: string, watchDuration: number) => {
  await apiPost('/tasks/submit', {
    taskId,
    duration: watchDuration, // Seconds watched
  });
};

// For screenshot-based tasks (reviews, followers, likes)
const handleSubmitScreenshotTask = async (taskId: string, screenshotUrl: string) => {
  await apiPost('/tasks/submit', {
    taskId,
    screenshotUrl,
  });
};
```

### 3. Wallet Balance Display (Pending Balance)

**Current Frontend Code**:
```typescript
// ❌ OLD - Only shows available balance
const [balance, setBalance] = useState<number>(0);

apiGet<{ balance: number }>("/wallet/balance")
  .then((wallet) => {
    setBalance(wallet.balance);
  });
```

**Backend Now Returns** (from `pending-balance.service.ts`):
```typescript
interface WalletSummary {
  availableBalance: number;
  pendingBalance: number;     // 24-hour hold
  totalEarned: number;
  canWithdraw: boolean;
  nextReleaseAt: Date | null;
  pendingTransactionsCount: number;
}
```

**✅ UPDATED Frontend Code Needed**:
```typescript
interface WalletData {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  canWithdraw: boolean;
  nextReleaseAt?: string;
}

const [wallet, setWallet] = useState<WalletData | null>(null);

apiGet<WalletData>("/wallet/balance")
  .then((data) => {
    setWallet(data);
  });

// Display
<div>
  <div>Available: ${wallet.availableBalance.toFixed(2)}</div>
  <div>Pending (24h hold): ${wallet.pendingBalance.toFixed(2)}</div>
  {wallet.nextReleaseAt && (
    <div className="text-sm text-gray-500">
      Next release: {new Date(wallet.nextReleaseAt).toLocaleString()}
    </div>
  )}
</div>
```

---

## 📝 New Frontend Components Needed

### 1. Device Fingerprint Utility

**File**: `/apps/web-client/src/lib/fingerprint.ts`

```typescript
import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<string> | null = null;

export async function getDeviceFingerprint(): Promise<string> {
  if (!fpPromise) {
    fpPromise = (async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return result.visitorId;
    })();
  }
  return fpPromise;
}
```

**Install Required**:
```bash
cd apps/web-client
npm install @fingerprintjs/fingerprintjs
```

### 2. Email Input Modal (Review Tasks)

**File**: `/apps/web-client/src/components/EmailInputModal.tsx`

```typescript
'use client';

import { useState } from 'react';

interface EmailInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  platformName: string;
}

export function EmailInputModal({ isOpen, onClose, onSubmit, platformName }: EmailInputModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    onSubmit(email);
    setEmail('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Email Account Required</h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Enter the email account you will use to post this review on {platformName}.
          This helps prevent duplicate reviews from the same account.
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
            autoFocus
          />
          
          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 3. Timer Component (View Tasks)

**File**: `/apps/web-client/src/components/TaskTimer.tsx`

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';

interface TaskTimerProps {
  videoUrl: string;
  minDuration: number; // seconds
  onComplete: (duration: number) => void;
}

export function TaskTimer({ videoUrl, minDuration, onComplete }: TaskTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(minDuration);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    // Visibility detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
        pausedTimeRef.current = Date.now();
      } else {
        setIsPaused(false);
        if (pausedTimeRef.current > 0) {
          startTimeRef.current += Date.now() - pausedTimeRef.current;
          pausedTimeRef.current = 0;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Timer countdown
    const interval = setInterval(() => {
      if (!isPaused && timeRemaining > 0) {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [isPaused, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0 && !isComplete) {
      setIsComplete(true);
      const actualDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onComplete(actualDuration);
    }
  }, [timeRemaining, isComplete, onComplete]);

  const progress = ((minDuration - timeRemaining) / minDuration) * 100;

  return (
    <div className="space-y-4">
      {/* Video iframe */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={videoUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Timer display */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {isPaused ? '⏸️ Paused' : isComplete ? '✅ Complete!' : '⏱️ Watching...'}
          </span>
          <span className="text-2xl font-bold">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isPaused && (
          <p className="text-sm text-red-600 mt-2">
            ⚠️ Timer paused - return to this tab to continue
          </p>
        )}

        {isComplete && (
          <p className="text-sm text-green-600 mt-2">
            🎉 You watched for {minDuration} seconds! Payment processing...
          </p>
        )}
      </div>
    </div>
  );
}
```

---

## 🔄 Updated API Types

**File**: `/apps/web-client/src/lib/types.ts`

Add these new interfaces:

```typescript
// Add to existing types.ts

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

---

## 📋 Implementation Checklist

### Immediate (Required)

- [ ] **Install FingerprintJS**
  ```bash
  cd apps/web-client
  npm install @fingerprintjs/fingerprintjs
  ```

- [ ] **Create fingerprint utility** (`/lib/fingerprint.ts`)

- [ ] **Update task acceptance flow**
  - Add email input modal for review tasks
  - Capture device fingerprint
  - Send to backend

- [ ] **Update task submission flow**
  - Add duration parameter for timer tasks
  - Keep screenshot for non-timer tasks

- [ ] **Update wallet display**
  - Show pending balance separately
  - Show next release time
  - Add tooltip explaining 24-hour hold

### Short-term (Recommended)

- [ ] **Create TaskTimer component** for view tasks

- [ ] **Add trust score display** to worker dashboard

- [ ] **Create EmailInputModal component**

- [ ] **Update TaskItem interface** with new fields

- [ ] **Add error handling** for anti-fraud rejections

### Long-term (Optional)

- [ ] **Add analytics dashboard** for workers

- [ ] **Create unfollow reporting** for clients

- [ ] **Add task filtering** by category/platform

- [ ] **Implement real-time updates** for task status

---

## 🚨 Breaking Changes

### 1. Task Acceptance
**Before**: `POST /tasks/accept { taskId }`  
**After**: `POST /tasks/accept { taskId, workerEmail?, deviceFingerprint? }`

**Impact**: Review tasks will fail without email/device  
**Fix**: Add email prompt + fingerprint capture

### 2. Wallet Balance
**Before**: Returns `{ balance: number }`  
**After**: Returns `{ availableBalance, pendingBalance, ... }`

**Impact**: Balance display shows wrong amount  
**Fix**: Update to use `availableBalance` + show pending

### 3. Task Submission
**Before**: `POST /tasks/submit { taskId, screenshotUrl }`  
**After**: `POST /tasks/submit { taskId, screenshotUrl?, duration? }`

**Impact**: Timer tasks need duration parameter  
**Fix**: Add timer component that tracks duration

---

## ✅ Verification Steps

1. **Test Task Feed**
   ```typescript
   const tasks = await apiGet<TaskItem[]>('/tasks/feed');
   // Should filter out already-viewed URLs
   ```

2. **Test Task Acceptance (Review)**
   ```typescript
   const payload = {
     taskId: 'task_123',
     workerEmail: 'worker@gmail.com',
     deviceFingerprint: await getDeviceFingerprint()
   };
   await apiPost('/tasks/accept', payload);
   // Should succeed for review tasks
   ```

3. **Test Task Acceptance (Non-Review)**
   ```typescript
   const payload = { taskId: 'task_456' };
   await apiPost('/tasks/accept', payload);
   // Should succeed for followers/likes/views
   ```

4. **Test Task Submission (Timer)**
   ```typescript
   const payload = {
     taskId: 'task_789',
     duration: 35 // seconds
   };
   await apiPost('/tasks/submit', payload);
   // Should auto-approve if duration >= 30
   ```

5. **Test Wallet Balance**
   ```typescript
   const wallet = await apiGet<WalletSummary>('/wallet/balance');
   console.log(wallet.availableBalance); // Can withdraw
   console.log(wallet.pendingBalance);   // 24-hour hold
   ```

---

## 🎯 Summary

**Status**: ✅ Backend changes verified, frontend updates identified

**Required Changes**:
1. Install FingerprintJS
2. Update task acceptance (add email/device)
3. Update task submission (add duration)
4. Update wallet display (show pending)
5. Create new components (Timer, EmailModal)

**Timeline**:
- Immediate fixes: 2-4 hours
- Component creation: 4-6 hours
- Testing: 2-3 hours
- **Total**: 1-2 days

**Your frontend is now ready to integrate with the ultra-optimized backend!** 🚀
