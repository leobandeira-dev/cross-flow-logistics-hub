
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface VolumeData {
  id: string;
  tipo: string;
  descricao: string;
  peso?: string;
  dimensoes?: string;
  notaFiscal: string;
  etiquetaMae?: string | null;
  endereco?: string | null;
}

export const useVolumePreparation = () => {
  const { toast } = useToast();
  const [preparingVolume, setPreparingVolume] = useState(false);

  const prepareVolume = async (volumeData: VolumeData): Promise<VolumeData> => {
    setPreparingVolume(true);
    
    try {
      // Simulated API call or volume preparation logic
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set default endereco to "Area de Conferencia" for all volumes except etiqueta mae
      const isEtiquetaMae = volumeData.tipo === 'Etiqueta Mãe' || volumeData.tipo === 'Palete';
      const volumeWithDefaultLocation = {
        ...volumeData,
        endereco: isEtiquetaMae ? null : 'Area de Conferência'
      };
      
      toast({
        title: "Volume preparado",
        description: `Volume ${volumeData.id} preparado com sucesso${!isEtiquetaMae ? ' e endereçado para Área de Conferência' : ''}`,
      });
      
      return volumeWithDefaultLocation;
    } catch (error) {
      toast({
        title: "Erro ao preparar volume",
        description: "Ocorreu um erro ao preparar o volume. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setPreparingVolume(false);
    }
  };

  // Function to prepare volume data without toast notifications or UI updates
  const prepareVolumeData = (volumeData: VolumeData): VolumeData => {
    // Set default endereco to "Area de Conferencia" for all volumes except etiqueta mae
    const isEtiquetaMae = volumeData.tipo === 'Etiqueta Mãe' || volumeData.tipo === 'Palete';
    return {
      ...volumeData,
      endereco: isEtiquetaMae ? null : 'Area de Conferência'
    };
  };

  return {
    prepareVolume,
    prepareVolumeData,
    preparingVolume
  };
};
