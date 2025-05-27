
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase.types";

interface NotaFiscalCreateData {
  numero: string;
  serie?: string;
  chave_acesso?: string;
  valor_total: number;
  peso_bruto?: number;
  quantidade_volumes?: number;
  data_emissao?: string;
  status?: string;
  observacoes?: string;
}

/**
 * Creates a new nota fiscal in the database
 */
export const criarNotaFiscal = async (notaFiscalData: NotaFiscalCreateData): Promise<NotaFiscal> => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert({
        numero: notaFiscalData.numero,
        serie: notaFiscalData.serie,
        chave_acesso: notaFiscalData.chave_acesso,
        valor_total: notaFiscalData.valor_total,
        peso_bruto: notaFiscalData.peso_bruto,
        quantidade_volumes: notaFiscalData.quantidade_volumes,
        data_emissao: notaFiscalData.data_emissao,
        status: notaFiscalData.status || 'pendente',
        data_entrada: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar nota fiscal: ${error.message}`);
    }

    console.log('Nota fiscal criada no banco:', data);
    return data as NotaFiscal;
  } catch (error) {
    console.error('Erro ao criar nota fiscal:', error);
    throw error;
  }
};
