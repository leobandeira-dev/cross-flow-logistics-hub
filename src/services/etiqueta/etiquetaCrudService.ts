
import { supabase } from "@/integrations/supabase/client";

export interface EtiquetaData {
  id?: string;
  codigo: string;
  tipo: 'volume' | 'mae';
  data_geracao: string;
  altura?: number;
  largura?: number;
  comprimento?: number;
  peso?: number;
  fragil?: boolean;
  nota_fiscal_id?: string;
  etiqueta_mae_id?: string;
  status: 'gerada' | 'impressa' | 'entregue';
  dados_json?: any;
}

/**
 * Service for CRUD operations on etiquetas
 */
const etiquetaCrudService = {
  /**
   * Criar uma nova etiqueta no banco
   */
  async criarEtiqueta(etiquetaData: Partial<EtiquetaData>): Promise<EtiquetaData> {
    try {
      const { data, error } = await supabase
        .from('etiquetas')
        .insert({
          codigo: etiquetaData.codigo || `ETQ-${Date.now()}`,
          tipo: etiquetaData.tipo || 'volume',
          data_geracao: new Date().toISOString(),
          altura: etiquetaData.altura,
          largura: etiquetaData.largura,
          comprimento: etiquetaData.comprimento,
          peso: etiquetaData.peso,
          fragil: etiquetaData.fragil || false,
          nota_fiscal_id: etiquetaData.nota_fiscal_id,
          etiqueta_mae_id: etiquetaData.etiqueta_mae_id,
          status: etiquetaData.status || 'gerada',
          dados_json: etiquetaData.dados_json
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar etiqueta: ${error.message}`);
      }

      console.log('Etiqueta criada no banco:', data);
      return data;
    } catch (error) {
      console.error('Erro ao criar etiqueta:', error);
      throw error;
    }
  },

  /**
   * Buscar etiquetas por nota fiscal
   */
  async buscarEtiquetasPorNotaFiscal(notaFiscalId: string): Promise<EtiquetaData[]> {
    try {
      const { data, error } = await supabase
        .from('etiquetas')
        .select('*')
        .eq('nota_fiscal_id', notaFiscalId);

      if (error) {
        throw new Error(`Erro ao buscar etiquetas: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar etiquetas:', error);
      throw error;
    }
  },

  /**
   * Atualizar status de etiquetas
   */
  async atualizarStatusEtiquetas(etiquetaIds: string[], novoStatus: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('etiquetas')
        .update({ status: novoStatus })
        .in('id', etiquetaIds);

      if (error) {
        throw new Error(`Erro ao atualizar status das etiquetas: ${error.message}`);
      }

      console.log(`Status das etiquetas atualizado para: ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status das etiquetas:', error);
      throw error;
    }
  },

  /**
   * Criar múltiplas etiquetas de volume para uma nota fiscal
   */
  async criarEtiquetasVolumes(volumes: any[], notaFiscalId: string): Promise<EtiquetaData[]> {
    try {
      const etiquetasData = volumes.map(volume => ({
        codigo: volume.id,
        tipo: 'volume' as const,
        data_geracao: new Date().toISOString(),
        nota_fiscal_id: notaFiscalId,
        status: 'gerada' as const,
        dados_json: {
          volumeData: volume,
          tipoVolume: volume.tipoVolume || 'geral',
          codigoONU: volume.codigoONU,
          codigoRisco: volume.codigoRisco,
          classificacaoQuimica: volume.classificacaoQuimica
        }
      }));

      const { data, error } = await supabase
        .from('etiquetas')
        .insert(etiquetasData)
        .select();

      if (error) {
        throw new Error(`Erro ao criar etiquetas de volumes: ${error.message}`);
      }

      console.log(`${data.length} etiquetas de volume criadas no banco`);
      return data;
    } catch (error) {
      console.error('Erro ao criar etiquetas de volumes:', error);
      throw error;
    }
  },

  /**
   * Criar etiqueta mãe
   */
  async criarEtiquetaMae(etiquetaMaeData: any): Promise<EtiquetaData> {
    try {
      const { data, error } = await supabase
        .from('etiquetas')
        .insert({
          codigo: etiquetaMaeData.id || `MAE-${Date.now()}`,
          tipo: 'mae',
          data_geracao: new Date().toISOString(),
          status: 'gerada',
          dados_json: {
            tipoEtiquetaMae: etiquetaMaeData.tipoEtiquetaMae,
            descricao: etiquetaMaeData.descricao,
            quantidade: etiquetaMaeData.quantidade
          }
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar etiqueta mãe: ${error.message}`);
      }

      console.log('Etiqueta mãe criada no banco:', data);
      return data;
    } catch (error) {
      console.error('Erro ao criar etiqueta mãe:', error);
      throw error;
    }
  }
};

export default etiquetaCrudService;
