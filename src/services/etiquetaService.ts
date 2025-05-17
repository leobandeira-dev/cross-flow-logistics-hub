
import { supabase } from "@/integrations/supabase/client";

const etiquetaService = {
  /**
   * Atualiza o status de múltiplas etiquetas
   */
  async atualizarEtiquetas(etiquetasIds: string[], dados: any): Promise<void> {
    if (!etiquetasIds || etiquetasIds.length === 0) return;
    
    const { error } = await supabase
      .from('etiquetas')
      .update(dados)
      .in('id', etiquetasIds);
    
    if (error) {
      throw new Error(`Erro ao atualizar etiquetas: ${error.message}`);
    }
  },
  
  /**
   * Busca etiquetas por ID
   */
  async buscarEtiquetasPorId(ids: string[]): Promise<any[]> {
    if (!ids || ids.length === 0) return [];
    
    const { data, error } = await supabase
      .from('etiquetas')
      .select('*')
      .in('id', ids);
    
    if (error) {
      throw new Error(`Erro ao buscar etiquetas: ${error.message}`);
    }
    
    return data || [];
  },
  
  /**
   * Busca etiquetas por filtros
   */
  async buscarEtiquetas(filtros: {
    status?: string;
    tipo?: string;
    notaFiscalId?: string;
  } = {}): Promise<any[]> {
    let query = supabase.from('etiquetas').select('*');
    
    if (filtros.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    
    if (filtros.notaFiscalId) {
      query = query.eq('nota_fiscal_id', filtros.notaFiscalId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao buscar etiquetas: ${error.message}`);
    }
    
    return data || [];
  }
};

export default etiquetaService;
