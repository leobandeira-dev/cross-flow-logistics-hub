
import { useState, useCallback } from 'react';
import { NotaFiscal } from '@/types/supabase.types';
import { buscarNotasFiscais } from '@/services/notaFiscal/fetchNotaFiscalService';
import { vincularNotaFiscalOrdemCarregamento } from '@/services/notaFiscal/updateNotaFiscalService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para integração entre notas fiscais e carregamento
 */
export const useNotasFiscaisIntegration = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notasDisponiveis, setNotasDisponiveis] = useState<NotaFiscal[]>([]);

  /**
   * Busca notas fiscais disponíveis para carregamento
   */
  const buscarNotasDisponiveisParaCarregamento = useCallback(async () => {
    setIsLoading(true);
    try {
      // Buscar notas fiscais que estão recebidas e não vinculadas a ordens de carregamento
      const filtros = {
        status: 'recebida'
      };
      
      const notas = await buscarNotasFiscais(filtros);
      
      // Filtrar apenas notas que não estão vinculadas a ordens de carregamento
      const notasDisponiveis = notas.filter(nota => !nota.ordem_carregamento_id);
      
      setNotasDisponiveis(notasDisponiveis);
      return notasDisponiveis;
    } catch (error) {
      console.error('Erro ao buscar notas fiscais disponíveis:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar notas fiscais disponíveis para carregamento.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Vincula notas fiscais a uma ordem de carregamento
   */
  const vincularNotasOrdemCarregamento = useCallback(async (
    notasFiscaisIds: string[], 
    ordemCarregamentoId: string
  ) => {
    setIsLoading(true);
    try {
      const promises = notasFiscaisIds.map(notaId => 
        vincularNotaFiscalOrdemCarregamento(notaId, ordemCarregamentoId)
      );
      
      await Promise.all(promises);
      
      // Atualizar lista de notas disponíveis removendo as vinculadas
      setNotasDisponiveis(prev => 
        prev.filter(nota => !notasFiscaisIds.includes(nota.id))
      );
      
      toast({
        title: "Sucesso",
        description: `${notasFiscaisIds.length} nota(s) fiscal(is) vinculada(s) à ordem de carregamento.`
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao vincular notas fiscais:', error);
      toast({
        title: "Erro",
        description: "Erro ao vincular notas fiscais à ordem de carregamento.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    notasDisponiveis,
    buscarNotasDisponiveisParaCarregamento,
    vincularNotasOrdemCarregamento
  };
};
