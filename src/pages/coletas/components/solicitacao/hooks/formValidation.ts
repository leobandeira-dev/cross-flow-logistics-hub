
import { InternalFormData } from './solicitacaoFormTypes';
import { toast } from '@/hooks/use-toast';

export const validateStep = (step: number, formData: InternalFormData): boolean => {
  if (step === 1) {
    // Validate first step (basic info and notas fiscais)
    if (!formData.cliente) {
      toast({ title: "Erro", description: "Selecione um cliente para continuar.", variant: "destructive" });
      return false;
    }
    
    if (!formData.dataColeta) {
      toast({ title: "Erro", description: "Selecione uma data de coleta para continuar.", variant: "destructive" });
      return false;
    }
    
    if (formData.notasFiscais.length === 0) {
      toast({ title: "Erro", description: "Adicione pelo menos uma nota fiscal para continuar.", variant: "destructive" });
      return false;
    }
    
    if (!formData.remetente.razaoSocial) {
      toast({ title: "Erro", description: "Preencha os dados do remetente para continuar.", variant: "destructive" });
      return false;
    }
    
    if (!formData.remetente.cnpj) {
      toast({ title: "Erro", description: "Preencha o CNPJ do remetente para continuar.", variant: "destructive" });
      return false;
    }
    
    if (!formData.destinatario.razaoSocial) {
      toast({ title: "Erro", description: "Preencha os dados do destinatário para continuar.", variant: "destructive" });
      return false;
    }
    
    if (!formData.destinatario.cnpj) {
      toast({ title: "Erro", description: "Preencha o CNPJ do destinatário para continuar.", variant: "destructive" });
      return false;
    }
    
    return true;
  }
  
  return true;
};
