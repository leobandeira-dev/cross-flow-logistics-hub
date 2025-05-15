
export interface OrdemCarregamento {
  id: string;
  cliente: string;
  destinatario: string;
  dataCarregamento: string;
  volumesTotal: number;
  volumesVerificados: number;
  status: 'pending' | 'processing' | 'completed';
  notasFiscais?: NotaFiscal[];
}

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
