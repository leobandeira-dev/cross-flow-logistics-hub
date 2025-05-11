
// Define tipos compartilhados para o módulo de coletas
export interface SolicitacaoColetaBase {
  id: string;
  cliente: string;
  data: string;
  origem: string;
  destino: string;
  notas: string[];
  volumes: number;
  peso: string;
  solicitante: string;
}

export interface SolicitacaoPendente extends SolicitacaoColetaBase {
  status: 'pending';
  prioridade: string;
  observacoes?: string;
}

export interface SolicitacaoAprovada extends SolicitacaoColetaBase {
  status: 'approved';
  aprovador: string;
  dataAprovacao: string;
  observacoes?: string;
}

export interface SolicitacaoRecusada extends SolicitacaoColetaBase {
  status: 'rejected';
  aprovador: string;
  dataAprovacao: string;
  motivoRecusa: string;
  observacoes?: string;
}

export type SolicitacaoColeta = SolicitacaoPendente | SolicitacaoAprovada | SolicitacaoRecusada;

// Tipos de status para cargas
export type StatusCarga = 
  | 'pending'    // Pendente de alocação
  | 'scheduled'  // Agendada
  | 'loading'    // Em carregamento
  | 'transit'    // Em trânsito
  | 'delivered'  // Entregue
  | 'problem';   // Finalizada com problema

// Interface para representar uma carga no sistema
export interface Carga {
  id: string;
  destino: string;
  dataPrevisao?: string;
  dataEntrega?: string;
  volumes: number;
  peso: string;
  status: StatusCarga;
  motorista?: string;
  veiculo?: string;
  observacoes?: string;
}
