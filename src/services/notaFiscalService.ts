import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal, ItemNotaFiscal } from "@/types/supabase.types";

// Fix in the criarNotaFiscal function
export const criarNotaFiscal = async (notaFiscal: Partial<NotaFiscal>, itensNotaFiscal?: Partial<ItemNotaFiscal>[]): Promise<NotaFiscal> => {
  try {
    // Adjust date handling for toISOString
    if (typeof notaFiscal.data_entrada === 'string') {
      // If it's already a string, keep it as is
      // Note: This assumes the string is already in ISO format
    } else if (notaFiscal.data_entrada instanceof Date) {
      // If it's a Date object, convert to ISO string
      notaFiscal.data_entrada = notaFiscal.data_entrada.toISOString();
    }
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert(notaFiscal)
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

// Fix the criarItensNotaFiscal function
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

export const buscarNotaFiscalPorChave = async (chave: string): Promise<NotaFiscal | null> => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select(`
        *,
        itens:itens_nota_fiscal(*)
      `)
      .eq('chave_acesso', chave)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Não encontrou nenhuma nota fiscal
        return null;
      }
      throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
    }
    
    return data as unknown as NotaFiscal;
  } catch (error: any) {
    console.error('Erro ao buscar nota fiscal:', error);
    throw error;
  }
};

export const buscarNotasFiscais = async (filtros?: {
  status?: string;
  fornecedor?: string;
  dataInicio?: string;
  dataFim?: string;
  termo?: string;
}): Promise<NotaFiscal[]> => {
  try {
    let query = supabase
      .from('notas_fiscais')
      .select(`
        *,
        itens:itens_nota_fiscal(*)
      `);
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.fornecedor) {
      query = query.ilike('fornecedor', `%${filtros.fornecedor}%`);
    }
    
    if (filtros?.dataInicio) {
      query = query.gte('data_entrada', filtros.dataInicio);
    }
    
    if (filtros?.dataFim) {
      query = query.lte('data_entrada', filtros.dataFim);
    }
    
    if (filtros?.termo) {
      query = query.or(`numero.ilike.%${filtros.termo}%,chave_acesso.ilike.%${filtros.termo}%,fornecedor.ilike.%${filtros.termo}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao buscar notas fiscais: ${error.message}`);
    }
    
    return data as unknown as NotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao buscar notas fiscais:', error);
    throw error;
  }
};

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

export const buscarItensNotaFiscal = async (notaFiscalId: string): Promise<ItemNotaFiscal[]> => {
  try {
    const { data, error } = await supabase
      .from('itens_nota_fiscal')
      .select('*')
      .eq('nota_fiscal_id', notaFiscalId);
    
    if (error) {
      throw new Error(`Erro ao buscar itens da nota fiscal: ${error.message}`);
    }
    
    return data as ItemNotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao buscar itens da nota fiscal:', error);
    throw error;
  }
};

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

export const obterEstatisticasNotasFiscais = async (): Promise<any> => {
  try {
    // Total de notas fiscais
    const { count: totalNotas } = await supabase
      .from('notas_fiscais')
      .select('*', { count: 'exact', head: true });
    
    // Notas fiscais por status
    const statusList = ['pendente', 'em_processamento', 'conferida', 'divergente', 'finalizada'];
    const statusCounts = {};
    
    for (const status of statusList) {
      const { count } = await supabase
        .from('notas_fiscais')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);
      
      statusCounts[status] = count || 0;
    }
    
    // Valor total das notas fiscais
    const { data: notasFiscais } = await supabase
      .from('notas_fiscais')
      .select('valor_total');
    
    const valorTotal = notasFiscais?.reduce((acc, nf) => acc + (nf.valor_total || 0), 0) || 0;
    
    return {
      totalNotas,
      statusCounts,
      valorTotal
    };
  } catch (error: any) {
    console.error('Erro ao obter estatísticas de notas fiscais:', error);
    throw error;
  }
};
