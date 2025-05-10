
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "@/hooks/use-toast";
import PrintActionButtons from './print/PrintActionButtons';
import EmailSendForm from './print/EmailSendForm';
import DocumentInfo from './print/DocumentInfo';
import { usePDFGenerator } from './print/PDFGenerator';

interface DocumentPrintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentType: string;
  layoutRef: React.RefObject<HTMLDivElement>;
  filename?: string;
}

const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({
  open,
  onOpenChange,
  documentId,
  documentType,
  layoutRef,
  filename
}) => {
  const [email, setEmail] = useState('');
  const { generatePDF, isGenerating } = usePDFGenerator(layoutRef, documentId, documentType);

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
      const defaultFilename = `${documentType.toLowerCase().replace(/\s/g, '_')}_${documentId.replace(/\s/g, '_')}.pdf`;
      pdf.save(filename || defaultFilename);
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
    const simulateEmailSending = async () => {
      // Would be replaced by actual API call in production
      return new Promise<void>((resolve) => setTimeout(resolve, 1500));
    };
    
    try {
      await simulateEmailSending();
      toast({
        title: "E-mail enviado",
        description: `O documento foi enviado para ${email}`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o e-mail. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleFocusEmail = () => {
    document.getElementById('email-input')?.focus();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Opções de Impressão - {documentType}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <PrintActionButtons
            onPrint={handlePrint}
            onSave={handleSave}
            onFocusEmail={handleFocusEmail}
            isGenerating={isGenerating}
          />
          
          <DocumentInfo documentType={documentType} documentId={documentId} />
          
          <EmailSendForm
            email={email}
            setEmail={setEmail}
            onSendEmail={handleSendEmail}
            isGenerating={isGenerating}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPrintModal;
