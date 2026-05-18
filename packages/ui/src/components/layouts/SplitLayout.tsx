import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Split Layout - Asymmetrical grid inspired by Linear
 * Left: 40% navigation/context
 * Right: 60% main content
 * NOT a standard sidebar
 */

interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

export function SplitLayout({ left, right, className }: SplitLayoutProps) {
  return (
    <div className={cn("flex h-screen overflow-hidden bg-white", className)}>
      {/* Left Panel - Navigation/Context */}
      <aside className="w-[40%] border-r border-neutral-200 flex flex-col">
        {left}
      </aside>

      {/* Right Panel - Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {right}
      </main>
    </div>
  );
}

/**
 * Command Bar Layout - Apple-inspired spacing discipline
 * Top command bar with intentional whitespace
 */

interface CommandBarLayoutProps {
  command: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CommandBarLayout({ command, children, className }: CommandBarLayoutProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Command Bar - Fixed height, generous padding */}
      <div className="h-16 border-b border-neutral-200 flex items-center px-8">
        {command}
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

/**
 * Grid Canvas - Notion-inspired clarity
 * Clean grid with intentional gaps
 */

interface GridCanvasProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function GridCanvas({ children, columns = 3, gap = "md", className }: GridCanvasProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const gridGap = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div className={cn("grid", gridCols[columns], gridGap[gap], className)}>
      {children}
    </div>
  );
}

/**
 * Stack Layout - Vertical rhythm with consistent spacing
 */

interface StackProps {
  children: React.ReactNode;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Stack({ children, spacing = "md", className }: StackProps) {
  const spacingMap = {
    xs: "space-y-2",
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-12",
  };

  return (
    <div className={cn("flex flex-col", spacingMap[spacing], className)}>
      {children}
    </div>
  );
}
