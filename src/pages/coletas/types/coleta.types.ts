
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
  // Adding backward compatibility properties
  cliente?: string;
  data?: string;
  solicitante?: string;
  origem?: string;
  destino?: string;
  volumes?: number;
  peso?: string;
  notas?: string[];
}

// Adding the missing Carga interface that many components are trying to import
export interface Carga {
  id: string;
  destino: string;
  dataPrevisao: string;
  volumes: number;
  peso: string;
  status: 'pending' | 'scheduled' | 'transit' | 'loading' | 'delivered' | 'problem';
  motorista?: string;
  veiculo?: string;
  origem?: string;
  notasFiscais?: string[];
  valorTotal?: number;
}

