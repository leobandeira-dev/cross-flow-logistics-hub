
import { useState, useCallback } from 'react';
import { NotaFiscal } from '@/types/supabase.types';
import { buscarNotaFiscalPorChave } from '@/services/notaFiscal/fetchNotaFiscalService';
import { useToast } from '@/hooks/use-toast';

export interface RastreamentoInfo {
  notaFiscal: NotaFiscal;
  historico: {
    evento: string;
    data: string;
    status: string;
    observacoes?: string;
  }[];
}

/**
 * Hook para rastreamento integrado de notas fiscais
 */
export const useRastreamentoIntegration = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rastreamentoInfo, setRastreamentoInfo] = useState<RastreamentoInfo | null>(null);

  /**
   * Rastreia uma nota fiscal por chave de acesso
   */
  const rastrearNotaFiscal = useCallback(async (chaveAcesso: string) => {
    setIsLoading(true);
    try {
      const notaFiscal = await buscarNotaFiscalPorChave(chaveAcesso);
      
      if (!notaFiscal) {
        toast({
          title: "Nota não encontrada",
          description: "Não foi possível encontrar uma nota fiscal com essa chave de acesso.",
          variant: "destructive"
        });
        setRastreamentoInfo(null);
        return null;
      }

      // Montar histórico baseado nos dados da nota fiscal
      const historico = [];
      
      if (notaFiscal.data_emissao) {
        historico.push({
          evento: 'Emissão da Nota Fiscal',
          data: notaFiscal.data_emissao,
          status: 'emitida',
          observacoes: `Emitida por ${notaFiscal.emitente_razao_social}`
        });
      }
      
      if (notaFiscal.data_entrada) {
        historico.push({
          evento: 'Entrada no Armazém',
          data: notaFiscal.data_entrada,
          status: 'recebida',
          observacoes: 'Mercadoria recebida e conferida'
        });
      }
      
      if (notaFiscal.ordem_carregamento_id) {
        historico.push({
          evento: 'Vinculada à Ordem de Carregamento',
          data: notaFiscal.updated_at || new Date().toISOString(),
          status: 'em_carregamento',
          observacoes: `Ordem: ${notaFiscal.ordem_carregamento_id}`
        });
      }
      
      if (notaFiscal.data_saida) {
        historico.push({
          evento: 'Saída do Armazém',
          data: notaFiscal.data_saida,
          status: 'expedida',
          observacoes: 'Mercadoria expedida'
        });
      }

      const info: RastreamentoInfo = {
        notaFiscal,
        historico: historico.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      };
      
      setRastreamentoInfo(info);
      return info;
    } catch (error) {
      console.error('Erro ao rastrear nota fiscal:', error);
      toast({
        title: "Erro",
        description: "Erro ao rastrear nota fiscal. Tente novamente.",
        variant: "destructive"
      });
      setRastreamentoInfo(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    rastreamentoInfo,
    rastrearNotaFiscal
  };
};
