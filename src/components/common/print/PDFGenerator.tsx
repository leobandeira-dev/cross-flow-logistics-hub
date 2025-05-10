
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from "@/hooks/use-toast";

/**
 * Hook for PDF generation functionality
 */
export const usePDFGenerator = (
  layoutRef: React.RefObject<HTMLDivElement>,
  documentId: string,
  documentType: string
) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generatePDF = async () => {
    if (!layoutRef.current) return null;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(layoutRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // A4 size: 210 x 297 mm
      const imgWidth = 190;
      const pageHeight = 297;  
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      // Add title at the top of the first page
      pdf.setFontSize(14);
      pdf.text(`${documentType} - ${documentId}`, 10, position);
      position += 10; // Move down for the image

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - position);
      
      // Add more pages if needed for large layouts
      while (heightLeft >= 0) {
        position = 0;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position - (pageHeight - 10), imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating };
};
