
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSolicitacaoForm } from './hooks/useSolicitacaoForm';
import SolicitacaoProgress from './SolicitacaoProgress';
import { SolicitacaoFormHeader } from './formHeader';
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
        
        <SolicitacaoProgress currentStep={currentStep} onNext={nextStep} onPrev={prevStep} />
        
        <SolicitacaoFormHeader 
          currentStep={currentStep}
          isLoading={isLoading || isImporting}
          tipoFrete={formData.tipoFrete}
          dataColeta={formData.dataColeta}
          horaColeta={formData.horaColeta || ''}
          dataAprovacao={formData.dataAprovacao || ''}
          horaAprovacao={formData.horaAprovacao || ''}
          dataInclusao={formData.dataInclusao || ''}
          horaInclusao={formData.horaInclusao || ''}
          origem={formData.origem}
          origemEndereco={formData.origemEndereco || ''}
          origemCEP={formData.origemCEP || ''}
          destino={formData.destino}
          destinoEndereco={formData.destinoEndereco || ''}
          destinoCEP={formData.destinoCEP || ''}
          remetente={formData.remetente ? {
            razaoSocial: formData.remetente.razaoSocial,
            cnpj: formData.remetente.cnpj
          } : undefined}
          destinatario={formData.destinatario ? {
            razaoSocial: formData.destinatario.razaoSocial,
            cnpj: formData.destinatario.cnpj
          } : undefined}
          onTipoFreteChange={(value) => handleInputChange('tipoFrete', value)}
          onDataColetaChange={(value) => handleInputChange('dataColeta', value)}
          onHoraColetaChange={(value) => handleInputChange('horaColeta', value || '')}
          onOrigemChange={(value) => handleInputChange('origem', value)}
          onDestinoChange={(value) => handleInputChange('destino', value)}
          readOnlyAddresses={formData.remetenteInfo !== undefined || formData.destinatarioInfo !== undefined}
        />
        
        <div>
          {currentStep === 1 && (
            <NotasFiscaisStep 
              formData={formData as any}
              handleInputChange={handleInputChange}
              handleImportSuccess={handleImportSuccess}
              isImporting={isImporting}
            />
          )}
          
          {currentStep === 2 && (
            <ConfirmationStep 
              formData={formData as any}
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
