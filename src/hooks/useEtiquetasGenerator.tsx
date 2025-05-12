import React, { useRef, useState } from 'react';
import { toast } from "@/hooks/use-toast";
import EtiquetaTemplate from '@/components/common/print/EtiquetaTemplate';
import { Volume } from '@/pages/armazenagem/recebimento/components/etiquetas/VolumesTable';

export const useEtiquetasGenerator = () => {
  const etiquetaRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentEtiqueta, setCurrentEtiqueta] = useState<{
    volumeData: Volume;
    volumeNumber: number;
    totalVolumes: number;
  } | null>(null);

  // Function to prepare volume data with default values for missing fields
  const prepareVolumeData = (volume: Volume, notaData: any = {}): Volume => {
    return {
      ...volume,
      remetente: notaData.fornecedor || volume.remetente || "REMETENTE NÃO INFORMADO",
      destinatario: notaData.destinatario || volume.destinatario || "DESTINATÁRIO NÃO INFORMADO",
      endereco: notaData.endereco || volume.endereco || "ENDEREÇO NÃO INFORMADO",
      cidade: notaData.cidade || volume.cidade || "CIDADE NÃO INFORMADA",
      cidadeCompleta: notaData.cidadeCompleta || volume.cidadeCompleta || notaData.cidade || volume.cidade || "CIDADE NÃO INFORMADA",
      uf: notaData.uf || volume.uf || "UF",
      pesoTotal: notaData.pesoTotal || volume.pesoTotal || "0,00 Kg",
      tipoVolume: volume.tipoVolume || 'geral',
      codigoONU: volume.codigoONU || '',
      codigoRisco: volume.codigoRisco || '',
      chaveNF: volume.chaveNF || notaData.chaveNF || ''
    };
  };

  // Generate and download the PDF with all labels
  const generateEtiquetasPDF = async (
    volumes: Volume[], 
    notaData: any = {}, 
    formatoImpressao: string = '50x100',
    tipo: 'volume' | 'mae' = 'volume',
    etiquetaMaeId?: string,
    layoutStyle: 'standard' | 'compact' | 'modern' = 'standard'
  ) => {
    if (!volumes || volumes.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum volume disponível para gerar etiquetas.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const totalVolumes = volumes.length;
    const notaFiscal = volumes[0].notaFiscal;

    try {
      // Create a hidden div to hold all etiquetas
      const hiddenDiv = document.createElement('div');
      hiddenDiv.style.position = 'absolute';
      hiddenDiv.style.left = '-9999px';
      document.body.appendChild(hiddenDiv);
      
      // Configure PDF format based on user selection
      let pdfFormat: any; // Changed from string to any to accommodate both string and number[] types
      let pdfOrientation: 'portrait' | 'landscape';
      let etiquetaFormat: 'small' | 'a4';
      
      switch (formatoImpressao) {
        case 'a4':
          pdfFormat = 'a4';
          pdfOrientation = 'landscape';
          etiquetaFormat = 'a4';
          break;
        case '50x100':
        default:
          pdfFormat = [100, 50]; // width x height in mm (array of numbers)
          pdfOrientation = 'landscape';
          etiquetaFormat = 'small';
          break;
      }
      
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
        const masterVolume: Volume = {
          ...volumes[0],
          id: etiquetaMaeId || `MASTER-${notaFiscal}-${Date.now()}`,
          etiquetaMae: etiquetaMaeId || `MASTER-${notaFiscal}-${Date.now()}`,
          quantidade: totalVolumes
        };
        
        const preparedMasterVolume = prepareVolumeData(masterVolume, notaData);
        
        // Create temporary element
        const tempEtiqueta = document.createElement('div');
        hiddenDiv.appendChild(tempEtiqueta);
        
        // Render etiqueta to the temporary element
        const { createRoot } = await import('react-dom/client');
        const root = createRoot(tempEtiqueta);
        
        // Render the component
        root.render(
          <EtiquetaTemplate
            volumeData={preparedMasterVolume as any}
            volumeNumber={1}
            totalVolumes={1}
            format={etiquetaFormat}
            tipo="mae"
            layoutStyle={layoutStyle}
          />
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
          const tempEtiqueta = document.createElement('div');
          hiddenDiv.appendChild(tempEtiqueta);
          
          // Render etiqueta to the temporary element
          const { createRoot } = await import('react-dom/client');
          const root = createRoot(tempEtiqueta);
          
          // Render the component
          root.render(
            <EtiquetaTemplate
              volumeData={volumeData as any}
              volumeNumber={i + 1}
              totalVolumes={totalVolumes}
              format={etiquetaFormat}
              tipo="volume"
              layoutStyle={layoutStyle}
            />
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
      const typePrefix = tipo === 'mae' ? 'etiqueta_mae' : 'etiquetas_volume';
      const fileName = `${typePrefix}_nf_${notaFiscal}_${new Date().toISOString().slice(0,10)}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      
      // Clean up the hidden div
      document.body.removeChild(hiddenDiv);
      
      toast({
        title: "Sucesso",
        description: tipo === 'mae' 
          ? `Etiqueta mãe gerada com sucesso.`
          : `${totalVolumes} etiquetas de volume geradas com sucesso.`,
      });
      
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
    layoutStyle: 'standard' | 'compact' | 'modern' = 'standard'
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
