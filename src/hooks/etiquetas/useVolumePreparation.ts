
import { Volume } from '@/pages/armazenagem/recebimento/hooks/etiquetas/useVolumeState';

// Define and export the VolumeData type
export type VolumeData = {
  id: string;
  notaFiscal: string;
  descricao: string;
  quantidade: number;
  etiquetado: boolean;
  remetente: string;
  destinatario: string;
  endereco: string;
  cidade: string;
  cidadeCompleta?: string;
  uf: string;
  pesoTotal: string;
  chaveNF: string;
  etiquetaMae?: string;
  tipoEtiquetaMae?: string;
  tipoVolume?: 'geral' | 'quimico';
  codigoONU?: string;
  codigoRisco?: string;
  transportadora?: string;
};

export const useVolumePreparation = () => {
  // The existing function to prepare volume data
  const prepareVolumeData = (volume: any): VolumeData => {
    // Extract transportadora from volume or from nested nota_fiscal if it exists
    const transportadora = volume.transportadora || 
      (volume.nota_fiscal && volume.nota_fiscal.transportadora) ||
      'Transportadora não especificada';
    
    // Convert the volume data to a standard format
    return {
      id: volume.id || volume.codigo || '',
      notaFiscal: volume.notaFiscal || volume.nota_fiscal?.numero || '',
      descricao: volume.descricao || '',
      quantidade: volume.quantidade || 1,
      etiquetado: volume.etiquetado || false,
      remetente: volume.remetente || volume.nota_fiscal?.emitente_nome || '',
      destinatario: volume.destinatario || volume.nota_fiscal?.destinatario_nome || '',
      endereco: volume.endereco || volume.nota_fiscal?.destinatario_endereco || '',
      cidade: volume.cidade || volume.nota_fiscal?.destinatario_cidade || '',
      cidadeCompleta: volume.cidadeCompleta || volume.nota_fiscal?.destinatario_cidade_completa || '',
      uf: volume.uf || volume.nota_fiscal?.destinatario_uf || '',
      pesoTotal: volume.pesoTotal || volume.nota_fiscal?.peso_total || '0 Kg',
      chaveNF: volume.chaveNF || volume.nota_fiscal?.chave || '',
      etiquetaMae: volume.etiquetaMae || volume.etiqueta_mae_id || '',
      tipoEtiquetaMae: volume.tipoEtiquetaMae || 'geral',
      tipoVolume: volume.tipoVolume || 'geral',
      codigoONU: volume.codigoONU || '',
      codigoRisco: volume.codigoRisco || '',
      transportadora: transportadora
    };
  };

  // Add the missing prepareVolume function
  const prepareVolume = async (volume: VolumeData): Promise<VolumeData> => {
    // This function can be used for any additional processing needed
    // before using the volume data, such as API calls or transformations
    return prepareVolumeData(volume);
  };

  return {
    prepareVolumeData,
    prepareVolume
  };
};
