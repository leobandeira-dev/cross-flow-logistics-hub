
import { NotaFiscalVolume, VolumeItem, generateVolumeId } from './types';

// Convert volumes to standard VolumeItem format
export const convertVolumesToVolumeItems = (volumes: any[]): VolumeItem[] => {
  return volumes.map((volume) => ({
    id: volume.id || generateVolumeId(),
    quantidade: volume.quantidade || 1,
    altura: volume.altura || 0,
    largura: volume.largura || 0,
    comprimento: volume.comprimento || 0,
    peso: volume.peso || 0
  }));
};

// Ensure a nota fiscal has all required fields
export const ensureCompleteNotaFiscal = (notaFiscal: any): NotaFiscalVolume => {
  return {
    numeroNF: notaFiscal.numeroNF || '',
    chaveNF: notaFiscal.chaveNF || '',
    dataEmissao: notaFiscal.dataEmissao || '',
    volumes: Array.isArray(notaFiscal.volumes) 
      ? convertVolumesToVolumeItems(notaFiscal.volumes) 
      : [],
    remetente: notaFiscal.remetente || '',
    destinatario: notaFiscal.destinatario || '',
    valorTotal: notaFiscal.valorTotal || 0,
    pesoTotal: notaFiscal.pesoTotal || 0
  };
};

// Calculate cubic volume (m³)
export const calculateCubicVolume = (volume: VolumeItem): number => {
  return (volume.altura * volume.largura * volume.comprimento * volume.quantidade) / 1000000;
};

// Calculate total cubic volume for a set of volumes
export const calculateTotalCubicVolume = (volumes: VolumeItem[]): number => {
  return volumes.reduce((total, vol) => total + calculateCubicVolume(vol), 0);
};
