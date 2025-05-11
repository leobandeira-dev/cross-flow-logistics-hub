
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface SolicitacaoFooterProps {
  currentStep: number;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

const SolicitacaoFooter: React.FC<SolicitacaoFooterProps> = ({
  currentStep,
  isLoading,
  onPrevStep,
  onNextStep,
  onSubmit,
  onClose,
}) => {
  if (currentStep === 1) {
    return (
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
        <Button 
          className="bg-cross-blue hover:bg-cross-blueDark"
          onClick={onNextStep}
        >
          Continuar
        </Button>
      </DialogFooter>
    );
  } else {
    return (
      <DialogFooter>
        <Button variant="outline" onClick={onPrevStep} disabled={isLoading}>Voltar</Button>
        <Button 
          className="bg-cross-blue hover:bg-cross-blueDark"
          onClick={onSubmit}
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
    );
  }
};

export default SolicitacaoFooter;
