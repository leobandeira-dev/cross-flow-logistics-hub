
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase.types";

/**
 * Updates a nota fiscal in the database
 */
export const atualizarNotaFiscal = async (id: string, notaFiscal: Partial<NotaFiscal>): Promise<NotaFiscal> => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .update(notaFiscal)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao atualizar nota fiscal: ${error.message}`);
    }
    
    return data as NotaFiscal;
  } catch (error: any) {
    console.error('Erro ao atualizar nota fiscal:', error);
    throw error;
  }
};

/**
 * Updates only the status of a nota fiscal
 */
export const atualizarStatusNotaFiscal = async (id: string, status: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notas_fiscais')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      throw new Error(`Erro ao atualizar status da nota fiscal: ${error.message}`);
    }
  } catch (error: any) {
    console.error('Erro ao atualizar status da nota fiscal:', error);
    throw error;
  }
};
