
import { VolumeItem, generateVolumeId } from './types';

// Convert volume objects with various formats to consistent VolumeItem objects
export const convertVolumesToVolumeItems = (volumes: any[]): VolumeItem[] => {
  return volumes.map((volume) => {
    // Check if the volume is already a VolumeItem
    if (volume.id) {
      return volume;
    }
    
    // Create a new VolumeItem with proper structure
    const volumeItem: VolumeItem = {
      id: generateVolumeId(),
      altura: parseFloat(volume.altura || volume.height || 0),
      largura: parseFloat(volume.largura || volume.width || 0),
      comprimento: parseFloat(volume.comprimento || volume.length || 0),
      peso: parseFloat(volume.peso || volume.weight || 0),
      quantidade: parseInt(volume.quantidade || volume.quantity || 1)
    };
    
    return volumeItem;
  });
};

// Ensure a nota fiscal has all required fields
export const ensureCompleteNotaFiscal = (nf: any) => {
  return {
    numeroNF: nf.numeroNF || nf.numero || `NF${Date.now()}`,
    chaveNF: nf.chaveNF || '',
    dataEmissao: nf.dataEmissao || new Date().toISOString(),
    volumes: Array.isArray(nf.volumes) ? convertVolumesToVolumeItems(nf.volumes) : [],
    remetente: nf.remetente || nf.emit?.xNome || '',
    destinatario: nf.destinatario || nf.dest?.xNome || '',
    valorTotal: parseFloat(nf.valorTotal || nf.vNF || 0),
    pesoTotal: parseFloat(nf.pesoTotal || nf.pesoB || 0),
    // Additional fields
    enderecoRemetente: nf.enderecoRemetente || '',
    cepRemetente: nf.cepRemetente || '',
    cidadeRemetente: nf.cidadeRemetente || '',
    ufRemetente: nf.ufRemetente || '',
    enderecoDestinatario: nf.enderecoDestinatario || '',
    cepDestinatario: nf.cepDestinatario || '',
    cidadeDestinatario: nf.cidadeDestinatario || '',
    ufDestinatario: nf.ufDestinatario || ''
  };
};
