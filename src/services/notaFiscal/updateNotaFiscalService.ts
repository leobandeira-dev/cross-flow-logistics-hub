
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase/fiscal.types";

interface UpdateNotaFiscalData {
  numero?: string;
  serie?: string;
  chave_acesso?: string;
  valor_total?: number;
  peso_bruto?: number;
  quantidade_volumes?: number;
  data_emissao?: string;
  status?: string;
  tipo?: string;
  remetente_id?: string;
  destinatario_id?: string;
  transportadora_id?: string;
  observacoes?: string;
}

/**
 * Atualiza uma nota fiscal existente
 */
export const atualizarNotaFiscal = async (id: string, data: UpdateNotaFiscalData): Promise<NotaFiscal> => {
  try {
    console.log('Atualizando nota fiscal:', id, data);
    
    // Validate required fields if being updated
    if (data.numero !== undefined && !data.numero) {
      throw new Error('Número da nota fiscal é obrigatório');
    }
    
    if (data.data_emissao !== undefined && !data.data_emissao) {
      throw new Error('Data de emissão é obrigatória');
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Only include fields that are being updated
    Object.keys(data).forEach(key => {
      if (data[key as keyof UpdateNotaFiscalData] !== undefined) {
        updateData[key] = data[key as keyof UpdateNotaFiscalData];
      }
    });

    console.log('Dados preparados para atualização:', updateData);
    
    const { data: notaFiscal, error } = await supabase
      .from('notas_fiscais')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        remetente:empresas!remetente_id(*),
        destinatario:empresas!destinatario_id(*),
        transportadora:empresas!transportadora_id(*)
      `)
      .single();
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao atualizar nota fiscal: ${error.message}`);
    }
    
    console.log('Nota fiscal atualizada com sucesso:', notaFiscal);
    return notaFiscal as NotaFiscal;
  } catch (error: any) {
    console.error('Erro ao atualizar nota fiscal:', error);
    throw error;
  }
};

/**
 * Atualiza o status de uma nota fiscal
 */
export const atualizarStatusNotaFiscal = async (id: string, status: string): Promise<NotaFiscal> => {
  return atualizarNotaFiscal(id, { status });
};

/**
 * Atualiza múltiplas notas fiscais
 */
export const atualizarMultiplasNotasFiscais = async (ids: string[], data: UpdateNotaFiscalData): Promise<NotaFiscal[]> => {
  try {
    console.log('Atualizando múltiplas notas fiscais:', ids, data);
    
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    const { data: notasFiscais, error } = await supabase
      .from('notas_fiscais')
      .update(updateData)
      .in('id', ids)
      .select(`
        *,
        remetente:empresas!remetente_id(*),
        destinatario:empresas!destinatario_id(*),
        transportadora:empresas!transportadora_id(*)
      `);
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao atualizar notas fiscais: ${error.message}`);
    }
    
    console.log('Notas fiscais atualizadas com sucesso:', notasFiscais);
    return notasFiscais as NotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao atualizar múltiplas notas fiscais:', error);
    throw error;
  }
};
