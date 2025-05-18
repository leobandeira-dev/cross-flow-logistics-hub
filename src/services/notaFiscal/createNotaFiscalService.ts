
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal, ItemNotaFiscal } from "@/types/supabase.types";

/**
 * Creates a new nota fiscal in the database
 */
export const criarNotaFiscal = async (notaFiscal: Partial<NotaFiscal>, itensNotaFiscal?: Partial<ItemNotaFiscal>[]): Promise<NotaFiscal> => {
  try {
    // Create a properly typed object with required fields
    const notaFiscalToInsert = {
      numero: notaFiscal.numero || '',
      valor: notaFiscal.valor || 0,
      data_emissao: notaFiscal.data_emissao || new Date().toISOString().split('T')[0],
      tipo: notaFiscal.tipo || 'entrada',
      status: notaFiscal.status || 'pendente',
      // Optional fields
      chave_acesso: notaFiscal.chave_acesso,
      serie: notaFiscal.serie,
      peso_bruto: notaFiscal.peso_bruto,
      quantidade_volumes: notaFiscal.quantidade_volumes,
      data_entrada: notaFiscal.data_entrada,
      data_saida: notaFiscal.data_saida,
      empresa_emitente_id: notaFiscal.empresa_emitente_id,
      empresa_destinatario_id: notaFiscal.empresa_destinatario_id,
      filial_id: notaFiscal.filial_id,
      ordem_carregamento_id: notaFiscal.ordem_carregamento_id,
      coleta_id: notaFiscal.coleta_id,
      observacoes: notaFiscal.observacoes,
      tempo_armazenamento_horas: notaFiscal.tempo_armazenamento_horas
    };
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert(notaFiscalToInsert)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao criar nota fiscal: ${error.message}`);
    }
    
    // Se houver itens, cria-os vinculados à nota fiscal
    if (itensNotaFiscal && itensNotaFiscal.length > 0) {
      const itensComNotaId = itensNotaFiscal.map(item => ({
        ...item,
        nota_fiscal_id: data.id
      }));
      
      await criarItensNotaFiscal(itensComNotaId);
    }
    
    return data as NotaFiscal;
  } catch (error) {
    console.error('Erro ao criar nota fiscal:', error);
    throw error;
  }
};

/**
 * Creates items for a nota fiscal
 */
export const criarItensNotaFiscal = async (itensNotaFiscal: Partial<ItemNotaFiscal>[]): Promise<ItemNotaFiscal[]> => {
  try {
    if (!itensNotaFiscal.length) return [];
    
    // Ensure all required properties are present for each item
    const itemsWithRequiredProps = itensNotaFiscal.map(item => {
      return {
        codigo_produto: item.codigo_produto || 'N/A',
        descricao: item.descricao || 'N/A',
        quantidade: item.quantidade || 0,
        valor_unitario: item.valor_unitario || 0,
        valor_total: item.valor_total || 0,
        sequencia: item.sequencia || 1,
        nota_fiscal_id: item.nota_fiscal_id,
        // Optional fields
        id: item.id,
        created_at: item.created_at,
        updated_at: item.updated_at
      } as ItemNotaFiscal;
    });
    
    const { data, error } = await supabase
      .from('itens_nota_fiscal')
      .insert(itemsWithRequiredProps)
      .select();
    
    if (error) {
      throw new Error(`Erro ao criar itens da nota fiscal: ${error.message}`);
    }
    
    return data as ItemNotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao criar itens da nota fiscal:', error);
    throw error;
  }
};
