
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrintActionButtons from './print/PrintActionButtons';
import EmailSendForm from './print/EmailSendForm';
import DocumentInfo from './print/DocumentInfo';
import { usePDFGenerator } from './print/usePDFGenerator';
import { generateDANFEFromXML, createPDFDataUrl, base64ToBlob } from '@/pages/armazenagem/recebimento/utils/danfeAPI';

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
  const [sending, setSending] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('default');
  const [generatingDanfe, setGeneratingDanfe] = useState(false);
  const [danfePdfBase64, setDanfePdfBase64] = useState<string | null>(null);
  
  // Determine which ref to use based on selected layout
  const activeRef = React.useMemo(() => {
    if (selectedLayout === 'danfe' || selectedLayout === 'simplified') {
      return selectedLayout === 'danfe' ? danfeRef : simplifiedDanfeRef;
    }
    return layoutRef;
  }, [selectedLayout, layoutRef, danfeRef, simplifiedDanfeRef]);
  
  const { generatePDF, isGenerating } = usePDFGenerator(
    activeRef,
    documentId, 
    documentType
  );

  // Clear PDF data when modal is closed
  useEffect(() => {
    if (!open) {
      setDanfePdfBase64(null);
    }
  }, [open]);

  const getXmlString = (): string | null => {
    // This function would extract the XML string from xmlData
    // For mock data, we'll return a placeholder
    if (!xmlData) {
      return null;
    }
    
    // In a real scenario, this would extract the XML from xmlData
    // For example, if xmlData has an 'xmlContent' property:
    return xmlData.xmlContent || null;
  };

  const handlePrint = async () => {
    if (selectedLayout === 'danfe' || selectedLayout === 'simplified') {
      await handleDANFEPrint();
    } else {
      await handleStandardPrint();
    }
  };

  const handleStandardPrint = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      pdf.output('dataurlnewwindow');
      toast({
        title: "PDF gerado",
        description: `O PDF foi aberto em uma nova janela para impressão no formato ${getLayoutName()}.`,
      });
    }
  };

  const handleDANFEPrint = async () => {
    setGeneratingDanfe(true);
    
    try {
      // Get the XML content
      const xmlContent = getXmlString();
      
      if (!xmlContent) {
        toast({
          title: "Erro",
          description: "XML da nota fiscal não encontrado.",
          variant: "destructive"
        });
        return;
      }
      
      // Generate DANFE from XML if not already generated
      let pdfBase64 = danfePdfBase64;
      if (!pdfBase64) {
        pdfBase64 = await generateDANFEFromXML(xmlContent);
        setDanfePdfBase64(pdfBase64);
      }
      
      if (pdfBase64) {
        // Open PDF in new window
        const dataUrl = createPDFDataUrl(pdfBase64);
        window.open(dataUrl, '_blank');
        
        toast({
          title: "DANFE gerado",
          description: `O DANFE foi aberto em uma nova janela para impressão no formato ${getLayoutName()}.`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar o DANFE a partir do XML.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao gerar DANFE:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o DANFE. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setGeneratingDanfe(false);
    }
  };

  const handleSave = async () => {
    if (selectedLayout === 'danfe' || selectedLayout === 'simplified') {
      await handleDANFESave();
    } else {
      await handleStandardSave();
    }
  };

  const handleStandardSave = async () => {
    const pdf = await generatePDF();
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

  const handleDANFESave = async () => {
    setGeneratingDanfe(true);
    
    try {
      // Get the XML content
      const xmlContent = getXmlString();
      
      if (!xmlContent) {
        toast({
          title: "Erro",
          description: "XML da nota fiscal não encontrado.",
          variant: "destructive"
        });
        return;
      }
      
      // Generate DANFE from XML if not already generated
      let pdfBase64 = danfePdfBase64;
      if (!pdfBase64) {
        pdfBase64 = await generateDANFEFromXML(xmlContent);
        setDanfePdfBase64(pdfBase64);
      }
      
      if (pdfBase64) {
        // Create a blob and download it
        const blob = base64ToBlob(pdfBase64);
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename || `danfe_${documentId.replace(/\s/g, '_')}.pdf`;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "DANFE salvo",
          description: `O DANFE foi salvo com sucesso no formato ${getLayoutName()}.`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar o DANFE a partir do XML.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao salvar DANFE:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o DANFE. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setGeneratingDanfe(false);
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

    setSending(true);
    
    try {
      // For DANFE, we need to generate it first if not already generated
      if ((selectedLayout === 'danfe' || selectedLayout === 'simplified') && !danfePdfBase64) {
        const xmlContent = getXmlString();
        
        if (xmlContent) {
          const pdfBase64 = await generateDANFEFromXML(xmlContent);
          setDanfePdfBase64(pdfBase64);
        }
      }
      
      // Simulate email sending - in a real implementation, you would send the PDF to a backend
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "E-mail enviado",
        description: `O documento foi enviado para ${email} no formato ${getLayoutName()}.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o e-mail. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleFocusEmail = () => {
    document.getElementById('email-input')?.focus();
  };

  const showDanfeOptions = documentType === "Nota Fiscal" && (danfeRef || simplifiedDanfeRef);
  const isProcessing = isGenerating || generatingDanfe || sending;

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
            isGenerating={isProcessing}
          />
          
          <DocumentInfo documentType={documentType} documentId={documentId} />
          
          <EmailSendForm
            email={email}
            setEmail={setEmail}
            onSendEmail={handleSendEmail}
            isGenerating={isProcessing}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPrintModal;
