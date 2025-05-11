
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
      
      const canvas = await html2canvas(layoutRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // A4 size: 210 x 297 mm
      const imgWidth = 190;
      const pageHeight = 297;  
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      // Add title at the top of the first page
      pdf.setFontSize(14);
      pdf.text(`Layout de Carregamento - OC: ${orderNumber}`, 10, position);
      position += 10; // Move down for the image

      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - position);
      
      // Add more pages if needed for large layouts
      while (heightLeft >= 0) {
        position = 10; // Reset position for new page
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 10, position - (pageHeight - 20), imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
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
