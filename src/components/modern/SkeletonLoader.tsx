
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className, 
  variant = 'text',
  lines = 1 
}) => {
  const baseClasses = "skeleton rounded";

  const variantClasses = {
    text: "h-4",
    card: "h-32",
    avatar: "w-10 h-10 rounded-full",
    button: "h-10 w-24"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && "w-3/4", // Last line shorter
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    />
  );
};

export default SkeletonLoader;
