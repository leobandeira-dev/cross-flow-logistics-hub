
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { SolicitacaoDialogProps } from './SolicitacaoTypes';
import SolicitacaoProgress from './SolicitacaoProgress';
import NotasFiscaisStep from './NotasFiscaisStep';
import ConfirmationStep from './ConfirmationStep';
import SolicitacaoFooter from './SolicitacaoFooter';
import { useSolicitacaoForm } from './useSolicitacaoForm';

const NovaSolicitacaoDialog: React.FC<SolicitacaoDialogProps> = ({ 
  isOpen, 
  setIsOpen,
  activeTab,
  setActiveTab
}) => {
  const {
    isLoading,
    currentStep,
    formData,
    handleInputChange,
    nextStep,
    prevStep,
    handleSubmit,
    handleImportSuccess
  } = useSolicitacaoForm(setIsOpen);

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <NotasFiscaisStep
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            onImportSuccess={handleImportSuccess}
            onChangeRemetente={(dados) => handleInputChange('remetente', dados)}
            onChangeDestinatario={(dados) => handleInputChange('destinatario', dados)}
            onChangeDataColeta={(data) => handleInputChange('dataColeta', data)}
            onChangeNotasFiscais={(notasFiscais) => handleInputChange('notasFiscais', notasFiscais)}
          />
        );
      case 2:
        return (
          <ConfirmationStep
            formData={formData}
            onChangeObservacoes={(value) => handleInputChange('observacoes', value)}
          />
        );
      default:
        return null;
    }
  };

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
        
        <SolicitacaoProgress currentStep={currentStep} totalSteps={2} />
        
        <div className="grid gap-6 py-4">
          {renderStep()}
        </div>
        
        <SolicitacaoFooter
          currentStep={currentStep}
          isLoading={isLoading}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NovaSolicitacaoDialog;
