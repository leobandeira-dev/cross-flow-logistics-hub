
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
}

export interface DocumentoNota {
  id: string;
  numero: string;
  cliente: string;
  data: string;
  valor: string;
}

export interface DocumentoColeta {
  id: string;
  numero: string;
  cliente: string;
  data: string;
  notasFiscais: string[];
}

export interface DocumentoOrdem {
  id: string;
  numero: string;
  cliente: string;
  data: string;
  notasFiscais: string[];
}

export interface DocumentosMock {
  notas: DocumentoNota[];
  coletas: DocumentoColeta[];
  ordens: DocumentoOrdem[];
}
