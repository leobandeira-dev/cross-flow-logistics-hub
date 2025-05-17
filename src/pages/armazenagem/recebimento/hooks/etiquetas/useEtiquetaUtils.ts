
import { Volume } from '../../components/etiquetas/VolumesTable';

export const useEtiquetaUtils = () => {
  /**
   * Calcula o peso total dos volumes
   */
  const calculateTotalPeso = (volumes: Volume[]): string => {
    if (!volumes || volumes.length === 0) return '0 Kg';
    
    // Assume que pesoTotal está no formato "X Kg"
    const totalPeso = volumes.reduce((total, vol) => {
      const peso = parseFloat(vol.pesoTotal?.replace('Kg', '').trim()) || 0;
      return total + peso;
    }, 0);
    
    return `${totalPeso.toFixed(2)} Kg`;
  };
  
  /**
   * Prepara os dados da nota fiscal para uso na etiqueta
   */
  const prepareNotaData = (volume: Volume, notaFiscalData: any) => {
    return {
      fornecedor: volume.remetente || notaFiscalData?.fornecedor || notaFiscalData?.emitenteRazaoSocial || '',
      destinatario: volume.destinatario || notaFiscalData?.destinatario || notaFiscalData?.destinatarioRazaoSocial || '',
      endereco: volume.endereco || notaFiscalData?.endereco || notaFiscalData?.destinatarioEndereco || '',
      cidade: volume.cidade || notaFiscalData?.cidade || notaFiscalData?.destinatarioCidade || '',
      cidadeCompleta: volume.cidadeCompleta || notaFiscalData?.cidadeCompleta || notaFiscalData?.destinatarioCidadeCompleta || '',
      uf: volume.uf || notaFiscalData?.uf || notaFiscalData?.destinatarioUF || '',
      pesoTotal: volume.pesoTotal || notaFiscalData?.pesoTotal || '0 Kg',
      chaveNF: volume.chaveNF || notaFiscalData?.chaveNF || '',
      transportadora: notaFiscalData?.transportadora || notaFiscalData?.transportadoraNome || 'Transportadora não especificada'
    };
  };
  
  return {
    calculateTotalPeso,
    prepareNotaData
  };
};
