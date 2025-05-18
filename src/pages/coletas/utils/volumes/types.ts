
import { v4 as uuidv4 } from 'uuid';

export interface VolumeItem {
  id: string;
  altura: number; // height in cm
  largura: number; // width in cm
  comprimento: number; // length in cm
  peso: number; // weight in kg
  quantidade: number; // quantity
}

export interface NotaFiscalVolume {
  numeroNF: string;
  chaveNF?: string; // Added for XML import
  dataEmissao?: string; // Added for XML import
  volumes: VolumeItem[];
  remetente: string;
  emitenteCNPJ?: string; // Added for sender consistency validation
  destinatario: string;
  valorTotal: number;
  pesoTotal: number;
}

export type NotaFiscalVolumeInput = Omit<NotaFiscalVolume, 'id'>;

// Generate a unique ID for a volume
export const generateVolumeId = (): string => {
  return uuidv4();
};
