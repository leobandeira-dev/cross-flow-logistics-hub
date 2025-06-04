
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface DuplicateCheckResult {
  hasDuplicates: boolean;
  existingVolumes: number;
  volumes: Array<{
    id: string;
    codigo: string;
    volume_numero: number;
    status: string;
    data_geracao: string;
  }>;
}

export interface AtomicEtiquetaData {
  nota_fiscal_id: string;
  numero_volumes: number;
  tipo_etiqueta: string;
  informacoes_adicionais?: string;
  id_empresa: string;
  criado_por_usuario_id: string;
  area?: string;
  remetente?: string;
  destinatario?: string;
  endereco?: string;
  cidade?: string;
  uf?: string;
  transportadora?: string;
  chave_nf?: string;
  peso_total_bruto?: string;
  numero_pedido?: string;
  codigo_onu?: string;
  codigo_risco?: string;
  classificacao_quimica?: string;
}

/**
 * Serviço para persistência atômica de etiquetas com verificação de duplicidade
 */
export const etiquetaAtomicService = {
  /**
   * Verifica se já existem etiquetas para uma nota fiscal específica
   */
  async verificarDuplicidade(notaFiscalId: string): Promise<DuplicateCheckResult> {
    try {
      console.log('🔍 Verificando duplicidade para NF:', notaFiscalId);
      
      const { data: existingEtiquetas, error } = await supabase
        .from('etiquetas')
        .select('id, codigo, volume_numero, status, data_geracao')
        .eq('nota_fiscal_id', notaFiscalId)
        .order('volume_numero', { ascending: true });

      if (error) {
        throw new Error(`Erro ao verificar duplicidade: ${error.message}`);
      }

      const result: DuplicateCheckResult = {
        hasDuplicates: existingEtiquetas && existingEtiquetas.length > 0,
        existingVolumes: existingEtiquetas?.length || 0,
        volumes: existingEtiquetas || []
      };

      console.log('📊 Resultado da verificação de duplicidade:', result);
      return result;

    } catch (error) {
      console.error('❌ Erro na verificação de duplicidade:', error);
      throw error;
    }
  },

  /**
   * Persiste etiquetas de forma atômica no banco de dados
   */
  async persistirEtiquetasAtomicamente(dados: AtomicEtiquetaData): Promise<Array<any>> {
    try {
      console.log('💾 Iniciando persistência atômica para', dados.numero_volumes, 'volumes');
      
      // Preparar dados das etiquetas
      const etiquetasParaInserir = [];
      
      for (let i = 1; i <= dados.numero_volumes; i++) {
        const codigoEtiqueta = `ETQ-${new Date().getTime()}-${i.toString().padStart(3, '0')}`;
        
        const etiquetaData = {
          codigo: codigoEtiqueta,
          nota_fiscal_id: dados.nota_fiscal_id,
          tipo: 'volume',
          tipo_etiqueta: dados.tipo_etiqueta,
          volume_numero: i,
          total_volumes: dados.numero_volumes,
          informacoes_adicionais: dados.informacoes_adicionais,
          id_empresa: dados.id_empresa,
          criado_por_usuario_id: dados.criado_por_usuario_id,
          area: dados.area,
          remetente: dados.remetente,
          destinatario: dados.destinatario,
          endereco: dados.endereco,
          cidade: dados.cidade,
          uf: dados.uf,
          transportadora: dados.transportadora,
          chave_nf: dados.chave_nf,
          peso_total_bruto: dados.peso_total_bruto,
          numero_pedido: dados.numero_pedido,
          codigo_onu: dados.codigo_onu,
          codigo_risco: dados.codigo_risco,
          classificacao_quimica: dados.classificacao_quimica,
          status: 'gerada',
          data_geracao: new Date().toISOString(),
          quantidade: 1,
          fragil: false,
          etiquetado: false
        };
        
        etiquetasParaInserir.push(etiquetaData);
      }

      console.log('📋 Dados preparados para inserção:', etiquetasParaInserir.length, 'etiquetas');

      // Inserção atômica usando transação
      const { data: etiquetasInseridas, error } = await supabase
        .from('etiquetas')
        .insert(etiquetasParaInserir)
        .select();

      if (error) {
        console.error('❌ Erro na inserção atômica:', error);
        throw new Error(`Erro ao salvar etiquetas no banco de dados: ${error.message}`);
      }

      if (!etiquetasInseridas || etiquetasInseridas.length !== dados.numero_volumes) {
        throw new Error(`Erro: Esperado ${dados.numero_volumes} etiquetas, mas foram inseridas ${etiquetasInseridas?.length || 0}`);
      }

      console.log('✅ Persistência atômica concluída:', etiquetasInseridas.length, 'etiquetas salvas');
      
      return etiquetasInseridas;

    } catch (error) {
      console.error('❌ Falha na persistência atômica:', error);
      throw error;
    }
  },

  /**
   * Fluxo completo: verifica duplicidade + solicita confirmação + persiste atomicamente
   */
  async executarFluxoCompletoComConfirmacao(
    dados: AtomicEtiquetaData,
    onConfirmacao?: () => Promise<boolean>
  ): Promise<Array<any> | null> {
    try {
      // 1. Verificar duplicidade
      const verificacao = await this.verificarDuplicidade(dados.nota_fiscal_id);
      
      // 2. Se há duplicatas, solicitar confirmação
      if (verificacao.hasDuplicates) {
        const mensagem = `A Nota Fiscal já possui ${verificacao.existingVolumes} volume(s) previamente gerado(s).`;
        
        toast({
          title: "⚠️ Volumes Existentes Encontrados",
          description: mensagem,
          variant: "default"
        });

        // Se há callback de confirmação, usá-lo
        if (onConfirmacao) {
          const confirmar = await onConfirmacao();
          if (!confirmar) {
            console.log('ℹ️ Usuário cancelou a geração de novas etiquetas');
            return null;
          }
        }
      }

      // 3. Prosseguir com persistência atômica
      const etiquetasGeradas = await this.persistirEtiquetasAtomicamente(dados);
      
      toast({
        title: "✅ Etiquetas Geradas com Sucesso",
        description: `${etiquetasGeradas.length} etiqueta(s) foram salvas no banco de dados.`,
      });

      return etiquetasGeradas;

    } catch (error) {
      console.error('❌ Erro no fluxo completo:', error);
      
      toast({
        title: "❌ Erro na Geração de Etiquetas",
        description: `Falha na persistência: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
      
      throw error;
    }
  }
};
