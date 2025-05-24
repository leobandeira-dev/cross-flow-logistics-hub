
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase/fiscal.types";

/**
 * Busca uma nota fiscal pela chave de acesso
 */
export const buscarNotaFiscalPorChave = async (chaveAcesso: string): Promise<NotaFiscal | null> => {
  try {
    console.log('Buscando nota fiscal por chave:', chaveAcesso);
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select(`
        *,
        remetente:empresas!remetente_id(*),
        destinatario:empresas!destinatario_id(*),
        transportadora:empresas!transportadora_id(*)
      `)
      .eq('chave_acesso', chaveAcesso)
      .maybeSingle();

    if (error) {
      console.error('Erro do Supabase ao buscar nota fiscal:', error);
      throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
    }

    console.log('Nota fiscal encontrada:', data);
    return data;
  } catch (error: any) {
    console.error('Erro ao buscar nota fiscal por chave:', error);
    throw error;
  }
};

/**
 * Busca todas as notas fiscais com filtros opcionais
 */
export const buscarNotasFiscais = async (filtros?: {
  status?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
}): Promise<NotaFiscal[]> => {
  try {
    let query = supabase
      .from('notas_fiscais')
      .select(`
        *,
        remetente:empresas!remetente_id(*),
        destinatario:empresas!destinatario_id(*),
        transportadora:empresas!transportadora_id(*)
      `)
      .order('created_at', { ascending: false });

    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }

    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }

    if (filtros?.dataInicio) {
      query = query.gte('data_emissao', filtros.dataInicio);
    }

    if (filtros?.dataFim) {
      query = query.lte('data_emissao', filtros.dataFim);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      throw new Error(`Erro ao buscar notas fiscais: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar notas fiscais:', error);
    throw error;
  }
};

/**
 * Busca uma nota fiscal por ID
 */
export const buscarNotaFiscalPorId = async (id: string): Promise<NotaFiscal | null> => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select(`
        *,
        remetente:empresas!remetente_id(*),
        destinatario:empresas!destinatario_id(*),
        transportadora:empresas!transportadora_id(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar nota fiscal por ID:', error);
      throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao buscar nota fiscal por ID:', error);
    throw error;
  }
};
