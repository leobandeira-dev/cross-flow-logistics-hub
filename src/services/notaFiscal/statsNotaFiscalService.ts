
import { supabase } from "@/integrations/supabase/client";

/**
 * Busca estatísticas das notas fiscais
 */
export const buscarEstatisticasNotasFiscais = async () => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('status, valor_total, data_emissao')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }
    
    // Calcular estatísticas
    const total = data?.length || 0;
    const processadas = data?.filter(nf => nf.status === 'processada').length || 0;
    const pendentes = data?.filter(nf => nf.status === 'pendente').length || 0;
    const rejeitadas = data?.filter(nf => nf.status === 'rejeitada').length || 0;
    const valorTotal = data?.reduce((sum, nf) => sum + (nf.valor_total || 0), 0) || 0;
    
    return {
      total,
      processadas,
      pendentes,
      rejeitadas,
      valorTotal
    };
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};
