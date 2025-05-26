
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
    console.log('=== INÍCIO CRIAÇÃO NOTA FISCAL ===');
    console.log('Dados recebidos:', data);
    
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
      console.log('Data de emissão validada:', validDataEmissao);
    } catch (error) {
      console.error('Data de emissão inválida:', data.data_emissao);
      validDataEmissao = new Date().toISOString();
      console.log('Usando data atual:', validDataEmissao);
    }

    // Prepare insert data with all required fields
    const insertData = {
      numero: data.numero.toString(),
      serie: data.serie?.toString() || '1',
      chave_acesso: data.chave_acesso || null,
      valor_total: Number(data.valor_total) || 0,
      peso_bruto: data.peso_bruto ? Number(data.peso_bruto) : null,
      quantidade_volumes: data.quantidade_volumes ? Number(data.quantidade_volumes) : null,
      data_emissao: validDataEmissao,
      status: data.status || 'entrada',
      tipo: data.tipo || 'entrada',
      remetente_id: data.remetente_id || null,
      destinatario_id: data.destinatario_id || null,
      transportadora_id: data.transportadora_id || null,
      observacoes: data.observacoes || null
    };

    console.log('Dados preparados para inserção:', insertData);
    console.log('Tentando inserir no Supabase...');
    
    const { data: notaFiscal, error } = await supabase
      .from('notas_fiscais')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro do Supabase ao inserir:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Erro ao criar nota fiscal: ${error.message}`);
    }
    
    console.log('✅ Nota fiscal criada com sucesso no Supabase:', notaFiscal);
    console.log('=== FIM CRIAÇÃO NOTA FISCAL ===');
    
    return notaFiscal as NotaFiscal;
  } catch (error: any) {
    console.error('❌ Erro geral ao criar nota fiscal:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};
