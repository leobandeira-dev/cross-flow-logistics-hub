
import { supabase } from "@/integrations/supabase/client";
import { SolicitacaoColeta, Coleta } from "@/types/supabase.types";

const coletaService = {
  /**
   * Lista todas as solicitações de coleta
   */
  async listarSolicitacoes(filtros?: {
    status?: string;
    dataInicio?: string;
    dataFim?: string;
    termo?: string;
  }): Promise<SolicitacaoColeta[]> {
    let query = supabase
      .from('solicitacoes_coleta')
      .select(`
        *,
        empresa_solicitante:empresa_solicitante_id(*)
      `);
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.dataInicio) {
      query = query.gte('data_solicitacao', filtros.dataInicio);
    }
    
    if (filtros?.dataFim) {
      query = query.lte('data_solicitacao', filtros.dataFim);
    }
    
    if (filtros?.termo) {
      query = query.or(`
        numero_solicitacao.ilike.%${filtros.termo}%,
        contato_nome.ilike.%${filtros.termo}%
      `);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao listar solicitações de coleta: ${error.message}`);
    }
    
    return data as SolicitacaoColeta[];
  },

  /**
   * Busca uma solicitação de coleta pelo ID
   */
  async buscarSolicitacaoPorId(id: string): Promise<SolicitacaoColeta> {
    const { data, error } = await supabase
      .from('solicitacoes_coleta')
      .select(`
        *,
        empresa_solicitante:empresa_solicitante_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(`Erro ao buscar solicitação de coleta: ${error.message}`);
    }
    
    return data as SolicitacaoColeta;
  },

  /**
   * Cria uma nova solicitação de coleta
   */
  async criarSolicitacao(solicitacao: Partial<SolicitacaoColeta>): Promise<SolicitacaoColeta> {
    // Gerar número da solicitação
    const numeroSolicitacao = `SOL-${new Date().getTime().toString().substring(5)}`;
    
    const { data, error } = await supabase
      .from('solicitacoes_coleta')
      .insert({
        numero_solicitacao: numeroSolicitacao,
        data_solicitacao: new Date().toISOString(),
        tipo_coleta: solicitacao.tipo_coleta || 'padrao',
        status: 'pendente',
        empresa_solicitante_id: solicitacao.empresa_solicitante_id,
        endereco_coleta: solicitacao.endereco_coleta,
        cidade_coleta: solicitacao.cidade_coleta,
        estado_coleta: solicitacao.estado_coleta,
        cep_coleta: solicitacao.cep_coleta,
        contato_nome: solicitacao.contato_nome,
        contato_telefone: solicitacao.contato_telefone,
        observacoes: solicitacao.observacoes
      } as any)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao criar solicitação de coleta: ${error.message}`);
    }
    
    return data as SolicitacaoColeta;
  },

  /**
   * Aprovar uma solicitação de coleta
   */
  async aprovarSolicitacao(id: string): Promise<SolicitacaoColeta> {
    const { data, error } = await supabase
      .from('solicitacoes_coleta')
      .update({
        status: 'aprovada',
        data_aprovacao: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao aprovar solicitação de coleta: ${error.message}`);
    }
    
    return data as SolicitacaoColeta;
  },

  /**
   * Registrar uma coleta realizada
   */
  async registrarColeta(coleta: Partial<Coleta>): Promise<Coleta> {
    // Gerar número da coleta
    const numeroColeta = `COL-${new Date().getTime().toString().substring(5)}`;
    
    const { data, error } = await supabase
      .from('coletas')
      .insert({
        numero_coleta: numeroColeta,
        solicitacao_id: coleta.solicitacao_id,
        data_realizada: coleta.data_realizada || new Date().toISOString(),
        motorista_id: coleta.motorista_id,
        veiculo_id: coleta.veiculo_id,
        quantidade_volumes: coleta.quantidade_volumes || 0,
        peso_total: coleta.peso_total,
        status: 'coletado',
        observacoes: coleta.observacoes
      } as any)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao registrar coleta: ${error.message}`);
    }
    
    // Se for uma coleta de uma solicitação, atualiza a solicitação
    if (coleta.solicitacao_id) {
      await supabase
        .from('solicitacoes_coleta')
        .update({
          status: 'coletada',
          data_coleta: coleta.data_realizada || new Date().toISOString()
        })
        .eq('id', coleta.solicitacao_id);
    }
    
    return data as Coleta;
  },

  /**
   * Lista as coletas realizadas
   */
  async listarColetas(filtros?: {
    status?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<Coleta[]> {
    let query = supabase
      .from('coletas')
      .select(`
        *,
        solicitacao:solicitacao_id(*),
        motorista:motorista_id(*),
        veiculo:veiculo_id(*)
      `);
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.dataInicio) {
      query = query.gte('data_realizada', filtros.dataInicio);
    }
    
    if (filtros?.dataFim) {
      query = query.lte('data_realizada', filtros.dataFim);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao listar coletas: ${error.message}`);
    }
    
    return data as Coleta[];
  },

  /**
   * Calcula métricas de tempo de coleta
   */
  async calcularTempoColeta(filtros?: {
    dataInicio?: string;
    dataFim?: string;
  }) {
    let query = supabase
      .from('solicitacoes_coleta')
      .select('tempo_aprovacao_coleta_horas')
      .not('tempo_aprovacao_coleta_horas', 'is', null);
    
    if (filtros?.dataInicio) {
      query = query.gte('data_aprovacao', filtros.dataInicio);
    }
    
    if (filtros?.dataFim) {
      query = query.lte('data_coleta', filtros.dataFim);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao calcular tempo de coleta: ${error.message}`);
    }
    
    const tempos = data.map(item => item.tempo_aprovacao_coleta_horas);
    const somaTempo = tempos.reduce((acc, curr) => acc + curr, 0);
    
    return {
      media: tempos.length > 0 ? somaTempo / tempos.length : 0,
      total: somaTempo,
      quantidade: tempos.length
    };
  }
};

export default coletaService;
