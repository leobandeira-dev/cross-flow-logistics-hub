
import { toast } from "@/hooks/use-toast";
import { Volume } from '@/pages/armazenagem/recebimento/components/etiquetas/VolumesTable';
import EtiquetaTemplate from '@/components/common/print/EtiquetaTemplate';
import { createRoot } from 'react-dom/client';
import { EtiquetaFormat, EtiquetaGenerationResult, LayoutStyle } from './types';
import React from 'react';

/**
 * Hook for PDF generation functionality
 */
export const usePDFGeneration = () => {
  /**
   * Creates a temporary element for rendering an etiqueta
   */
  const createTempElement = (hiddenDiv: HTMLDivElement) => {
    const tempEtiqueta = document.createElement('div');
    hiddenDiv.appendChild(tempEtiqueta);
    return tempEtiqueta;
  };

  /**
   * Configures PDF format based on user selection
   */
  const configurePDFFormat = (formatoImpressao: string) => {
    let pdfFormat: any;
    let pdfOrientation: 'portrait' | 'landscape';
    let etiquetaFormat: EtiquetaFormat;
    
    switch (formatoImpressao) {
      case 'a4':
        pdfFormat = 'a4';
        pdfOrientation = 'landscape';
        etiquetaFormat = 'a4';
        break;
      case '50x100':
      default:
        pdfFormat = [100, 50]; // width x height in mm
        pdfOrientation = 'landscape';
        etiquetaFormat = 'small';
        break;
    }
    
    return { pdfFormat, pdfOrientation, etiquetaFormat };
  };

  /**
   * Renders etiqueta to a temporary element and captures as image
   */
  const renderEtiquetaToCanvas = async (
    tempEtiqueta: HTMLDivElement, 
    volumeData: Volume, 
    volumeNumber: number, 
    totalVolumes: number, 
    etiquetaFormat: EtiquetaFormat, 
    tipo: 'volume' | 'mae',
    layoutStyle: LayoutStyle
  ) => {
    const root = createRoot(tempEtiqueta);
    
    // Render the component using React.createElement instead of JSX
    root.render(
      React.createElement(EtiquetaTemplate, {
        volumeData: volumeData as any,
        volumeNumber: volumeNumber,
        totalVolumes: totalVolumes,
        format: etiquetaFormat,
        tipo: tipo,
        layoutStyle: layoutStyle
      })
    );
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture as image
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(tempEtiqueta, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    return { canvas, root };
  };

  return {
    createTempElement,
    configurePDFFormat,
    renderEtiquetaToCanvas
  };
};
