/**
 * Worker Dashboard Design System
 * Enterprise-grade design tokens for a calm, professional interface
 */

export const workerDesign = {
  // Color Palette - Restrained & Professional
  colors: {
    // Primary - Deep Navy
    primary: {
      50: '#F0F4F8',
      100: '#D9E2EC',
      200: '#BCCCDC',
      300: '#9FB3C8',
      400: '#829AB1',
      500: '#627D98',
      600: '#486581',
      700: '#334E68',
      800: '#243B53',
      900: '#102A43',
    },
    // Neutral - Soft Charcoal
    neutral: {
      50: '#F7F9FA',
      100: '#F1F3F5',
      200: '#E3E8EF',
      300: '#CDD5DF',
      400: '#9AA5B1',
      500: '#697386',
      600: '#4C5862',
      700: '#3E4C59',
      800: '#2A3642',
      900: '#1A202C',
    },
    // Success - Emerald
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    // Warning - Amber
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    // Error - Red
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    // Info - Soft Blue
    info: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
  },

  // Typography - Professional Hierarchy
  typography: {
    // Page Titles
    h1: 'text-2xl font-semibold text-neutral-900 tracking-tight',
    // Section Titles
    h2: 'text-lg font-semibold text-neutral-900',
    // Subsection Titles
    h3: 'text-base font-medium text-neutral-800',
    // Card Titles
    h4: 'text-sm font-medium text-neutral-800',
    // Body Text
    body: 'text-sm text-neutral-700',
    // Secondary Text
    secondary: 'text-sm text-neutral-500',
    // Small Text
    small: 'text-xs text-neutral-600',
    // Tiny Text
    tiny: 'text-xs text-neutral-500',
    // Labels
    label: 'text-xs font-medium text-neutral-700 uppercase tracking-wide',
    // Numbers/Stats
    stat: 'text-3xl font-semibold text-neutral-900 tabular-nums',
    statLarge: 'text-4xl font-semibold text-neutral-900 tabular-nums',
    // Money
    money: 'text-2xl font-semibold text-success-600 tabular-nums',
    moneyLarge: 'text-3xl font-semibold text-success-600 tabular-nums',
  },

  // Spacing - Consistent Rhythm
  spacing: {
    section: 'py-8',
    sectionLarge: 'py-12',
    card: 'p-6',
    cardCompact: 'p-4',
    cardLarge: 'p-8',
    stack: 'space-y-6',
    stackTight: 'space-y-4',
    stackLoose: 'space-y-8',
    inline: 'space-x-3',
    inlineTight: 'space-x-2',
  },

  // Components
  components: {
    // Cards
    card: 'bg-white border border-neutral-200 rounded-lg',
    cardHover: 'bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 hover:shadow-sm transition-all duration-150',
    cardElevated: 'bg-white border border-neutral-200 rounded-lg shadow-sm',
    
    // Buttons
    buttonPrimary: 'px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    buttonSecondary: 'px-4 py-2 bg-white border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    buttonGhost: 'px-4 py-2 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-100 active:bg-neutral-200 transition-colors duration-150',
    buttonDanger: 'px-4 py-2 bg-error-600 text-white text-sm font-medium rounded-lg hover:bg-error-700 active:bg-error-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2',
    
    // Status Pills
    statusSuccess: 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-success-50 text-success-700 text-xs font-medium rounded-full',
    statusWarning: 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-warning-50 text-warning-700 text-xs font-medium rounded-full',
    statusError: 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-error-50 text-error-700 text-xs font-medium rounded-full',
    statusInfo: 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-info-50 text-info-700 text-xs font-medium rounded-full',
    statusNeutral: 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full',
    
    // Inputs
    input: 'w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow duration-150',
    
    // Tables
    table: 'w-full border-collapse',
    tableHeader: 'bg-neutral-50 border-b border-neutral-200',
    tableHeaderCell: 'px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wide',
    tableRow: 'border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-100',
    tableCell: 'px-4 py-4 text-sm text-neutral-700',
    
    // Empty States
    emptyState: 'flex flex-col items-center justify-center py-16 px-6 text-center',
    emptyStateIcon: 'w-12 h-12 text-neutral-300 mb-4',
    emptyStateTitle: 'text-sm font-medium text-neutral-900 mb-1',
    emptyStateDescription: 'text-sm text-neutral-500 max-w-sm',
  },

  // Layout
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    containerNarrow: 'max-w-4xl mx-auto px-4 sm:px-6',
    containerWide: 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8',
    page: 'min-h-screen bg-neutral-50',
    pageContent: 'py-8',
  },

  // Shadows - Subtle Depth
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    none: 'shadow-none',
  },

  // Borders
  borders: {
    default: 'border border-neutral-200',
    strong: 'border border-neutral-300',
    light: 'border border-neutral-100',
    none: 'border-0',
  },

  // Transitions
  transitions: {
    fast: 'transition-all duration-100',
    normal: 'transition-all duration-150',
    slow: 'transition-all duration-300',
  },
} as const;

// Helper function to combine classes
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
