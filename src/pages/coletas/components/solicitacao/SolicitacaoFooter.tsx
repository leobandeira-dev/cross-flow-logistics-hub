
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { SolicitacaoFooterProps } from './SolicitacaoTypes';

const SolicitacaoFooter: React.FC<SolicitacaoFooterProps> = ({
  currentStep,
  onPrev,
  onNext,
  onSubmit,
  isLoading = false
}) => {
  return (
    <div className="flex justify-between pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 1 || isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
      </Button>
      <div className="flex space-x-2">
        {currentStep < 2 ? (
          <Button
            type="button"
            onClick={onNext}
            disabled={isLoading}
            className="bg-cross-blue hover:bg-cross-blueDark"
          >
            Próximo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-cross-blue hover:bg-cross-blueDark"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
              </>
            ) : (
              'Solicitar Coleta'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SolicitacaoFooter;
