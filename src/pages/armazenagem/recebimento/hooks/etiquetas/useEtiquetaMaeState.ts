
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for managing etiqueta mãe state
 */
export const useEtiquetaMaeState = () => {
  const [etiquetasMae, setEtiquetasMae] = useState<any[]>([]);
  const [tipoEtiqueta, setTipoEtiqueta] = useState<'volume' | 'mae'>('volume');

  // Function to handle creating master etiqueta (without printing)
  const handleCreateEtiquetaMae = (createEtiquetaMaeFn: any) => (formData: any) => {
    const descricao = formData.descricaoEtiquetaMae || 'Etiqueta Mãe';
    const tipoEtiquetaMae = formData.tipoEtiquetaMae as 'geral' | 'palete';
    
    // Create the etiqueta mãe and add it to the list
    const newEtiquetaMae = createEtiquetaMaeFn(descricao, tipoEtiquetaMae);
    
    // Add to the etiquetas mãe list
    setEtiquetasMae(prev => [...prev, newEtiquetaMae]);
    
    // Reset the form fields
    return newEtiquetaMae;
  };

  // Function to handle linking volumes to master label
  const handleVincularVolumes = (vincularVolumesFn: any) => (etiquetaMaeId: string, volumeIds: string[], volumesArray: Volume[]) => {
    // Update volumes with the etiqueta mae link
    const updatedVolumes = vincularVolumesFn(etiquetaMaeId, volumeIds, volumesArray);
    
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

    return updatedVolumes;
  };

  return {
    tipoEtiqueta,
    etiquetasMae,
    setTipoEtiqueta,
    setEtiquetasMae,
    handleCreateEtiquetaMae,
    handleVincularVolumes
  };
};
