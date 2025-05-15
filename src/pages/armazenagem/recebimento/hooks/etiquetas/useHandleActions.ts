import { toast } from '@/hooks/use-toast';
import { Volume } from '../../components/etiquetas/VolumesTable';
import { useEtiquetasPrinting } from './useEtiquetasPrinting';
import { LayoutStyle } from '@/hooks/etiquetas/types';

/**
 * Hook for handling various etiqueta actions
 */
export const useHandleActions = (
  volumes: Volume[],
  setVolumes: React.Dispatch<React.SetStateAction<Volume[]>>,
  setGeneratedVolumes: React.Dispatch<React.SetStateAction<Volume[]>>,
  setEtiquetasMae: React.Dispatch<React.SetStateAction<any[]>>,
  notaFiscalData: any,
  generateVolumesFn: (
    notaFiscal: string,
    volumesTotal: number,
    pesoTotalBruto: string,
    notaFiscalData: any,
    tipoVolume: 'geral' | 'quimico',
    codigoONU: string,
    codigoRisco: string
  ) => Volume[]
) => {
  const {
    printEtiquetas,
    reimprimirEtiquetas,
    printEtiquetaMae,
    createEtiquetaMae
  } = useEtiquetasPrinting();

  // Function to handle volume generation
  const handleGenerateVolumes = (
    notaFiscal: string,
    volumesTotal: number,
    pesoTotalBruto: string,
    tipoVolume: 'geral' | 'quimico',
    codigoONU: string,
    codigoRisco: string
  ) => {
    const newVolumes = generateVolumesFn(
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
  const handlePrintEtiquetas = (
    volume: Volume, 
    formatoImpressao: string,
    layoutStyle: LayoutStyle
  ) => {
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
  const handleReimprimirEtiquetas = (
    volume: Volume,
    formatoImpressao: string,
    layoutStyle: LayoutStyle
  ) => {
    reimprimirEtiquetas(volume, volumes, notaFiscalData, formatoImpressao, layoutStyle);
  };
  
  // Function to handle creating master etiqueta (without printing)
  const handleCreateEtiquetaMae = (
    descricao: string,
    tipoEtiquetaMae: 'geral' | 'palete'
  ) => {
    // Create the etiqueta mãe and add it to the list
    const newEtiquetaMae = createEtiquetaMae(descricao, tipoEtiquetaMae);
    
    // Add to the etiquetas mãe list
    setEtiquetasMae(prev => [...prev, newEtiquetaMae]);
  };

  // Function to handle printing master etiqueta
  const handlePrintEtiquetaMae = (
    etiquetaMae: any,
    formatoImpressao: string,
    layoutStyle: LayoutStyle
  ) => {
    printEtiquetaMae(etiquetaMae, volumes, formatoImpressao, layoutStyle);
  };
  
  // Function to handle classifying volume
  const handleSaveVolumeClassification = (volume: Volume, formData: any) => {
    // Update volumes with classification data
    setVolumes(prevVolumes => 
      prevVolumes.map(vol => 
        vol.id === volume.id 
          ? { 
              ...vol, 
              tipoVolume: formData.tipoVolume,
              codigoONU: formData.codigoONU,
              codigoRisco: formData.codigoRisco
            } 
          : vol
      )
    );
    
    // Update generatedVolumes to keep UI consistent
    setGeneratedVolumes(prevVolumes => 
      prevVolumes.map(vol => 
        vol.id === volume.id 
          ? { 
              ...vol, 
              tipoVolume: formData.tipoVolume,
              codigoONU: formData.codigoONU,
              codigoRisco: formData.codigoRisco
            } 
          : vol
      )
    );
    
    toast({
      title: "Volume Classificado",
      description: `O volume ${volume.id} foi classificado como ${formData.tipoVolume === 'quimico' ? 'Produto Químico' : 'Carga Geral'}.`,
    });
  };

  // Function to handle linking volumes to master label
  const handleVincularVolumes = (etiquetaMaeId: string, volumeIds: string[]) => {
    // Update volumes with the etiqueta mae link
    setVolumes(prevVolumes => 
      prevVolumes.map(vol => 
        volumeIds.includes(vol.id) 
          ? { ...vol, etiquetaMae: etiquetaMaeId }
          : vol
      )
    );
    
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
    handleGenerateVolumes,
    handlePrintEtiquetas,
    handleReimprimirEtiquetas,
    handleCreateEtiquetaMae,
    handlePrintEtiquetaMae,
    handleSaveVolumeClassification,
    handleVincularVolumes
  };
};
