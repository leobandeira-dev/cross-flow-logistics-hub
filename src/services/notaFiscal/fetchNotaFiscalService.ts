
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase/fiscal.types";

/**
 * Fetches a nota fiscal by its access key (chave de acesso)
 */
export const buscarNotaFiscalPorChave = async (chaveAcesso: string): Promise<NotaFiscal | null> => {
  try {
    console.log('Buscando nota fiscal por chave:', chaveAcesso);
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('chave_acesso', chaveAcesso)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar nota fiscal por chave:', error);
      throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
    }
    
    console.log('Resultado da busca por chave:', data);
    return data;
  } catch (error: any) {
    console.error('Erro na busca por chave:', error);
    throw error;
  }
};

/**
 * Fetches a nota fiscal by its number
 */
export const buscarNotaFiscalPorNumero = async (numero: string): Promise<NotaFiscal | null> => {
  try {
    console.log('Buscando nota fiscal por número:', numero);
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('numero', numero)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar nota fiscal por número:', error);
      throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
    }
    
    console.log('Resultado da busca por número:', data);
    return data;
  } catch (error: any) {
    console.error('Erro na busca por número:', error);
    throw error;
  }
};

/**
 * Fetches all notas fiscais with optional filters
 */
export const buscarNotasFiscais = async (filters?: {
  status?: string;
  numero?: string;
  chave_acesso?: string;
  emitente_cnpj?: string;
  destinatario_cnpj?: string;
  data_inicio?: string;
  data_fim?: string;
}) => {
  try {
    console.log('Buscando notas fiscais com filtros:', filters);
    
    let query = supabase
      .from('notas_fiscais')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.numero) {
      query = query.ilike('numero', `%${filters.numero}%`);
    }
    
    if (filters?.chave_acesso) {
      query = query.ilike('chave_acesso', `%${filters.chave_acesso}%`);
    }
    
    if (filters?.emitente_cnpj) {
      query = query.ilike('emitente_cnpj', `%${filters.emitente_cnpj}%`);
    }
    
    if (filters?.destinatario_cnpj) {
      query = query.ilike('destinatario_cnpj', `%${filters.destinatario_cnpj}%`);
    }
    
    if (filters?.data_inicio) {
      query = query.gte('data_emissao', filters.data_inicio);
    }
    
    if (filters?.data_fim) {
      query = query.lte('data_emissao', filters.data_fim);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      throw new Error(`Erro ao buscar notas fiscais: ${error.message}`);
    }
    
    console.log(`Encontradas ${data?.length || 0} notas fiscais`);
    return data || [];
  } catch (error: any) {
    console.error('Erro na busca de notas fiscais:', error);
    throw error;
  }
};

/**
 * Fetches a single nota fiscal by ID
 */
export const buscarNotaFiscalPorId = async (id: string): Promise<NotaFiscal | null> => {
  try {
    console.log('Buscando nota fiscal por ID:', id);
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar nota fiscal por ID:', error);
      throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
    }
    
    console.log('Resultado da busca por ID:', data);
    return data;
  } catch (error: any) {
    console.error('Erro na busca por ID:', error);
    throw error;
  }
};
