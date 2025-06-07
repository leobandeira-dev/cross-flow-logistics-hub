import React from 'react';
import StatusBadge from '../components/common/StatusBadge';

export const getLabelStatusBadge = (status?: string) => {
  if (!status) {
    return <StatusBadge status="pending" text="Não definido" />;
  }

  const statusLower = status.toLowerCase();
  const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending'; text: string }> = {
    'etiquetada': { type: 'success', text: 'Etiquetada' },
    'gerada': { type: 'pending', text: 'Gerada' },
    'inutilizada': { type: 'error', text: 'Inutilizada' },
    'unitizada': { type: 'info', text: 'Unitizada' },
    'processada': { type: 'success', text: 'Processada' },
    'aguardando': { type: 'pending', text: 'Aguardando' },
    'divergente': { type: 'error', text: 'Divergente' },
    'em_processamento': { type: 'warning', text: 'Em Processamento' },
  };

  const statusData = statusMap[statusLower] || { type: 'pending', text: status };
  return <StatusBadge status={statusData.type} text={statusData.text} />;
}; 