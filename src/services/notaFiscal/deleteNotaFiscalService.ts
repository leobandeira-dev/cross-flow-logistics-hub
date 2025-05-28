
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes a nota fiscal from the database
 */
export const excluirNotaFiscal = async (id: string): Promise<void> => {
  try {
    console.log('Excluindo nota fiscal:', id);
    
    // First, delete related items
    const { error: itemsError } = await supabase
      .from('itens_nota_fiscal')
      .delete()
      .eq('nota_fiscal_id', id);
    
    if (itemsError) {
      console.error('Erro ao excluir itens da nota fiscal:', itemsError);
      throw new Error(`Erro ao excluir itens da nota fiscal: ${itemsError.message}`);
    }
    
    // Then delete the nota fiscal
    const { error } = await supabase
      .from('notas_fiscais')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir nota fiscal:', error);
      throw new Error(`Erro ao excluir nota fiscal: ${error.message}`);
    }
    
    console.log('Nota fiscal excluída com sucesso:', id);
  } catch (error) {
    console.error('Erro ao excluir nota fiscal:', error);
    throw error;
  }
};

/**
 * Soft delete a nota fiscal (mark as inactive)
 */
export const inativarNotaFiscal = async (id: string): Promise<void> => {
  try {
    console.log('Inativando nota fiscal:', id);
    
    const { error } = await supabase
      .from('notas_fiscais')
      .update({ 
        status: 'inativa',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao inativar nota fiscal:', error);
      throw new Error(`Erro ao inativar nota fiscal: ${error.message}`);
    }
    
    console.log('Nota fiscal inativada com sucesso:', id);
  } catch (error) {
    console.error('Erro ao inativar nota fiscal:', error);
    throw error;
  }
};
