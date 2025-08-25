
import React, { InputHTMLAttributes, useId, useState } from 'react';
import { clsx } from 'clsx';

export type InputVariant = 'filled' | 'outlined' | 'ghost';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  loading?: boolean;
  /** Show a small clear (x) button when there is a value */
  enableClear?: boolean;
  /** If type='password', enables show/hide toggle */
  enablePasswordToggle?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled,
  invalid,
  variant = 'outlined',
  size = 'md',
  loading = false,
  enableClear = true,
  enablePasswordToggle = false,
  type = 'text',
  id,
  ...rest
}) => {
  const inputId = useId();
  const [internalType, setInternalType] = useState(type);

  const sizes: Record<InputSize, string> = {
    sm: 'text-sm px-3 py-2 rounded-md',
    md: 'text-base px-3.5 py-2.5 rounded-lg',
    lg: 'text-lg px-4 py-3 rounded-xl',
  };

  const base =
    'w-full outline-none transition-shadow placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants: Record<InputVariant, string> = {
    filled:
      'bg-gray-100 focus:bg-white border border-transparent focus:border-gray-300 focus:ring-2 focus:ring-blue-500/30',
    outlined:
      'bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30',
    ghost:
      'bg-transparent border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30',
  };

  const invalidClasses = invalid
    ? 'border-red-500 focus:border-red-600 focus:ring-red-500/30'
    : '';

  const wrapperClasses = clsx('input-wrapper', 'space-y-1.5');
  const labelClasses = clsx('block text-sm font-medium', disabled && 'opacity-60');
  const inputClasses = clsx(base, sizes[size], variants[variant], invalidClasses, loading && 'animate-pulse');
  const helperClasses = clsx('text-xs', invalid ? 'text-red-600' : 'text-gray-500');

  const showClear = enableClear && !!value && !disabled && !loading;
  const showToggle = enablePasswordToggle && (type === 'password' || internalType === 'password');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={id ?? inputId} className={labelClasses}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id ?? inputId}
          aria-invalid={invalid || undefined}
          aria-busy={loading || undefined}
          aria-describedby={helperText ? `${id ?? inputId}-help` : undefined}
          className={clsx(inputClasses, 'pr-20')}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          type={internalType}
          {...rest}
        />
        {showClear && (
          <button
            type="button"
            aria-label="Clear input"
            className="absolute inset-y-0 right-10 my-auto text-sm px-2"
            onClick={() => {
              const event = { target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
              onChange?.(event);
            }}
          >
            ×
          </button>
        )}
        {showToggle && (
          <button
            type="button"
            aria-label={internalType === 'password' ? 'Show password' : 'Hide password'}
            className="absolute inset-y-0 right-2 my-auto text-xs border rounded px-2 py-1"
            onClick={() => setInternalType(internalType === 'password' ? 'text' : 'password')}
          >
            {internalType === 'password' ? 'Show' : 'Hide'}
          </button>
        )}
      </div>
      {helperText && !invalid && (
        <p id={`${id ?? inputId}-help`} className={helperClasses}>
          {helperText}
        </p>
      )}
      {invalid && errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
};
