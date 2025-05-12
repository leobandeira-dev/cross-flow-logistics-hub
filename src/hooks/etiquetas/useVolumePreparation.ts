
import { Volume } from '@/pages/armazenagem/recebimento/components/etiquetas/VolumesTable';

/**
 * Hook for preparing volume data with default values for missing fields
 */
export const useVolumePreparation = () => {
  /**
   * Prepares volume data with default values for missing fields
   */
  const prepareVolumeData = (volume: Volume, notaData: any = {}): Volume => {
    return {
      ...volume,
      remetente: notaData.fornecedor || volume.remetente || "REMETENTE NÃO INFORMADO",
      destinatario: notaData.destinatario || volume.destinatario || "DESTINATÁRIO NÃO INFORMADO",
      endereco: notaData.endereco || volume.endereco || "ENDEREÇO NÃO INFORMADO",
      cidade: notaData.cidade || volume.cidade || "CIDADE NÃO INFORMADA",
      cidadeCompleta: notaData.cidadeCompleta || volume.cidadeCompleta || notaData.cidade || volume.cidade || "CIDADE NÃO INFORMADA",
      uf: notaData.uf || volume.uf || "UF",
      pesoTotal: notaData.pesoTotal || volume.pesoTotal || "0,00 Kg",
      tipoVolume: volume.tipoVolume || 'geral',
      codigoONU: volume.codigoONU || '',
      codigoRisco: volume.codigoRisco || '',
      chaveNF: volume.chaveNF || notaData.chaveNF || ''
    };
  };

  return { prepareVolumeData };
};
