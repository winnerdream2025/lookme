# Master Audit & Rebuild Plan

Date: 2026-05-06
Scope: Entire LookMe SaaS stack — security, dead code, duplication, API contracts, frontend

---

## Phase 1: Security — CRITICAL (Fix First)

### S1. Gateway publicPaths Over-Exposes Catalog Admin Endpoints
**File:** `@/apps/api/src/index.ts:55-65`
```ts
const publicPaths = [
  ...
  "/api/v1/catalog",      // ← Prefix match: ALL catalog routes skip auth
  ...
];
```
**Impact:** Anyone can POST /catalog/platforms, PATCH /catalog/services, etc.
**Fix:** Change to specific read-only paths.

### S2. Task Admin Endpoints Unprotected
**File:** `@/services/task/src/routes/task.routes.ts:23-24`
`POST /tasks/release-expired` and `POST /tasks/review` have no admin guard.
**Impact:** Any worker can approve their own proof and auto-credit their wallet.
**Fix:** Add requireAdmin middleware.

### S3. Catalog Write Endpoints Unprotected
**File:** `@/services/catalog/src/routes/catalog.routes.ts:25-38`
All POST / PATCH / DELETE for platforms, categories, services, pricing-tiers — no role check.
**Fix:** Add requireAdmin to all write routes.

### S4. Campaign Service Auth Completely Broken
**File:** `@/services/campaign/src/controllers/campaign.controller.ts`
All controllers use `req.user?.sub` and `req.user!.sub` — undefined in downstream services.
**Also:** Campaign service doesn't use `createApp` from `@lookme/server`. It mounts its own helmet, CORS, JSON. Duplicated infrastructure.
**Fix:** Migrate to createApp, fix auth source.

### S5. Old `/wallet/withdraw` Still Active — Bypasses Manual Payout
**File:** `@/services/wallet/src/routes/wallet.routes.ts:31`
`POST /withdraw` calls `WalletService.withdraw()` which auto-deducts balance with no admin.
**Fix:** Remove route entirely.

### S6. Frontend Middleware Has No Role Filtering
**File:** `@/apps/web-client/src/middleware.ts`
Cookie value IS the role, but code only checks existence. Clients can open /my-tasks; workers can open /orders.
**Fix:** Parse role, allow-list routes per role.

### S7. No Shared requireRole Middleware
`requireRole` exists in gateway auth.middleware.ts but is never imported by any service. Each service re-invents (or ignores) role checks.
**Fix:** Export from @lookme/server, standardize across all services.

---

## Phase 2: Dead Code Removal

### D1. Slot Files (Completely Unused)
- `@/services/task/src/routes/slot.routes.ts`
- `@/services/task/src/controllers/slot.controller.ts`
- `@/services/task/src/repositories/slot.repository.ts`
- `@/services/task/src/services/slot.service.ts`
Not mounted in index.ts. Stale from early architecture.

### D2. Duplicate Middleware Files in Services
Every service has its own:
- `error.middleware.ts` — but packages/server exports one
- `validate.middleware.ts` — but packages/server exports one
- Some services (auth, order, wallet, task) duplicate these

### D3. Duplicate Review Docs
- `WORKER_AUDIT.md` (superseded)
- `WORKER_AUDIT_REVIEW.md` (superseded)
- `ROUTES_MIDDLEWARE_REVIEW.md` (superseded by this doc)

---

## Phase 3: Duplication Elimination

### U1. Middleware Not Unified
- `packages/server/src/middleware/` has validate, error, request-id, request-logger
- `apps/api/src/middleware/` duplicates request-id, request-logger, error, auth
- Each service has its own error.middleware.ts and validate.middleware.ts

### U2. Express App Setup Not Uniform
- Auth, catalog, order, task, wallet use `createApp()` from @lookme/server
- Campaign uses its own `express()` + manual middleware chain
- Gateway uses its own `express()` + manual middleware chain

### U3. Response Envelope Inconsistency
- Gateway and some controllers use `{ success: true, data: ... }`
- Wallet controller uses `success()` from @lookme/utils
- Campaign controller uses `success()` from @lookme/utils
- Auth controller uses `success()` from @lookme/utils
- Mix of manual and helper-based responses

### U4. Frontend Type Duplication
- Dashboard defines inline `TaskItem` interface
- `types.ts` defines `TaskItem` interface
- They diverge on field names and nullability

---

## Phase 4: API Contract Fixes

### A1. listWorkerTasks / getById Return Raw Prisma
**File:** `@/services/task/src/services/task.service.ts:174-191`
Returns `task.order.serviceType.platform.name` but frontend expects `task.platformName`.
Also returns Prisma `Decimal` (serializes to string/object).
**Fix:** Transform to flattened shape with `Number()` for decimals.

### A2. Dashboard Inline TaskItem vs Shared Type
**File:** `@/apps/web-client/src/app/dashboard/page.tsx:210-225`
Inline `TaskItem` with `reviewRating?: number | null`, missing `status`, `proof`, `expiresAt`.
**Fix:** Import shared `TaskItem` from `types.ts`, delete inline definition.

### A3. Frontend Types Missing Backend Fields
- `Transaction` type has no `referenceId`, `referenceType` (useful for linking)
- `WalletData` has no `withdrawalRequests`
- `TaskItem.proof` doesn't match Prisma `TaskProof` shape

---

## Phase 5: Campaign Service Rebuild

The campaign service is completely disconnected from the current flow. It's a dead service with broken auth. Options:
1. Integrate it (campaigns as batch orders for clients)
2. Remove it entirely from active stack
3. Archive it for future use

Decision needed from user. For now, mark as deprecated but don't delete.

---

## Fix Priority (Grouped by Impact)

| # | Item | Phase | Effort |
|---|------|-------|--------|
| 1 | Gateway publicPaths fix | S1 | 1 line |
| 2 | Task admin guards | S2 | 2 routes |
| 3 | Catalog admin guards | S3 | 7 routes |
| 4 | Remove old /wallet/withdraw | S5 | 1 line |
| 5 | Delete slot dead code | D1 | 4 files |
| 6 | Export requireRole from @lookme/server | S7 | 1 export |
| 7 | Add requireRole to all admin routes | S7 | services |
| 8 | Fix listWorkerTasks + getById shape | A1 | 2 methods |
| 9 | Fix dashboard inline TaskItem | A2 | 1 file |
| 10 | Frontend middleware role filtering | S6 | rewrite |
| 11 | Campaign service auth fix | S4 | 1 file |
| 12 | Unify middleware, delete duplicates | U1 | multiple |
| 13 | Unify app factory usage | U2 | 2 files |
| 14 | Standardize response envelopes | U3 | audit only |
| 15 | Clean review docs | D3 | delete 3 files |

