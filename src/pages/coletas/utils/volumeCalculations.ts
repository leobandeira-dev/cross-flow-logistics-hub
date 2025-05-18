
// Volume calculation utilities

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

// Calculate total volume (m³) for a single volume item
export const calcularVolume = (volume: VolumeItem): number => {
  // Convert from cm³ to m³ (divide by 1,000,000)
  return (volume.altura * volume.largura * volume.comprimento * volume.quantidade) / 1000000;
};

// Format number to Brazilian format with 2 or 3 decimals
export const formatarNumero = (numero: number, decimais: number = 3): string => {
  return numero.toLocaleString('pt-BR', { 
    minimumFractionDigits: decimais, 
    maximumFractionDigits: decimais 
  });
};

// Convert various volume formats to VolumeItem format
export const convertVolumesToVolumeItems = (volumes: any[]): VolumeItem[] => {
  if (!volumes || !Array.isArray(volumes)) return [];
  
  return volumes.map((vol: any) => {
    // Generate a new ID for each volume
    return {
      id: vol.id || generateVolumeId(),
      altura: typeof vol.altura === 'number' ? vol.altura : parseFloat(vol.altura) || 0,
      largura: typeof vol.largura === 'number' ? vol.largura : parseFloat(vol.largura) || 0,
      comprimento: typeof vol.comprimento === 'number' ? vol.comprimento : parseFloat(vol.comprimento) || 0,
      peso: typeof vol.peso === 'number' ? vol.peso : parseFloat(vol.peso) || 0,
      quantidade: typeof vol.quantidade === 'number' ? vol.quantidade : parseInt(vol.quantidade) || 1
    };
  });
};

// Ensure a nota fiscal has all required properties
export const ensureCompleteNotaFiscal = (nf: any): NotaFiscalVolume => {
  return {
    numeroNF: nf.numeroNF || '',
    chaveNF: nf.chaveNF || '',
    dataEmissao: nf.dataEmissao || '',
    volumes: Array.isArray(nf.volumes) ? convertVolumesToVolumeItems(nf.volumes) : [],
    remetente: nf.remetente || '',
    emitenteCNPJ: nf.emitenteCNPJ || '',
    destinatario: nf.destinatario || '',
    valorTotal: typeof nf.valorTotal === 'number' ? nf.valorTotal : parseFloat(nf.valorTotal) || 0,
    pesoTotal: typeof nf.pesoTotal === 'number' ? nf.pesoTotal : parseFloat(nf.pesoTotal) || 0
  };
};
