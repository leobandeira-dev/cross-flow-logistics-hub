
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

// Format currency in Brazilian Real (R$)
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
};

// Calculate totals for a single invoice
export const calcularTotaisNota = (volumes: VolumeItem[], pesoTotal?: number): { 
  qtdVolumes: number; 
  volumeTotal: number; 
  pesoTotal: number;
  pesoCubadoTotal: number;
} => {
  let totalVolumes = 0;
  let totalVolumeM3 = 0;
  
  volumes.forEach(volume => {
    totalVolumes += volume.quantidade;
    totalVolumeM3 += calcularVolume(volume);
  });
  
  // Calculate cubic weight (300kg per cubic meter)
  const pesoCubado = totalVolumeM3 * 300;
  
  return {
    qtdVolumes: totalVolumes,
    volumeTotal: totalVolumeM3,
    pesoTotal: pesoTotal || volumes.reduce((sum, vol) => sum + (vol.peso * vol.quantidade), 0),
    pesoCubadoTotal: pesoCubado
  };
};

// Calculate totals for a collection of invoices
export const calcularTotaisColeta = (notasFiscais: NotaFiscalVolume[]): {
  qtdVolumes: number;
  volumeTotal: number;
  pesoTotal: number;
  pesoCubadoTotal: number;
} => {
  let totalVolumes = 0;
  let totalVolumeM3 = 0;
  let totalPeso = 0;
  
  notasFiscais.forEach(nf => {
    const totaisNota = calcularTotaisNota(nf.volumes, nf.pesoTotal);
    totalVolumes += totaisNota.qtdVolumes;
    totalVolumeM3 += totaisNota.volumeTotal;
    totalPeso += nf.pesoTotal || totaisNota.pesoTotal;
  });
  
  // Calculate cubic weight (300kg per cubic meter)
  const pesoCubado = totalVolumeM3 * 300;
  
  return {
    qtdVolumes: totalVolumes,
    volumeTotal: totalVolumeM3,
    pesoTotal: totalPeso,
    pesoCubadoTotal: pesoCubado
  };
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
