
import { supabase } from "@/integrations/supabase/client";

export interface NotaFiscalStats {
  total: number;
  pendentes: number;
  recebidas: number;
  em_carregamento: number;
  expedidas: number;
  valor_total: number;
  peso_total: number;
}

/**
 * Gets statistics for notas fiscais
 */
export const obterEstatisticasNotasFiscais = async (): Promise<NotaFiscalStats> => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('status, valor_total, peso_bruto');
    
    if (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
    
    const stats = (data || []).reduce((acc, nota) => {
      acc.total += 1;
      
      switch (nota.status) {
        case 'pendente':
          acc.pendentes += 1;
          break;
        case 'recebida':
          acc.recebidas += 1;
          break;
        case 'em_carregamento':
          acc.em_carregamento += 1;
          break;
        case 'expedida':
          acc.expedidas += 1;
          break;
      }
      
      acc.valor_total += nota.valor_total || 0;
      acc.peso_total += nota.peso_bruto || 0;
      
      return acc;
    }, {
      total: 0,
      pendentes: 0,
      recebidas: 0,
      em_carregamento: 0,
      expedidas: 0,
      valor_total: 0,
      peso_total: 0
    });
    
    return stats;
  } catch (error) {
    console.error('Erro ao obter estatísticas das notas fiscais:', error);
    throw error;
  }
};

/**
 * Gets statistics for a specific period
 */
export const obterEstatisticasPorPeriodo = async (dataInicio: string, dataFim: string): Promise<NotaFiscalStats> => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('status, valor_total, peso_bruto')
      .gte('data_emissao', dataInicio)
      .lte('data_emissao', dataFim);
    
    if (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
    
    const stats = (data || []).reduce((acc, nota) => {
      acc.total += 1;
      
      switch (nota.status) {
        case 'pendente':
          acc.pendentes += 1;
          break;
        case 'recebida':
          acc.recebidas += 1;
          break;
        case 'em_carregamento':
          acc.em_carregamento += 1;
          break;
        case 'expedida':
          acc.expedidas += 1;
          break;
      }
      
      acc.valor_total += nota.valor_total || 0;
      acc.peso_total += nota.peso_bruto || 0;
      
      return acc;
    }, {
      total: 0,
      pendentes: 0,
      recebidas: 0,
      em_carregamento: 0,
      expedidas: 0,
      valor_total: 0,
      peso_total: 0
    });
    
    return stats;
  } catch (error) {
    console.error('Erro ao obter estatísticas das notas fiscais:', error);
    throw error;
  }
};
