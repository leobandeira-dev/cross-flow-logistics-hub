import React from 'react';
import StatusBadge from '../components/common/StatusBadge';

export const getUserStatusBadge = (status?: string) => {
  if (!status) {
    return <StatusBadge status="pending" text="Não definido" />;
  }

  const statusLower = status.toLowerCase();
  const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending'; text: string }> = {
    'ativo': { type: 'success', text: 'Ativo' },
    'pendente': { type: 'warning', text: 'Pendente' },
    'inativo': { type: 'error', text: 'Inativo' },
    'active': { type: 'success', text: 'Ativo' },
    'pending': { type: 'warning', text: 'Pendente' },
    'inactive': { type: 'error', text: 'Inativo' },
  };

  const statusData = statusMap[statusLower] || { type: 'pending', text: status };
  return <StatusBadge status={statusData.type} text={statusData.text} />;
}; 