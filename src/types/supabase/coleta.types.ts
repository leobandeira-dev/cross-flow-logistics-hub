
// Tipos relacionados a coletas
import { Empresa } from './empresa.types';
import { Motorista, Veiculo } from './transporte.types';
import { NotaFiscal } from './fiscal.types';
import { Perfil } from './usuario.types';

// Coleta
export interface Coleta {
  id: string;
  numero_coleta: string;
  empresa_cliente_id: string;
  endereco_coleta: string;
  cidade_coleta: string;
  estado_coleta: string;
  data_solicitacao: string;
  data_programada?: string;
  horario_inicio?: string;
  horario_fim?: string;
  tipo_coleta: string;
  status: string;
  motorista_id?: string;
  veiculo_id?: string;
  usuario_solicitante_id?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  empresa_cliente?: Empresa;
  motorista?: Motorista;
  veiculo?: Veiculo;
  usuario_solicitante?: Perfil;
}

// Volumes da Coleta
export interface VolumeColeta {
  id: string;
  coleta_id: string;
  tipo_volume: string;
  quantidade: number;
  peso?: number;
  altura?: number;
  largura?: number;
  comprimento?: number;
  nota_fiscal_numero?: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  coleta?: Coleta;
}
