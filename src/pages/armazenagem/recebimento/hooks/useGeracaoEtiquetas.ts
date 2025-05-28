
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Volume } from '../components/etiquetas/VolumesTable';
import { useVolumeActions } from './etiquetas/useVolumeActions';
import { useEtiquetasPrinting } from './etiquetas/useEtiquetasPrinting';
import { useDialogState } from './etiquetas/useDialogState';
import { LayoutStyle } from '@/hooks/etiquetas/types';
import { useEtiquetasDatabase } from '@/hooks/useEtiquetasDatabase';

// Import refactored hooks
import { useVolumeState } from './etiquetas/useVolumeState';
import { useEtiquetaMaeState } from './etiquetas/useEtiquetaMaeState';
import { usePrintOperations } from './etiquetas/usePrintOperations';
import { useVolumeClassification } from './etiquetas/useVolumeClassification';
import { useVolumeGeneration } from './etiquetas/useVolumeGeneration';

export const useGeracaoEtiquetas = () => {
  const location = useLocation();
  const notaFiscalData = location.state || {};
  const { marcarComoEtiquetada } = useEtiquetasDatabase();
  
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
      layoutStyle: 'enhanced' as LayoutStyle,
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

  const handlePrintEtiquetasImpl = async (volume: Volume) => {
    // Garantir que pegamos o valor atual do formulário
    const currentFormValues = form.getValues();
    const formatoImpressao = currentFormValues.formatoImpressao;
    const layoutStyle = currentFormValues.layoutStyle as LayoutStyle;
    
    console.log('Printing with layout style:', layoutStyle); // Para debug
    
    const result = handlePrintEtiquetas(printEtiquetas)(volume, volumes, notaFiscalData, formatoImpressao, layoutStyle);
    
    if (result && typeof result.then === 'function') {
      result.then(async (res) => {
        if (res && res.status === 'success' && res.volumes) {
          setVolumes(prevVolumes => 
            prevVolumes.map(vol => {
              const updatedVol = res.volumes!.find(v => v.id === vol.id);
              return updatedVol || vol;
            })
          );
          
          // Marcar como etiquetada no banco de dados se o volume tem um ID válido
          try {
            // Buscar etiqueta correspondente no banco
            const etiquetaCorrespondente = await fetch('/api/etiquetas').then(r => r.json())
              .then(etiquetas => etiquetas.find((e: any) => e.codigo === volume.id));
              
            if (etiquetaCorrespondente) {
              await marcarComoEtiquetada(etiquetaCorrespondente.id);
            }
          } catch (error) {
            console.error('Erro ao atualizar status da etiqueta no banco:', error);
          }
          
          toast({
            title: "Etiquetas Geradas",
            description: `Etiquetas para NF ${volume.notaFiscal} geradas com sucesso com layout ${layoutStyle}.`,
          });
        }
      });
    }
  };

  const handleReimprimirEtiquetasImpl = async (volume: Volume) => {
    // Garantir que pegamos o valor atual do formulário
    const currentFormValues = form.getValues();
    const formatoImpressao = currentFormValues.formatoImpressao;
    const layoutStyle = currentFormValues.layoutStyle as LayoutStyle;
    
    console.log('Reprinting with layout style:', layoutStyle); // Para debug
    
    // Marcar como etiquetada no banco de dados
    try {
      // Buscar etiqueta correspondente no banco
      const etiquetaCorrespondente = await fetch('/api/etiquetas').then(r => r.json())
        .then(etiquetas => etiquetas.find((e: any) => e.codigo === volume.id));
        
      if (etiquetaCorrespondente) {
        await marcarComoEtiquetada(etiquetaCorrespondente.id);
      }
    } catch (error) {
      console.error('Erro ao atualizar status da etiqueta no banco:', error);
    }
    
    handleReimprimirEtiquetas(reimprimirEtiquetas)(volume, volumes, notaFiscalData, formatoImpressao, layoutStyle);
  };
  
  const handleCreateEtiquetaMaeImpl = () => {
    const etiquetaMae = handleCreateEtiquetaMae(createEtiquetaMae)(form.getValues());
    form.setValue('descricaoEtiquetaMae', '');
    return etiquetaMae;
  };

  const handlePrintEtiquetaMaeImpl = (etiquetaMae: any) => {
    // Garantir que pegamos o valor atual do formulário
    const currentFormValues = form.getValues();
    const formatoImpressao = currentFormValues.formatoImpressao;
    const layoutStyle = currentFormValues.layoutStyle as LayoutStyle;
    
    console.log('Printing master label with layout style:', layoutStyle); // Para debug
    
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
