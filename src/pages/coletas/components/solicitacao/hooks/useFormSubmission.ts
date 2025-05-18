
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { InternalFormData } from './solicitacaoFormTypes';
import { calcularTotaisColeta } from '../../../utils/volumes/calculations';

export const useFormSubmission = (
  setFormData: React.Dispatch<React.SetStateAction<InternalFormData>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setIsOpen: (open: boolean) => void
) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Get form data to submit
      setFormData(prev => {
        // Calculate totals
        const totais = calcularTotaisColeta(prev.notasFiscais);
        
        // Add calculated values and date/timestamp
        const now = new Date();
        const dataInclusao = now.toISOString().split('T')[0];
        const horaInclusao = now.toTimeString().slice(0, 5);
        
        return {
          ...prev,
          quantidadeVolumes: totais.qtdVolumes,
          dataInclusao,
          horaInclusao,
        };
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de coleta foi enviada com sucesso."
      });
      
      // Reset the form and close dialog
      setCurrentStep(1);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
};
