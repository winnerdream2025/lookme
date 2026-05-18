# Role-Based Dashboard System

## Overview

Implemented separate, role-specific dashboards for Workers and Clients with distinct features, navigation, and action items system.

## Architecture

### Dashboard Routes

```
/dashboard                    → Redirects to role-specific dashboard
/dashboard/client            → Client overview (orders, stats)
/dashboard/worker            → Worker overview (tasks, earnings)
/dashboard/client/actions    → Admin requests for clients
/dashboard/worker/actions    → Admin requests for workers
/dashboard/client/profile    → Client profile settings
/dashboard/worker/profile    → Worker profile settings
```

### Layout System

**File:** `/app/dashboard/layout.tsx`

- Checks authentication on mount
- Fetches user role from `/auth/me`
- Redirects to role-specific dashboard
- Shows notification bar for admin requests
- Provides role-specific navigation tabs

## Client Dashboard

### Features

**Overview Page** (`/dashboard/client/page.tsx`):
- Total orders count
- Active orders count
- Completed orders count
- Recent orders list with progress bars
- Order tracking links
- Quick access to place new order
- Contact support section

**What Clients See:**
- ✅ Their orders (not tasks)
- ✅ Order progress and status
- ✅ Tracking links
- ✅ "Place new order" CTA
- ✅ Contact support
- ❌ No task feed
- ❌ No earnings/balance

**Navigation:**
- 📊 Overview
- 📦 My Orders
- 🛍️ Browse Services
- 👤 Profile

## Worker Dashboard

### Features

**Overview Page** (`/dashboard/worker/page.tsx`):
- Available tasks count
- In-progress tasks count
- Completed tasks count
- Current balance
- Quick access to My Tasks
- Quick access to Earnings
- Available tasks preview (first 5)
- Performance metrics

**What Workers See:**
- ✅ Available tasks feed
- ✅ Their accepted tasks
- ✅ Earnings and balance
- ✅ Performance stats
- ❌ No orders
- ❌ No "place order" button

**Navigation:**
- 📊 Overview
- 📋 My Tasks
- 💰 Earnings
- 👤 Profile

## Admin Request System

### Notification Bar

Shows at top of dashboard when user has pending actions:

**For Clients:**
```
"You have X request(s) from our team"
[View now →] → /dashboard/client/actions
```

**For Workers:**
```
"You have X action(s) required to complete your tasks"
[View now →] → /dashboard/worker/actions
```

### Use Cases

**Client Actions:**
- Provide additional business information
- Verify payment method
- Update order details
- Respond to support inquiry
- Complete KYC/verification

**Worker Actions:**
- Complete profile information
- Verify identity
- Provide proof of task completion
- Respond to quality issues
- Update payment details

## API Endpoints

### Required Endpoints

```typescript
GET /auth/me
// Returns: { id, email, role, profile }

GET /notifications/count
// Returns: { count: number }

GET /notifications/actions
// Returns: Array of action items

POST /notifications/actions/:id/complete
// Mark action as completed
```

### Action Item Structure

```typescript
interface ActionItem {
  id: string;
  type: "info_request" | "verification" | "quality_issue" | "payment_update";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  relatedOrderId?: string;
  relatedTaskId?: string;
  status: "pending" | "completed";
  createdAt: string;
}
```

## NavBar Integration

**Updated:** `/components/NavBar.tsx`

- Checks `session.isAuthenticated` on mount
- Fetches user data from `/auth/me`
- Shows user menu when logged in:
  - User avatar (first letter)
  - Username
  - Email and role
  - Dashboard link (role-specific)
  - My Orders (clients) / My Tasks (workers)
  - Sign out button
- Shows "Sign In" when not authenticated

## Key Differences

### Client Experience

```
Login → /dashboard/client
  ├── See orders, not tasks
  ├── Track order progress
  ├── Place new orders
  ├── Contact support
  └── Respond to admin requests
```

### Worker Experience

```
Login → /dashboard/worker
  ├── See tasks, not orders
  ├── Accept available tasks
  ├── Track earnings
  ├── View performance
  └── Complete admin actions
```

## Benefits

1. **Clear Separation** - Workers and clients never see irrelevant features
2. **Role-Specific UX** - Each role gets optimized interface
3. **Scalable** - Easy to add admin dashboard later
4. **Action System** - Admins can request info from both roles
5. **Proper Routing** - Clean URLs for each role

## Future Enhancements

### Admin Dashboard
```
/dashboard/admin
  ├── User management
  ├── Order monitoring
  ├── Task oversight
  ├── Send action requests
  └── Platform analytics
```

### Action Items Pages

**Client Actions** (`/dashboard/client/actions`):
- List of pending requests
- Form to respond
- Upload documents
- Mark as complete

**Worker Actions** (`/dashboard/worker/actions`):
- List of required actions
- Task-specific requests
- Verification forms
- Proof uploads

### Notifications

- Real-time notifications
- Email alerts for urgent actions
- Push notifications (PWA)
- In-app notification center

## Implementation Status

✅ **Completed:**
- Dashboard layout with role detection
- Client dashboard page
- Worker dashboard page
- NavBar authentication state
- Role-specific navigation
- Notification bar structure

⏳ **Pending:**
- Action items pages
- `/notifications/count` API endpoint
- `/notifications/actions` API endpoint
- Profile pages for both roles
- Real-time notifications

## Testing

### Test as Client
1. Login as client
2. Should redirect to `/dashboard/client`
3. Should see orders, not tasks
4. Should see "Place new order" button
5. NavBar shows "Dashboard" → `/dashboard/client`

### Test as Worker
1. Login as worker
2. Should redirect to `/dashboard/worker`
3. Should see tasks, not orders
4. Should see earnings and balance
5. NavBar shows "Dashboard" → `/dashboard/worker`
6. Should see "My Tasks" link in dropdown

## Conclusion

The role-based dashboard system provides a clean, scalable architecture for managing different user types. Workers and clients each get a tailored experience with relevant features only, while the admin request system allows for flexible communication and data collection from both roles.
