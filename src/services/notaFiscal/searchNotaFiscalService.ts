
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase/fiscal.types";

interface SearchNotaFiscalParams {
  term: string;
  field?: 'chave_acesso' | 'numero' | 'emitente_razao_social' | 'destinatario_razao_social' | 'all';
  limit?: number;
}

/**
 * Serviço para buscar notas fiscais por diferentes critérios
 */
export const searchNotasFiscais = async (params: SearchNotaFiscalParams): Promise<NotaFiscal[]> => {
  try {
    const { term, field = 'all', limit = 10 } = params;
    console.log('Buscando notas fiscais:', { term, field, limit });
    
    if (!term || term.length < 3) {
      return [];
    }
    
    let query = supabase.from('notas_fiscais').select('*');
    
    if (field === 'all') {
      query = query.or(
        `chave_acesso.ilike.%${term}%,numero.ilike.%${term}%,emitente_razao_social.ilike.%${term}%,destinatario_razao_social.ilike.%${term}%`
      );
    } else {
      query = query.ilike(field, `%${term}%`);
    }
    
    const { data, error } = await query.limit(limit);
    
    if (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      throw new Error(`Erro ao buscar notas fiscais: ${error.message}`);
    }
    
    console.log(`Encontradas ${data?.length || 0} notas fiscais para o termo "${term}"`);
    return data || [];
  } catch (error: any) {
    console.error('Erro na busca de notas fiscais:', error);
    throw error;
  }
};

/**
 * Busca nota fiscal para geração de etiqueta usando múltiplos critérios
 */
export const searchNotaForEtiqueta = async (searchTerm: string): Promise<NotaFiscal | null> => {
  try {
    console.log('Buscando nota fiscal para etiqueta:', searchTerm);
    
    if (!searchTerm || searchTerm.trim().length < 3) {
      return null;
    }
    
    // Tenta buscar por ID primeiro
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(searchTerm)) {
      const { data: notaById, error: errorById } = await supabase
        .from('notas_fiscais')
        .select('*')
        .eq('id', searchTerm)
        .maybeSingle();
        
      if (notaById) {
        return notaById;
      }
    }
    
    // Depois tenta por chave de acesso
    const { data: notaByChave, error: errorByChave } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('chave_acesso', searchTerm)
      .maybeSingle();
      
    if (notaByChave) {
      return notaByChave;
    }
    
    // Depois tenta por número de NF
    const { data: notaByNumero, error: errorByNumero } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('numero', searchTerm)
      .maybeSingle();
      
    if (notaByNumero) {
      return notaByNumero;
    }
    
    // Por fim, tenta busca textual
    const { data: notasByText, error: errorByText } = await supabase
      .from('notas_fiscais')
      .select('*')
      .or(`numero.ilike.%${searchTerm}%,chave_acesso.ilike.%${searchTerm}%`)
      .limit(1);
      
    if (notasByText && notasByText.length > 0) {
      return notasByText[0];
    }
    
    console.log('Nenhuma nota fiscal encontrada para o termo:', searchTerm);
    return null;
  } catch (error: any) {
    console.error('Erro ao buscar nota fiscal para etiqueta:', error);
    throw error;
  }
};
