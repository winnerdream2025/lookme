# 🎨 LookMe Design System - Getting Started

## Quick Start (30 seconds)

```tsx
// 1. Import components
import { MeshLayout, PageContainer } from '@/components/layout';
import { GlassCard, Input, Button } from '@/components/core';

// 2. Build your page
export default function MyPage() {
  return (
    <MeshLayout>
      <PageContainer>
        <h1>My Page</h1>
        <GlassCard variant="dark">
          <Input variant="glass" placeholder="Enter text..." />
          <Button variant="primary">Submit</Button>
        </GlassCard>
      </PageContainer>
    </MeshLayout>
  );
}
```

## 📚 Documentation

- **Full Guide**: `GLOBAL_DESIGN_SYSTEM.md`
- **Quick Reference**: `DESIGN_SYSTEM_QUICK_REFERENCE.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`

## 🎯 Core Concepts

### 1. Always Use MeshLayout
Every page should be wrapped in `MeshLayout` for consistent background:

```tsx
<MeshLayout>
  <PageContainer>
    {/* Your content */}
  </PageContainer>
</MeshLayout>
```

### 2. Use GlassCard for All Cards
Replace divs with `GlassCard`:

```tsx
<GlassCard variant="dark" hover="glow">
  {/* Card content */}
</GlassCard>
```

### 3. Use Input Component for Forms
Replace HTML inputs with styled `Input`:

```tsx
<Input
  variant="glass"
  label="Email"
  placeholder="you@example.com"
  icon={<Mail className="w-4 h-4" />}
/>
```

### 4. Use Button Component
Replace button elements with `Button`:

```tsx
<Button variant="primary" size="lg">
  Click Me
  <ArrowRight className="w-5 h-5" />
</Button>
```

## 🎨 Design Tokens

### Colors
- `text-primary-600` - Electric blue
- `text-cyan-400` - Cyan accent
- `text-slate-300` - Light text on dark
- `text-success-400` - Success green
- `text-warning-400` - Warning amber
- `text-danger-400` - Danger red

### Typography
- `<h1>` - Auto-styled (48px, extrabold)
- `<h2>` - Auto-styled (36px, bold)
- `.body-text` - Regular body text
- `.label` - Uppercase labels
- `.text-gradient` - Gradient text effect

### Utilities
- `.glass-card-dark` - Dark glass effect
- `.gradient-primary` - Blue to cyan gradient
- `.text-gradient` - Gradient text

## 📦 Component API

### GlassCard
```tsx
<GlassCard
  variant="dark" | "light" | "solid"
  padding="sm" | "md" | "lg" | "xl"
  hover="none" | "lift" | "glow" | "border"
>
  Content
</GlassCard>
```

### Input
```tsx
<Input
  variant="glass" | "solid" | "outline"
  label="Label"
  placeholder="Placeholder..."
  helperText="Helper text"
  errorMessage="Error message"
  icon={<Icon />}
/>
```

### Button
```tsx
<Button
  variant="primary" | "glass" | "success" | "danger"
  size="sm" | "md" | "lg" | "xl"
  isLoading={false}
  fullWidth={false}
>
  Button Text
</Button>
```

## 🚀 Example Pages

Visit these pages to see the design system in action:

- `/design-system-showcase` - Complete component showcase
- `/services-catalog` - Service marketplace
- `/order/new` - Order configuration
- `/worker/dashboard` - Worker dashboard
- `/admin/audit` - Admin audit panel

## ⚡ Pro Tips

1. **Always use dark backgrounds** - The design system is optimized for dark themes
2. **Use glass inputs** - `variant="glass"` for all inputs on dark backgrounds
3. **Add icons** - Lucide React icons enhance the UI
4. **Use gradients** - Apply `.text-gradient` for highlighted text
5. **Hover effects** - Add `hover="glow"` to cards for premium feel

## 🎯 Common Patterns

### Hero Section
```tsx
<Section spacing="lg" className="text-center">
  <h1 className="text-white">
    Title with <span className="text-gradient">Gradient</span>
  </h1>
  <p className="text-xl text-slate-300">Subtitle</p>
  <Button variant="primary" size="lg">Get Started</Button>
</Section>
```

### Form
```tsx
<GlassCard variant="dark" padding="lg">
  <h2 className="text-2xl font-bold text-white mb-6">Form Title</h2>
  <form className="space-y-6">
    <Input variant="glass" label="Name" />
    <Input variant="glass" label="Email" type="email" />
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
      <p className="text-3xl font-extrabold text-gradient">{stat.value}</p>
    </GlassCard>
  ))}
</div>
```

## 🐛 Troubleshooting

**Q: Glass effects not showing?**  
A: Ensure parent has dark background (`bg-slate-950` or `bg-slate-900`)

**Q: Text not readable?**  
A: Use `text-white` or `text-slate-300` on dark backgrounds

**Q: TypeScript errors?**  
A: Restart TypeScript server in your IDE

**Q: CSS @theme warning?**  
A: This is expected for Tailwind v4 and can be ignored

## 📞 Need Help?

1. Check `DESIGN_SYSTEM_QUICK_REFERENCE.md` for quick answers
2. Review `GLOBAL_DESIGN_SYSTEM.md` for comprehensive guide
3. Look at example pages in `/app/(platform)/`
4. Visit `/design-system-showcase` to see all components

---

**Happy Building! 🚀**
