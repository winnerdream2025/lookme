'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GlobalLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'gradient' | 'mesh';
  className?: string;
}

export function GlobalLayout({ 
  children, 
  variant = 'default',
  className 
}: GlobalLayoutProps) {
  const backgroundVariants = {
    default: 'bg-slate-50',
    dark: 'bg-slate-950',
    gradient: 'gradient-dark',
    mesh: 'bg-slate-950 gradient-mesh',
  };

  return (
    <div className={cn(
      'min-h-screen',
      backgroundVariants[variant],
      className
    )}>
      {/* Fixed Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient Mesh Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.08),transparent_50%)]" />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Animated Glow Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Specialized Layout Variants
export function DarkLayout({ children, className }: Omit<GlobalLayoutProps, 'variant'>) {
  return (
    <GlobalLayout variant="dark" className={cn('dark', className)}>
      {children}
    </GlobalLayout>
  );
}

export function MeshLayout({ children, className }: Omit<GlobalLayoutProps, 'variant'>) {
  return (
    <GlobalLayout variant="mesh" className={cn('dark', className)}>
      {children}
    </GlobalLayout>
  );
}

// Page Container - Constrains content width
export interface PageContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function PageContainer({ 
  children, 
  size = 'xl',
  className 
}: PageContainerProps) {
  const sizeVariants = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div className={cn(
      'mx-auto px-6 lg:px-12 py-8',
      sizeVariants[size],
      className
    )}>
      {children}
    </div>
  );
}

// Section Component - For page sections
export interface SectionProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'gradient';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Section({ 
  children, 
  variant = 'default',
  spacing = 'lg',
  className 
}: SectionProps) {
  const variantClasses = {
    default: 'bg-transparent',
    dark: 'bg-slate-900',
    gradient: 'gradient-dark',
  };

  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20',
    xl: 'py-32',
  };

  return (
    <section className={cn(
      variantClasses[variant],
      spacingClasses[spacing],
      className
    )}>
      {children}
    </section>
  );
}
