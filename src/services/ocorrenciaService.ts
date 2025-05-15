
import { supabase } from "@/integrations/supabase/client";
import { Ocorrencia, ComentarioOcorrencia } from "@/types/supabase.types";

const ocorrenciaService = {
  /**
   * Lista todas as ocorrências
   */
  async listarOcorrencias(filtros?: {
    status?: string;
    tipo?: string;
    prioridade?: string;
    dataInicio?: string;
    dataFim?: string;
    termo?: string;
  }): Promise<Ocorrencia[]> {
    let query = supabase
      .from('ocorrencias')
      .select(`
        *,
        empresa_cliente:empresa_cliente_id(*),
        nota_fiscal:nota_fiscal_id(*),
        usuario_abertura:usuario_abertura_id(*),
        usuario_responsavel:usuario_responsavel_id(*)
      `);
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    
    if (filtros?.prioridade) {
      query = query.eq('prioridade', filtros.prioridade);
    }
    
    if (filtros?.dataInicio) {
      query = query.gte('data_abertura', filtros.dataInicio);
    }
    
    if (filtros?.dataFim) {
      query = query.lte('data_abertura', filtros.dataFim);
    }
    
    if (filtros?.termo) {
      query = query.or(`
        titulo.ilike.%${filtros.termo}%,
        descricao.ilike.%${filtros.termo}%
      `);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao listar ocorrências: ${error.message}`);
    }
    
    return data as Ocorrencia[];
  },

  /**
   * Busca uma ocorrência pelo ID
   */
  async buscarOcorrenciaPorId(id: string): Promise<Ocorrencia> {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select(`
        *,
        empresa_cliente:empresa_cliente_id(*),
        nota_fiscal:nota_fiscal_id(*),
        coleta:coleta_id(*),
        carregamento:carregamento_id(*),
        etiqueta:etiqueta_id(*),
        usuario_abertura:usuario_abertura_id(*),
        usuario_responsavel:usuario_responsavel_id(*),
        comentarios:comentarios_ocorrencia(*, usuario:usuario_id(*))
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(`Erro ao buscar ocorrência: ${error.message}`);
    }
    
    return data as unknown as Ocorrencia;
  },

  /**
   * Cria uma nova ocorrência
   */
  async criarOcorrencia(ocorrencia: Partial<Ocorrencia>): Promise<Ocorrencia> {
    const { data, error } = await supabase
      .from('ocorrencias')
      .insert({
        ...ocorrencia,
        data_abertura: new Date().toISOString(),
        status: 'aberto'
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao criar ocorrência: ${error.message}`);
    }
    
    return data as Ocorrencia;
  },

  /**
   * Atualiza o status de uma ocorrência
   */
  async atualizarStatusOcorrencia(id: string, status: string): Promise<Ocorrencia> {
    const dados: Record<string, any> = { status };
    
    // Se o status for "resolved", registra a data de resolução
    if (status === 'resolved') {
      dados.data_resolucao = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('ocorrencias')
      .update(dados)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao atualizar status da ocorrência: ${error.message}`);
    }
    
    return data as Ocorrencia;
  },

  /**
   * Atribui uma ocorrência a um usuário
   */
  async atribuirOcorrencia(id: string, usuarioId: string): Promise<Ocorrencia> {
    const { data, error } = await supabase
      .from('ocorrencias')
      .update({
        usuario_responsavel_id: usuarioId,
        status: 'in_progress'
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao atribuir ocorrência: ${error.message}`);
    }
    
    return data as Ocorrencia;
  },

  /**
   * Adiciona um comentário a uma ocorrência
   */
  async adicionarComentario(
    ocorrenciaId: string,
    usuarioId: string,
    comentario: string
  ): Promise<ComentarioOcorrencia> {
    const { data, error } = await supabase
      .from('comentarios_ocorrencia')
      .insert({
        ocorrencia_id: ocorrenciaId,
        usuario_id: usuarioId,
        comentario,
        data_comentario: new Date().toISOString()
      })
      .select(`*, usuario:usuario_id(*)`)
      .single();
    
    if (error) {
      throw new Error(`Erro ao adicionar comentário: ${error.message}`);
    }
    
    return data as unknown as ComentarioOcorrencia;
  },

  /**
   * Registra a solução de uma ocorrência
   */
  async registrarSolucao(id: string, solucao: string): Promise<Ocorrencia> {
    const { data, error } = await supabase
      .from('ocorrencias')
      .update({
        solucao,
        status: 'resolved',
        data_resolucao: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao registrar solução: ${error.message}`);
    }
    
    return data as Ocorrencia;
  },

  /**
   * Busca dados para dashboard de ocorrências
   */
  async buscarDashboardOcorrencias() {
    // Total por status
    const { data: totalPorStatus, error: errorStatus } = await supabase
      .from('ocorrencias')
      .select('status, count(*)')
      .group('status');
    
    if (errorStatus) {
      throw new Error(`Erro ao buscar total por status: ${errorStatus.message}`);
    }
    
    // Total por tipo
    const { data: totalPorTipo, error: errorTipo } = await supabase
      .from('ocorrencias')
      .select('tipo, count(*)')
      .group('tipo');
    
    if (errorTipo) {
      throw new Error(`Erro ao buscar total por tipo: ${errorTipo.message}`);
    }
    
    // Total por prioridade
    const { data: totalPorPrioridade, error: errorPrioridade } = await supabase
      .from('ocorrencias')
      .select('prioridade, count(*)')
      .group('prioridade');
    
    if (errorPrioridade) {
      throw new Error(`Erro ao buscar total por prioridade: ${errorPrioridade.message}`);
    }
    
    return {
      totalPorStatus,
      totalPorTipo,
      totalPorPrioridade
    };
  }
};

export default ocorrenciaService;
