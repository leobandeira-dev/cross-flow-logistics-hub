
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PrintLayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  layoutRef: React.RefObject<HTMLDivElement>;
}

const PrintLayoutModal: React.FC<PrintLayoutModalProps> = ({
  open,
  onOpenChange,
  orderNumber,
  layoutRef
}) => {
  const [email, setEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!layoutRef.current) return;

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
      
      // Create PDF with proper orientation
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
      
      // Add title
      let yPosition = margin;
      pdf.setFontSize(14);
      pdf.text(`Layout de Carregamento - OC: ${orderNumber}`, margin, yPosition);
      yPosition += 10;
      
      // If the image fits on one page
      if (imgHeight <= availableHeight - (yPosition - margin)) {
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

  const handlePrint = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      pdf.output('dataurlnewwindow');
      toast({
        title: "PDF gerado",
        description: "O PDF foi aberto em uma nova janela para impressão.",
      });
    }
  };

  const handleSave = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      pdf.save(`layout_carregamento_${orderNumber.replace(/\s/g, '_')}.pdf`);
      toast({
        title: "PDF salvo",
        description: "O PDF foi salvo com sucesso.",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um endereço de e-mail válido.",
        variant: "destructive"
      });
      return;
    }

    // Simular envio de email - em uma implementação real, você enviaria o PDF para um backend
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "E-mail enviado",
        description: `O layout foi enviado para ${email}`,
      });
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Opções de Impressão</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={handlePrint}
              disabled={isGenerating}
              className="flex-col py-6 h-auto"
            >
              <Printer className="h-8 w-8 mb-2" />
              <span>Imprimir</span>
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={isGenerating}
              variant="outline"
              className="flex-col py-6 h-auto"
            >
              <Save className="h-8 w-8 mb-2" />
              <span>Salvar PDF</span>
            </Button>
            
            <Button 
              variant="secondary"
              className="flex-col py-6 h-auto"
              onClick={() => {
                document.getElementById('email-input')?.focus();
              }}
            >
              <Mail className="h-8 w-8 mb-2" />
              <span>Enviar por E-mail</span>
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-input">Enviar para e-mail:</Label>
            <div className="flex gap-2">
              <Input 
                id="email-input"
                type="email" 
                placeholder="exemplo@empresa.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                onClick={handleSendEmail}
                disabled={isGenerating || !email.trim()}
              >
                <Mail className="mr-2 h-4 w-4" />
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintLayoutModal;
