
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

  const generatePDF = async (options?: { isDANFE?: boolean }) => {
    if (!layoutRef.current) return null;

    setIsGenerating(true);
    try {
      // Wait for any pending renders to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(layoutRef.current, {
        scale: 1.5, // Lower scale to avoid memory issues
        useCORS: true,
        logging: false,
        allowTaint: true, 
        backgroundColor: '#ffffff',
      });
      
      // Get image data with specific format and quality
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Set PDF orientation and size based on layout
      const isLandscape = canvas.width > canvas.height;
      const pdf = new jsPDF(isLandscape ? 'l' : 'p', 'mm', 'a4');
      
      // A4 size dimensions
      const pageWidth = isLandscape ? 297 : 210;
      const pageHeight = isLandscape ? 210 : 297;
      
      // Calculate dimensions to fit the page with margins
      const margin = 10;
      const availableWidth = pageWidth - (2 * margin);
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = margin;
      let pageNum = 1;

      // Add title at the top of the first page
      if (!options?.isDANFE) {
        pdf.setFontSize(14);
        pdf.text(`${documentType} - ${documentId}`, margin, position);
        position += 10; // Move down for the image
      }

      // Add first page with fixed positioning
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      
      // Calculate remaining height for additional pages
      heightLeft -= (pageHeight - position - margin);
      
      // Add more pages if needed for large layouts
      while (heightLeft > 0) { // Changed from >= to > to avoid potential infinite loop
        pdf.addPage();
        // Use a fixed offset calculation to avoid the scaling issue
        const offsetY = (pageHeight - 2 * margin) * pageNum;
        pdf.addImage(imgData, 'JPEG', margin, position - offsetY, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 2 * margin);
        pageNum++;
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
