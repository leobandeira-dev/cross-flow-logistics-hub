

// Tipos relacionados a documentos fiscais
import { Empresa } from './empresa.types';
import { Coleta } from './coleta.types';

// Nota Fiscal
export interface NotaFiscal {
  id: string;
  numero: string;
  serie?: string;
  chave_acesso?: string;
  valor_total: number;
  peso_bruto?: number;
  quantidade_volumes?: number;
  data_emissao: string;
  data_entrada?: string;
  data_saida?: string;
  status: string;
  tipo?: string;
  remetente_id?: string;
  destinatario_id?: string;
  transportadora_id?: string;
  ordem_carregamento_id?: string;
  coleta_id?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  
  // Additional properties for createNotaFiscalService
  valor?: number;
  empresa_emitente_id?: string;
  empresa_destinatario_id?: string;
  filial_id?: string;
  tempo_armazenamento_horas?: number;
  
  // Relacionamentos
  remetente?: Empresa;
  destinatario?: Empresa;
  transportadora?: Empresa;
  coleta?: Coleta;
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
  
  // Relacionamentos
  nota_fiscal?: NotaFiscal;
}

