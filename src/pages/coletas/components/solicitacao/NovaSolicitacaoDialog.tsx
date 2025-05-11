
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSolicitacaoForm } from './useSolicitacaoForm';
import SolicitacaoProgress from './SolicitacaoProgress';
import SolicitacaoFormHeader from './SolicitacaoFormHeader';
import NotasFiscaisStep from './NotasFiscaisStep';
import ConfirmationStep from './ConfirmationStep';
import SolicitacaoFooter from './SolicitacaoFooter';
import { SolicitacaoDialogProps } from './SolicitacaoTypes';

const NovaSolicitacaoDialog: React.FC<SolicitacaoDialogProps> = ({
  open,
  setOpen,
  activeTab,
  setActiveTab
}) => {
  const {
    isLoading,
    isImporting,
    currentStep,
    formData,
    handleInputChange,
    nextStep,
    prevStep,
    handleSubmit,
    handleImportSuccess
  } = useSolicitacaoForm(setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Coleta</DialogTitle>
        </DialogHeader>
        
        <SolicitacaoProgress currentStep={currentStep} />
        
        <SolicitacaoFormHeader 
          currentStep={currentStep}
          isLoading={isLoading || isImporting}
          cliente={formData.cliente}
          dataColeta={formData.dataColeta}
          origem={formData.origem}
          destino={formData.destino}
          onClienteChange={(value) => handleInputChange('cliente', value)}
          onDataColetaChange={(value) => handleInputChange('dataColeta', value)}
          onOrigemChange={(value) => handleInputChange('origem', value)}
          onDestinoChange={(value) => handleInputChange('destino', value)}
          readOnlyAddresses={formData.remetenteInfo !== undefined || formData.destinatarioInfo !== undefined}
        />
        
        <div>
          {currentStep === 1 && (
            <NotasFiscaisStep 
              formData={formData}
              handleInputChange={handleInputChange}
              handleImportSuccess={handleImportSuccess}
              isImporting={isImporting}
            />
          )}
          
          {currentStep === 2 && (
            <ConfirmationStep 
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}
        </div>
        
        <SolicitacaoFooter 
          currentStep={currentStep}
          onPrev={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          isLoading={isLoading || isImporting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NovaSolicitacaoDialog;
