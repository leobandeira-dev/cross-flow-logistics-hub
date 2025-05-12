
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume, ensureCompleteNotaFiscal } from '../utils/volumeCalculations';
import NotasFiscaisManager from './NotasFiscaisManager';
import { NovaSolicitacaoDialogProps } from './solicitacao/SolicitacaoTypes';
import SolicitacaoForm from './solicitacao/SolicitacaoForm';
import { useImportForm } from './importacao/useImportForm';

const NovaSolicitacaoDialog: React.FC<NovaSolicitacaoDialogProps> = ({ 
  isOpen, 
  setIsOpen,
  activeTab,
  setActiveTab
}) => {
  const { 
    isLoading, 
    formData, 
    handleInputChange,
    handleSubmit,
    handleSingleXmlUpload,
    handleBatchXmlUpload,
    handleExcelUpload,
    handleDownloadTemplate
  } = useImportForm(setIsOpen);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cross-blue hover:bg-cross-blueDark">
          <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Coleta</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar uma nova solicitação de coleta.
          </DialogDescription>
        </DialogHeader>
        
        <SolicitacaoForm
          formData={formData}
          handleInputChange={handleInputChange}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoading={isLoading}
          handleSingleXmlUpload={handleSingleXmlUpload}
          handleBatchXmlUpload={handleBatchXmlUpload}
          handleExcelUpload={handleExcelUpload}
          handleDownloadTemplate={handleDownloadTemplate}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>Cancelar</Button>
          <Button 
            className="bg-cross-blue hover:bg-cross-blueDark"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
              </>
            ) : (
              'Solicitar Coleta'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaSolicitacaoDialog;
