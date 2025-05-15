
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    open: {
      label: 'Aberta',
      variant: 'destructive' as const
    },
    in_progress: {
      label: 'Em Andamento',
      variant: 'warning' as const
    },
    resolved: {
      label: 'Resolvida',
      variant: 'success' as const
    },
    closed: {
      label: 'Fechada',
      variant: 'outline' as const
    }
  };

  const { label, variant } = statusConfig[status];

  return (
    <Badge 
      variant={variant} 
      className={cn("font-normal", className)}
    >
      {label}
    </Badge>
  );
};

export default StatusBadge;
