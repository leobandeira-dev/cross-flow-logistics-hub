
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';
import { buscarNotaFiscalPorChave } from '@/services/notaFiscal/fetchNotaFiscalService';

export const useVolumeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateVolumes = (generateVolumes: any, setVolumes: any, setGeneratedVolumes: any) => {
    return async (formValues: any, notaFiscalData: any) => {
      setIsGenerating(true);
      try {
        console.log('Gerando volumes com dados:', formValues, notaFiscalData);

        // First, ensure nota fiscal exists in database
        let notaFiscalId = notaFiscalData?.id;
        
        if (!notaFiscalId && formValues.notaFiscal) {
          try {
            // Try to find existing nota fiscal
            const existingNota = await buscarNotaFiscalPorChave(formValues.notaFiscal);
            
            if (existingNota) {
              notaFiscalId = existingNota.id;
              console.log('Nota fiscal encontrada:', existingNota);
            } else {
              // Create new nota fiscal
              const newNota = await criarNotaFiscal({
                numero: formValues.notaFiscal,
                chave_acesso: formValues.notaFiscal,
                valor_total: 0, // Changed from 'valor' to 'valor_total'
                data_emissao: new Date().toISOString().split('T')[0],
                status: 'entrada'
              });
              notaFiscalId = newNota.id;
              console.log('Nova nota fiscal criada:', newNota);
            }
          } catch (error) {
            console.error('Erro ao processar nota fiscal:', error);
            toast({
              title: "Aviso",
              description: "Continuando sem vincular à nota fiscal no banco",
              variant: "destructive",
            });
          }
        }

        // Generate volumes
        const volumes = generateVolumes(formValues, notaFiscalData);
        
        // Add nota fiscal ID to volumes for database linking
        const volumesWithNotaId = volumes.map((vol: any) => ({
          ...vol,
          nota_fiscal_id: notaFiscalId
        }));

        setVolumes(volumesWithNotaId);
        setGeneratedVolumes(volumesWithNotaId);

        toast({
          title: "Volumes Gerados",
          description: `${volumes.length} volumes gerados com sucesso.`,
        });

        console.log('Volumes gerados:', volumesWithNotaId);
        return volumesWithNotaId;
      } catch (error: any) {
        console.error('Erro ao gerar volumes:', error);
        toast({
          title: "Erro",
          description: error.message || "Erro ao gerar volumes",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsGenerating(false);
      }
    };
  };

  return {
    isGenerating,
    handleGenerateVolumes
  };
};
