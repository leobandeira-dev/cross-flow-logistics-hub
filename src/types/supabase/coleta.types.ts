
// Collection related types
import { Empresa } from './company.types';
import { Motorista, Veiculo } from './transport.types';
import { NotaFiscal } from './fiscal.types';

// Solicitação de Coleta
export interface SolicitacaoColeta {
  id: string;
  numero_solicitacao: string;
  empresa_solicitante_id?: string;
  tipo_coleta: string;
  data_solicitacao: string;
  data_aprovacao?: string;
  data_coleta?: string;
  status: string;
  endereco_coleta?: string;
  cidade_coleta?: string;
  estado_coleta?: string;
  cep_coleta?: string;
  contato_nome?: string;
  contato_telefone?: string;
  observacoes?: string;
  tempo_aprovacao_coleta_horas?: number;
  created_at: string;
  updated_at: string;
  
  // Relationships
  empresa_solicitante?: Empresa;
}

// Coleta (realizada)
export interface Coleta {
  id: string;
  solicitacao_id?: string;
  numero_coleta: string;
  data_realizada: string;
  motorista_id?: string;
  veiculo_id?: string;
  quantidade_volumes: number;
  peso_total?: number;
  status: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  solicitacao?: SolicitacaoColeta;
  motorista?: Motorista;
  veiculo?: Veiculo;
  notas_fiscais?: NotaFiscal[];
}
