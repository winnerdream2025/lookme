# LookMe Premium SaaS Design System

## Overview
This document outlines the premium modern SaaS marketplace design system implemented for LookMe, inspired by Linear, Stripe, Notion, Framer, and modern Dribbble designs.

## Design Principles

### Visual Aesthetic
- **Clean minimalist design** with elegant spacing
- **Soft purple gradient accents** as primary brand color
- **White/light gray backgrounds** with subtle gradient overlays
- **Glassmorphism touches** with backdrop blur effects
- **Rounded corners** (16px–24px) for modern feel
- **High-end startup aesthetic** - professional yet futuristic

### Color Palette

#### Primary Colors
- **Purple Gradient**: `from-purple-600 to-purple-500`
- **Neutral Dark**: `from-neutral-900 to-neutral-700`
- **White**: `#FFFFFF`
- **Soft Gray**: `neutral-50` to `neutral-100`

#### Accent Colors
- **Purple**: `purple-50/100/200/500/600/700`
- **Blue**: `blue-50/100/500`
- **Pink**: `pink-50/100/500`
- **Green**: `green-50/100/500`

#### Shadows
- **Purple Shadow**: `shadow-purple-200/300`
- **Soft Shadow**: `shadow-sm/md/lg`

## Component Library

### 1. Badge (`/components/ui/Badge.tsx`)
Reusable badge component with multiple variants.

**Variants:**
- `default` - Neutral gray
- `purple` - Purple accent
- `success` - Green
- `warning` - Amber
- `info` - Blue
- `pink` - Pink
- `blue` - Sky blue

**Usage:**
```tsx
<Badge variant="purple">Most Popular</Badge>
```

### 2. FeatureBadge (`/components/ui/FeatureBadge.tsx`)
Premium feature highlight cards with icons.

**Features:**
- Icon support with purple gradient background
- Hover effects with border color change
- Glassmorphism styling

**Usage:**
```tsx
<FeatureBadge
  icon={<svg>...</svg>}
  title="Instant Start"
  description="Most orders start within minutes"
/>
```

### 3. ServiceCard (`/components/ui/ServiceCard.tsx`)
Premium service display cards for marketplace.

**Features:**
- Platform icon display
- Badge support for "Most Popular"
- Gradient hover effects
- Pricing display with starting and popular packages
- Delivery time indicator
- Smooth transitions and shadows

**Usage:**
```tsx
<ServiceCard
  slug="instagram-followers"
  platform="Instagram"
  name="Instagram Followers"
  description="Real, active followers..."
  category="followers"
  startingPrice={2.99}
  popularPrice={9.99}
  popularQty={500}
  deliveryTime="Starts within 1h"
  badge="Most Popular"
  platformIcon="📸"
/>
```

### 4. Sidebar (`/components/ui/Sidebar.tsx`)
Premium sidebar navigation with gradient active states.

**Features:**
- Purple gradient for active items
- Icon support
- Count badges
- Smooth transitions

**Usage:**
```tsx
<Sidebar
  title="CATEGORIES"
  items={sidebarItems}
  activeId={activeClass}
  onItemClick={handleClassChange}
/>
```

## Page Layouts

### Pricing/Marketplace Page (`/app/pricing/page.tsx`)

**Layout Structure:**
- Left sidebar (264px) with category navigation
- Main content area with feature badges at top
- Search bar with sort dropdown
- Service cards grid (3 columns on desktop)
- Purple gradient background overlay

**Key Features:**
- Feature badges: Instant Start, Safe & Secure, 24/7 Support
- Advanced search and filtering
- Sort options: Popular, Price Low-High, Price High-Low
- Platform filters when category selected
- Responsive mobile layout

### Navigation Bar (`/components/NavBar.tsx`)

**Features:**
- Logo with purple gradient icon
- Centered search bar (desktop)
- Services mega-dropdown with categories
- Notification bell with badge
- Shopping cart with count
- Purple gradient CTA button
- Mobile search overlay
- Glassmorphism backdrop blur

**Layout:**
- Height: 64px (h-16)
- Max width: 1600px
- Sticky positioning with backdrop blur

### Homepage (`/app/page.tsx`)

**Sections:**
1. **Hero Section**
   - Gradient background with blur effects
   - Purple gradient badge for "Orders processing now"
   - Large gradient text headings
   - Purple gradient CTA buttons
   - Stats cards with individual gradient backgrounds

2. **Company Presentation**
   - Dark gradient background (neutral-900 to neutral-800)
   - Subtle pattern overlay
   - Glassmorphism cards with backdrop blur

3. **Value Propositions**
   - Purple gradient section header
   - Gradient text for headings

## Typography

### Font Family
- Primary: Geist Sans (Next.js default)
- Fallback: System UI fonts

### Font Sizes
- **Hero Heading**: `text-5xl md:text-6xl` (48px/60px)
- **Page Title**: `text-4xl` (36px)
- **Section Title**: `text-3xl` (30px)
- **Card Title**: `text-base` (16px)
- **Body**: `text-sm` (14px)
- **Small**: `text-xs` (12px)

### Font Weights
- **Bold**: `font-bold` (700)
- **Semibold**: `font-semibold` (600)
- **Medium**: `font-medium` (500)

## Spacing & Layout

### Border Radius
- **Small**: `rounded-lg` (8px)
- **Medium**: `rounded-xl` (12px)
- **Large**: `rounded-2xl` (16px)
- **Extra Large**: `rounded-3xl` (24px)

### Padding
- **Tight**: `p-3` to `p-4`
- **Standard**: `p-5` to `p-6`
- **Loose**: `p-8` to `p-10`

### Gaps
- **Grid Gap**: `gap-4` to `gap-6` (16px-24px)
- **Flex Gap**: `gap-2` to `gap-4` (8px-16px)

## Interactive States

### Buttons
```css
/* Primary CTA */
bg-gradient-to-r from-purple-600 to-purple-500
hover:from-purple-700 hover:to-purple-600
shadow-lg shadow-purple-200
hover:shadow-xl hover:shadow-purple-300

/* Secondary */
border border-neutral-200
hover:bg-neutral-50
```

### Cards
```css
/* Default */
border border-neutral-200
hover:border-purple-300
hover:shadow-lg
transition-all duration-300

/* Active Sidebar Item */
bg-gradient-to-r from-purple-600 to-purple-500
text-white
shadow-md shadow-purple-200
```

## Responsive Breakpoints

- **Mobile**: `< 768px`
- **Tablet**: `md: 768px`
- **Desktop**: `lg: 1024px`
- **Wide**: `xl: 1280px`

### Mobile Optimizations
- Hide sidebar on mobile, show dropdown selector
- Stack feature badges vertically
- 1-column service card grid
- Mobile search overlay
- Bottom navigation concept (future implementation)

## Glassmorphism Effects

```css
/* Backdrop Blur */
backdrop-blur-xl
bg-white/80

/* Card Glassmorphism */
bg-white/5
backdrop-blur-sm
border border-neutral-700/50
```

## Gradient Patterns

### Background Gradients
```css
/* Page Background */
bg-gradient-to-br from-white via-purple-50/10 to-white

/* Hero Background */
bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30

/* Dark Section */
bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900
```

### Text Gradients
```css
bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent
bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent
```

## Animation & Transitions

### Standard Transitions
```css
transition-all duration-300
transition-colors
```

### Hover Effects
- Scale: `hover:scale-[1.02]`
- Shadow increase: `hover:shadow-lg`
- Gradient shift: `hover:from-purple-700`

### Pulse Animation
```css
animate-pulse /* For notification badges */
```

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states with ring utilities
- Color contrast ratios meet WCAG AA standards

## Future Enhancements

1. **Mobile Bottom Tab Navigation**
   - Home, Catalog, Support, Account tabs
   - Purple gradient for active state
   - Fixed positioning

2. **Dark Mode Support**
   - Purple gradients remain
   - Inverted neutral colors
   - Adjusted opacity values

3. **Advanced Animations**
   - Framer Motion integration
   - Page transitions
   - Micro-interactions

4. **Loading States**
   - Skeleton screens with gradient shimmer
   - Progress indicators with purple accent

## Implementation Notes

- All components are fully typed with TypeScript
- Responsive design mobile-first approach
- Reusable component architecture
- Consistent naming conventions
- TailwindCSS utility classes
- No external UI libraries required
