
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { SolicitacaoFooterProps } from './SolicitacaoTypes';

const SolicitacaoFooter: React.FC<SolicitacaoFooterProps> = ({
  currentStep,
  isLoading,
  onPrevStep,
  onNextStep,
  onSubmit,
  onClose,
  onPrev,
  onNext
}) => {
  const handlePrev = onPrevStep || onPrev || (() => {});
  const handleNext = onNextStep || onNext || (() => {});
  const handleClose = onClose || (() => {});

  if (currentStep === 1) {
    return (
      <DialogFooter>
        <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancelar</Button>
        <Button 
          className="bg-cross-blue hover:bg-cross-blueDark"
          onClick={handleNext}
        >
          Continuar
        </Button>
      </DialogFooter>
    );
  } else {
    return (
      <DialogFooter>
        <Button variant="outline" onClick={handlePrev} disabled={isLoading}>Voltar</Button>
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
