
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { InternalFormData } from './solicitacaoFormTypes';
import { EmpresaInfo } from '../SolicitacaoTypes';

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
      
      // Reset form with empty values
      const emptyEmpresa: EmpresaInfo = {
        razaoSocial: '',
        cnpj: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
        telefone: '',
        email: ''
      };
      
      setFormData({
        remetente: emptyEmpresa,
        destinatario: emptyEmpresa,
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
