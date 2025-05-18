
import { InternalFormData } from './solicitacaoFormTypes';
import { toast } from '@/hooks/use-toast';

// Validate each step of the form
export const validateStep = (step: number, formData: InternalFormData): boolean => {
  switch (step) {
    case 1:
      // Validating step 1: Notas Fiscais e Dados de Remetente/Destinatário
      if (formData.notasFiscais.length === 0) {
        toast({
          title: "Formulário incompleto",
          description: "Adicione pelo menos uma nota fiscal.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!formData.cliente) {
        toast({
          title: "Formulário incompleto",
          description: "O campo Cliente é obrigatório.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!formData.origem || !formData.destino) {
        toast({
          title: "Formulário incompleto",
          description: "Os campos Origem e Destino são obrigatórios.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!formData.dataColeta) {
        toast({
          title: "Formulário incompleto",
          description: "A Data de Coleta é obrigatória.",
          variant: "destructive"
        });
        return false;
      }
      
      // Check if volumes have been properly filled
      for (const nf of formData.notasFiscais) {
        if (!nf.volumes || nf.volumes.length === 0) {
          toast({
            title: "Formulário incompleto",
            description: `A nota fiscal ${nf.numeroNF} não possui volumes cadastrados.`,
            variant: "destructive"
          });
          return false;
        }
      }
      
      return true;
    
    case 2:
      // Validating step 2 is not really needed as it's just observations
      return true;
    
    default:
      return true;
  }
};
