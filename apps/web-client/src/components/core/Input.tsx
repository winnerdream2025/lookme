import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  [
    'w-full rounded-xl font-medium transition-all duration-200',
    'placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed',
    'text-base',
  ].join(' '),
  {
    variants: {
      variant: {
        glass: [
          'bg-[rgba(15,23,42,0.5)] text-slate-100',
          'border border-white/10',
          'backdrop-blur-sm',
          'focus:bg-[rgba(15,23,42,0.7)] focus:border-primary-500',
          'focus:ring-2 focus:ring-primary-500 focus:outline-none',
        ].join(' '),
        solid: [
          'bg-slate-800/80 text-slate-100',
          'border border-slate-700',
          'focus:border-primary-500',
          'focus:ring-2 focus:ring-primary-500 focus:outline-none',
        ].join(' '),
        outline: [
          'bg-transparent text-slate-100',
          'border-2 border-slate-600',
          'focus:border-primary-500',
          'focus:ring-2 focus:ring-primary-500 focus:outline-none',
        ].join(' '),
        light: [
          'bg-white text-slate-900',
          'border border-slate-200',
          'focus:border-primary-500',
          'focus:ring-2 focus:ring-primary-500 focus:outline-none',
        ].join(' '),
      },
      size: {
        sm: 'px-3 py-2 text-base',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-base md:text-lg',
      },
      error: {
        true: 'border-danger-500! focus:border-danger-500! focus:ring-danger-500!',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'glass',
      size: 'md',
      error: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      error,
      label,
      helperText,
      errorMessage,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const hasError = error || !!errorMessage;

    return (
      <div className="w-full">
        {label && (
          <label className="form-label">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}

          <input
            className={cn(
              inputVariants({ variant, size, error: hasError }),
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="form-error">
            {errorMessage}
          </p>
        )}

        {helperText && !errorMessage && (
          <p className="form-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea variant
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  rows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      error,
      label,
      helperText,
      errorMessage,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const hasError = error || !!errorMessage;

    return (
      <div className="w-full">
        {label && (
          <label className="form-label">
            {label}
          </label>
        )}

        <textarea
          className={cn(
            inputVariants({ variant, error: hasError }),
            'min-h-[100px] resize-y',
            className
          )}
          rows={rows}
          ref={ref}
          {...props}
        />

        {errorMessage && (
          <p className="form-error">
            {errorMessage}
          </p>
        )}

        {helperText && !errorMessage && (
          <p className="form-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select variant
export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      error,
      label,
      helperText,
      errorMessage,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const hasError = error || !!errorMessage;

    return (
      <div className="w-full">
        {label && (
          <label className="form-label">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            className={cn(
              inputVariants({ variant, error: hasError }),
              'appearance-none pr-10 cursor-pointer',
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {errorMessage && (
          <p className="form-error">
            {errorMessage}
          </p>
        )}

        {helperText && !errorMessage && (
          <p className="form-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
