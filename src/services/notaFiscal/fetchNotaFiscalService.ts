
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal, ItemNotaFiscal } from "@/types/supabase/fiscal.types";

/**
 * Fetches a nota fiscal by its access key
 */
export const buscarNotaFiscalPorChave = async (chave: string): Promise<NotaFiscal | null> => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select(`
        *,
        itens:itens_nota_fiscal(*)
      `)
      .eq('chave_acesso', chave)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Não encontrou nenhuma nota fiscal
        return null;
      }
      throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
    }
    
    return data as unknown as NotaFiscal;
  } catch (error: any) {
    console.error('Erro ao buscar nota fiscal:', error);
    throw error;
  }
};

/**
 * Fetches notas fiscais with optional filters, ordered by inclusion date (most recent first)
 */
export const buscarNotasFiscais = async (filtros?: {
  status?: string;
  fornecedor?: string;
  dataInicio?: string;
  dataFim?: string;
  termo?: string;
}): Promise<NotaFiscal[]> => {
  try {
    let query = supabase
      .from('notas_fiscais')
      .select(`
        *,
        itens:itens_nota_fiscal(*)
      `)
      .order('data_inclusao', { ascending: false }); // Ordenar por data de inclusão (mais recente primeiro)
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.fornecedor) {
      query = query.ilike('emitente_razao_social', `%${filtros.fornecedor}%`);
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
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao buscar notas fiscais: ${error.message}`);
    }
    
    console.log('Notas fiscais buscadas da tabela notas_fiscais:', data);
    
    return data as unknown as NotaFiscal[];
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
      .eq('nota_fiscal_id', notaFiscalId)
      .order('sequencia', { ascending: true });
    
    if (error) {
      throw new Error(`Erro ao buscar itens da nota fiscal: ${error.message}`);
    }
    
    return data as ItemNotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao buscar itens da nota fiscal:', error);
    throw error;
  }
};
