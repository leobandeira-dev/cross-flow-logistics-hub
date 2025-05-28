
import { supabase } from "@/integrations/supabase/client";
import { Etiqueta } from "@/types/supabase/armazem.types";

export interface CreateEtiquetaData {
  codigo: string;
  tipo: string;
  area?: string;
  remetente?: string;
  destinatario?: string;
  endereco?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  descricao?: string;
  transportadora?: string;
  chave_nf?: string;
  quantidade?: number;
  peso_total_bruto?: string;
  numero_pedido?: string;
  volume_numero?: number;
  total_volumes?: number;
  codigo_onu?: string;
  codigo_risco?: string;
  classificacao_quimica?: string;
  etiqueta_mae_id?: string;
  status?: string;
}

export interface InutilizarEtiquetaData {
  motivo_inutilizacao: string;
  usuario_inutilizacao_id?: string;
}

const etiquetaService = {
  /**
   * Busca todas as etiquetas (READ)
   */
  async buscarEtiquetas(): Promise<Etiqueta[]> {
    try {
      const { data, error } = await supabase
        .from('etiquetas')
        .select('*')
        .order('data_geracao', { ascending: false });
      
      if (error) {
        throw new Error(`Erro ao buscar etiquetas: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro no serviço buscarEtiquetas:', error);
      throw error;
    }
  },

  /**
   * Busca uma etiqueta por ID (READ)
   */
  async buscarEtiquetaPorId(id: string): Promise<Etiqueta> {
    try {
      const { data, error } = await supabase
        .from('etiquetas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(`Erro ao buscar etiqueta por ID: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erro no serviço buscarEtiquetaPorId:', error);
      throw error;
    }
  },

  /**
   * Busca etiquetas por código (READ)
   */
  async buscarEtiquetasPorCodigo(codigo: string): Promise<Etiqueta[]> {
    try {
      const { data, error } = await supabase
        .from('etiquetas')
        .select('*')
        .ilike('codigo', `%${codigo}%`)
        .order('data_geracao', { ascending: false });
      
      if (error) {
        throw new Error(`Erro ao buscar etiquetas por código: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro no serviço buscarEtiquetasPorCodigo:', error);
      throw error;
    }
  },

  /**
   * Cria uma nova etiqueta (CREATE)
   */
  async criarEtiqueta(etiquetaData: CreateEtiquetaData): Promise<Etiqueta> {
    try {
      // Validações antes de criar
      if (!etiquetaData.codigo) {
        throw new Error('Código da etiqueta é obrigatório');
      }
      
      if (!etiquetaData.tipo) {
        throw new Error('Tipo da etiqueta é obrigatório');
      }

      const { data, error } = await supabase
        .from('etiquetas')
        .insert({
          ...etiquetaData,
          status: etiquetaData.status || 'gerada',
          data_geracao: new Date().toISOString(),
          etiquetado: false
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(`Erro ao criar etiqueta: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erro no serviço criarEtiqueta:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma etiqueta existente (UPDATE)
   */
  async atualizarEtiqueta(id: string, etiquetaData: Partial<CreateEtiquetaData>): Promise<Etiqueta> {
    try {
      // Validação de ID
      if (!id) {
        throw new Error('ID da etiqueta é obrigatório para atualização');
      }

      // Verificar se a etiqueta existe
      const etiquetaExistente = await this.buscarEtiquetaPorId(id);
      if (!etiquetaExistente) {
        throw new Error('Etiqueta não encontrada');
      }

      const { data, error } = await supabase
        .from('etiquetas')
        .update({
          ...etiquetaData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Erro ao atualizar etiqueta: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erro no serviço atualizarEtiqueta:', error);
      throw error;
    }
  },

  /**
   * Exclui uma etiqueta (DELETE)
   */
  async excluirEtiqueta(id: string): Promise<void> {
    try {
      // Validação de ID
      if (!id) {
        throw new Error('ID da etiqueta é obrigatório para exclusão');
      }

      // Verificar se a etiqueta existe
      const etiquetaExistente = await this.buscarEtiquetaPorId(id);
      if (!etiquetaExistente) {
        throw new Error('Etiqueta não encontrada');
      }

      // Verificar se a etiqueta pode ser excluída (não está etiquetada)
      if (etiquetaExistente.etiquetado) {
        throw new Error('Não é possível excluir uma etiqueta que já foi impressa. Use a função de inutilizar.');
      }

      const { error } = await supabase
        .from('etiquetas')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Erro ao excluir etiqueta: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro no serviço excluirEtiqueta:', error);
      throw error;
    }
  },

  /**
   * Marca etiqueta como etiquetada (impressa) (UPDATE)
   */
  async marcarComoEtiquetada(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('ID da etiqueta é obrigatório');
      }

      const { error } = await supabase
        .from('etiquetas')
        .update({
          status: 'etiquetada',
          etiquetado: true,
          data_impressao: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        throw new Error(`Erro ao marcar etiqueta como etiquetada: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro no serviço marcarComoEtiquetada:', error);
      throw error;
    }
  },

  /**
   * Inutiliza uma etiqueta (UPDATE)
   */
  async inutilizarEtiqueta(id: string, dados: InutilizarEtiquetaData): Promise<void> {
    try {
      if (!id) {
        throw new Error('ID da etiqueta é obrigatório');
      }

      if (!dados.motivo_inutilizacao) {
        throw new Error('Motivo de inutilização é obrigatório');
      }

      const { error } = await supabase
        .from('etiquetas')
        .update({
          status: 'inutilizada',
          motivo_inutilizacao: dados.motivo_inutilizacao,
          data_inutilizacao: new Date().toISOString(),
          usuario_inutilizacao_id: dados.usuario_inutilizacao_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        throw new Error(`Erro ao inutilizar etiqueta: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro no serviço inutilizarEtiqueta:', error);
      throw error;
    }
  },

  /**
   * Cria uma unitização (etiqueta mãe) (CREATE)
   */
  async criarUnitizacao(dados: {
    codigo: string;
    tipo_unitizacao: string;
    observacoes?: string;
  }) {
    try {
      if (!dados.codigo) {
        throw new Error('Código da unitização é obrigatório');
      }

      if (!dados.tipo_unitizacao) {
        throw new Error('Tipo de unitização é obrigatório');
      }

      const { data, error } = await supabase
        .from('unitizacoes')
        .insert({
          ...dados,
          data_unitizacao: new Date().toISOString(),
          status: 'ativo'
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(`Erro ao criar unitização: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erro no serviço criarUnitizacao:', error);
      throw error;
    }
  },

  /**
   * Vincula etiquetas a uma unitização (CREATE)
   */
  async vincularEtiquetasUnitizacao(unitizacaoId: string, etiquetaIds: string[]): Promise<void> {
    try {
      if (!unitizacaoId) {
        throw new Error('ID da unitização é obrigatório');
      }

      if (!etiquetaIds || etiquetaIds.length === 0) {
        throw new Error('Lista de IDs de etiquetas é obrigatória');
      }

      const vinculos = etiquetaIds.map(etiquetaId => ({
        unitizacao_id: unitizacaoId,
        etiqueta_id: etiquetaId,
        data_inclusao: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('etiquetas_unitizacao')
        .insert(vinculos);
      
      if (error) {
        throw new Error(`Erro ao vincular etiquetas à unitização: ${error.message}`);
      }

      // Atualizar status das etiquetas para unitizadas
      const { error: updateError } = await supabase
        .from('etiquetas')
        .update({
          status: 'unitizada',
          etiqueta_mae_id: unitizacaoId,
          updated_at: new Date().toISOString()
        })
        .in('id', etiquetaIds);

      if (updateError) {
        throw new Error(`Erro ao atualizar status das etiquetas: ${updateError.message}`);
      }
    } catch (error) {
      console.error('Erro no serviço vincularEtiquetasUnitizacao:', error);
      throw error;
    }
  }
};

export default etiquetaService;
