
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
  remetente_id?: string;
  destinatario_id?: string;
  transportadora_id?: string;
  ordem_carregamento_id?: string;
  coleta_id?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  
  // Additional properties from the database schema
  numero_pedido?: string;
  tipo_operacao?: string;
  tempo_armazenamento_horas?: number;
  
  // Emitente fields
  emitente_cnpj?: string;
  emitente_razao_social?: string;
  emitente_telefone?: string;
  emitente_uf?: string;
  emitente_cidade?: string;
  emitente_bairro?: string;
  emitente_endereco?: string;
  emitente_numero?: string;
  emitente_cep?: string;
  
  // Destinatário fields
  destinatario_cnpj?: string;
  destinatario_razao_social?: string;
  destinatario_telefone?: string;
  destinatario_uf?: string;
  destinatario_cidade?: string;
  destinatario_bairro?: string;
  destinatario_endereco?: string;
  destinatario_numero?: string;
  destinatario_cep?: string;
  
  // Transport and logistics fields
  fob_cif?: string;
  numero_coleta?: string;
  valor_coleta?: number;
  numero_cte_coleta?: string;
  numero_cte_viagem?: string;
  data_embarque?: string;
  status_embarque?: string;
  responsavel_entrega?: string;
  quimico?: boolean;
  fracionado?: boolean;
  motorista?: string;
  entregue_ao_fornecedor?: string;
  informacoes_complementares?: string;
  
  // Additional properties for createNotaFiscalService
  valor?: number;
  tipo?: string;
  empresa_emitente_id?: string;
  empresa_destinatario_id?: string;
  filial_id?: string;
  
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
