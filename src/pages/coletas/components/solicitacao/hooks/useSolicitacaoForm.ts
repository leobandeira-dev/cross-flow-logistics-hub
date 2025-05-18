
import { useState } from 'react';
import { EMPTY_EMPRESA } from '../EmpresaInfoForm';
import { validateStep } from './formValidation';
import { useImportHandler } from './useImportHandler';
import { useAddressUpdater } from './useAddressUpdater';
import { useFormSubmission } from './useFormSubmission';
import { InternalFormData, UseSolicitacaoFormReturn } from './solicitacaoFormTypes';

export const useSolicitacaoForm = (setIsOpen: (open: boolean) => void): UseSolicitacaoFormReturn => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InternalFormData>({
    remetente: EMPTY_EMPRESA,
    destinatario: EMPTY_EMPRESA,
    dataColeta: '',
    observacoes: '',
    notasFiscais: [],
    cliente: '',
    origem: '',
    destino: ''
  });

  // Use our custom hooks
  const { isLoading, handleSubmit } = useFormSubmission(setFormData, setCurrentStep, setIsOpen);
  const { isImporting, handleImportSuccess } = useImportHandler(setFormData);
  
  // Apply address updater effect
  useAddressUpdater(formData, setFormData);

  const handleInputChange = <K extends keyof InternalFormData>(field: K, value: InternalFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateStep(currentStep, formData)) {
      setCurrentStep(current => Math.min(current + 1, 2));
    }
  };

  const prevStep = () => {
    setCurrentStep(current => Math.max(current - 1, 1));
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
