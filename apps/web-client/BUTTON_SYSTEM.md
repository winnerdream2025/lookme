# Button System - Clean Apple Style

## Royal Blue Primary Button

All buttons across the platform now use the royal blue from the hero page.

### Color: `#2563EB` (Royal Blue)

This is the same blue used in the hero gradient: `from-blue-600 to-cyan-600`

## Button Component

Location: `/src/components/ui/Button.tsx`

### Variants

1. **Primary** (Royal Blue)
   - Background: `#2563EB`
   - Hover: `#1d4ed8`
   - Use for: Main actions, form submissions

2. **Secondary** (White with border)
   - Background: `white`
   - Border: `#E5E7EB`
   - Use for: Secondary actions

3. **Ghost** (Transparent)
   - Background: `transparent`
   - Hover: `#F9FAFB`
   - Use for: Tertiary actions

4. **Danger** (Red)
   - Background: `#DC2626`
   - Hover: `#B91C1C`
   - Use for: Destructive actions

### Sizes

- **sm**: `h-9 px-4 text-sm`
- **md**: `h-11 px-6 text-sm`
- **lg**: `h-12 px-8 text-[15px]`

## Usage

```tsx
import { Button } from "@/components/ui/Button";

// Primary button (royal blue)
<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>

// Secondary button
<Button variant="secondary" size="md">
  Cancel
</Button>

// Full width
<Button variant="primary" className="w-full">
  Sign in
</Button>
```

## Pages Updated

✅ Login (`/login`)
✅ Register (`/register`)
✅ Contact (`/contact`)

## Remaining Pages

All other form pages need the same treatment:
- Forgot password
- Reset password
- Order review
- Service request
- Dashboard pages
- Profile pages
- etc.

## Design Principles

1. **Royal blue for all primary actions** - Consistent with hero
2. **Clean, simple** - No gradients, no animations on buttons
3. **Apple-style** - Rounded corners (xl), clean shadows
4. **White and black** - Secondary colors stay neutral
5. **No AI fingerprint** - Simple, intentional design
