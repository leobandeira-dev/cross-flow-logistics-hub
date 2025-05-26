
import { supabase } from "@/integrations/supabase/client";
import { OrdemCarregamento } from "@/types/supabase.types";

interface CreateOrdemCarregamentoData {
  numero_ordem?: string;
  tipo_carregamento: string;
  data_programada?: string;
  empresa_cliente_id?: string;
  motorista_id?: string;
  veiculo_id?: string;
  observacoes?: string;
  status?: string;
}

/**
 * Cria uma nova ordem de carregamento
 */
export const criarOrdemCarregamento = async (data: CreateOrdemCarregamentoData): Promise<OrdemCarregamento> => {
  try {
    console.log('Criando ordem de carregamento:', data);
    
    const insertData = {
      numero_ordem: data.numero_ordem || `OC-${Date.now()}`,
      tipo_carregamento: data.tipo_carregamento,
      data_programada: data.data_programada || null,
      empresa_cliente_id: data.empresa_cliente_id || null,
      motorista_id: data.motorista_id || null,
      veiculo_id: data.veiculo_id || null,
      observacoes: data.observacoes || null,
      status: data.status || 'pendente'
    };

    const { data: ordem, error } = await supabase
      .from('ordens_carregamento')
      .insert(insertData)
      .select(`
        *,
        empresa_cliente:empresas!empresa_cliente_id(*),
        motorista:motoristas(*),
        veiculo:veiculos(*)
      `)
      .single();
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao criar ordem de carregamento: ${error.message}`);
    }
    
    console.log('Ordem de carregamento criada com sucesso:', ordem);
    return ordem as OrdemCarregamento;
  } catch (error: any) {
    console.error('Erro ao criar ordem de carregamento:', error);
    throw error;
  }
};

/**
 * Busca todas as ordens de carregamento
 */
export const buscarOrdensCarregamento = async (filtros?: {
  status?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
}): Promise<OrdemCarregamento[]> => {
  try {
    let query = supabase
      .from('ordens_carregamento')
      .select(`
        *,
        empresa_cliente:empresas!empresa_cliente_id(*),
        motorista:motoristas(*),
        veiculo:veiculos(*)
      `)
      .order('created_at', { ascending: false });

    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }

    if (filtros?.tipo) {
      query = query.eq('tipo_carregamento', filtros.tipo);
    }

    if (filtros?.dataInicio) {
      query = query.gte('data_programada', filtros.dataInicio);
    }

    if (filtros?.dataFim) {
      query = query.lte('data_programada', filtros.dataFim);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar ordens de carregamento:', error);
      throw new Error(`Erro ao buscar ordens de carregamento: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar ordens de carregamento:', error);
    throw error;
  }
};

/**
 * Busca ordem de carregamento por ID
 */
export const buscarOrdemCarregamentoPorId = async (id: string): Promise<OrdemCarregamento | null> => {
  try {
    const { data, error } = await supabase
      .from('ordens_carregamento')
      .select(`
        *,
        empresa_cliente:empresas!empresa_cliente_id(*),
        motorista:motoristas(*),
        veiculo:veiculos(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar ordem de carregamento por ID:', error);
      throw new Error(`Erro ao buscar ordem de carregamento: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao buscar ordem de carregamento por ID:', error);
    throw error;
  }
};

/**
 * Atualiza uma ordem de carregamento
 */
export const atualizarOrdemCarregamento = async (id: string, data: Partial<CreateOrdemCarregamentoData>): Promise<OrdemCarregamento> => {
  try {
    console.log('Atualizando ordem de carregamento:', id, data);
    
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };

    const { data: ordem, error } = await supabase
      .from('ordens_carregamento')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        empresa_cliente:empresas!empresa_cliente_id(*),
        motorista:motoristas(*),
        veiculo:veiculos(*)
      `)
      .single();
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao atualizar ordem de carregamento: ${error.message}`);
    }
    
    console.log('Ordem de carregamento atualizada com sucesso:', ordem);
    return ordem as OrdemCarregamento;
  } catch (error: any) {
    console.error('Erro ao atualizar ordem de carregamento:', error);
    throw error;
  }
};

/**
 * Exclui uma ordem de carregamento
 */
export const excluirOrdemCarregamento = async (id: string): Promise<void> => {
  try {
    console.log('Excluindo ordem de carregamento:', id);
    
    const { error } = await supabase
      .from('ordens_carregamento')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao excluir ordem de carregamento: ${error.message}`);
    }
    
    console.log('Ordem de carregamento excluída com sucesso');
  } catch (error: any) {
    console.error('Erro ao excluir ordem de carregamento:', error);
    throw error;
  }
};
