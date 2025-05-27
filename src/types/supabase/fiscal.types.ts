
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
  
  // Novos campos do formulário
  data_hora_emissao?: string;
  tipo_operacao?: string;
  entregue_ao_fornecedor?: string;
  
  // Campos do emitente
  emitente_cnpj?: string;
  emitente_razao_social?: string;
  emitente_telefone?: string;
  emitente_uf?: string;
  emitente_cidade?: string;
  emitente_bairro?: string;
  emitente_endereco?: string;
  emitente_numero?: string;
  emitente_cep?: string;
  
  // Campos do destinatário
  destinatario_cnpj?: string;
  destinatario_razao_social?: string;
  destinatario_telefone?: string;
  destinatario_uf?: string;
  destinatario_cidade?: string;
  destinatario_bairro?: string;
  destinatario_endereco?: string;
  destinatario_numero?: string;
  destinatario_cep?: string;
  
  // Campos adicionais do formulário
  numero_pedido?: string;
  informacoes_complementares?: string;
  fob_cif?: string;
  numero_coleta?: string;
  valor_coleta?: number;
  numero_cte_coleta?: string;
  arquivo_cte_coleta?: string;
  numero_cte_viagem?: string;
  arquivo_cte_viagem?: string;
  data_hora_entrada?: string;
  status_embarque?: string;
  quimico?: boolean;
  fracionado?: boolean;
  responsavel_entrega?: string;
  lista_romaneio?: string;
  motorista?: string;
  data_embarque?: string;
  arquivos_diversos?: string;
  tempo_armazenamento_horas?: number;
  
  // Additional properties for createNotaFiscalService
  valor?: number;
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
