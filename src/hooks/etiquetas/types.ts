
import { Volume } from '@/pages/armazenagem/recebimento/components/etiquetas/VolumesTable';

export type LayoutStyle = 'standard' | 'compact' | 'modern';
export type EtiquetaFormat = 'small' | 'a4';
export type EtiquetaTipo = 'volume' | 'mae';
export type EtiquetaMaeTipo = 'geral' | 'palete';

export interface EtiquetaGenerationOptions {
  formatoImpressao?: string;
  tipo?: EtiquetaTipo;
  etiquetaMaeId?: string;
  layoutStyle?: LayoutStyle;
  tipoEtiquetaMae?: EtiquetaMaeTipo;
}

export interface CurrentEtiqueta {
  volumeData: Volume;
  volumeNumber: number;
  totalVolumes: number;
}

export interface EtiquetaGenerationResult {
  status: 'success' | 'error';
  volumes?: Volume[];
  error?: any;
}
