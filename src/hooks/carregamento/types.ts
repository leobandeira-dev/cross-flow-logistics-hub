
export interface NotaFiscal {
  id: string;
  numero: string;
  remetente: string;
  cliente: string;
  pedido?: string;
  dataEmissao: string;
  valor: number;
  pesoBruto: number;
}

export interface OrdemCarregamento {
  id: string;
  cliente: string;
  tipoCarregamento: string;
  dataCarregamento: string;
  transportadora: string;
  placaVeiculo: string;
  motorista: string;
  observacoes?: string;
  status: 'pending' | 'processing' | 'completed';
  notasFiscais?: NotaFiscal[];
  volumesTotal: number;
  volumesVerificados: number;
}

export interface CreateOCFormData {
  cliente: string;
  tipoCarregamento: string;
  dataCarregamento: string;
  transportadora: string;
  placaVeiculo: string;
  motorista: string;
  observacoes?: string;
}
