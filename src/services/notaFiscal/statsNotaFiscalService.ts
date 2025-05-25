
import { supabase } from "@/integrations/supabase/client";

interface NotaFiscalStats {
  total: number;
  pendentes: number;
  entrada: number;
  no_armazem: number;
  expedidas: number;
  valor_total: number;
  peso_total: number;
  volumes_total: number;
}

/**
 * Busca estatísticas das notas fiscais
 */
export const buscarEstatisticasNotasFiscais = async (filtros?: {
  dataInicio?: string;
  dataFim?: string;
}): Promise<NotaFiscalStats> => {
  try {
    console.log('Buscando estatísticas das notas fiscais:', filtros);
    
    let query = supabase
      .from('notas_fiscais')
      .select('status, valor_total, peso_bruto, quantidade_volumes');

    if (filtros?.dataInicio) {
      query = query.gte('data_emissao', filtros.dataInicio);
    }

    if (filtros?.dataFim) {
      query = query.lte('data_emissao', filtros.dataFim);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }

    // Calcular estatísticas
    const stats: NotaFiscalStats = {
      total: data?.length || 0,
      pendentes: data?.filter(nf => nf.status === 'pendente').length || 0,
      entrada: data?.filter(nf => nf.status === 'entrada').length || 0,
      no_armazem: data?.filter(nf => nf.status === 'no_armazem').length || 0,
      expedidas: data?.filter(nf => nf.status === 'expedido').length || 0,
      valor_total: data?.reduce((sum, nf) => sum + (nf.valor_total || 0), 0) || 0,
      peso_total: data?.reduce((sum, nf) => sum + (nf.peso_bruto || 0), 0) || 0,
      volumes_total: data?.reduce((sum, nf) => sum + (nf.quantidade_volumes || 0), 0) || 0
    };

    console.log('Estatísticas calculadas:', stats);
    return stats;
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas das notas fiscais:', error);
    throw error;
  }
};

/**
 * Busca contagem de notas por status
 */
export const buscarContagemPorStatus = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('status');

    if (error) {
      console.error('Erro ao buscar contagem por status:', error);
      throw new Error(`Erro ao buscar contagem: ${error.message}`);
    }

    const contagem: Record<string, number> = {};
    data?.forEach(nf => {
      contagem[nf.status] = (contagem[nf.status] || 0) + 1;
    });

    return contagem;
  } catch (error: any) {
    console.error('Erro ao buscar contagem por status:', error);
    throw error;
  }
};
