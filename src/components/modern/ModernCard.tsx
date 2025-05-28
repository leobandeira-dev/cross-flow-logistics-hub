
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'gradient';
  hover?: boolean;
  onClick?: () => void;
}

const ModernCard: React.FC<ModernCardProps> = ({ 
  children, 
  className, 
  variant = 'glass',
  hover = true,
  onClick 
}) => {
  const baseClasses = "rounded-xl transition-all duration-300";
  
  const variantClasses = {
    glass: "glass-card",
    solid: "bg-card border border-border shadow-lg",
    gradient: "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
  };

  const hoverClasses = hover ? "hover:scale-[1.02] hover:shadow-xl" : "";
  const clickableClasses = onClick ? "cursor-pointer active:scale-[0.98]" : "";

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        clickableClasses,
        "interactive-element",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ModernCard;
