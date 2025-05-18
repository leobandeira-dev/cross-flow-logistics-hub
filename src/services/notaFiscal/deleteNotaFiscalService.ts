
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes a nota fiscal and its related items from the database
 */
export const excluirNotaFiscal = async (id: string): Promise<void> => {
  try {
    // Primeiro exclui os itens relacionados
    const { error: errorItens } = await supabase
      .from('itens_nota_fiscal')
      .delete()
      .eq('nota_fiscal_id', id);
    
    if (errorItens) {
      throw new Error(`Erro ao excluir itens da nota fiscal: ${errorItens.message}`);
    }
    
    // Depois exclui a nota fiscal
    const { error } = await supabase
      .from('notas_fiscais')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Erro ao excluir nota fiscal: ${error.message}`);
    }
  } catch (error: any) {
    console.error('Erro ao excluir nota fiscal:', error);
    throw error;
  }
};
