
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl",
        "glass-card border border-border/20 transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "interactive-element"
      )}
      aria-label={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
    >
      <div className="relative">
        {theme === 'light' ? (
          <Moon 
            size={18} 
            className="text-foreground transition-all duration-300 rotate-0 scale-100" 
          />
        ) : (
          <Sun 
            size={18} 
            className="text-foreground transition-all duration-300 rotate-0 scale-100" 
          />
        )}
      </div>
      
      {/* Tooltip */}
      <div className={cn(
        "absolute -bottom-8 left-1/2 -translate-x-1/2",
        "px-2 py-1 rounded-md text-xs font-medium",
        "bg-popover text-popover-foreground border border-border/20",
        "opacity-0 pointer-events-none transition-opacity duration-200",
        "group-hover:opacity-100"
      )}>
        {theme === 'light' ? 'Tema escuro' : 'Tema claro'}
      </div>
    </button>
  );
};

export default ThemeToggle;
