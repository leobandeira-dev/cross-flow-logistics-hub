
import { Volume } from '@/pages/armazenagem/recebimento/hooks/etiquetas/useVolumeState';

export const useVolumePreparation = () => {
  const prepareVolumeData = (volume: any) => {
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
      transportadora: transportadora // Added transportadora field
    };
  };

  return {
    prepareVolumeData
  };
};
