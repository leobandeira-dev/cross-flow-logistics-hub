
// Fiscal documents related types
import { Empresa } from './company.types';
import { Coleta } from './coleta.types';
import { OrdemCarregamento } from './shipping.types';

// Nota Fiscal
export interface NotaFiscal {
  id: string;
  numero: string;
  serie?: string;
  chave_acesso?: string;
  valor: number;
  peso_bruto?: number;
  quantidade_volumes?: number;
  data_emissao: string;
  data_entrada?: string;
  data_saida?: string;
  tipo: string;
  status: string;
  empresa_emitente_id?: string;
  empresa_destinatario_id?: string;
  filial_id?: string;
  ordem_carregamento_id?: string;
  coleta_id?: string;
  observacoes?: string;
  tempo_armazenamento_horas?: number;
  created_at: string;
  updated_at: string;
  
  // Relationships
  empresa_emitente?: Empresa;
  empresa_destinatario?: Empresa;
  itens?: ItemNotaFiscal[];
  coleta?: Coleta;
  ordem_carregamento?: OrdemCarregamento;
}

// Item da Nota Fiscal
export interface ItemNotaFiscal {
  id: string;
  nota_fiscal_id: string;
  sequencia: number;
  codigo_produto: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  created_at: string;
  updated_at: string;
  
  // Relationships
  nota_fiscal?: NotaFiscal;
}
