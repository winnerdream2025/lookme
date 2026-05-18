/**
 * @lookme/ui - Design System
 * 
 * Linear-inspired: Sharp, precise, minimal
 * Apple-inspired: Spacing discipline
 * Notion-inspired: Clarity
 * 
 * NOT generic Tailwind UI
 * Unique asymmetrical layouts
 * Typography-driven
 * High contrast, minimal colors
 */

// ─── Utilities ───
export { cn } from "./lib/cn";
export { buttonVariants, badgeVariants, inputVariants } from "./lib/variants";
export type { ButtonVariants, BadgeVariants, InputVariants } from "./lib/variants";

// ─── Core Components ───
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";

export { Badge } from "./components/Badge";
export type { BadgeProps } from "./components/Badge";

// ─── Typography ───
export {
  Display,
  Title,
  Heading,
  Subheading,
  Body,
  Caption,
  Label,
  Code,
} from "./components/Typography";

// ─── Layouts ───
export {
  SplitLayout,
  CommandBarLayout,
  GridCanvas,
  Stack,
} from "./components/layouts/SplitLayout";
