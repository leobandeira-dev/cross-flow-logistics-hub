
import React from 'react';
import { Ocorrencia } from "../types/ocorrencias.types";
import StatusBadge from "../components/common/StatusBadge";

export const getTipoOcorrenciaText = (tipo: string): string => {
  const tipoMap: Record<string, string> = {
    'extravio': 'Extravio',
    'avaria': 'Avaria',
    'atraso': 'Atraso',
    'divergencia': 'Divergência',
  };
  return tipoMap[tipo] || tipo;
};

export const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending'; text: string }> = {
    'open': { type: 'error', text: 'Aberto' },
    'in_progress': { type: 'warning', text: 'Em Andamento' },
    'resolved': { type: 'info', text: 'Resolvido' },
    'closed': { type: 'success', text: 'Fechado' },
  };
  const statusData = statusMap[status];
  return <StatusBadge status={statusData.type} text={statusData.text} />;
};

export const getPrioridadeBadge = (prioridade: string) => {
  const prioridadeMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending'; text: string }> = {
    'high': { type: 'error', text: 'Alta' },
    'medium': { type: 'warning', text: 'Média' },
    'low': { type: 'info', text: 'Baixa' },
  };
  const prioridadeData = prioridadeMap[prioridade];
  return <StatusBadge status={prioridadeData.type} text={prioridadeData.text} />;
};

export const getDocumentTypeText = (tipo: string): string => {
  const tipoMap: Record<string, string> = {
    'nota': 'Nota Fiscal',
    'coleta': 'Coleta',
    'oc': 'Ordem de Carregamento',
  };
  return tipoMap[tipo] || tipo;
};
