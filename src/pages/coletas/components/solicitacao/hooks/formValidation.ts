
import { toast } from '@/hooks/use-toast';
import { InternalFormData } from './solicitacaoFormTypes';

export const validateStep = (step: number, formData: InternalFormData): boolean => {
  if (step === 1) {
    if (formData.notasFiscais.length === 0) {
      toast({
        title: "Nenhuma nota fiscal",
        description: "Adicione pelo menos uma nota fiscal para continuar.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.remetente.cnpj && !formData.remetente.cpf) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o CNPJ ou CPF do remetente.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.destinatario.cnpj && !formData.destinatario.cpf) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o CNPJ ou CPF do destinatário.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  }
  
  return true;
};
