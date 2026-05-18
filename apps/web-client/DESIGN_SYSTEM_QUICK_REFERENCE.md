# LookMe Design System - Quick Reference

## 🚀 Quick Import Guide

```tsx
// Core Components
import { GlassCard, Input, Button } from '@/components/core';

// Layout Components
import { MeshLayout, PageContainer, Section } from '@/components/layout';

// Icons (Lucide React)
import { ArrowRight, CheckCircle2, Plus } from 'lucide-react';
```

---

## 🎨 Color Quick Reference

```tsx
// Use in className
className="text-primary-600"      // Electric blue
className="text-cyan-400"         // Cyan accent
className="text-slate-300"        // Light text on dark
className="text-success-400"      // Success green
className="text-warning-400"      // Warning amber
className="text-danger-400"       // Danger red

// Backgrounds
className="bg-slate-950"          // Darkest background
className="bg-slate-900"          // Dark section
className="bg-white/10"           // Semi-transparent white
```

---

## 📦 Component Cheat Sheet

### GlassCard
```tsx
// Light glass (for light backgrounds)
<GlassCard variant="light" padding="lg" hover="lift">
  Content
</GlassCard>

// Dark glass (for dark backgrounds) - MOST COMMON
<GlassCard variant="dark" padding="md" hover="glow">
  Content
</GlassCard>

// Solid white (for dashboards)
<GlassCard variant="solid" padding="lg">
  Content
</GlassCard>
```

### Input
```tsx
// Glass input (dark backgrounds)
<Input
  variant="glass"
  label="Label"
  placeholder="Placeholder..."
  helperText="Helper text"
  icon={<Icon className="w-4 h-4" />}
/>

// Solid input (light backgrounds)
<Input
  variant="solid"
  label="Label"
  errorMessage="Error message"
/>
```

### Button
```tsx
// Primary gradient button - MOST COMMON
<Button variant="primary" size="lg">
  Click Me
  <ArrowRight className="w-5 h-5" />
</Button>

// Glass button (dark backgrounds)
<Button variant="glass" size="md">
  Secondary Action
</Button>

// Loading state
<Button variant="primary" isLoading>
  Processing...
</Button>
```

---

## 🎯 Common Patterns

### Page Template
```tsx
export default function MyPage() {
  return (
    <MeshLayout>
      <PageContainer size="xl">
        <Section spacing="lg">
          <h1>Title</h1>
          {/* Content */}
        </Section>
      </PageContainer>
    </MeshLayout>
  );
}
```

### Service Card Grid
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <ServiceCard key={item.id}>
      <h3>{item.name}</h3>
      <p className="body-text-sm">{item.desc}</p>
      <Button variant="primary">Order</Button>
    </ServiceCard>
  ))}
</div>
```

### Form Layout
```tsx
<GlassCard variant="dark" padding="lg">
  <h2 className="text-2xl font-bold text-white mb-6">Form Title</h2>
  <form className="space-y-6">
    <Input variant="glass" label="Field 1" />
    <Input variant="glass" label="Field 2" />
    <Textarea variant="glass" label="Message" rows={4} />
    <Button variant="primary" fullWidth>Submit</Button>
  </form>
</GlassCard>
```

### Stats Grid
```tsx
<div className="grid grid-cols-4 gap-6">
  {stats.map(stat => (
    <GlassCard key={stat.label} variant="dark">
      <p className="text-sm text-slate-400">{stat.label}</p>
      <p className="text-3xl font-extrabold text-gradient">
        {stat.value}
      </p>
    </GlassCard>
  ))}
</div>
```

---

## 🎨 Typography Quick Reference

```tsx
// Headings (auto-styled)
<h1>Main Title</h1>           // 48px, extrabold, tight
<h2>Section Title</h2>        // 36px, bold, tight
<h3>Subsection</h3>           // 30px, bold, snug

// Body text
<p className="body-text">Regular text</p>
<p className="body-text-sm">Small text</p>
<p className="body-text-lg">Large text</p>

// Labels
<span className="label">UPPERCASE LABEL</span>

// Gradient text
<span className="text-gradient">Highlighted Text</span>
```

---

## 🎨 Utility Classes

```tsx
// Glass effects
className="glass-card-dark"
className="glass-card-light"
className="glass-input"

// Gradients
className="gradient-primary"
className="gradient-dark"
className="gradient-mesh"
className="text-gradient"

// Animations
className="animate-pulse-glow"
className="animate-slide-up"
className="animate-shimmer"
```

---

## 📐 Spacing Scale

```tsx
className="p-4"    // 16px padding
className="p-6"    // 24px padding
className="p-8"    // 32px padding
className="gap-4"  // 16px gap
className="gap-6"  // 24px gap
className="gap-8"  // 32px gap
```

---

## 🎯 Common Combinations

### Hero Section
```tsx
<Section spacing="lg" className="text-center">
  <h1 className="text-5xl font-extrabold text-white mb-4">
    Title with <span className="text-gradient">Gradient</span>
  </h1>
  <p className="text-xl text-slate-300 mb-8">Subtitle</p>
  <Button variant="primary" size="lg">
    Get Started <ArrowRight />
  </Button>
</Section>
```

### Feature Card
```tsx
<GlassCard variant="dark" hover="glow">
  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-white" />
  </div>
  <h3 className="text-xl font-bold text-white mb-2">Feature</h3>
  <p className="text-slate-300">Description</p>
</GlassCard>
```

### Stat Card
```tsx
<GlassCard variant="dark">
  <p className="text-sm text-slate-400 mb-2">Label</p>
  <p className="text-4xl font-extrabold text-gradient">$142.50</p>
</GlassCard>
```

---

## ⚡ Performance Tips

1. Use `GlassCard` instead of custom divs
2. Prefer `text-gradient` over images
3. Use `MeshLayout` for consistent backgrounds
4. Batch icon imports from lucide-react
5. Use semantic color tokens (success, warning, danger)

---

## 🐛 Common Mistakes

❌ **Don't**:
```tsx
<div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
  // Custom glass card
</div>
```

✅ **Do**:
```tsx
<GlassCard variant="dark" padding="md">
  // Use component
</GlassCard>
```

---

❌ **Don't**:
```tsx
<input className="w-full px-4 py-2 bg-slate-800 text-white" />
```

✅ **Do**:
```tsx
<Input variant="glass" />
```

---

❌ **Don't**:
```tsx
<h1 className="text-4xl font-bold text-white tracking-tight">
  Title
</h1>
```

✅ **Do**:
```tsx
<h1 className="text-white">Title</h1>
// Or just <h1>Title</h1> (auto-styled)
```

---

## 📱 Responsive Patterns

```tsx
// Grid responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Text responsive
className="text-3xl md:text-4xl lg:text-5xl"

// Padding responsive
className="px-6 lg:px-12 py-8 lg:py-16"

// Hide on mobile
className="hidden md:block"

// Show only on mobile
className="block md:hidden"
```

---

## 🎨 Color Combinations

### Dark Background + Light Text
```tsx
<div className="bg-slate-950">
  <h1 className="text-white">Title</h1>
  <p className="text-slate-300">Body text</p>
  <span className="text-slate-400">Muted text</span>
</div>
```

### Primary Actions
```tsx
<Button variant="primary">Primary</Button>
<span className="text-primary-400">Link</span>
<div className="bg-primary-500/10 border border-primary-500/30">
  Highlighted box
</div>
```

### Status Colors
```tsx
// Success
<span className="text-success-400">✓ Completed</span>

// Warning
<span className="text-warning-400">⚠ Pending</span>

// Danger
<span className="text-danger-400">✗ Failed</span>
```

---

**Pro Tip**: Keep this file open while building pages for quick reference!
