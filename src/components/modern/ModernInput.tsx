
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'floating' | 'standard';
}

const ModernInput: React.FC<ModernInputProps> = ({ 
  label, 
  error, 
  icon, 
  variant = 'floating',
  className,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value !== '');
    props.onBlur?.(e);
  };

  if (variant === 'floating') {
    return (
      <div className="floating-label-group">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
              {icon}
            </div>
          )}
          <input
            {...props}
            className={cn(
              "floating-input w-full h-12 px-4 bg-background/50 backdrop-blur-md border border-border/50 rounded-xl",
              "transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
              "placeholder-transparent peer",
              icon && "pl-10",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              className
            )}
            placeholder={label}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <label 
            className={cn(
              "floating-label",
              (isFocused || hasValue || props.value) && "text-xs -top-2 left-3 bg-background px-1 text-primary",
              error && "text-destructive"
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1 text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            "w-full h-12 px-4 bg-background/50 backdrop-blur-md border border-border/50 rounded-xl",
            "transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
            icon && "pl-10",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {error && (
        <p className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default ModernInput;
