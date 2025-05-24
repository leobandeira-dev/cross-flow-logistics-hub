
import { supabase } from "@/integrations/supabase/client";

/**
 * Exclui uma nota fiscal por ID
 */
export const excluirNotaFiscal = async (id: string): Promise<void> => {
  try {
    console.log('Excluindo nota fiscal:', id);
    
    const { error } = await supabase
      .from('notas_fiscais')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao excluir nota fiscal: ${error.message}`);
    }
    
    console.log('Nota fiscal excluída com sucesso');
  } catch (error: any) {
    console.error('Erro ao excluir nota fiscal:', error);
    throw error;
  }
};

/**
 * Exclui múltiplas notas fiscais
 */
export const excluirMultiplasNotasFiscais = async (ids: string[]): Promise<void> => {
  try {
    console.log('Excluindo múltiplas notas fiscais:', ids);
    
    const { error } = await supabase
      .from('notas_fiscais')
      .delete()
      .in('id', ids);
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao excluir notas fiscais: ${error.message}`);
    }
    
    console.log('Notas fiscais excluídas com sucesso');
  } catch (error: any) {
    console.error('Erro ao excluir múltiplas notas fiscais:', error);
    throw error;
  }
};
