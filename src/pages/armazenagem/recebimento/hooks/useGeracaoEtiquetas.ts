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
  const { marcarComoEtiquetada, buscarEtiquetasPorCodigo } = useEtiquetasDatabase();
  
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

  // Function to mark volumes as labeled in the database
  const markVolumesAsLabeled = async (volumes: Volume[]) => {
    const successfullyMarked: string[] = [];
    const failedToMark: string[] = [];

    for (const volume of volumes) {
      try {
        console.log(`🏷️ Marcando volume ${volume.id} como etiquetado...`);
        
        // Buscar etiqueta no banco pelo código
        const etiquetasEncontradas = await buscarEtiquetasPorCodigo(volume.id);
        
        if (etiquetasEncontradas && etiquetasEncontradas.length > 0) {
          const etiqueta = etiquetasEncontradas[0];
          await marcarComoEtiquetada(etiqueta.id);
          successfullyMarked.push(volume.id);
          console.log(`✅ Volume ${volume.id} marcado como etiquetado`);
        } else {
          console.warn(`⚠️ Etiqueta não encontrada no banco para volume: ${volume.id}`);
          failedToMark.push(volume.id);
        }
      } catch (error) {
        console.error(`❌ Erro ao marcar volume ${volume.id} como etiquetado:`, error);
        failedToMark.push(volume.id);
      }
    }

    // Log results
    if (successfullyMarked.length > 0) {
      console.log(`✅ ${successfullyMarked.length} volume(s) marcado(s) como etiquetado(s)`);
    }
    
    if (failedToMark.length > 0) {
      console.warn(`⚠️ ${failedToMark.length} volume(s) não puderam ser marcados:`, failedToMark);
    }

    return { successfullyMarked, failedToMark };
  };

  const handlePrintEtiquetasImpl = async (volume: Volume) => {
    // Garantir que pegamos o valor atual do formulário
    const currentFormValues = form.getValues();
    const formatoImpressao = currentFormValues.formatoImpressao;
    const layoutStyle = currentFormValues.layoutStyle as LayoutStyle;
    
    console.log('Printing with layout style:', layoutStyle);
    
    const result = handlePrintEtiquetas(printEtiquetas)(volume, volumes, notaFiscalData, formatoImpressao, layoutStyle);
    
    if (result && typeof result.then === 'function') {
      result.then(async (res) => {
        if (res && res.status === 'success' && res.volumes) {
          // Atualizar estado local
          setVolumes(prevVolumes => 
            prevVolumes.map(vol => {
              const updatedVol = res.volumes!.find(v => v.id === vol.id);
              return updatedVol || vol;
            })
          );
          
          // Marcar volumes como etiquetados no banco de dados
          const volumesNota = volumes.filter(vol => vol.notaFiscal === volume.notaFiscal);
          const { successfullyMarked, failedToMark } = await markVolumesAsLabeled(volumesNota);
          
          // Mostrar toast apropriado
          if (successfullyMarked.length > 0 && failedToMark.length === 0) {
            toast({
              title: "✅ Etiquetas Impressas e Marcadas",
              description: `${successfullyMarked.length} etiqueta(s) para NF ${volume.notaFiscal} foram impressas e marcadas como etiquetadas.`,
            });
          } else if (successfullyMarked.length > 0 && failedToMark.length > 0) {
            toast({
              title: "⚠️ Etiquetas Impressas com Problemas",
              description: `${successfullyMarked.length} etiquetas impressas com sucesso, ${failedToMark.length} não puderam ser marcadas no banco.`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "⚠️ Etiquetas Impressas",
              description: `Etiquetas para NF ${volume.notaFiscal} foram impressas, mas houve problemas ao marcar no banco de dados.`,
              variant: "destructive",
            });
          }
        }
      });
    }
  };

  const handleReimprimirEtiquetasImpl = async (volume: Volume) => {
    // Garantir que pegamos o valor atual do formulário
    const currentFormValues = form.getValues();
    const formatoImpressao = currentFormValues.formatoImpressao;
    const layoutStyle = currentFormValues.layoutStyle as LayoutStyle;
    
    console.log('Reprinting with layout style:', layoutStyle);
    
    // Para reimpressão, também marcar como etiquetado
    const volumesNota = volumes.filter(vol => vol.notaFiscal === volume.notaFiscal);
    const { successfullyMarked, failedToMark } = await markVolumesAsLabeled(volumesNota);
    
    // Executar impressão
    handleReimprimirEtiquetas(reimprimirEtiquetas)(volume, volumes, notaFiscalData, formatoImpressao, layoutStyle);
    
    // Toast para reimpressão
    if (successfullyMarked.length > 0 && failedToMark.length === 0) {
      toast({
        title: "✅ Etiquetas Reimpressas e Marcadas",
        description: `${successfullyMarked.length} etiqueta(s) para NF ${volume.notaFiscal} foram reimpressas e marcadas como etiquetadas.`,
      });
    } else if (successfullyMarked.length > 0 && failedToMark.length > 0) {
      toast({
        title: "⚠️ Etiquetas Reimpressas com Problemas",
        description: `${successfullyMarked.length} etiquetas reimpressas, ${failedToMark.length} não puderam ser marcadas no banco.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "⚠️ Etiquetas Reimpressas",
        description: `Etiquetas para NF ${volume.notaFiscal} foram reimpressas, mas houve problemas ao marcar no banco.`,
        variant: "destructive",
      });
    }
  };
  
  const handleCreateEtiquetaMaeImpl = () => {
    const etiquetaMae = handleCreateEtiquetaMae(createEtiquetaMae)(form.getValues());
    form.setValue('descricaoEtiquetaMae', '');
    return etiquetaMae;
  };

  const handlePrintEtiquetaMaeImpl = async (etiquetaMae: any) => {
    // Garantir que pegamos o valor atual do formulário
    const currentFormValues = form.getValues();
    const formatoImpressao = currentFormValues.formatoImpressao;
    const layoutStyle = currentFormValues.layoutStyle as LayoutStyle;
    
    console.log('Printing master label with layout style:', layoutStyle);
    
    // Para etiqueta mãe, tentar marcar como etiquetada também
    try {
      const etiquetasEncontradas = await buscarEtiquetasPorCodigo(etiquetaMae.id);
      
      if (etiquetasEncontradas && etiquetasEncontradas.length > 0) {
        const etiqueta = etiquetasEncontradas[0];
        await marcarComoEtiquetada(etiqueta.id);
        console.log(`✅ Etiqueta mãe ${etiquetaMae.id} marcada como etiquetada`);
      }
    } catch (error) {
      console.error(`❌ Erro ao marcar etiqueta mãe ${etiquetaMae.id} como etiquetada:`, error);
    }
    
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
