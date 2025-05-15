
import { supabase } from "@/integrations/supabase/client";
import { Etiqueta, Unitizacao, Localizacao, Movimentacao } from "@/types/supabase.types";

const etiquetaService = {
  /**
   * Lista todas as etiquetas
   */
  async listarEtiquetas(filtros?: {
    tipo?: string;
    status?: string;
    termo?: string;
  }): Promise<Etiqueta[]> {
    let query = supabase
      .from('etiquetas')
      .select(`
        *,
        nota_fiscal:nota_fiscal_id(*),
        etiqueta_mae:etiqueta_mae_id(*)
      `);
    
    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.termo) {
      query = query.ilike('codigo', `%${filtros.termo}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao listar etiquetas: ${error.message}`);
    }
    
    return data as Etiqueta[];
  },

  /**
   * Busca uma etiqueta pelo código
   */
  async buscarEtiquetaPorCodigo(codigo: string): Promise<Etiqueta> {
    const { data, error } = await supabase
      .from('etiquetas')
      .select(`
        *,
        nota_fiscal:nota_fiscal_id(*),
        etiqueta_mae:etiqueta_mae_id(*)
      `)
      .eq('codigo', codigo)
      .single();
    
    if (error) {
      throw new Error(`Erro ao buscar etiqueta: ${error.message}`);
    }
    
    return data as Etiqueta;
  },

  /**
   * Cria uma nova etiqueta
   */
  async criarEtiqueta(etiqueta: Partial<Etiqueta>): Promise<Etiqueta> {
    // Gerar código único para a etiqueta se não foi fornecido
    const codigo = etiqueta.codigo || `ETQ-${new Date().getTime().toString().substring(5)}`;
    
    const { data, error } = await supabase
      .from('etiquetas')
      .insert({
        codigo,
        tipo: etiqueta.tipo || 'volume',
        data_geracao: new Date().toISOString(),
        altura: etiqueta.altura,
        largura: etiqueta.largura,
        comprimento: etiqueta.comprimento,
        peso: etiqueta.peso,
        fragil: etiqueta.fragil || false,
        nota_fiscal_id: etiqueta.nota_fiscal_id,
        etiqueta_mae_id: etiqueta.etiqueta_mae_id,
        status: 'gerada'
      } as any)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao criar etiqueta: ${error.message}`);
    }
    
    return data as Etiqueta;
  },

  /**
   * Cria uma etiqueta mãe
   */
  async criarEtiquetaMae(etiqueta: Partial<Etiqueta>): Promise<Etiqueta> {
    // Gerar código único para a etiqueta mãe
    const codigo = `ETQM-${new Date().getTime().toString().substring(5)}`;
    
    const { data, error } = await supabase
      .from('etiquetas')
      .insert({
        ...etiqueta,
        codigo,
        tipo: 'etiqueta_mae',
        data_geracao: new Date().toISOString(),
        status: 'gerada'
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao criar etiqueta mãe: ${error.message}`);
    }
    
    return data as Etiqueta;
  },

  /**
   * Vincula uma etiqueta a uma etiqueta mãe
   */
  async vincularEtiquetaMae(etiquetaId: string, etiquetaMaeId: string): Promise<Etiqueta> {
    const { data, error } = await supabase
      .from('etiquetas')
      .update({
        etiqueta_mae_id: etiquetaMaeId
      })
      .eq('id', etiquetaId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao vincular etiqueta mãe: ${error.message}`);
    }
    
    return data as Etiqueta;
  },

  /**
   * Registra a unitização de etiquetas (agrupamento)
   */
  async unitizarEtiquetas(
    etiquetasIds: string[],
    dadosUnitizacao: Partial<Unitizacao>
  ): Promise<{ unitizacao: Unitizacao; etiquetas: Etiqueta[] }> {
    // Gerar código único para unitização
    const codigo = `UNIT-${new Date().getTime().toString().substring(5)}`;
    
    // Criar a unitização
    const { data: unitizacao, error: errorUnitizacao } = await supabase
      .from('unitizacoes')
      .insert({
        ...dadosUnitizacao,
        codigo,
        data_unitizacao: new Date().toISOString(),
        status: 'ativo'
      })
      .select()
      .single();
    
    if (errorUnitizacao) {
      throw new Error(`Erro ao criar unitização: ${errorUnitizacao.message}`);
    }
    
    // Vincular etiquetas à unitização
    const vinculacoes = etiquetasIds.map(etiquetaId => ({
      etiqueta_id: etiquetaId,
      unitizacao_id: unitizacao.id
    }));
    
    const { error: errorVinculo } = await supabase
      .from('etiquetas_unitizacao')
      .insert(vinculacoes);
    
    if (errorVinculo) {
      throw new Error(`Erro ao vincular etiquetas à unitização: ${errorVinculo.message}`);
    }
    
    // Atualizar status das etiquetas
    const { data: etiquetas, error: errorEtiquetas } = await supabase
      .from('etiquetas')
      .update({
        status: 'unitizada'
      })
      .in('id', etiquetasIds)
      .select();
    
    if (errorEtiquetas) {
      throw new Error(`Erro ao atualizar status das etiquetas: ${errorEtiquetas.message}`);
    }
    
    return {
      unitizacao: unitizacao as Unitizacao,
      etiquetas: etiquetas as Etiqueta[]
    };
  },

  /**
   * Registra a movimentação de uma etiqueta
   */
  async registrarMovimentacao(
    etiquetaId: string,
    localizacaoOrigemId: string | null,
    localizacaoDestinoId: string,
    tipoMovimentacao: string,
    observacoes?: string
  ): Promise<Movimentacao> {
    const { data, error } = await supabase
      .from('movimentacoes')
      .insert({
        etiqueta_id: etiquetaId,
        localizacao_origem_id: localizacaoOrigemId,
        localizacao_destino_id: localizacaoDestinoId,
        tipo_movimentacao: tipoMovimentacao,
        data_movimentacao: new Date().toISOString(),
        observacoes
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao registrar movimentação: ${error.message}`);
    }
    
    // Atualizar o status da localização de destino
    await supabase
      .from('localizacoes')
      .update({
        ocupado: true
      })
      .eq('id', localizacaoDestinoId);
    
    // Se tiver origem, atualizar status dela também
    if (localizacaoOrigemId) {
      const { count } = await supabase
        .from('movimentacoes')
        .select('*', { count: 'exact', head: true })
        .eq('localizacao_destino_id', localizacaoOrigemId);
      
      // Se não houver mais volumes nesta localização, marca como desocupada
      if (count === 0) {
        await supabase
          .from('localizacoes')
          .update({
            ocupado: false
          })
          .eq('id', localizacaoOrigemId);
      }
    }
    
    return data as Movimentacao;
  },

  /**
   * Busca o histórico de movimentações de uma etiqueta
   */
  async buscarHistoricoMovimentacoes(etiquetaId: string): Promise<Movimentacao[]> {
    const { data, error } = await supabase
      .from('movimentacoes')
      .select(`
        *,
        etiqueta:etiqueta_id(*),
        localizacao_origem:localizacao_origem_id(*),
        localizacao_destino:localizacao_destino_id(*),
        usuario:usuario_id(*)
      `)
      .eq('etiqueta_id', etiquetaId)
      .order('data_movimentacao', { ascending: false });
    
    if (error) {
      throw new Error(`Erro ao buscar histórico de movimentações: ${error.message}`);
    }
    
    return data as Movimentacao[];
  },

  /**
   * Busca a localização atual de uma etiqueta
   */
  async buscarLocalizacaoAtual(etiquetaId: string): Promise<Localizacao | null> {
    const { data, error } = await supabase
      .from('movimentacoes')
      .select(`
        localizacao_destino:localizacao_destino_id(*)
      `)
      .eq('etiqueta_id', etiquetaId)
      .order('data_movimentacao', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Não encontrou nenhuma movimentação
        return null;
      }
      throw new Error(`Erro ao buscar localização atual: ${error.message}`);
    }
    
    return data.localizacao_destino as Localizacao;
  }
};

export default etiquetaService;
