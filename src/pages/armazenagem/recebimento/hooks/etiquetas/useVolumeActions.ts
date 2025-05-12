
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Volume } from '../../components/etiquetas/VolumesTable';
import { EtiquetaGenerationResult } from '@/hooks/etiquetas/types';

/**
 * Hook for handling volume-related actions
 */
export const useVolumeActions = () => {
  const [generatedVolumes, setGeneratedVolumes] = useState<Volume[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);

  // Function to generate volumes based on form data
  const generateVolumes = (
    notaFiscal: string,
    volumesTotal: number,
    pesoTotalBruto: string,
    notaFiscalData: any,
    tipoVolume: 'geral' | 'quimico',
    codigoONU: string,
    codigoRisco: string
  ): Volume[] => {
    if (!notaFiscal) {
      toast({
        title: "Erro",
        description: "Informe o número da nota fiscal.",
        variant: "destructive"
      });
      return [];
    }
    
    if (!volumesTotal || isNaN(volumesTotal) || volumesTotal <= 0) {
      toast({
        title: "Erro",
        description: "Informe uma quantidade válida de volumes.",
        variant: "destructive"
      });
      return [];
    }
    
    // Generate new volumes based on the quantity, using data from nota fiscal if available
    const newVolumes: Volume[] = [];
    for (let i = 1; i <= volumesTotal; i++) {
      const newVolume: Volume = {
        id: `VOL-${notaFiscal}-${i.toString().padStart(3, '0')}`,
        notaFiscal,
        descricao: `Volume ${i} de ${volumesTotal}`,
        quantidade: 1,
        etiquetado: false,
        tipoVolume,
        codigoONU: codigoONU || '',
        codigoRisco: codigoRisco || '',
        // Use data from the nota fiscal if available
        remetente: notaFiscalData?.remetente || "A definir",
        destinatario: notaFiscalData?.destinatario || "A definir",
        endereco: notaFiscalData?.endereco || "A definir",
        cidade: notaFiscalData?.cidade || "A definir",
        cidadeCompleta: notaFiscalData?.cidadeCompleta || "A definir",
        uf: notaFiscalData?.uf || "UF",
        pesoTotal: pesoTotalBruto,
        chaveNF: notaFiscalData?.chaveNF || ''
      };
      newVolumes.push(newVolume);
    }
    
    return newVolumes;
  };

  // Function to handle classifying a volume
  const classifyVolume = (volume: Volume, formData: any, volumes: Volume[]): Volume[] => {
    return volumes.map(vol => 
      vol.id === volume.id 
        ? { 
            ...vol, 
            tipoVolume: formData.tipoVolume,
            codigoONU: formData.codigoONU,
            codigoRisco: formData.codigoRisco
          } 
        : vol
    );
  };

  // Function to handle linking volumes to master label
  const vincularVolumes = (etiquetaMaeId: string, volumeIds: string[], volumes: Volume[]): Volume[] => {
    return volumes.map(vol => 
      volumeIds.includes(vol.id)
        ? { ...vol, etiquetaMae: etiquetaMaeId }
        : vol
    );
  };

  return {
    generatedVolumes,
    volumes,
    setGeneratedVolumes,
    setVolumes,
    generateVolumes,
    classifyVolume,
    vincularVolumes,
  };
};
