
import { toast } from '@/hooks/use-toast';
import { Volume } from '../../components/etiquetas/VolumesTable';
import { useEtiquetasGenerator } from '@/hooks/etiquetas';
import { LayoutStyle } from '@/hooks/etiquetas/types';

/**
 * Hook for handling etiquetas printing operations
 */
export const useEtiquetasPrinting = () => {
  const { generateEtiquetasPDF, generateEtiquetaMaePDF, isGenerating } = useEtiquetasGenerator();

  // Calculate total peso from a collection of volumes
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

  // Function to handle printing etiquetas for selected volumes
  const printEtiquetas = (
    volume: Volume, 
    volumes: Volume[], 
    notaFiscalData: any, 
    formatoImpressao: string,
    layoutStyle: LayoutStyle
  ) => {
    // Get volumes with the same nota fiscal
    const volumesNota = volumes.filter(vol => vol.notaFiscal === volume.notaFiscal);
    
    // Prepare nota data for the etiquetas
    const notaData = prepareNotaData(volume, notaFiscalData);
    
    // Generate etiquetas for all volumes of this nota fiscal
    const result = generateEtiquetasPDF(volumesNota, notaData, formatoImpressao, 'volume', undefined, layoutStyle);
    
    return result;
  };

  // Function to handle reprinting etiquetas for all volumes
  const reimprimirEtiquetas = (
    volume: Volume, 
    volumes: Volume[], 
    notaFiscalData: any, 
    formatoImpressao: string,
    layoutStyle: LayoutStyle
  ) => {
    // For reimprimir, we generate etiquetas regardless of etiquetado status
    const volumesNota = volumes.filter(vol => vol.notaFiscal === volume.notaFiscal);
    
    const notaData = prepareNotaData(volume, notaFiscalData);
    
    generateEtiquetasPDF(volumesNota, notaData, formatoImpressao, 'volume', undefined, layoutStyle);
    
    toast({
      title: "Etiquetas Reimpressas",
      description: `Etiquetas para NF ${volume.notaFiscal} reimpressas com sucesso.`,
    });
  };

  // Function to prepare nota data for etiquetas
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
  
  // Function to create a master etiqueta without printing
  const createEtiquetaMae = (
    descricao: string,
    tipoEtiquetaMae: 'geral' | 'palete'
  ) => {
    // Generate a sequential ID for the etiqueta mãe
    const timestamp = Date.now();
    const etiquetaMaeId = `MASTER-${timestamp}`;
    
    // Create a master etiqueta data object
    const etiquetaMae = {
      id: etiquetaMaeId,
      notaFiscal: '',
      descricao: descricao || 'Etiqueta Mãe',
      quantidadeVolumes: 0, 
      remetente: '',
      destinatario: '',
      cidade: '',
      uf: '',
      dataCriacao: new Date().toISOString().split('T')[0],
      status: 'ativo',
      tipo: tipoEtiquetaMae
    };
    
    const tipoLabel = tipoEtiquetaMae === 'palete' ? 'Palete' : 'Etiqueta Mãe';
    
    toast({
      title: `${tipoLabel} Criado(a)`,
      description: `Novo(a) ${tipoLabel.toLowerCase()} ${etiquetaMaeId} criado(a) com sucesso.`,
    });
    
    return etiquetaMae;
  };
  
  // Function to create and print a master etiqueta
  const createAndPrintEtiquetaMae = (
    etiquetaMaeId: string,
    descricao: string,
    tipoEtiquetaMae: 'geral' | 'palete',
    formatoImpressao: string,
    layoutStyle: LayoutStyle
  ) => {
    // Create a standalone master etiqueta not attached to any nota fiscal
    const dummyMasterVolume: Volume[] = [{
      id: etiquetaMaeId,
      notaFiscal: '',
      descricao: descricao,
      quantidade: 0,
      etiquetado: true,
      remetente: '',
      destinatario: '',
      endereco: '',
      cidade: '',
      cidadeCompleta: '',
      uf: '',
      pesoTotal: '0 Kg',
      chaveNF: '',
      etiquetaMae: etiquetaMaeId,
      tipoEtiquetaMae: tipoEtiquetaMae // Add the type to the volume data
    }];
    
    // Empty nota data since this is a standalone master etiqueta
    const emptyNotaData = {
      fornecedor: '',
      destinatario: '',
      endereco: '',
      cidade: '',
      cidadeCompleta: '',
      uf: '',
      pesoTotal: '0 Kg',
      chaveNF: '',
      tipoEtiquetaMae: tipoEtiquetaMae
    };
    
    // Generate master etiqueta
    generateEtiquetaMaePDF(dummyMasterVolume, emptyNotaData, formatoImpressao, etiquetaMaeId, layoutStyle);
    
    const tipoLabel = tipoEtiquetaMae === 'palete' ? 'Palete' : 'Etiqueta Mãe';
    
    toast({
      title: `${tipoLabel} Criado(a)`,
      description: `Novo(a) ${tipoLabel.toLowerCase()} ${etiquetaMaeId} criado(a) com sucesso.`,
    });
  };

  // Function to handle printing master etiqueta
  const printEtiquetaMae = (
    etiquetaMae: any, 
    volumes: Volume[],
    formatoImpressao: string,
    layoutStyle: LayoutStyle
  ) => {
    // For etiqueta mãe that's already created and possibly linked to volumes
    const linkedVolumes = volumes.filter(vol => vol.etiquetaMae === etiquetaMae.id);
    
    // Prepare nota data based on the first linked volume or use generic info
    const notaData = linkedVolumes.length > 0 ? {
      fornecedor: linkedVolumes[0].remetente || '',
      destinatario: linkedVolumes[0].destinatario || '',
      endereco: linkedVolumes[0].endereco || '',
      cidade: linkedVolumes[0].cidade || '',
      cidadeCompleta: linkedVolumes[0].cidadeCompleta || '',
      uf: linkedVolumes[0].uf || '',
      pesoTotal: calculateTotalPeso(linkedVolumes),
      chaveNF: linkedVolumes[0].chaveNF || ''
    } : {
      fornecedor: '',
      destinatario: '',
      endereco: '',
      cidade: '',
      cidadeCompleta: '',
      uf: '',
      pesoTotal: '0 Kg',
      chaveNF: ''
    };
    
    // Create a dummy volume to represent the master etiqueta
    const dummyMasterVolume: Volume[] = [{
      id: etiquetaMae.id,
      notaFiscal: linkedVolumes.length > 0 ? linkedVolumes[0].notaFiscal : '',
      descricao: etiquetaMae.descricao || 'Etiqueta Mãe',
      quantidade: linkedVolumes.length,
      etiquetado: true,
      remetente: notaData.fornecedor,
      destinatario: notaData.destinatario,
      endereco: notaData.endereco,
      cidade: notaData.cidade,
      cidadeCompleta: notaData.cidadeCompleta,
      uf: notaData.uf,
      pesoTotal: notaData.pesoTotal,
      chaveNF: notaData.chaveNF,
      etiquetaMae: etiquetaMae.id,
      tipoEtiquetaMae: etiquetaMae.tipo || 'geral'
    }];
    
    // Generate master etiqueta
    generateEtiquetaMaePDF(dummyMasterVolume, notaData, formatoImpressao, etiquetaMae.id, layoutStyle);
    
    toast({
      title: "Etiqueta Mãe Impressa",
      description: `Etiqueta mãe ${etiquetaMae.id} impressa com sucesso.`,
    });
  };

  return {
    isGenerating,
    printEtiquetas,
    reimprimirEtiquetas,
    printEtiquetaMae,
    createEtiquetaMae,
    createAndPrintEtiquetaMae,
    calculateTotalPeso
  };
};
