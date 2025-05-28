
// usePDFGeneration.ts
import { useState } from 'react';
import { useQRCodeGenerator } from './useQRCodeGenerator';
import { useVolumePreparation } from './useVolumePreparation';
import { useEtiquetaFormat } from './useEtiquetaFormat';
import { useEtiquetaHTML } from './useEtiquetaHTML';
import { usePDFGenerator } from './usePDFGenerator';
import { EtiquetaFormat, LayoutStyle, VolumeData } from './types';

export const usePDFGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { prepareVolumeData } = useVolumePreparation();
  const { generateQRCodeDataURL } = useQRCodeGenerator();
  const { getFormats } = useEtiquetaFormat();
  const { generateEtiquetaHTML } = useEtiquetaHTML();
  const { generatePDF } = usePDFGenerator();

  // Function to prepare volumes for printing
  const prepareVolumesForPrinting = async (volumes: any[], notaData: any) => {
    const preparedVolumes = [];
    
    for (const vol of volumes) {
      // Prepare volume data
      const preparedVolume = prepareVolumeData(vol);
      
      // Generate QR code for the volume ID
      const qrCodeDataURL = await generateQRCodeDataURL(preparedVolume.id);
      
      // Add additional printing-related data
      preparedVolumes.push({
        ...preparedVolume,
        remetente: preparedVolume.remetente || notaData?.fornecedor || '',
        destinatario: preparedVolume.destinatario || notaData?.destinatario || '',
        cidade: preparedVolume.cidade || notaData?.cidade || '',
        cidadeCompleta: preparedVolume.cidadeCompleta || notaData?.cidadeCompleta || '',
        uf: preparedVolume.uf || notaData?.uf || '',
        pesoTotal: notaData?.pesoTotal || preparedVolume.pesoTotal || '0 Kg', // Use nota fiscal weight when available
        transportadora: preparedVolume.transportadora || notaData?.transportadora || 'N/D',
        codigoONU: preparedVolume.codigoONU || notaData?.codigoONU || '',
        codigoRisco: preparedVolume.codigoRisco || notaData?.codigoRisco || '',
        classificacaoQuimica: preparedVolume.classificacaoQuimica || 'nao_classificada',
        area: preparedVolume.area || '01', // Garantir que a área seja incluída
        quantidade: preparedVolume.quantidade || 1, // Garantir que a quantidade seja incluída
        volumeNumber: preparedVolume.volumeNumber || vol.volumeNumber || 1, // Garantir número do volume
        totalVolumes: preparedVolume.totalVolumes || vol.totalVolumes || 1, // Garantir total de volumes
        qrCode: qrCodeDataURL
      } as VolumeData);  // Type assertion to make TypeScript recognize all properties
    }
    
    return preparedVolumes;
  };

  // Generate PDF for volume labels
  const generateEtiquetaPDF = async (
    volumes: any[],
    notaData: any,
    formatoImpressao: string, 
    tipoEtiqueta: 'volume' | 'mae' = 'volume',
    layoutStyle: LayoutStyle = 'enhanced',
    transportadoraLogo?: string
  ) => {
    if (!volumes || volumes.length === 0) return;
    setIsLoading(true);

    try {
      // Get formats
      const formats = getFormats();
      const formato = formats[formatoImpressao] || formats['100x100'];

      // Prepare volumes for printing
      const volumesParaImprimir = await prepareVolumesForPrinting(volumes, notaData);
      
      // Generate HTML for each volume with the logo
      const etiquetasHTML = volumesParaImprimir.map(vol => 
        generateEtiquetaHTML(vol, tipoEtiqueta, layoutStyle, transportadoraLogo)
      );
      
      // Generate PDF
      const fileName = `etiquetas_${notaData.chaveNF || 'volume'}_${new Date().getTime()}.pdf`;
      await generatePDF(etiquetasHTML, formato, fileName);
      
      return fileName;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF for master label
  const generateEtiquetaMasterPDF = async (
    masterVolume: any[],
    notaData: any,
    formatoImpressao: string,
    etiquetaMaeId: string,
    layoutStyle: LayoutStyle = 'enhanced',
    transportadoraLogo?: string
  ) => {
    return generateEtiquetaPDF(masterVolume, notaData, formatoImpressao, 'mae', layoutStyle, transportadoraLogo);
  };

  return {
    isLoading,
    generateEtiquetaPDF,
    generateEtiquetaMasterPDF
  };
};
