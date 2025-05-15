
import { supabase } from "@/integrations/supabase/client";
import { Etiqueta, Unitizacao } from "@/types/supabase.types";

/**
 * Service for unitization operations
 */
const unitizacaoService = {
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
        codigo,
        data_unitizacao: new Date().toISOString(),
        status: 'ativo',
        tipo_unitizacao: dadosUnitizacao.tipo_unitizacao || 'palete',
        usuario_id: dadosUnitizacao.usuario_id,
        localizacao_id: dadosUnitizacao.localizacao_id
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
  }
};

export default unitizacaoService;
