
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal, ItemNotaFiscal } from "@/types/supabase.types";

/**
 * Fetches a nota fiscal by its access key
 */
export const buscarNotaFiscalPorChave = async (chave: string): Promise<NotaFiscal | null> => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('chave_acesso', chave)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar nota fiscal por chave:', error);
      throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
    }
    
    return data as NotaFiscal;
  } catch (error: any) {
    console.error('Erro ao buscar nota fiscal:', error);
    throw error;
  }
};

/**
 * Fetches notas fiscais with optional filters
 */
export const buscarNotasFiscais = async (filtros?: {
  status?: string;
  fornecedor?: string;
  dataInicio?: string;
  dataFim?: string;
  termo?: string;
}): Promise<NotaFiscal[]> => {
  try {
    console.log('Buscando notas fiscais com filtros:', filtros);
    
    let query = supabase
      .from('notas_fiscais')
      .select('*');
    
    if (filtros?.status && filtros.status !== 'all') {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.dataInicio) {
      query = query.gte('data_emissao', filtros.dataInicio);
    }
    
    if (filtros?.dataFim) {
      query = query.lte('data_emissao', filtros.dataFim);
    }
    
    if (filtros?.termo) {
      query = query.or(`numero.ilike.%${filtros.termo}%,chave_acesso.ilike.%${filtros.termo}%,emitente_razao_social.ilike.%${filtros.termo}%,destinatario_razao_social.ilike.%${filtros.termo}%`);
    }
    
    // Ordenar por data de criação mais recente
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro na query do Supabase:', error);
      throw new Error(`Erro ao buscar notas fiscais: ${error.message}`);
    }
    
    console.log('Notas fiscais encontradas:', data?.length || 0);
    return (data || []) as NotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao buscar notas fiscais:', error);
    throw error;
  }
};

/**
 * Fetches items for a specific nota fiscal
 */
export const buscarItensNotaFiscal = async (notaFiscalId: string): Promise<ItemNotaFiscal[]> => {
  try {
    const { data, error } = await supabase
      .from('itens_nota_fiscal')
      .select('*')
      .eq('nota_fiscal_id', notaFiscalId);
    
    if (error) {
      throw new Error(`Erro ao buscar itens da nota fiscal: ${error.message}`);
    }
    
    return (data || []) as ItemNotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao buscar itens da nota fiscal:', error);
    throw error;
  }
};
