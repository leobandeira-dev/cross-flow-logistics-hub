
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  danfeRef?: React.RefObject<HTMLDivElement>;
  simplifiedDanfeRef?: React.RefObject<HTMLDivElement>;
  filename?: string;
  xmlData?: any;
}

const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({
  open,
  onOpenChange,
  documentId,
  documentType,
  layoutRef,
  danfeRef,
  simplifiedDanfeRef,
  filename,
  xmlData
}) => {
  const [email, setEmail] = useState('');
  const [selectedLayout, setSelectedLayout] = useState('default');
  
  // Determine which ref to use based on selected layout
  const activeRef = React.useMemo(() => {
    switch (selectedLayout) {
      case 'danfe': return danfeRef;
      case 'simplified': return simplifiedDanfeRef;
      default: return layoutRef;
    }
  }, [selectedLayout, layoutRef, danfeRef, simplifiedDanfeRef]);
  
  const { generatePDF, isGenerating } = usePDFGenerator(
    activeRef,
    documentId, 
    documentType
  );

  const handlePrint = async () => {
    console.log("Iniciando impressão do layout:", selectedLayout);
    console.log("Referência ativa:", activeRef?.current);
    
    const pdf = await generatePDF({
      isDANFE: selectedLayout === 'danfe' || selectedLayout === 'simplified'
    });
    
    if (pdf) {
      pdf.output('dataurlnewwindow');
      toast({
        title: "PDF gerado",
        description: `O PDF foi aberto em uma nova janela para impressão no formato ${getLayoutName()}.`,
      });
    }
  };

  const handleSave = async () => {
    console.log("Iniciando salvamento do layout:", selectedLayout);
    
    const pdf = await generatePDF({
      isDANFE: selectedLayout === 'danfe' || selectedLayout === 'simplified'
    });
    
    if (pdf) {
      const layoutSuffix = selectedLayout !== 'default' ? `_${selectedLayout}` : '';
      const defaultFilename = `${documentType.toLowerCase().replace(/\s/g, '_')}_${documentId.replace(/\s/g, '_')}${layoutSuffix}.pdf`;
      pdf.save(filename || defaultFilename);
      toast({
        title: "PDF salvo",
        description: `O PDF foi salvo com sucesso no formato ${getLayoutName()}.`,
      });
    }
  };

  const getLayoutName = () => {
    switch(selectedLayout) {
      case 'danfe': return 'DANFE padrão';
      case 'simplified': return 'DANFE simplificado';
      default: return 'padrão';
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
        description: `O documento foi enviado para ${email} no formato ${getLayoutName()}.`,
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

  const showDanfeOptions = documentType === "Nota Fiscal" && (danfeRef || simplifiedDanfeRef);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Opções de Impressão - {documentType}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {showDanfeOptions && (
            <Tabs value={selectedLayout} onValueChange={setSelectedLayout} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="default">Layout Padrão</TabsTrigger>
                <TabsTrigger value="danfe">DANFE</TabsTrigger>
                <TabsTrigger value="simplified">DANFE Simplificado</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
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
