
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernStatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  text: string;
  className?: string;
  animate?: boolean;
}

const ModernStatusBadge: React.FC<ModernStatusBadgeProps> = ({ 
  status, 
  text, 
  className,
  animate = false 
}) => {
  const baseClasses = "status-badge-modern";
  
  const statusClasses = {
    success: "status-success-modern",
    warning: "status-warning-modern", 
    error: "status-error-modern",
    info: "status-info-modern",
    pending: "bg-gray-500/20 text-gray-300 border-gray-500/30"
  };

  const animationClasses = animate ? "animate-pulse" : "";

  return (
    <span className={cn(
      baseClasses,
      statusClasses[status],
      animationClasses,
      "interactive-element",
      className
    )}>
      {text}
    </span>
  );
};

export default ModernStatusBadge;
