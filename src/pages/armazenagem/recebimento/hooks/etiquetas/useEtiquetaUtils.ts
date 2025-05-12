
import { Volume } from '../../components/etiquetas/VolumesTable';

/**
 * Hook for etiqueta utility functions
 */
export const useEtiquetaUtils = () => {
  /**
   * Calculate total peso from a collection of volumes
   */
  const calculateTotalPeso = (volumes: Volume[]): string => {
    if (volumes.length === 0) return '0 Kg';
    
    let totalPeso = 0;
    
    volumes.forEach(vol => {
      const pesoStr = vol.pesoTotal || '0 Kg';
      const pesoNum = parseFloat(pesoStr.replace(/[^0-9.,]/g, '').replace(',', '.'));
      if (!isNaN(pesoNum)) {
        totalPeso += pesoNum;
      }
    });
    
    return `${totalPeso.toFixed(2).replace('.', ',')} Kg`;
  };

  /**
   * Prepare nota data for etiquetas
   */
  const prepareNotaData = (volume: Volume, notaFiscalData: any) => {
    return {
      fornecedor: volume.remetente || notaFiscalData?.remetente || '',
      destinatario: volume.destinatario || notaFiscalData?.destinatario || '',
      endereco: volume.endereco || notaFiscalData?.endereco || '',
      cidade: volume.cidade || notaFiscalData?.cidade || '',
      cidadeCompleta: volume.cidadeCompleta || notaFiscalData?.cidadeCompleta || '',
      uf: volume.uf || notaFiscalData?.uf || '',
      pesoTotal: volume.pesoTotal || notaFiscalData?.pesoTotal || '',
      chaveNF: volume.chaveNF || notaFiscalData?.chaveNF || ''
    };
  };
  
  return {
    calculateTotalPeso,
    prepareNotaData
  };
};
