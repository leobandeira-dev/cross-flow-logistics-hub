
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { EMPTY_EMPRESA } from '../EmpresaInfoForm';
import { InternalFormData } from './solicitacaoFormTypes';

export const useFormSubmission = (
  setFormData: React.Dispatch<React.SetStateAction<InternalFormData>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setIsOpen: (open: boolean) => void
) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    
    // Submit form
    setTimeout(() => {
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de coleta foi registrada com sucesso."
      });
      setIsLoading(false);
      setFormData({
        remetente: EMPTY_EMPRESA,
        destinatario: EMPTY_EMPRESA,
        dataColeta: '',
        observacoes: '',
        notasFiscais: [],
        cliente: '',
        origem: '',
        destino: ''
      });
      setCurrentStep(1);
      setIsOpen(false);
    }, 1500);
  };

  return {
    isLoading,
    handleSubmit
  };
};
