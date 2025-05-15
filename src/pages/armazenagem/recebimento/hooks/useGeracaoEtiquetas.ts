
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Volume } from '../components/etiquetas/VolumesTable';
import { useVolumeActions } from './etiquetas/useVolumeActions';
import { useEtiquetasPrinting } from './etiquetas/useEtiquetasPrinting';
import { useDialogState } from './etiquetas/useDialogState';
import { LayoutStyle } from '@/hooks/etiquetas/types';

export const useGeracaoEtiquetas = () => {
  const location = useLocation();
  const notaFiscalData = location.state || {};
  const [tipoEtiqueta, setTipoEtiqueta] = useState<'volume' | 'mae'>('volume');
  const [etiquetasMae, setEtiquetasMae] = useState<any[]>([]);
  
  const { 
    volumes, 
    generatedVolumes, 
    setVolumes, 
    setGeneratedVolumes, 
    generateVolumes, 
    classifyVolume,
    vincularVolumes
  } = useVolumeActions();
  
  const {
    isGenerating,
    printEtiquetas,
    reimprimirEtiquetas,
    printEtiquetaMae,
    createEtiquetaMae,
    createAndPrintEtiquetaMae
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

  // Function to handle volume generation
  const handleGenerateVolumes = () => {
    const notaFiscal = form.getValues('notaFiscal');
    const volumesTotal = parseInt(form.getValues('volumesTotal'), 10);
    const pesoTotalBruto = form.getValues('pesoTotalBruto') || notaFiscalData?.pesoTotal || '0,00 Kg';
    const tipoVolume = form.getValues('tipoVolume') as 'geral' | 'quimico';
    const codigoONU = form.getValues('codigoONU') || '';
    const codigoRisco = form.getValues('codigoRisco') || '';
    
    const newVolumes = generateVolumes(
      notaFiscal, 
      volumesTotal, 
      pesoTotalBruto, 
      notaFiscalData, 
      tipoVolume, 
      codigoONU, 
      codigoRisco
    );
    
    if (newVolumes.length > 0) {
      // Add to existing volumes
      setVolumes(prevVolumes => {
        // Remove any existing volumes for this nota fiscal
        const filteredVolumes = prevVolumes.filter(vol => vol.notaFiscal !== notaFiscal);
        // Add the new volumes
        return [...filteredVolumes, ...newVolumes];
      });
      
      setGeneratedVolumes(newVolumes);
      
      toast({
        title: "Volumes gerados",
        description: `${volumesTotal} volumes gerados para a nota fiscal ${notaFiscal}.`,
      });
    }
  };

  // Function to handle printing etiquetas
  const handlePrintEtiquetas = (volume: Volume) => {
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') as LayoutStyle;
    
    // Generate etiquetas for the selected volume
    const result = printEtiquetas(volume, volumes, notaFiscalData, formatoImpressao, layoutStyle);
    
    // Update volumes state if labels were successfully generated
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

  // Function to handle reprinting etiquetas
  const handleReimprimirEtiquetas = (volume: Volume) => {
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') as LayoutStyle;
    
    reimprimirEtiquetas(volume, volumes, notaFiscalData, formatoImpressao, layoutStyle);
  };
  
  // Function to handle creating master etiqueta (without printing)
  const handleCreateEtiquetaMae = () => {
    const descricao = form.getValues('descricaoEtiquetaMae') || 'Etiqueta Mãe';
    const tipoEtiquetaMae = form.getValues('tipoEtiquetaMae') as 'geral' | 'palete';
    
    // Create the etiqueta mãe and add it to the list
    const newEtiquetaMae = createEtiquetaMae(descricao, tipoEtiquetaMae);
    
    // Add to the etiquetas mãe list
    setEtiquetasMae(prev => [...prev, newEtiquetaMae]);
    
    // Reset the form fields
    form.setValue('descricaoEtiquetaMae', '');
  };

  // Function to handle printing master etiqueta
  const handlePrintEtiquetaMae = (etiquetaMae: any) => {
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') as LayoutStyle;
    
    printEtiquetaMae(etiquetaMae, volumes, formatoImpressao, layoutStyle);
  };

  // Function to handle classifying volume
  const handleClassifyVolume = (volume: Volume) => {
    openClassifyDialog(volume);
  };

  // Function to save volume classification
  const handleSaveVolumeClassification = (volume: Volume, formData: any) => {
    // Update both states: volumes and generatedVolumes to ensure UI is consistent
    setVolumes(prevVolumes => classifyVolume(volume, formData, prevVolumes));
    setGeneratedVolumes(prevVolumes => classifyVolume(volume, formData, prevVolumes));
    
    toast({
      title: "Volume Classificado",
      description: `O volume ${volume.id} foi classificado como ${formData.tipoVolume === 'quimico' ? 'Produto Químico' : 'Carga Geral'}.`,
    });
  };

  // Function to handle linking volumes to master label
  const handleVincularVolumes = (etiquetaMaeId: string, volumeIds: string[]) => {
    // Update volumes with the etiqueta mae link
    setVolumes(prevVolumes => vincularVolumes(etiquetaMaeId, volumeIds, prevVolumes));
    
    toast({
      title: "Volumes Vinculados",
      description: `${volumeIds.length} volumes foram vinculados à etiqueta mãe ${etiquetaMaeId}.`,
    });
    
    // Update the etiquetas mãe list to reflect the number of volumes
    setEtiquetasMae(prev => prev.map(em => 
      em.id === etiquetaMaeId 
        ? { ...em, quantidadeVolumes: volumeIds.length }
        : em
    ));
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
