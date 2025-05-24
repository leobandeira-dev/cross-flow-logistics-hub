
import { supabase } from "@/integrations/supabase/client";
import { Empresa } from "@/types/supabase/empresa.types";

interface CreateEmpresaData {
  razao_social: string;
  nome_fantasia?: string;
  cnpj?: string;
  tipo: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  status?: string;
}

/**
 * Cria uma nova empresa
 */
export const criarEmpresa = async (data: CreateEmpresaData): Promise<Empresa> => {
  try {
    console.log('Criando empresa:', data);
    
    if (!data.razao_social) {
      throw new Error('Razão social é obrigatória');
    }
    
    if (!data.tipo) {
      throw new Error('Tipo da empresa é obrigatório');
    }

    const insertData = {
      razao_social: data.razao_social,
      nome_fantasia: data.nome_fantasia || null,
      cnpj: data.cnpj || null,
      tipo: data.tipo,
      email: data.email || null,
      telefone: data.telefone || null,
      endereco: data.endereco || null,
      cidade: data.cidade || null,
      estado: data.estado || null,
      cep: data.cep || null,
      status: data.status || 'ativo'
    };

    const { data: empresa, error } = await supabase
      .from('empresas')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao criar empresa: ${error.message}`);
    }
    
    console.log('Empresa criada com sucesso:', empresa);
    return empresa as Empresa;
  } catch (error: any) {
    console.error('Erro ao criar empresa:', error);
    throw error;
  }
};

/**
 * Busca todas as empresas
 */
export const buscarEmpresas = async (filtros?: {
  tipo?: string;
  status?: string;
}): Promise<Empresa[]> => {
  try {
    let query = supabase
      .from('empresas')
      .select('*')
      .order('razao_social', { ascending: true });

    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }

    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar empresas:', error);
      throw new Error(`Erro ao buscar empresas: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar empresas:', error);
    throw error;
  }
};

/**
 * Busca empresa por ID
 */
export const buscarEmpresaPorId = async (id: string): Promise<Empresa | null> => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar empresa por ID:', error);
      throw new Error(`Erro ao buscar empresa: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao buscar empresa por ID:', error);
    throw error;
  }
};

/**
 * Atualiza uma empresa
 */
export const atualizarEmpresa = async (id: string, data: Partial<CreateEmpresaData>): Promise<Empresa> => {
  try {
    console.log('Atualizando empresa:', id, data);
    
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };

    const { data: empresa, error } = await supabase
      .from('empresas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao atualizar empresa: ${error.message}`);
    }
    
    console.log('Empresa atualizada com sucesso:', empresa);
    return empresa as Empresa;
  } catch (error: any) {
    console.error('Erro ao atualizar empresa:', error);
    throw error;
  }
};

/**
 * Exclui uma empresa
 */
export const excluirEmpresa = async (id: string): Promise<void> => {
  try {
    console.log('Excluindo empresa:', id);
    
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw new Error(`Erro ao excluir empresa: ${error.message}`);
    }
    
    console.log('Empresa excluída com sucesso');
  } catch (error: any) {
    console.error('Erro ao excluir empresa:', error);
    throw error;
  }
};
