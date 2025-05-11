import { NotaFiscalVolume } from '../utils/volumeCalculations';
import { DadosEmpresa } from '../components/solicitacao/SolicitacaoTypes';

export interface SolicitacaoColeta {
  id: string;
  dataSolicitacao: string;
  dataColeta?: string;
  status: 'pending' | 'approved' | 'rejected';
  remetente?: DadosEmpresa;
  destinatario?: DadosEmpresa;
  notasFiscais?: NotaFiscalVolume[];
  observacoes?: string;
}
