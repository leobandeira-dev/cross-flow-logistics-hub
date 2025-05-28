
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
   * Busca todas as etiquetas
   */
  async buscarEtiquetas(): Promise<Etiqueta[]> {
    const { data, error } = await supabase
      .from('etiquetas')
      .select('*')
      .order('data_geracao', { ascending: false });
    
    if (error) {
      throw new Error(`Erro ao buscar etiquetas: ${error.message}`);
    }
    
    return data || [];
  },

  /**
   * Cria uma nova etiqueta
   */
  async criarEtiqueta(etiquetaData: CreateEtiquetaData): Promise<Etiqueta> {
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
  },

  /**
   * Atualiza uma etiqueta existente
   */
  async atualizarEtiqueta(id: string, etiquetaData: Partial<CreateEtiquetaData>): Promise<Etiqueta> {
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
  },

  /**
   * Marca etiqueta como etiquetada (impressa)
   */
  async marcarComoEtiquetada(id: string): Promise<void> {
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
  },

  /**
   * Inutiliza uma etiqueta
   */
  async inutilizarEtiqueta(id: string, dados: InutilizarEtiquetaData): Promise<void> {
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
  },

  /**
   * Cria uma unitização (etiqueta mãe)
   */
  async criarUnitizacao(dados: {
    codigo: string;
    tipo_unitizacao: string;
    observacoes?: string;
  }) {
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
  },

  /**
   * Vincula etiquetas a uma unitização
   */
  async vincularEtiquetasUnitizacao(unitizacaoId: string, etiquetaIds: string[]): Promise<void> {
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
  }
};

export default etiquetaService;
