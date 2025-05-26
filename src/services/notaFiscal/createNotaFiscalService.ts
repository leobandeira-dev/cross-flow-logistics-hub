
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase/fiscal.types";

interface CreateNotaFiscalData {
  numero: string;
  serie?: string;
  chave_acesso?: string;
  valor_total: number;
  peso_bruto?: number;
  quantidade_volumes?: number;
  data_emissao: string;
  status?: string;
  tipo?: string;
  remetente_id?: string;
  destinatario_id?: string;
  transportadora_id?: string;
  observacoes?: string;
}

/**
 * Creates a new nota fiscal in the database
 */
export const criarNotaFiscal = async (data: CreateNotaFiscalData): Promise<NotaFiscal> => {
  try {
    console.log('Criando nota fiscal com dados:', data);
    
    // Validate required fields
    if (!data.numero) {
      throw new Error('Número da nota fiscal é obrigatório');
    }
    
    if (!data.data_emissao) {
      throw new Error('Data de emissão é obrigatória');
    }

    // Ensure data_emissao is a valid ISO string
    let validDataEmissao: string;
    try {
      validDataEmissao = new Date(data.data_emissao).toISOString();
    } catch (error) {
      console.error('Data de emissão inválida:', data.data_emissao);
      validDataEmissao = new Date().toISOString();
    }

    const insertData = {
      numero: data.numero,
      serie: data.serie || '1',
      chave_acesso: data.chave_acesso || null,
      valor_total: data.valor_total || 0,
      peso_bruto: data.peso_bruto || null,
      quantidade_volumes: data.quantidade_volumes || null,
      data_emissao: validDataEmissao,
      status: data.status || 'pendente',
      tipo: data.tipo || 'entrada',
      remetente_id: data.remetente_id || null,
      destinatario_id: data.destinatario_id || null,
      transportadora_id: data.transportadora_id || null,
      observacoes: data.observacoes || null
    };

    console.log('Dados preparados para inserção:', insertData);
    
    const { data: notaFiscal, error } = await supabase
      .from('notas_fiscais')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao criar nota fiscal: ${error.message}`);
    }
    
    console.log('Nota fiscal criada com sucesso:', notaFiscal);
    return notaFiscal as NotaFiscal;
  } catch (error: any) {
    console.error('Erro ao criar nota fiscal:', error);
    throw error;
  }
};
