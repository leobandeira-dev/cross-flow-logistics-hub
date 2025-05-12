
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Volume } from '@/pages/armazenagem/recebimento/components/etiquetas/VolumesTable';

export interface VolumeData {
  id: string;
  tipo?: string;  // Making this optional since Volume might not have it
  descricao: string;
  peso?: string;
  dimensoes?: string;
  notaFiscal: string;
  etiquetaMae?: string | null;
  endereco?: string | null;
  quantidade: number; // Required to match Volume
  etiquetado: boolean; // Required to match Volume
  [key: string]: any; // Allow additional properties to make it compatible with Volume
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
  const prepareVolumeData = (volumeData: Volume): Volume => {
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
