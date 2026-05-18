# @lookme/ui — Design System

**Sharp. Precise. Minimal.**

A unique design system inspired by Linear, Apple, and Notion — built for the LookMe social engagement marketplace.

---

## 🎨 Design Principles

### 1. **Strong Visual Hierarchy**
- Typography-driven design
- Clear information architecture
- Intentional use of whitespace

### 2. **Unique Layouts (NOT Standard Sidebar)**
- **SplitLayout**: Asymmetrical 40/60 grid
- **CommandBarLayout**: Apple-inspired top command bar
- **GridCanvas**: Notion-style clean grids
- **Stack**: Vertical rhythm with consistent spacing

### 3. **Minimal Colors, High Contrast**
- **Primary**: Neutral 900 (near black)
- **Secondary**: Neutral 100-700 (grays)
- **Accent**: Single accent color per app
  - Client: Blue
  - Worker: Emerald
  - Admin: Purple

### 4. **Typography System**
```tsx
<Display>   // 6xl - Hero sections
<Title>     // 4xl - Page headers
<Heading>   // 2xl - Section headers
<Subheading> // lg - Subsections
<Body>      // base - Content
<Caption>   // sm - Labels, metadata
<Label>     // sm - Form labels
<Code>      // sm mono - Inline code
```

---

## 📦 Components

### Core

#### Button
```tsx
import { Button } from "@lookme/ui";

<Button variant="primary" size="md">
  Place Order
</Button>

// Variants: primary, secondary, ghost, danger, outline
// Sizes: sm, md, lg, icon
// Props: loading, disabled
```

#### Badge
```tsx
import { Badge } from "@lookme/ui";

<Badge variant="success" size="md" dot>
  Verified
</Badge>

// Variants: default, success, warning, danger, info
// Sizes: sm, md, lg
// Props: dot (shows status dot)
```

---

### Layouts

#### SplitLayout (Asymmetrical Grid)
```tsx
import { SplitLayout } from "@lookme/ui";

<SplitLayout
  left={<Navigation />}
  right={<Content />}
/>

// Left: 40% - Navigation/context
// Right: 60% - Main content
// NOT a standard sidebar!
```

#### CommandBarLayout (Apple-inspired)
```tsx
import { CommandBarLayout } from "@lookme/ui";

<CommandBarLayout
  command={<SearchBar />}
>
  <Content />
</CommandBarLayout>

// Fixed command bar at top
// Generous padding, clean spacing
```

#### GridCanvas (Notion-style)
```tsx
import { GridCanvas } from "@lookme/ui";

<GridCanvas columns={3} gap="md">
  <Card />
  <Card />
  <Card />
</GridCanvas>

// Columns: 1, 2, 3, 4
// Gap: sm, md, lg
```

#### Stack (Vertical Rhythm)
```tsx
import { Stack } from "@lookme/ui";

<Stack spacing="md">
  <Heading>Title</Heading>
  <Body>Content</Body>
</Stack>

// Spacing: xs, sm, md, lg, xl
```

---

## 🎯 Usage Examples

### Client Dashboard - Order Placement

```tsx
import {
  SplitLayout,
  CommandBarLayout,
  Stack,
  Title,
  Body,
  Button,
  Badge,
} from "@lookme/ui";

function OrderPage() {
  return (
    <SplitLayout
      left={
        <Stack spacing="lg">
          <Title>Instagram Followers</Title>
          <Body muted>
            High-quality followers from real accounts
          </Body>
          <Badge variant="success">Most Popular</Badge>
        </Stack>
      }
      right={
        <CommandBarLayout
          command={<SearchServices />}
        >
          <OrderForm />
        </CommandBarLayout>
      }
    />
  );
}
```

### Worker App - Task Feed

```tsx
import {
  GridCanvas,
  Stack,
  Heading,
  Caption,
  Button,
} from "@lookme/ui";

function TaskFeed() {
  return (
    <Stack spacing="xl">
      <Heading>Available Tasks</Heading>
      
      <GridCanvas columns={2} gap="lg">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </GridCanvas>
    </Stack>
  );
}
```

---

## 🚫 Anti-Patterns (What NOT to Do)

### ❌ Card Soup
```tsx
// DON'T: Generic card grids everywhere
<div className="grid grid-cols-3 gap-4">
  <Card><Card><Card>...
</div>
```

### ✅ Use Intentional Layouts
```tsx
// DO: Asymmetrical, purposeful layouts
<SplitLayout left={...} right={...} />
<GridCanvas columns={3} gap="lg">...</GridCanvas>
```

### ❌ Standard Sidebar + Topbar
```tsx
// DON'T: Generic dashboard layout
<Sidebar />
<Topbar />
<Content />
```

### ✅ Unique Layouts
```tsx
// DO: Asymmetrical split or command bar
<SplitLayout ... />
<CommandBarLayout ... />
```

### ❌ Too Many Colors
```tsx
// DON'T: Rainbow of colors
className="bg-blue-500 text-green-600 border-purple-400"
```

### ✅ Minimal Palette
```tsx
// DO: Neutral + 1 accent
className="bg-neutral-900 text-white"
className="bg-emerald-50 text-emerald-700" // accent only
```

---

## 📐 Spacing Scale

```
xs:  space-y-2   (8px)
sm:  space-y-4   (16px)
md:  space-y-6   (24px)
lg:  space-y-8   (32px)
xl:  space-y-12  (48px)
```

Use `<Stack spacing="md">` for consistent vertical rhythm.

---

## 🎨 Color Palette

### Neutrals (Primary)
```
neutral-50:  #fafafa
neutral-100: #f5f5f5
neutral-200: #e5e5e5
neutral-300: #d4d4d4
neutral-500: #737373
neutral-600: #525252
neutral-700: #404040
neutral-800: #262626
neutral-900: #171717
```

### Accent Colors (Use Sparingly)
```
Client App:  blue-600
Worker App:  emerald-600
Admin App:   purple-600
```

---

## 🔧 Installation

```bash
# In your Next.js app
pnpm add @lookme/ui

# Peer dependencies
pnpm add react react-dom
pnpm add tailwindcss
```

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // Include UI package
  ],
  theme: {
    extend: {
      // Your custom theme
    },
  },
};
```

---

## 📚 References

- **Linear**: Sharp, precise UI
- **Apple**: Spacing discipline, clarity
- **Notion**: Clean information hierarchy

---

## 🚀 Next Steps

1. Install dependencies: `npx pnpm install`
2. Import components in your Next.js app
3. Follow the design principles
4. Avoid anti-patterns
5. Build unique, beautiful UIs

**Remember**: Strong hierarchy. Minimal colors. Intentional whitespace. NO card soup!
