
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase.types";

/**
 * Updates an existing nota fiscal in the database
 */
export const atualizarNotaFiscal = async (id: string, notaFiscal: Partial<NotaFiscal>): Promise<NotaFiscal> => {
  try {
    console.log('Atualizando nota fiscal:', id, notaFiscal);
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .update({
        ...notaFiscal,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar nota fiscal:', error);
      throw new Error(`Erro ao atualizar nota fiscal: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`Nota fiscal não encontrada: ${id}`);
    }
    
    console.log('Nota fiscal atualizada com sucesso:', data);
    return data as NotaFiscal;
  } catch (error) {
    console.error('Erro ao atualizar nota fiscal:', error);
    throw error;
  }
};

/**
 * Updates the status of a nota fiscal
 */
export const atualizarStatusNotaFiscal = async (id: string, status: string): Promise<NotaFiscal> => {
  return atualizarNotaFiscal(id, { status });
};

/**
 * Associates a nota fiscal with an ordem de carregamento
 */
export const vincularNotaFiscalOrdemCarregamento = async (notaFiscalId: string, ordemCarregamentoId: string): Promise<NotaFiscal> => {
  return atualizarNotaFiscal(notaFiscalId, { 
    ordem_carregamento_id: ordemCarregamentoId,
    status: 'em_carregamento'
  });
};

/**
 * Associates a nota fiscal with a coleta
 */
export const vincularNotaFiscalColeta = async (notaFiscalId: string, coletaId: string): Promise<NotaFiscal> => {
  return atualizarNotaFiscal(notaFiscalId, { 
    coleta_id: coletaId,
    status: 'coletada'
  });
};

/**
 * Updates the entrada date of a nota fiscal
 */
export const registrarEntradaNotaFiscal = async (id: string): Promise<NotaFiscal> => {
  return atualizarNotaFiscal(id, { 
    data_entrada: new Date().toISOString(),
    status: 'recebida'
  });
};

/**
 * Updates the saida date of a nota fiscal
 */
export const registrarSaidaNotaFiscal = async (id: string): Promise<NotaFiscal> => {
  return atualizarNotaFiscal(id, { 
    data_saida: new Date().toISOString(),
    status: 'expedida'
  });
};
