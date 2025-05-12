
import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Volume } from '@/pages/armazenagem/recebimento/components/etiquetas/VolumesTable';
import { useEtiquetaPreview } from './useEtiquetaPreview';
import { useVolumePreparation } from './useVolumePreparation';
import { usePDFGeneration } from './usePDFGeneration';
import { EtiquetaGenerationOptions, EtiquetaGenerationResult, LayoutStyle } from './types';

/**
 * Hook for generating etiquetas (labels) for volumes
 */
export const useEtiquetasGenerator = () => {
  const { etiquetaRef, currentEtiqueta, setCurrentEtiqueta, isGenerating, setIsGenerating } = useEtiquetaPreview();
  const { prepareVolumeData } = useVolumePreparation();
  const { createTempElement, configurePDFFormat, renderEtiquetaToCanvas } = usePDFGeneration();

  // Generate and download the PDF with all labels
  const generateEtiquetasPDF = async (
    volumes: Volume[], 
    notaData: any = {}, 
    formatoImpressao: string = '50x100',
    tipo: 'volume' | 'mae' = 'volume',
    etiquetaMaeId?: string,
    layoutStyle: LayoutStyle = 'standard'
  ): Promise<EtiquetaGenerationResult> => {
    if (!volumes || volumes.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum volume disponível para gerar etiquetas.",
        variant: "destructive"
      });
      return { status: 'error', error: 'No volumes available' };
    }

    setIsGenerating(true);
    const totalVolumes = volumes.length;
    const notaFiscal = volumes[0].notaFiscal || 'SEM-NF';

    try {
      // Create a hidden div to hold all etiquetas
      const hiddenDiv = document.createElement('div');
      hiddenDiv.style.position = 'absolute';
      hiddenDiv.style.left = '-9999px';
      document.body.appendChild(hiddenDiv);
      
      // Configure PDF format based on user selection
      const { pdfFormat, pdfOrientation, etiquetaFormat } = configurePDFFormat(formatoImpressao);
      
      // Create a PDF document
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: pdfFormat
      });
      
      if (tipo === 'mae') {
        // Generate one master label for all volumes
        // Create a "master" volume that contains all the info
        const tipoEtiquetaMae = volumes[0].tipoEtiquetaMae || 'geral';
        const masterVolume: Volume = {
          ...volumes[0],
          id: etiquetaMaeId || `MASTER-${notaFiscal}-${Date.now()}`,
          etiquetaMae: etiquetaMaeId || `MASTER-${notaFiscal}-${Date.now()}`,
          quantidade: totalVolumes,
          tipoEtiquetaMae: tipoEtiquetaMae
        };
        
        const preparedMasterVolume = prepareVolumeData(masterVolume, notaData);
        
        // Create temporary element
        const tempEtiqueta = createTempElement(hiddenDiv);
        
        // Render and capture as image
        const { canvas, root } = await renderEtiquetaToCanvas(
          tempEtiqueta,
          preparedMasterVolume,
          1,
          1,
          etiquetaFormat,
          'mae',
          layoutStyle
        );
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        
        // Clean up
        root.unmount();
        hiddenDiv.removeChild(tempEtiqueta);
      } else {
        // For each volume, render the etiqueta and add to PDF
        for (let i = 0; i < volumes.length; i++) {
          const volumeData = prepareVolumeData(volumes[i], notaData);
          
          // Create temporary element
          const tempEtiqueta = createTempElement(hiddenDiv);
          
          // Render and capture as image
          const { canvas, root } = await renderEtiquetaToCanvas(
            tempEtiqueta,
            volumeData,
            i + 1,
            totalVolumes,
            etiquetaFormat,
            'volume',
            layoutStyle
          );
          
          // Add to PDF
          if (i > 0) {
            pdf.addPage();
          }
          
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          
          // Clean up
          root.unmount();
          hiddenDiv.removeChild(tempEtiqueta);
        }
      }
      
      // Generate file name based on nota fiscal and type
      const typePrefix = tipo === 'mae' ? 
        (volumes[0].tipoEtiquetaMae === 'palete' ? 'etiqueta_palete' : 'etiqueta_mae') : 
        'etiquetas_volume';
      const fileName = `${typePrefix}_${tipo === 'mae' ? etiquetaMaeId : 'nf_' + notaFiscal}_${new Date().toISOString().slice(0,10)}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      
      // Clean up the hidden div
      document.body.removeChild(hiddenDiv);
      
      // Show appropriate toast message based on the etiqueta type
      if (tipo === 'mae') {
        const tipoLabel = volumes[0].tipoEtiquetaMae === 'palete' ? 'palete' : 'etiqueta mãe';
        toast({
          title: "Sucesso",
          description: `${tipoLabel.charAt(0).toUpperCase() + tipoLabel.slice(1)} gerado(a) com sucesso.`,
        });
      } else {
        toast({
          title: "Sucesso",
          description: `${totalVolumes} etiquetas de volume geradas com sucesso.`,
        });
      }
      
      // Mark volumes as used (etiquetado = true) since each label can only be printed once
      return {
        status: 'success',
        volumes: volumes.map(vol => ({...vol, etiquetado: true}))
      };
      
    } catch (error) {
      console.error('Erro ao gerar etiquetas:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar as etiquetas. Tente novamente.",
        variant: "destructive"
      });
      return { status: 'error', error };
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate master label for a group of volumes
  const generateEtiquetaMaePDF = async (
    volumes: Volume[],
    notaData: any = {},
    formatoImpressao: string = '50x100',
    etiquetaMaeId?: string,
    layoutStyle: LayoutStyle = 'standard'
  ) => {
    return generateEtiquetasPDF(volumes, notaData, formatoImpressao, 'mae', etiquetaMaeId, layoutStyle);
  };

  return {
    etiquetaRef,
    isGenerating,
    currentEtiqueta,
    setCurrentEtiqueta,
    generateEtiquetasPDF,
    generateEtiquetaMaePDF
  };
};
