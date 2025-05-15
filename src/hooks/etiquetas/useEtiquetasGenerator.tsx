
import { useState } from 'react';
import { usePDFGeneration } from './usePDFGeneration';
import { CurrentEtiqueta, GenerationOptions, EtiquetaGenerationResult, LayoutStyle } from './types';
import { supabase } from '@/integrations/supabase/client';
import etiquetaService from '@/services/etiquetaService';

export const useEtiquetasGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateEtiquetaPDF, generateEtiquetaMasterPDF } = usePDFGeneration();

  // Função para gerar etiquetas de volume
  const generateEtiquetasPDF = async (
    volumes: any[], 
    notaData: any, 
    formatoImpressao: string,
    tipoEtiqueta: 'volume' | 'mae' = 'volume',
    masterId?: string,
    layoutStyle: LayoutStyle = 'standard'
  ): Promise<EtiquetaGenerationResult> => {
    setIsGenerating(true);
    try {
      // Gerar o PDF
      await generateEtiquetaPDF(volumes, notaData, formatoImpressao, tipoEtiqueta, layoutStyle);
      
      // Marcar etiquetas como geradas no volume se for volume
      if (tipoEtiqueta === 'volume') {
        const volumesAtualizados = volumes.map(vol => ({...vol, etiquetado: true}));
        return {
          status: 'success',
          volumes: volumesAtualizados
        };
      }
      
      return {
        status: 'success'
      };
    } catch (error) {
      console.error('Erro ao gerar etiquetas:', error);
      return {
        status: 'error',
        message: 'Erro ao gerar etiquetas. Tente novamente.'
      };
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para gerar etiqueta mãe
  const generateEtiquetaMaePDF = async (
    masterVolume: any[],
    notaData: any,
    formatoImpressao: string,
    etiquetaMaeId: string,
    layoutStyle: LayoutStyle = 'standard'
  ): Promise<EtiquetaGenerationResult> => {
    setIsGenerating(true);
    try {
      // Gerar o PDF para etiqueta mãe
      await generateEtiquetaMasterPDF(masterVolume, notaData, formatoImpressao, etiquetaMaeId, layoutStyle);
      
      return {
        status: 'success'
      };
    } catch (error) {
      console.error('Erro ao gerar etiqueta mãe:', error);
      return {
        status: 'error',
        message: 'Erro ao gerar etiqueta mãe. Tente novamente.'
      };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateEtiquetasPDF,
    generateEtiquetaMaePDF
  };
};

export * from './types';
