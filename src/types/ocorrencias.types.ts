
export interface Ocorrencia {
  id: string;
  cliente: string;
  tipo: string;
  dataRegistro: string;
  dataOcorrencia: string;
  nf: string;
  descricao: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  prioridade: 'high' | 'medium' | 'low';
  documentoVinculado?: string;
  tipoDocumento?: string;
  valorPrejuizo?: string;
  
  // Novos campos para rastreamento de tempo e performance
  dataColeta?: string;
  dataArmazenagem?: string;
  dataTransferencia?: string;
  dataEntrega?: string;
  tempoProcessamentoTotal?: number; // em minutos
}

export interface DocumentoNota {
  id: string;
  numero: string;
  cliente: string;
  data: string;
  valor: string;
  // Campos adicionais para rastreamento
  statusProcessamento?: 'pendente' | 'em_processamento' | 'concluido';
  tempoProcessamento?: number; // em minutos
}

export interface DocumentoColeta {
  id: string;
  numero: string;
  cliente: string;
  data: string;
  notasFiscais: string[];
  // Campos adicionais para rastreamento
  statusColeta?: 'agendada' | 'em_andamento' | 'concluida';
  tempoColeta?: number; // em minutos
}

export interface DocumentoOrdem {
  id: string;
  numero: string;
  cliente: string;
  data: string;
  notasFiscais: string[];
  // Campos adicionais para rastreamento
  statusOrdem?: 'emitida' | 'em_processamento' | 'concluida';
  tempoProcessamento?: number; // em minutos
}

export interface DocumentosMock {
  notas: DocumentoNota[];
  coletas: DocumentoColeta[];
  ordens: DocumentoOrdem[];
}

// Interfaces para os relatórios de performance
export interface PerformanceMetrics {
  id: string;
  tipoDocumento: 'nota' | 'coleta' | 'ordem';
  numeroDocumento: string;
  cliente: string;
  dataInicio: string;
  dataFim?: string;
  tempoTotal?: number; // em minutos
  status: 'em_andamento' | 'concluido';
}

export interface ConsolidadoPerformance {
  mediaTempoColeta: number;
  mediaTempoArmazenagem: number;
  mediaTempoTransferencia: number;
  mediaTempoEntrega: number;
  mediaTempoTotal: number;
  totalDocumentosProcessados: number;
  eficienciaPorTipo: Record<string, number>;
}
