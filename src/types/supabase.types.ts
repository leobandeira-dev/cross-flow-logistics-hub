
export interface NotaFiscal {
  id: string;
  numero: string;
  serie?: string;
  chave_acesso?: string;
  valor_total: number;
  peso_bruto?: number;
  quantidade_volumes?: number;
  data_emissao?: string;
  data_entrada?: string;
  data_saida?: string;
  status: string;
  remetente_id?: string;
  destinatario_id?: string;
  transportadora_id?: string;
  ordem_carregamento_id?: string;
  created_at?: string;
  updated_at?: string;
  observacoes?: string;
}

export interface ItemNotaFiscal {
  id: string;
  nota_fiscal_id: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  created_at?: string;
  updated_at?: string;
}
