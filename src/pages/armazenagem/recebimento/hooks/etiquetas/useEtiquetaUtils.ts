
import { Volume } from '../../components/etiquetas/VolumesTable';

export const useEtiquetaUtils = () => {
  /**
   * Calcula o peso total dos volumes
   */
  const calculateTotalPeso = (volumes: Volume[]): string => {
    if (!volumes || volumes.length === 0) return '0 Kg';
    
    // Assume que pesoTotal está no formato "X Kg" ou apenas "X"
    const totalPeso = volumes.reduce((total, vol) => {
      // Remove 'Kg' e espaços, e substitui vírgulas por pontos para cálculo
      const pesoStr = vol.pesoTotal ? vol.pesoTotal.replace('Kg', '').trim().replace(',', '.') : '0';
      const peso = parseFloat(pesoStr) || 0;
      return total + peso;
    }, 0);
    
    // Formata o peso com 2 casas decimais e adiciona "Kg"
    return `${totalPeso.toFixed(2)} Kg`;
  };
  
  /**
   * Prepara os dados da nota fiscal para uso na etiqueta
   */
  const prepareNotaData = (volume: Volume, notaFiscalData: any) => {
    return {
      fornecedor: volume.remetente || notaFiscalData?.fornecedor || notaFiscalData?.emitenteRazaoSocial || notaFiscalData?.emitente || '',
      destinatario: volume.destinatario || notaFiscalData?.destinatario || notaFiscalData?.destinatarioRazaoSocial || '',
      endereco: volume.endereco || notaFiscalData?.endereco || notaFiscalData?.enderecoDestinatario || notaFiscalData?.destinatarioEndereco || '',
      cidade: volume.cidade || notaFiscalData?.cidade || notaFiscalData?.cidadeDestinatario || notaFiscalData?.destinatarioCidade || '',
      cidadeCompleta: volume.cidadeCompleta || notaFiscalData?.cidadeCompleta || `${notaFiscalData?.cidadeDestinatario || ''} - ${notaFiscalData?.ufDestinatario || ''}` || notaFiscalData?.destinatarioCidadeCompleta || '',
      uf: volume.uf || notaFiscalData?.uf || notaFiscalData?.ufDestinatario || notaFiscalData?.destinatarioUF || '',
      pesoTotal: volume.pesoTotal || notaFiscalData?.pesoTotal || '0 Kg',
      chaveNF: volume.chaveNF || notaFiscalData?.chaveNF || '',
      transportadora: notaFiscalData?.transportadora || notaFiscalData?.transportadoraNome || 'Transportadora não especificada',
      codigoONU: volume.codigoONU || '',
      codigoRisco: volume.codigoRisco || '',
      classificacaoQuimica: volume.classificacaoQuimica || 'nao_classificada'
    };
  };
  
  return {
    calculateTotalPeso,
    prepareNotaData
  };
};
