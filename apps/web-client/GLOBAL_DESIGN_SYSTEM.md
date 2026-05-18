# LookMe Global Design System & Architecture

## 🎨 Complete Platform-Wide Implementation

This document outlines the comprehensive design system that ensures consistent visual language across the entire LookMe platform.

---

## 📋 Table of Contents

1. [Design System Tokens](#design-system-tokens)
2. [Core Reusable Components](#core-reusable-components)
3. [Global Layout System](#global-layout-system)
4. [Typography System](#typography-system)
5. [Page Architecture](#page-architecture)
6. [Usage Examples](#usage-examples)
7. [Migration Guide](#migration-guide)

---

## 1. Design System Tokens

### Location
`/src/app/globals.css`

### Color Palette

#### Brand Colors
```css
/* Electric Royal Blue - Primary */
--color-primary-600: #2563eb  /* Main brand color */
--color-primary-500: #3b82f6  /* Hover states */
--color-primary-700: #1d4ed8  /* Active states */

/* Cyan Accent - Gradients */
--color-cyan-400: #22d3ee
--color-cyan-500: #06b6d4
--color-cyan-600: #0891b2
```

#### Surface Colors
```css
/* Deep Slate/Navy Backgrounds */
--color-slate-950: #020617  /* Darkest background */
--color-slate-900: #0f172a  /* Dark sections */
--color-slate-800: #1e293b  /* Card backgrounds */
```

#### Semantic Colors
```css
/* Success */
--color-success-400: #34d399
--color-success-500: #10b981
--color-success-600: #059669

/* Warning */
--color-warning-400: #fbbf24
--color-warning-500: #f59e0b
--color-warning-600: #d97706

/* Danger */
--color-danger-400: #f87171
--color-danger-500: #ef4444
--color-danger-600: #dc2626
```

### Typography Scale

```css
/* Font Families */
--font-sans: Geist Sans, Inter, system-ui
--font-mono: Geist Mono, Fira Code, monospace

/* Font Sizes */
--font-size-xs: 0.75rem    /* 12px */
--font-size-sm: 0.875rem   /* 14px */
--font-size-base: 1rem     /* 16px */
--font-size-lg: 1.125rem   /* 18px */
--font-size-xl: 1.25rem    /* 20px */
--font-size-2xl: 1.5rem    /* 24px */
--font-size-3xl: 1.875rem  /* 30px */
--font-size-4xl: 2.25rem   /* 36px */
--font-size-5xl: 3rem      /* 48px */
--font-size-6xl: 3.75rem   /* 60px */
--font-size-7xl: 4.5rem    /* 72px */
```

### Glassmorphism Utilities

```css
/* Light Glass Card */
.glass-card-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* Dark Glass Card */
.glass-card-dark {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Glass Input */
.glass-input {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-input:focus {
  background: rgba(15, 23, 42, 0.6);
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

### Gradient Utilities

```css
/* Primary Gradient */
.gradient-primary {
  background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
}

/* Text Gradient */
.text-gradient {
  background: linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Gradient Mesh Background */
.gradient-mesh {
  background: 
    radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(6, 182, 212, 0.05) 0px, transparent 50%);
}
```

---

## 2. Core Reusable Components

### GlassCard Component

**Location**: `/src/components/core/GlassCard.tsx`

**Usage**:
```tsx
import { GlassCard, ServiceCard, DashboardCard } from '@/components/core/GlassCard';

// Basic Glass Card
<GlassCard variant="dark" padding="lg" hover="glow">
  <h3>Card Title</h3>
  <p>Card content...</p>
</GlassCard>

// Service Card (optimized for service listings)
<ServiceCard>
  <h3>TikTok Views</h3>
  <p>From $0.79</p>
</ServiceCard>

// Dashboard Card (solid white for dashboards)
<DashboardCard>
  <p>Dashboard content...</p>
</DashboardCard>
```

**Props**:
- `variant`: `'default'` | `'dark'` | `'light'` | `'solid'`
- `padding`: `'none'` | `'sm'` | `'md'` | `'lg'` | `'xl'`
- `hover`: `'none'` | `'lift'` | `'glow'` | `'border'`

### Input Component

**Location**: `/src/components/core/Input.tsx`

**Usage**:
```tsx
import { Input, Textarea } from '@/components/core/Input';

// Glass Input (for dark backgrounds)
<Input
  variant="glass"
  label="Profile URL"
  placeholder="Enter direct profile link..."
  helperText="Paste the full URL to your profile"
  icon={<LinkIcon className="w-4 h-4" />}
/>

// Solid Input (for light backgrounds)
<Input
  variant="solid"
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  errorMessage="Please enter a valid email"
/>

// Textarea
<Textarea
  variant="glass"
  label="Special Instructions"
  placeholder="Any specific requirements..."
  rows={4}
/>
```

**Props**:
- `variant`: `'glass'` | `'solid'` | `'outline'`
- `size`: `'sm'` | `'md'` | `'lg'`
- `label`: string (optional)
- `helperText`: string (optional)
- `errorMessage`: string (optional)
- `icon`: ReactNode (optional)
- `iconPosition`: `'left'` | `'right'`

### Button Component

**Location**: `/src/components/core/Button.tsx`

**Usage**:
```tsx
import { Button, IconButton } from '@/components/core/Button';

// Primary Gradient Button
<Button variant="primary" size="lg">
  Order Now
  <ArrowRight className="w-5 h-5" />
</Button>

// Glass Button (for dark backgrounds)
<Button variant="glass" size="md">
  Learn More
</Button>

// Loading State
<Button variant="primary" isLoading>
  Processing...
</Button>

// Icon Button
<IconButton
  icon={<Plus className="w-5 h-5" />}
  variant="primary"
  size="md"
  aria-label="Add item"
/>
```

**Props**:
- `variant`: `'primary'` | `'secondary'` | `'outline'` | `'ghost'` | `'glass'` | `'danger'` | `'success'`
- `size`: `'sm'` | `'md'` | `'lg'` | `'xl'`
- `fullWidth`: boolean
- `isLoading`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

---

## 3. Global Layout System

### GlobalLayout Component

**Location**: `/src/components/layout/GlobalLayout.tsx`

**Usage**:
```tsx
import { GlobalLayout, MeshLayout, DarkLayout } from '@/components/layout/GlobalLayout';

// Default Layout
<GlobalLayout variant="default">
  <YourPageContent />
</GlobalLayout>

// Mesh Layout (recommended for most pages)
<MeshLayout>
  <YourPageContent />
</MeshLayout>

// Dark Layout
<DarkLayout>
  <YourPageContent />
</DarkLayout>
```

**Features**:
- Fixed gradient mesh background
- Animated glow orbs
- Subtle grid pattern
- Prevents layout shifts

### PageContainer Component

**Usage**:
```tsx
import { PageContainer } from '@/components/layout/GlobalLayout';

<PageContainer size="xl">
  <h1>Page Title</h1>
  <p>Content...</p>
</PageContainer>
```

**Props**:
- `size`: `'sm'` | `'md'` | `'lg'` | `'xl'` | `'full'`

### Section Component

**Usage**:
```tsx
import { Section } from '@/components/layout/GlobalLayout';

<Section spacing="lg" variant="dark">
  <h2>Section Title</h2>
  <p>Section content...</p>
</Section>
```

**Props**:
- `variant`: `'default'` | `'dark'` | `'gradient'`
- `spacing`: `'sm'` | `'md'` | `'lg'` | `'xl'`

---

## 4. Typography System

### Heading Styles

All headings automatically apply the design system:

```tsx
// Automatically styled with tracking-tight, font-extrabold
<h1>Main Page Title</h1>      // 48px, 800 weight
<h2>Section Title</h2>         // 36px, 700 weight
<h3>Subsection Title</h3>      // 30px, 700 weight
<h4>Card Title</h4>            // 24px, 600 weight
<h5>Small Heading</h5>         // 20px, 600 weight
<h6>Tiny Heading</h6>          // 18px, 600 weight
```

### Body Text Classes

```tsx
// Regular body text
<p className="body-text">
  This is regular body text with relaxed line height.
</p>

// Small body text
<p className="body-text-sm">
  This is smaller body text.
</p>

// Large body text
<p className="body-text-lg">
  This is larger body text.
</p>

// Label text
<span className="label">
  UPPERCASE LABEL
</span>
```

### Dark Mode Support

All typography automatically adapts to dark mode:

```tsx
<div className="dark">
  <h1>This heading is white</h1>
  <p className="body-text">This text is slate-300</p>
</div>
```

---

## 5. Page Architecture

### Created Page Skeletons

#### 1. Services Catalog
**Path**: `/app/(platform)/services-catalog/page.tsx`

**Features**:
- 19-service marketplace grid
- Glass card service listings
- Custom request callout
- Trust indicators
- Platform filters

**Usage**:
```tsx
// Navigate to: /services-catalog
// Displays all services with glassmorphism cards
```

#### 2. New Order Configuration
**Path**: `/app/(platform)/order/new/page.tsx`

**Features**:
- Service type selector
- Glass input fields with icons
- Target URL input with placeholder "Enter direct profile link..."
- Quantity selector
- Delivery speed options
- Order summary sidebar
- Special instructions textarea

**Usage**:
```tsx
// Navigate to: /order/new
// Client campaign configuration page
```

#### 3. Worker Dashboard
**Path**: `/app/(platform)/worker/dashboard/page.tsx`

**Features**:
- Stats grid (tasks completed, earnings, etc.)
- Available tasks feed
- Action timers with start/stop
- Platform filters
- Difficulty badges
- Recent activity log

**Usage**:
```tsx
// Navigate to: /worker/dashboard
// Micro-task hub for workers
```

#### 4. Admin Audit Panel
**Path**: `/app/(platform)/admin/audit/page.tsx`

**Features**:
- Split-screen layout
- Submissions list (left panel)
- Detail view (right panel)
- Quality checklist
- Approve/Reject actions
- Proof of completion viewer
- Worker notes display

**Usage**:
```tsx
// Navigate to: /admin/audit
// Quality control panel for admins
```

---

## 6. Usage Examples

### Complete Page Template

```tsx
'use client';

import { MeshLayout, PageContainer, Section } from '@/components/layout/GlobalLayout';
import { GlassCard } from '@/components/core/GlassCard';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';

export default function MyPage() {
  return (
    <MeshLayout>
      <PageContainer size="xl">
        {/* Header Section */}
        <Section spacing="lg" className="text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Page Title with <span className="text-gradient">Gradient</span>
          </h1>
          <p className="text-xl text-slate-300">
            Subtitle text goes here
          </p>
        </Section>

        {/* Content Section */}
        <Section spacing="lg">
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard variant="dark" hover="glow">
              <h3 className="text-xl font-bold text-white mb-4">
                Card Title
              </h3>
              <p className="text-slate-300 mb-6">
                Card description text
              </p>
              <Button variant="primary" fullWidth>
                Call to Action
              </Button>
            </GlassCard>

            <GlassCard variant="dark">
              <Input
                variant="glass"
                label="Input Label"
                placeholder="Enter value..."
                helperText="Helper text here"
              />
            </GlassCard>
          </div>
        </Section>
      </PageContainer>
    </MeshLayout>
  );
}
```

### Service Card Grid

```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {services.map((service) => (
    <ServiceCard key={service.id}>
      <h3 className="text-xl font-bold mb-2">{service.name}</h3>
      <p className="body-text-sm mb-4">{service.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-extrabold text-gradient">
          ${service.price}
        </span>
        <Button variant="primary" size="sm">
          Order Now
        </Button>
      </div>
    </ServiceCard>
  ))}
</div>
```

### Form with Glass Inputs

```tsx
<GlassCard variant="dark" padding="lg">
  <h2 className="text-2xl font-bold text-white mb-6">
    Contact Form
  </h2>
  
  <form className="space-y-6">
    <Input
      variant="glass"
      label="Full Name"
      placeholder="John Doe"
      icon={<User className="w-4 h-4" />}
    />
    
    <Input
      variant="glass"
      type="email"
      label="Email Address"
      placeholder="you@example.com"
      icon={<Mail className="w-4 h-4" />}
    />
    
    <Textarea
      variant="glass"
      label="Message"
      placeholder="Your message..."
      rows={4}
    />
    
    <Button variant="primary" size="lg" fullWidth>
      Send Message
    </Button>
  </form>
</GlassCard>
```

---

## 7. Migration Guide

### Step 1: Wrap Existing Pages

Replace existing page wrappers with `MeshLayout`:

**Before**:
```tsx
export default function MyPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* content */}
    </div>
  );
}
```

**After**:
```tsx
import { MeshLayout, PageContainer } from '@/components/layout/GlobalLayout';

export default function MyPage() {
  return (
    <MeshLayout>
      <PageContainer>
        {/* content */}
      </PageContainer>
    </MeshLayout>
  );
}
```

### Step 2: Replace Card Components

**Before**:
```tsx
<div className="border border-neutral-200 rounded-2xl p-6 bg-white">
  {/* content */}
</div>
```

**After**:
```tsx
import { ServiceCard } from '@/components/core/GlassCard';

<ServiceCard>
  {/* content */}
</ServiceCard>
```

### Step 3: Replace Input Fields

**Before**:
```tsx
<input
  type="text"
  className="w-full px-4 py-2 border rounded"
  placeholder="Enter value..."
/>
```

**After**:
```tsx
import { Input } from '@/components/core/Input';

<Input
  variant="glass"
  placeholder="Enter value..."
  helperText="Helper text"
/>
```

### Step 4: Replace Buttons

**Before**:
```tsx
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
  Click Me
</button>
```

**After**:
```tsx
import { Button } from '@/components/core/Button';

<Button variant="primary" size="md">
  Click Me
</Button>
```

### Step 5: Update Typography

**Before**:
```tsx
<h1 className="text-4xl font-bold text-neutral-900">
  Title
</h1>
```

**After**:
```tsx
<h1>Title</h1>  {/* Automatically styled */}

{/* Or with gradient */}
<h1 className="text-white">
  Title with <span className="text-gradient">Gradient</span>
</h1>
```

---

## 🎯 Design Principles

1. **Consistency**: All 19 services use the same card component
2. **Glassmorphism**: Frosted glass effects with backdrop blur
3. **Dark Theme First**: Primary UI is dark with light accents
4. **Accessibility**: Focus states, ARIA labels, keyboard navigation
5. **Performance**: CSS-only animations, optimized blur effects
6. **Responsive**: Mobile-first, adapts to all screen sizes

---

## 🚀 Quick Start Checklist

- [ ] Import `MeshLayout` for new pages
- [ ] Use `GlassCard` for all card components
- [ ] Use `Input` component for all form fields
- [ ] Use `Button` component for all actions
- [ ] Apply `text-gradient` for highlighted text
- [ ] Use semantic color tokens (`success`, `warning`, `danger`)
- [ ] Test on dark backgrounds
- [ ] Verify glassmorphism effects work
- [ ] Check responsive behavior
- [ ] Validate accessibility

---

## 📚 Additional Resources

- **Figma Design File**: [Link to design system]
- **Component Storybook**: [Link to Storybook]
- **Accessibility Guide**: [WCAG 2.1 AA compliance]
- **Performance Metrics**: [Lighthouse scores]

---

## 🐛 Troubleshooting

### Issue: Glass effects not showing
**Solution**: Ensure parent has dark background. Glass effects require contrast.

### Issue: Text not readable
**Solution**: Use `text-white` or `text-slate-300` on dark backgrounds.

### Issue: Gradients not rendering
**Solution**: Check browser support for `background-clip: text`.

### Issue: Layout shifts
**Solution**: Use `GlobalLayout` wrapper to prevent shifts.

---

## 📝 Notes

- **@theme Warning**: The CSS `@theme` directive is from Tailwind CSS v4 and can be safely ignored.
- **Font Loading**: Geist fonts are loaded via Next.js font optimization.
- **Browser Support**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+).
- **Dark Mode**: Automatically applied via `dark` class on layout components.

---

**Last Updated**: May 16, 2026
**Version**: 1.0.0
**Maintained By**: LookMe Platform Team
