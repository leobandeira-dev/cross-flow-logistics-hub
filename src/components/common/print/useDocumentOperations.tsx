
import React from 'react';
import { toast } from "@/hooks/use-toast";
import { usePDFGenerator } from './usePDFGenerator';
import useDANFEGenerator from './DANFEGenerator';

interface DocumentOperationsProps {
  layoutRef: React.RefObject<HTMLDivElement>;
  danfeRef?: React.RefObject<HTMLDivElement>;
  simplifiedDanfeRef?: React.RefObject<HTMLDivElement>;
  documentId: string;
  documentType: string;
  selectedLayout: string;
  xmlData?: any;
  danfePdfBase64: string | null;
  setDanfePdfBase64: (base64: string | null) => void;
  filename?: string;
}

/**
 * Hook for document operations (print, save, email)
 */
const useDocumentOperations = ({
  layoutRef,
  danfeRef,
  simplifiedDanfeRef,
  documentId,
  documentType,
  selectedLayout,
  xmlData,
  danfePdfBase64,
  setDanfePdfBase64,
  filename
}: DocumentOperationsProps) => {
  const [sending, setSending] = React.useState(false);
  
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
  
  const danfeGenerator = useDANFEGenerator({
    xmlData,
    danfePdfBase64,
    setDanfePdfBase64,
    documentId,
    layoutType: selectedLayout as 'danfe' | 'simplified'
  });

  const getLayoutName = () => {
    switch(selectedLayout) {
      case 'danfe': return 'DANFE padrão';
      case 'simplified': return 'DANFE simplificado';
      default: return 'padrão';
    }
  };

  const handlePrint = async () => {
    if (selectedLayout === 'danfe' || selectedLayout === 'simplified') {
      await danfeGenerator.handlePrint();
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

  const handleSave = async () => {
    if (selectedLayout === 'danfe' || selectedLayout === 'simplified') {
      await danfeGenerator.handleSave();
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

  const handleSendEmail = async (email: string) => {
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
        await danfeGenerator.generateDANFE();
      }
      
      // Simulate email sending - in a real implementation, you would send the PDF to a backend
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "E-mail enviado",
        description: `O documento foi enviado para ${email} no formato ${getLayoutName()}.`,
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o e-mail. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    handlePrint,
    handleSave,
    handleSendEmail,
    sending,
    isProcessing: isGenerating || danfeGenerator.isGenerating || sending
  };
};

export default useDocumentOperations;
