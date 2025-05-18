
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume } from '../../../utils/volumeCalculations';
import { VolumeItem } from '../../../utils/volumes/types';
import { InternalFormData } from './solicitacaoFormTypes';

// Utility function to ensure volumes have id property
const convertVolumesToVolumeItems = (volumes: any[]): VolumeItem[] => {
  return volumes.map((volume, index) => ({
    id: `vol-${Date.now()}-${index}`,
    tipo: volume.tipo || 'Caixa',
    quantidade: volume.quantidade || 1,
    altura: volume.altura || 0,
    largura: volume.largura || 0,
    comprimento: volume.comprimento || 0,
    peso: volume.peso || 0
  }));
};

export const useImportHandler = (
  setFormData: React.Dispatch<React.SetStateAction<InternalFormData>>
) => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImportSuccess = (notasFiscais: NotaFiscalVolume[] | any[], remetenteInfo?: any, destinatarioInfo?: any) => {
    setIsImporting(true);
    try {
      // Ensure all notasFiscais have the required properties and proper volume format
      const validatedNotasFiscais: NotaFiscalVolume[] = notasFiscais.map(nf => {
        return {
          numeroNF: nf.numeroNF,
          chaveNF: nf.chaveNF || '',
          dataEmissao: nf.dataEmissao || '',
          volumes: Array.isArray(nf.volumes) ? convertVolumesToVolumeItems(nf.volumes) : [],
          remetente: nf.remetente || '',
          destinatario: nf.destinatario || '',
          valorTotal: nf.valorTotal || 0,
          pesoTotal: nf.pesoTotal || 0
        };
      });
      
      toast({
        title: "Notas fiscais importadas",
        description: `${validatedNotasFiscais.length} notas fiscais importadas com sucesso.`
      });
      
      setFormData(prev => ({
        ...prev,
        notasFiscais: validatedNotasFiscais,
        remetenteInfo,
        destinatarioInfo
      }));
    } catch (error) {
      console.error("Erro ao processar notas fiscais importadas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar as notas fiscais importadas.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    handleImportSuccess
  };
};
