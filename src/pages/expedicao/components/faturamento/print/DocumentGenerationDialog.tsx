
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NotaFiscal } from '../../../Faturamento';
import { CabecalhoValores, TotaisCalculados } from '../../../hooks/faturamento/types';
import DocumentInfoForm, { DocumentInfoValues } from './DocumentInfoForm';
import { generateDocumentNumber } from '../../../hooks/faturamento/utils/documentUtils';
import { toast } from '@/hooks/use-toast';
import { useHistoricoFaturas, Fatura } from '../../../hooks/faturamento/useHistoricoFaturas';
import DocumentPDFGenerator from '@/components/common/DocumentPDFGenerator';
import FaturaDocumentLayout from './FaturaDocumentLayout';

interface DocumentGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notas: NotaFiscal[];
  cabecalhoValores: CabecalhoValores;
  totaisCalculados: TotaisCalculados;
}

const DocumentGenerationDialog: React.FC<DocumentGenerationDialogProps> = ({ 
  open, 
  onOpenChange,
  notas,
  cabecalhoValores,
  totaisCalculados
}) => {
  const [documentData, setDocumentData] = useState<DocumentInfoValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentGenerated, setDocumentGenerated] = useState(false);
  const { addFatura } = useHistoricoFaturas();
  
  // Create initial values with a generated document number
  const initialValues = {
    numeroDocumento: generateDocumentNumber(),
    tipoDocumento: 'Outbound',
    previsaoSaida: new Date(),
    previsaoSaida_hora: '08:00',
    previsaoChegada: new Date(Date.now() + 24 * 60 * 60 * 1000),
    previsaoChegada_hora: '17:00'
  };
  
  const handleFormSubmit = async (data: DocumentInfoValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, we would save this data to a database
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      // Combine dates with times
      const combineDateTime = (date: Date, timeStr: string): Date => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
      };
      
      // Set document data
      const fullData = {
        ...data,
        previsaoSaida: combineDateTime(data.previsaoSaida, data.previsaoSaida_hora),
        previsaoChegada: combineDateTime(data.previsaoChegada, data.previsaoChegada_hora)
      };
      
      setDocumentData(fullData);
      setDocumentGenerated(true);
      
      // Save to history
      const faturaId = `fatura-${Date.now()}`;
      const pesoTotal = notas.reduce((sum, nota) => sum + Number(nota.pesoNota) || 0, 0);
      
      const newFatura: Fatura = {
        id: faturaId,
        data: new Date(),
        cabecalho: {
          numeroDocumento: fullData.numeroDocumento,
          tipoDocumento: fullData.tipoDocumento,
          previsaoSaida: fullData.previsaoSaida,
          previsaoChegada: fullData.previsaoChegada,
          motoristaNome: fullData.motoristaNome,
          veiculoCavalo: fullData.veiculoCavalo,
          veiculoCarreta1: fullData.veiculoCarreta1,
          veiculoCarreta2: fullData.veiculoCarreta2,
          tipoCarroceria: fullData.tipoCarroceria,
          usuarioEmissor: fullData.usuarioEmissor,
          usuarioConferente: fullData.usuarioConferente,
          transportadora: fullData.transportadora,
        },
        notas: [...notas],
        totais: {
          pesoTotal,
          freteTotal: totaisCalculados.fretePesoViagem,
          expressoTotal: totaisCalculados.expressoViagem,
          icmsTotal: totaisCalculados.icmsViagem,
          totalViagem: totaisCalculados.totalViagem
        }
      };
      
      addFatura(newFatura);
      
      toast({
        title: "Documento gerado com sucesso",
        description: `Documento ${fullData.numeroDocumento} salvo no histórico.`,
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Erro ao gerar documento",
        description: "Ocorreu um erro ao gerar o documento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderFaturaDocument = () => {
    if (!documentData) return <div>Documento não encontrado</div>;
    
    const cabecalho = {
      numeroDocumento: documentData.numeroDocumento,
      tipoDocumento: documentData.tipoDocumento,
      previsaoSaida: documentData.previsaoSaida,
      previsaoChegada: documentData.previsaoChegada,
      motoristaNome: documentData.motoristaNome,
      veiculoCavalo: documentData.veiculoCavalo,
      veiculoCarreta1: documentData.veiculoCarreta1,
      veiculoCarreta2: documentData.veiculoCarreta2,
      tipoCarroceria: documentData.tipoCarroceria,
      usuarioEmissor: documentData.usuarioEmissor,
      usuarioConferente: documentData.usuarioConferente,
      transportadora: documentData.transportadora,
    };
    
    const totais = {
      pesoTotal: notas.reduce((sum, nota) => sum + Number(nota.pesoNota) || 0, 0),
      freteTotal: totaisCalculados.fretePesoViagem,
      expressoTotal: totaisCalculados.expressoViagem,
      icmsTotal: totaisCalculados.icmsViagem,
      totalViagem: totaisCalculados.totalViagem
    };
    
    return (
      <FaturaDocumentLayout
        documentId={documentData.numeroDocumento}
        notas={notas}
        totais={totais}
        cabecalho={cabecalho}
      />
    );
  };
  
  const handleReset = () => {
    setDocumentData(null);
    setDocumentGenerated(false);
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset form state after dialog is closed
    setTimeout(handleReset, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Gerar Documento de Faturamento</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {!documentGenerated ? (
            <DocumentInfoForm 
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Documento {documentData?.numeroDocumento} gerado com sucesso
                </h3>
                
                <DocumentPDFGenerator
                  documentId={documentData?.numeroDocumento || ""}
                  documentType="Fatura"
                  renderDocument={renderFaturaDocument}
                  buttonText="Imprimir documento"
                />
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md border text-sm">
                <p>O documento foi gerado e salvo no histórico. Você pode acessá-lo a qualquer momento na aba histórico.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentGenerationDialog;
