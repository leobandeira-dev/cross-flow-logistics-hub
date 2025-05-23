
import { useState } from 'react';
import { LayoutStyle } from './types';
import { usePDFGeneration } from './usePDFGeneration';
import etiquetaCrudService from '@/services/etiqueta/etiquetaCrudService';

export const useEtiquetaPDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateEtiquetaPDF: generatePDF } = usePDFGeneration();

  const generateEtiquetaPDF = async (
    volumes: any[],
    notaData: any,
    formatoImpressao: string,
    tipoEtiqueta: 'volume' | 'mae' = 'volume',
    layoutStyle: LayoutStyle = 'standard'
  ) => {
    setIsGenerating(true);
    try {
      // Generate PDF
      await generatePDF(volumes, notaData, formatoImpressao, tipoEtiqueta, layoutStyle);

      // Save etiquetas to database
      if (tipoEtiqueta === 'volume' && notaData?.id) {
        try {
          await etiquetaCrudService.criarEtiquetasVolumes(volumes, notaData.id);
          
          // Update status to printed
          const etiquetaIds = volumes.map(v => v.id);
          await etiquetaCrudService.atualizarStatusEtiquetas(etiquetaIds, 'impressa');
        } catch (dbError) {
          console.error('Erro ao salvar etiquetas no banco:', dbError);
          // Don't throw here - PDF generation was successful
        }
      } else if (tipoEtiqueta === 'mae') {
        try {
          await etiquetaCrudService.criarEtiquetaMae(volumes[0]);
        } catch (dbError) {
          console.error('Erro ao salvar etiqueta mãe no banco:', dbError);
        }
      }

      console.log('PDF gerado e etiquetas salvas no banco com sucesso');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateEtiquetaPDF
  };
};
