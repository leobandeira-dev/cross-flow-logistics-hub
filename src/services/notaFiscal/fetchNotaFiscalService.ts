
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase.types";

interface FiltrosNotaFiscal {
  status?: string;
  termo?: string;
}

/**
 * Busca notas fiscais no banco de dados com filtros opcionais
 */
export const buscarNotasFiscais = async (filtros: FiltrosNotaFiscal = {}): Promise<NotaFiscal[]> => {
  try {
    console.log('Buscando notas fiscais com filtros:', filtros);
    
    let query = supabase
      .from('notas_fiscais')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Aplicar filtro de status se fornecido
    if (filtros.status) {
      query = query.eq('status', filtros.status);
    }
    
    // Aplicar filtro de termo de busca se fornecido
    if (filtros.termo) {
      query = query.or(`numero.ilike.%${filtros.termo}%,chave_acesso.ilike.%${filtros.termo}%,emitente_razao_social.ilike.%${filtros.termo}%,destinatario_razao_social.ilike.%${filtros.termo}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      throw new Error(`Erro ao buscar notas fiscais: ${error.message}`);
    }
    
    console.log('Notas fiscais encontradas:', data?.length || 0);
    return (data || []) as NotaFiscal[];
  } catch (error) {
    console.error('Erro ao buscar notas fiscais:', error);
    throw error;
  }
};
