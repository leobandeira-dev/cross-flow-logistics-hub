
import { VolumeItem, generateVolumeId } from './types';
import { NotaFiscalVolume } from './types';

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
