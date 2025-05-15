
import { toast } from '@/hooks/use-toast';
import { Volume } from '../../components/etiquetas/VolumesTable';

/**
 * Hook for generating volumes for etiqueta creation
 */
export const useGenerateVolumes = () => {
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

  return {
    generateVolumes
  };
};
