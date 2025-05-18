
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SolicitacaoFooterProps } from './SolicitacaoTypes';

const SolicitacaoFooter: React.FC<SolicitacaoFooterProps> = ({
  currentStep,
  onNext,
  onPrev,
  onSubmit,
  isLoading
}) => {
  return (
    <div className="flex justify-between border-t pt-4 mt-4">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 1 || isLoading}
      >
        Voltar
      </Button>

      <div className="flex gap-2">
        {currentStep < 2 ? (
          <Button 
            onClick={onNext}
            disabled={isLoading}
          >
            Avançar
          </Button>
        ) : (
          <Button 
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              'Finalizar'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SolicitacaoFooter;
