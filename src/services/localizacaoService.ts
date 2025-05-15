
import { supabase } from "@/integrations/supabase/client";
import { Localizacao } from "@/types/supabase.types";

/**
 * Service for localizações operations
 */
const localizacaoService = {
  /**
   * Lista todas as localizações
   */
  async listarLocalizacoes(filtros?: {
    tipo?: string;
    status?: string;
    ocupado?: boolean;
  }): Promise<Localizacao[]> {
    let query = supabase
      .from('localizacoes')
      .select('*');
    
    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.ocupado !== undefined) {
      query = query.eq('ocupado', filtros.ocupado);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao listar localizações: ${error.message}`);
    }
    
    return data as Localizacao[];
  },
  
  /**
   * Busca uma localização pelo ID
   */
  async buscarLocalizacaoPorId(id: string): Promise<Localizacao> {
    const { data, error } = await supabase
      .from('localizacoes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(`Erro ao buscar localização: ${error.message}`);
    }
    
    return data as Localizacao;
  }
};

export default localizacaoService;
