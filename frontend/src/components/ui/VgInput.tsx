import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface VgInputProps extends HTMLMotionProps<'input'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const VgInput = forwardRef<HTMLInputElement, VgInputProps>(
  ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    id,
    ...props
  }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <motion.input
            ref={ref}
            id={inputId}
            className={`
              vg-input vg-select
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon ? 'pr-12' : ''}
              ${error ? 'border-vermilion focus:border-vermilion focus:ring-vermilion/20' : ''}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <motion.p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-vermilion flex items-center gap-1"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

VgInput.displayName = 'VgInput';

export interface VgTextareaProps extends HTMLMotionProps<'textarea'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const VgTextarea = forwardRef<HTMLTextAreaElement, VgTextareaProps>(
  ({ label, error, helperText, leftIcon, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="form-label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-4 text-text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <motion.textarea
            ref={ref}
            id={textareaId}
            className={`
              vg-input vg-select min-h-[100px] resize-y
              ${leftIcon ? 'pl-12' : ''}
              ${error ? 'border-vermilion focus:border-vermilion focus:ring-vermilion/20' : ''}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            id={`${textareaId}-error`}
            className="mt-1.5 text-sm text-vermilion flex items-center gap-1"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1.5 text-sm text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

VgTextarea.displayName = 'VgTextarea';

export interface VgSelectProps extends HTMLMotionProps<'select'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const VgSelect = forwardRef<HTMLSelectElement, VgSelectProps>(
  ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        )}
        <div className="relative">
          <motion.select
            ref={ref}
            id={selectId}
            className={`
              vg-input vg-select appearance-none pr-10
              ${error ? 'border-vermilion focus:border-vermilion focus:ring-vermilion/20' : ''}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </motion.select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sunflower">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {error && (
          <motion.p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-vermilion flex items-center gap-1"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

VgSelect.displayName = 'VgSelect';