import React from 'react';
import StatusBadge from '../components/common/StatusBadge';

export const getLoadStatusBadge = (status?: string) => {
  if (!status) {
    return <StatusBadge status="pending" text="Não definido" />;
  }

  const statusLower = status.toLowerCase();
  const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending'; text: string }> = {
    'pending': { type: 'pending', text: 'Pendente Aceite' },
    'transit': { type: 'info', text: 'Em Trânsito' },
    'loading': { type: 'warning', text: 'Em Carregamento' },
    'scheduled': { type: 'pending', text: 'Agendada' },
    'delivered': { type: 'success', text: 'Entregue' },
    'problem': { type: 'error', text: 'Problema' },
    'entregue': { type: 'success', text: 'Entregue' },
    'problema': { type: 'error', text: 'Problema' }
  };

  const statusData = statusMap[statusLower] || { type: 'pending', text: status };
  return <StatusBadge status={statusData.type} text={statusData.text} />;
}; 