
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
    
    // Tenta buscar por ID primeiro (formato UUID)
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
    
    // Depois tenta por chave de acesso (exata)
    const { data: notaByChave, error: errorByChave } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('chave_acesso', searchTerm)
      .maybeSingle();
      
    if (notaByChave) {
      return notaByChave;
    }
    
    // Depois tenta por número de NF (exata)
    const { data: notaByNumero, error: errorByNumero } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('numero', searchTerm)
      .maybeSingle();
      
    if (notaByNumero) {
      return notaByNumero;
    }
    
    // Por fim, tenta busca textual em múltiplos campos
    const { data: notasByText, error: errorByText } = await supabase
      .from('notas_fiscais')
      .select('*')
      .or(`numero.ilike.%${searchTerm}%,chave_acesso.ilike.%${searchTerm}%,emitente_razao_social.ilike.%${searchTerm}%,destinatario_razao_social.ilike.%${searchTerm}%`)
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

/**
 * Busca notas fiscais com filtros avançados
 */
export const searchNotasFiscaisAvancado = async (filters: {
  numero?: string;
  chave_acesso?: string;
  emitente_cnpj?: string;
  emitente_razao_social?: string;
  destinatario_cnpj?: string;
  destinatario_razao_social?: string;
  status?: string;
  data_inicio?: string;
  data_fim?: string;
  limit?: number;
}): Promise<NotaFiscal[]> => {
  try {
    console.log('Busca avançada de notas fiscais:', filters);
    
    let query = supabase.from('notas_fiscais').select('*');
    
    // Apply filters
    if (filters.numero) {
      query = query.ilike('numero', `%${filters.numero}%`);
    }
    
    if (filters.chave_acesso) {
      query = query.ilike('chave_acesso', `%${filters.chave_acesso}%`);
    }
    
    if (filters.emitente_cnpj) {
      query = query.ilike('emitente_cnpj', `%${filters.emitente_cnpj}%`);
    }
    
    if (filters.emitente_razao_social) {
      query = query.ilike('emitente_razao_social', `%${filters.emitente_razao_social}%`);
    }
    
    if (filters.destinatario_cnpj) {
      query = query.ilike('destinatario_cnpj', `%${filters.destinatario_cnpj}%`);
    }
    
    if (filters.destinatario_razao_social) {
      query = query.ilike('destinatario_razao_social', `%${filters.destinatario_razao_social}%`);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.data_inicio) {
      query = query.gte('data_emissao', filters.data_inicio);
    }
    
    if (filters.data_fim) {
      query = query.lte('data_emissao', filters.data_fim);
    }
    
    // Add limit
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    // Order by creation date (most recent first)
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro na busca avançada:', error);
      throw new Error(`Erro ao buscar notas fiscais: ${error.message}`);
    }
    
    console.log(`Encontradas ${data?.length || 0} notas fiscais na busca avançada`);
    return data || [];
  } catch (error: any) {
    console.error('Erro na busca avançada de notas fiscais:', error);
    throw error;
  }
};
