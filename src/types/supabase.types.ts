
// Re-export everything from the supabase directory structure
export * from './supabase';

// Additional legacy exports for backward compatibility
export type { NotaFiscal, ItemNotaFiscal } from './supabase/fiscal.types';
export type { Usuario } from './supabase/usuario.types';
export type { Empresa } from './supabase/empresa.types';
export type { Coleta } from './supabase/coleta.types';
export type { Database, Json } from './supabase/database.types';

// Types that might be missing - adding basic definitions
export interface Etiqueta {
  id: string;
  codigo: string;
  tipo: string;
  status: string;
  nota_fiscal_id?: string;
  etiqueta_mae_id?: string;
  volume_numero?: number;
  total_volumes?: number;
  peso?: number;
  altura?: number;
  largura?: number;
  comprimento?: number;
  fragil?: boolean;
  classificacao_quimica?: string;
  codigo_onu?: string;
  codigo_risco?: string;
  data_geracao: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrdemCarregamento {
  id: string;
  numero_ordem: string;
  status: string;
  data_criacao: string;
  data_programada?: string;
  data_inicio?: string;
  data_finalizacao?: string;
  tipo_carregamento: string;
  empresa_cliente_id?: string;
  motorista_id?: string;
  veiculo_id?: string;
  filial_id?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Carregamento {
  id: string;
  ordem_carregamento_id?: string;
  status: string;
  quantidade_volumes: number;
  peso_total?: number;
  data_inicio_carregamento?: string;
  data_fim_carregamento?: string;
  responsavel_carregamento_id?: string;
  conferente_id?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Ocorrencia {
  id: string;
  titulo?: string;
  tipo: string;
  descricao: string;
  status: string;
  prioridade: string;
  data_ocorrencia: string;
  data_abertura?: string;
  usuario_reportou_id: string;
  usuario_abertura_id?: string;
  usuario_responsavel_id?: string;
  nota_fiscal_id?: string;
  coleta_id?: string;
  ordem_carregamento_id?: string;
  carregamento_id?: string;
  etiqueta_id?: string;
  empresa_cliente_id?: string;
  data_resolucao?: string;
  solucao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ComentarioOcorrencia {
  id: string;
  ocorrencia_id: string;
  usuario_id: string;
  comentario: string;
  data_comentario: string;
  created_at?: string;
}

export interface Unitizacao {
  id: string;
  codigo: string;
  tipo_unitizacao: string;
  status: string;
  data_unitizacao: string;
  usuario_id?: string;
  localizacao_id?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}
