
// usePDFGeneration.ts
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useVolumePreparation } from './useVolumePreparation';
import { EtiquetaFormat, LayoutStyle } from './types';

export const usePDFGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { prepareVolumeData } = useVolumePreparation();

  // Define os formatos de etiquetas disponíveis
  const formatos: Record<string, EtiquetaFormat> = {
    '50x100': { width: 100, height: 50, unit: 'mm' },
    '100x100': { width: 100, height: 100, unit: 'mm' },
    '100x150': { width: 150, height: 100, unit: 'mm' },
    '62x42': { width: 62, height: 42, unit: 'mm' },
    'a4': { width: 210, height: 297, unit: 'mm' },
  };

  // Function to prepare volumes for printing
  const prepareVolumesForPrinting = (volumes: any[], notaData: any) => {
    return volumes.map(vol => {
      // Prepare volume data
      const preparedVolume = prepareVolumeData(vol);
      
      // Add additional printing-related data
      return {
        ...preparedVolume,
        remetente: preparedVolume.remetente || notaData?.fornecedor || '',
        destinatario: preparedVolume.destinatario || notaData?.destinatario || '',
        cidade: preparedVolume.cidade || notaData?.cidade || '',
        uf: preparedVolume.uf || notaData?.uf || '',
        qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==` // Placeholder QR code
      };
    });
  };

  // Gera o PDF para etiquetas de volume
  const generateEtiquetaPDF = async (
    volumes: any[],
    notaData: any,
    formatoImpressao: string, 
    tipoEtiqueta: 'volume' | 'mae' = 'volume',
    layoutStyle: LayoutStyle = 'standard'
  ) => {
    if (!volumes || volumes.length === 0) return;
    setIsLoading(true);

    try {
      // Prepara os dados para impressão
      const volumesParaImprimir = prepareVolumesForPrinting(volumes, notaData);
      
      // Cria elemento temporário para renderizar as etiquetas
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Renderiza o HTML da etiqueta
      tempDiv.innerHTML = volumesParaImprimir.map(vol => 
        generateEtiquetaHTML(vol, tipoEtiqueta, layoutStyle)
      ).join('');
      
      // Define o formato do PDF
      const formato = formatos[formatoImpressao] || formatos['100x100'];
      
      // Fix the jsPDF constructor call
      const orientation = formato.width > formato.height ? 'landscape' : 'portrait';
      const unit = formato.unit as "pt" | "mm" | "cm" | "in" | "px" | "pc" | "em" | "ex";
      
      const pdf = new jsPDF({
        orientation,
        unit,
        format: [formato.width, formato.height]
      });
      
      // Para cada volume, cria uma página do PDF
      for (let i = 0; i < volumesParaImprimir.length; i++) {
        const etiquetaElement = tempDiv.children[i] as HTMLElement;
        
        if (i > 0) pdf.addPage();
        
        const canvas = await html2canvas(etiquetaElement, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, formato.width, formato.height);
      }
      
      // Salva o PDF
      const fileName = `etiquetas_${notaData.chaveNF || 'volume'}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
      // Limpa o elemento temporário
      document.body.removeChild(tempDiv);
      
      return fileName;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Gera o PDF para etiqueta mãe
  const generateEtiquetaMasterPDF = async (
    masterVolume: any[],
    notaData: any,
    formatoImpressao: string,
    etiquetaMaeId: string,
    layoutStyle: LayoutStyle = 'standard'
  ) => {
    return generateEtiquetaPDF(masterVolume, notaData, formatoImpressao, 'mae', layoutStyle);
  };

  // Função auxiliar para gerar o HTML da etiqueta
  const generateEtiquetaHTML = (volume: any, tipoEtiqueta: string, layoutStyle: LayoutStyle) => {
    // Template HTML conforme o tipo de layout selecionado
    const templates = {
      standard: `
        <div class="etiqueta standard" style="width: 100%; height: 100%; padding: 10px; font-family: Arial;">
          <div style="font-size: 14px; font-weight: bold; text-align: center;">${volume.id}</div>
          <div style="font-size: 12px; margin-top: 5px;">${volume.descricao || ''}</div>
          <div style="font-size: 12px; margin-top: 10px;">
            <div>Remetente: ${volume.remetente}</div>
            <div>Destinatário: ${volume.destinatario}</div>
            <div>Cidade: ${volume.cidade} - ${volume.uf}</div>
          </div>
          <div style="font-size: 11px; margin-top: 10px; text-align: center;">
            Peso: ${volume.pesoTotal || '0 kg'}
          </div>
          ${volume.qrCode ? `<div style="text-align: center; margin-top: 10px;"><img src="${volume.qrCode}" style="width: 80px; height: 80px;"></div>` : ''}
        </div>
      `,
      compact: `
        <div class="etiqueta compact" style="width: 100%; height: 100%; padding: 5px; font-family: Arial;">
          <div style="font-size: 12px; font-weight: bold; text-align: center;">${volume.id}</div>
          <div style="font-size: 10px; margin-top: 3px; text-align: center;">${volume.descricao || ''}</div>
          <div style="font-size: 10px; margin-top: 5px;">
            <div>Para: ${volume.destinatario}</div>
            <div>${volume.cidade}/${volume.uf}</div>
          </div>
          ${volume.qrCode ? `<div style="text-align: center; margin-top: 5px;"><img src="${volume.qrCode}" style="width: 60px; height: 60px;"></div>` : ''}
        </div>
      `,
      modern: `
        <div class="etiqueta modern" style="width: 100%; height: 100%; padding: 10px; font-family: Arial; display: flex; flex-direction: column;">
          <div style="font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">${volume.id}</div>
          <div style="display: flex; justify-content: space-between; height: 100%;">
            <div style="font-size: 12px; flex: 2;">
              <div style="margin-bottom: 10px;">
                <strong>De:</strong> ${volume.remetente}
              </div>
              <div style="margin-bottom: 10px;">
                <strong>Para:</strong> ${volume.destinatario}<br>
                ${volume.cidade}/${volume.uf}
              </div>
              <div><strong>Peso:</strong> ${volume.pesoTotal || '0 kg'}</div>
              <div><strong>Desc:</strong> ${volume.descricao || 'N/A'}</div>
            </div>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
              ${volume.qrCode ? `<img src="${volume.qrCode}" style="width: 100px; height: 100px;">` : ''}
            </div>
          </div>
        </div>
      `,
    };
    
    return templates[layoutStyle] || templates.standard;
  };

  return {
    isLoading,
    generateEtiquetaPDF,
    generateEtiquetaMasterPDF
  };
};
