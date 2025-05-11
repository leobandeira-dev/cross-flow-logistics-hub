
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
      
      // Convert the layout to canvas with optimal settings
      const canvas = await html2canvas(layoutRef.current, {
        scale: 1, // Reduce scale to prevent memory issues
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      // Get image data
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      
      // Calculate page orientation based on canvas dimensions
      const isLandscape = canvas.width > canvas.height;
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // A4 dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit the page with margins
      const margin = 10;
      const availableWidth = pdfWidth - (2 * margin);
      const availableHeight = pdfHeight - (2 * margin);
      
      // Calculate image aspect ratio
      const imageRatio = canvas.height / canvas.width;
      
      // Calculate dimensions that maintain the aspect ratio
      const imgWidth = availableWidth;
      const imgHeight = imgWidth * imageRatio;
      
      // Add title if not a DANFE document
      let yPosition = margin;
      if (!options?.isDANFE) {
        pdf.setFontSize(14);
        pdf.text(`${documentType} - ${documentId}`, margin, yPosition);
        yPosition += 10;
      }
      
      // If the image fits on one page
      if (imgHeight <= availableHeight) {
        pdf.addImage(imgData, 'JPEG', margin, yPosition, imgWidth, imgHeight);
      } else {
        // For multi-page, we'll slice the image
        let remainingHeight = canvas.height;
        let sourceY = 0;
        let pageIndex = 0;
        
        while (remainingHeight > 0) {
          // Calculate how much of the image we can fit on this page
          const pageCanvasHeight = pageIndex === 0 
            ? (availableHeight - (yPosition - margin)) / imgHeight * canvas.height 
            : availableHeight / imgHeight * canvas.height;
          
          // Create a temporary canvas for this slice
          const tmpCanvas = document.createElement('canvas');
          tmpCanvas.width = canvas.width;
          tmpCanvas.height = Math.min(pageCanvasHeight, remainingHeight);
          
          // Draw the slice to the temporary canvas
          const ctx = tmpCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(
              canvas, 
              0, sourceY, canvas.width, tmpCanvas.height,
              0, 0, tmpCanvas.width, tmpCanvas.height
            );
            
            // Convert the slice to image data
            const sliceData = tmpCanvas.toDataURL('image/jpeg', 0.9);
            
            // Calculate the height of this slice in PDF
            const sliceHeight = (tmpCanvas.height / canvas.width) * imgWidth;
            
            // Add the slice to the PDF
            pdf.addImage(sliceData, 'JPEG', margin, yPosition, imgWidth, sliceHeight);
            
            // Update for next slice
            sourceY += tmpCanvas.height;
            remainingHeight -= tmpCanvas.height;
            
            if (remainingHeight > 0) {
              pdf.addPage();
              yPosition = margin;
              pageIndex++;
            }
          }
        }
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
