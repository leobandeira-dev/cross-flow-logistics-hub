
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes a nota fiscal from the database
 */
export const excluirNotaFiscal = async (notaFiscalId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notas_fiscais')
      .delete()
      .eq('id', notaFiscalId);

    if (error) {
      throw new Error(`Erro ao excluir nota fiscal: ${error.message}`);
    }

    console.log('Nota fiscal excluída do banco:', notaFiscalId);
  } catch (error) {
    console.error('Erro ao excluir nota fiscal:', error);
    throw error;
  }
};
