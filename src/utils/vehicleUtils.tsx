import React from 'react';
import StatusBadge from '../components/common/StatusBadge';

export const getVehicleStatusBadge = (status?: string) => {
  if (!status) {
    return <StatusBadge status="pending" text="Não definido" />;
  }

  const statusLower = status.toLowerCase();
  const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending'; text: string }> = {
    'active': { type: 'success', text: 'Ativo' },
    'ativo': { type: 'success', text: 'Ativo' },
    'maintenance': { type: 'warning', text: 'Em Manutenção' },
    'manutencao': { type: 'warning', text: 'Em Manutenção' },
    'inactive': { type: 'error', text: 'Inativo' },
    'inativo': { type: 'error', text: 'Inativo' },
  };

  const statusData = statusMap[statusLower] || { type: 'pending', text: status };
  return <StatusBadge status={statusData.type} text={statusData.text} />;
}; 