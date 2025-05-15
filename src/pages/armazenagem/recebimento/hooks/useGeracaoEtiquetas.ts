
import { useFormState } from './etiquetas/useFormState';
import { useEtiquetasState } from './etiquetas/useEtiquetasState';
import { useGenerateVolumes } from './etiquetas/useGenerateVolumes';
import { useDialogState } from './etiquetas/useDialogState';
import { useHandleActions } from './etiquetas/useHandleActions';
import { useEtiquetasPrinting } from './etiquetas/useEtiquetasPrinting';
import { LayoutStyle } from '@/hooks/etiquetas/types';

/**
 * Main hook for etiquetas generation functionality
 * Composes multiple smaller hooks to provide a unified API
 */
export const useGeracaoEtiquetas = () => {
  // Get form and related state
  const { form, notaFiscalData, tipoEtiqueta, setTipoEtiqueta } = useFormState();
  
  // Get etiquetas states
  const {
    volumes,
    generatedVolumes,
    etiquetasMae,
    setVolumes,
    setGeneratedVolumes,
    setEtiquetasMae
  } = useEtiquetasState();
  
  // Get volume generation functionality
  const { generateVolumes } = useGenerateVolumes();
  
  // Get dialog state functionality
  const {
    classifyDialogOpen,
    selectedVolume,
    setClassifyDialogOpen,
    openClassifyDialog
  } = useDialogState();
  
  // Get printing state
  const { isGenerating } = useEtiquetasPrinting();
  
  // Get handlers
  const {
    handleGenerateVolumes: handleGenerateVolumesAction,
    handlePrintEtiquetas: handlePrintEtiquetasAction,
    handleReimprimirEtiquetas: handleReimprimirEtiquetasAction,
    handleCreateEtiquetaMae: handleCreateEtiquetaMaeAction,
    handlePrintEtiquetaMae: handlePrintEtiquetaMaeAction,
    handleSaveVolumeClassification,
    handleVincularVolumes
  } = useHandleActions(
    volumes,
    setVolumes,
    setGeneratedVolumes,
    setEtiquetasMae,
    notaFiscalData,
    generateVolumes
  );

  // Wrapper function for handleGenerateVolumes
  const handleGenerateVolumes = () => {
    const notaFiscal = form.getValues('notaFiscal');
    const volumesTotal = parseInt(form.getValues('volumesTotal'), 10);
    const pesoTotalBruto = form.getValues('pesoTotalBruto') || notaFiscalData?.pesoTotal || '0,00 Kg';
    const tipoVolume = form.getValues('tipoVolume') as 'geral' | 'quimico';
    const codigoONU = form.getValues('codigoONU') || '';
    const codigoRisco = form.getValues('codigoRisco') || '';
    
    handleGenerateVolumesAction(
      notaFiscal,
      volumesTotal,
      pesoTotalBruto,
      tipoVolume,
      codigoONU,
      codigoRisco
    );
  };

  // Wrapper function for handlePrintEtiquetas
  const handlePrintEtiquetas = (volume: any) => {
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') as LayoutStyle || 'standard';
    
    handlePrintEtiquetasAction(volume, formatoImpressao, layoutStyle);
  };

  // Wrapper function for handleReimprimirEtiquetas
  const handleReimprimirEtiquetas = (volume: any) => {
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') as LayoutStyle || 'standard';
    
    handleReimprimirEtiquetasAction(volume, formatoImpressao, layoutStyle);
  };

  // Wrapper function for handleCreateEtiquetaMae
  const handleCreateEtiquetaMae = () => {
    const descricao = form.getValues('descricaoEtiquetaMae') || 'Etiqueta Mãe';
    const tipoEtiquetaMae = form.getValues('tipoEtiquetaMae') as 'geral' | 'palete';
    
    handleCreateEtiquetaMaeAction(descricao, tipoEtiquetaMae);
    
    // Reset the form fields
    form.setValue('descricaoEtiquetaMae', '');
  };

  // Wrapper function for handlePrintEtiquetaMae
  const handlePrintEtiquetaMae = (etiquetaMae: any) => {
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') as LayoutStyle || 'standard';
    
    handlePrintEtiquetaMaeAction(etiquetaMae, formatoImpressao, layoutStyle);
  };

  // Function to handle classifying volume
  const handleClassifyVolume = (volume: any) => {
    openClassifyDialog(volume);
  };

  return {
    form,
    notaFiscalData,
    tipoEtiqueta,
    generatedVolumes,
    volumes,
    etiquetasMae,
    classifyDialogOpen,
    selectedVolume,
    isGenerating,
    setTipoEtiqueta,
    setVolumes,
    setGeneratedVolumes,
    setEtiquetasMae,
    setClassifyDialogOpen,
    handleGenerateVolumes,
    handlePrintEtiquetas,
    handleReimprimirEtiquetas,
    handlePrintEtiquetaMae,
    handleCreateEtiquetaMae,
    handleClassifyVolume,
    handleSaveVolumeClassification,
    handleVincularVolumes
  };
};
