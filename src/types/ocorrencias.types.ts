export interface Ocorrencia {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  client: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  solution?: string;
  documents?: {
    id: string;
    type: string;
    number: string;
    description?: string;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  // Nova propriedade para dados da nota fiscal
  notaFiscal?: {
    id: string;
    numero: string;
    chave: string;
    xmlContent?: string;
    dados?: Record<string, any>;
  };
}

export interface OcorrenciaTimeline {
  id: string;
  ocorrenciaId: string;
  timestamp: string;
  description: string;
  type: 'creation' | 'status_change' | 'comment' | 'assignment' | 'resolution';
  user: string;
}

export interface OcorrenciaComment {
  id: string;
  ocorrenciaId: string;
  user: string;
  content: string;
  timestamp: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface DocumentosMock {
  id: string;
  tipo: string;
  numero: string;
  descricao?: string;
  data: string;
  cliente: string;
  status: string;
}
