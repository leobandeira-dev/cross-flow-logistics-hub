
import { NotaFiscalVolume, VolumeItem } from './types';
import { generateVolumeId } from './types';

// Utility function to ensure volumes have id property
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

// Ensure all required fields are present in a nota fiscal
export const ensureCompleteNotaFiscal = (nf: any): NotaFiscalVolume => {
  return {
    numeroNF: nf.numeroNF || '',
    chaveNF: nf.chaveNF || '',
    dataEmissao: nf.dataEmissao || new Date().toISOString().split('T')[0],
    volumes: Array.isArray(nf.volumes) ? convertVolumesToVolumeItems(nf.volumes) : [],
    remetente: nf.remetente || '',
    destinatario: nf.destinatario || '',
    valorTotal: nf.valorTotal || 0,
    pesoTotal: nf.pesoTotal || 0,
    emitenteCNPJ: nf.emitenteCNPJ || ''
  };
};
