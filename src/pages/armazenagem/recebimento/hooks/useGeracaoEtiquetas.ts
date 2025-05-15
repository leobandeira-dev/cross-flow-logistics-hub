
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Volume } from '../components/etiquetas/VolumesTable';
import { useVolumeActions } from './etiquetas/useVolumeActions';
import { useEtiquetasPrinting } from './etiquetas/useEtiquetasPrinting';
import { useDialogState } from './etiquetas/useDialogState';
import { LayoutStyle } from '@/hooks/etiquetas/types';

// Import refactored hooks
import { useVolumeState } from './etiquetas/useVolumeState';
import { useEtiquetaMaeState } from './etiquetas/useEtiquetaMaeState';
import { usePrintOperations } from './etiquetas/usePrintOperations';
import { useVolumeClassification } from './etiquetas/useVolumeClassification';
import { useVolumeGeneration } from './etiquetas/useVolumeGeneration';

export const useGeracaoEtiquetas = () => {
  const location = useLocation();
  const notaFiscalData = location.state || {};
  
  // Use refactored hooks
  const { volumes, generatedVolumes, setVolumes, setGeneratedVolumes } = useVolumeState();
  const { tipoEtiqueta, etiquetasMae, setTipoEtiqueta, setEtiquetasMae, handleCreateEtiquetaMae, handleVincularVolumes } = useEtiquetaMaeState();
  const { handlePrintEtiquetas, handleReimprimirEtiquetas, handlePrintEtiquetaMae } = usePrintOperations();
  const { handleSaveVolumeClassification } = useVolumeClassification();
  const { handleGenerateVolumes: generateVolumesHandler } = useVolumeGeneration();
  
  // Original hooks
  const { 
    generateVolumes, 
    classifyVolume,
    vincularVolumes
  } = useVolumeActions();
  
  const {
    isGenerating,
    printEtiquetas,
    reimprimirEtiquetas,
    printEtiquetaMae,
    createEtiquetaMae
  } = useEtiquetasPrinting();
  
  const {
    classifyDialogOpen,
    selectedVolume,
    setClassifyDialogOpen,
    openClassifyDialog
  } = useDialogState();
  
  const form = useForm({
    defaultValues: {
      notaFiscal: '',
      tipoEtiqueta: 'volume',
      volumesTotal: '',
      formatoImpressao: '50x100',
      layoutStyle: 'standard' as LayoutStyle,
      tipoVolume: 'geral',
      codigoONU: '',
      codigoRisco: '',
      etiquetaMaeId: '',
      tipoEtiquetaMae: 'geral',
      descricaoEtiquetaMae: '',
      pesoTotalBruto: ''
    }
  });

  // Connect the refactored hooks to the original functions
  const handleGenerateVolumes = () => {
    return generateVolumesHandler(generateVolumes, setVolumes, setGeneratedVolumes)(form.getValues(), notaFiscalData);
  };

  const handlePrintEtiquetasImpl = (volume: Volume) => {
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') as LayoutStyle;
    
    const result = handlePrintEtiquetas(printEtiquetas)(volume, volumes, notaFiscalData, formatoImpressao, layoutStyle);
    
    if (result && typeof result.then === 'function') {
      result.then((res) => {
        if (res && res.status === 'success' && res.volumes) {
          setVolumes(prevVolumes => 
            prevVolumes.map(vol => {
              const updatedVol = res.volumes!.find(v => v.id === vol.id);
              return updatedVol || vol;
            })
          );
          
          toast({
            title: "Etiquetas Geradas",
            description: `Etiquetas para NF ${volume.notaFiscal} geradas com sucesso.`,
          });
        }
      });
    }
  };

  const handleReimprimirEtiquetasImpl = (volume: Volume) => {
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') as LayoutStyle;
    
    handleReimprimirEtiquetas(reimprimirEtiquetas)(volume, volumes, notaFiscalData, formatoImpressao, layoutStyle);
  };
  
  const handleCreateEtiquetaMaeImpl = () => {
    const etiquetaMae = handleCreateEtiquetaMae(createEtiquetaMae)(form.getValues());
    form.setValue('descricaoEtiquetaMae', '');
    return etiquetaMae;
  };

  const handlePrintEtiquetaMaeImpl = (etiquetaMae: any) => {
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') as LayoutStyle;
    
    handlePrintEtiquetaMae(printEtiquetaMae)(etiquetaMae, volumes, formatoImpressao, layoutStyle);
  };

  const handleClassifyVolume = (volume: Volume) => {
    openClassifyDialog(volume);
  };

  const handleSaveVolumeClassificationImpl = (volume: Volume, formData: any) => {
    handleSaveVolumeClassification(classifyVolume, setVolumes, setGeneratedVolumes)(volume, formData);
  };

  const handleVincularVolumesImpl = (etiquetaMaeId: string, volumeIds: string[]) => {
    setVolumes(handleVincularVolumes(vincularVolumes)(etiquetaMaeId, volumeIds, volumes));
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
    handlePrintEtiquetas: handlePrintEtiquetasImpl,
    handleReimprimirEtiquetas: handleReimprimirEtiquetasImpl,
    handlePrintEtiquetaMae: handlePrintEtiquetaMaeImpl,
    handleCreateEtiquetaMae: handleCreateEtiquetaMaeImpl,
    handleClassifyVolume,
    handleSaveVolumeClassification: handleSaveVolumeClassificationImpl,
    handleVincularVolumes: handleVincularVolumesImpl
  };
};
