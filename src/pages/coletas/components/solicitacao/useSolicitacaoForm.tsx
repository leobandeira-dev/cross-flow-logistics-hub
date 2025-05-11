
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';
import { SolicitacaoFormData } from './SolicitacaoTypes';
import { EMPTY_EMPRESA } from './EmpresaInfoForm';

export const useSolicitacaoForm = (setIsOpen: (open: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SolicitacaoFormData>({
    remetente: EMPTY_EMPRESA,
    destinatario: EMPTY_EMPRESA,
    dataColeta: '',
    observacoes: '',
    notasFiscais: []
  });

  // Effect to update remetente/destinatario when XML data changes
  useEffect(() => {
    if (formData.remetenteInfo) {
      const newRemetente = {
        cnpj: formData.remetenteInfo.cnpj || '',
        cpf: formData.remetenteInfo.cpf || '',
        razaoSocial: formData.remetenteInfo.nome || '',
        nomeFantasia: formData.remetenteInfo.nome || '',
        endereco: {
          logradouro: formData.remetenteInfo.endereco?.logradouro || '',
          numero: formData.remetenteInfo.endereco?.numero || '',
          complemento: formData.remetenteInfo.endereco?.complemento || '',
          bairro: formData.remetenteInfo.endereco?.bairro || '',
          cidade: formData.remetenteInfo.endereco?.cidade || '',
          uf: formData.remetenteInfo.endereco?.uf || '',
          cep: formData.remetenteInfo.endereco?.cep || '',
        },
        enderecoFormatado: formData.remetenteInfo.enderecoFormatado || ''
      };
      
      setFormData(prev => ({
        ...prev,
        remetente: newRemetente
      }));
    }
    
    if (formData.destinatarioInfo) {
      const newDestinatario = {
        cnpj: formData.destinatarioInfo.cnpj || '',
        cpf: formData.destinatarioInfo.cpf || '',
        razaoSocial: formData.destinatarioInfo.nome || '',
        nomeFantasia: formData.destinatarioInfo.nome || '',
        endereco: {
          logradouro: formData.destinatarioInfo.endereco?.logradouro || '',
          numero: formData.destinatarioInfo.endereco?.numero || '',
          complemento: formData.destinatarioInfo.endereco?.complemento || '',
          bairro: formData.destinatarioInfo.endereco?.bairro || '',
          cidade: formData.destinatarioInfo.endereco?.cidade || '',
          uf: formData.destinatarioInfo.endereco?.uf || '',
          cep: formData.destinatarioInfo.endereco?.cep || '',
        },
        enderecoFormatado: formData.destinatarioInfo.enderecoFormatado || ''
      };
      
      setFormData(prev => ({
        ...prev,
        destinatario: newDestinatario
      }));
    }
  }, [formData.remetenteInfo, formData.destinatarioInfo]);

  const handleInputChange = <K extends keyof SolicitacaoFormData>(field: K, value: SolicitacaoFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(current => Math.min(current + 1, 2));
    }
  };

  const prevStep = () => {
    setCurrentStep(current => Math.max(current - 1, 1));
  };

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
        notasFiscais: []
      });
      setCurrentStep(1);
      setIsOpen(false);
    }, 1500);
  };

  const handleImportSuccess = (notasFiscais: NotaFiscalVolume[], remetenteInfo?: any, destinatarioInfo?: any) => {
    setIsImporting(true);
    try {
      toast({
        title: "Notas fiscais importadas",
        description: `${notasFiscais.length} notas fiscais importadas com sucesso.`
      });
      
      setFormData(prev => ({
        ...prev,
        notasFiscais,
        remetenteInfo,
        destinatarioInfo
      }));
    } catch (error) {
      console.error("Erro ao processar notas fiscais importadas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar as notas fiscais importadas.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isLoading,
    isImporting,
    currentStep,
    formData,
    handleInputChange,
    nextStep,
    prevStep,
    handleSubmit,
    handleImportSuccess
  };
};
