
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal, ItemNotaFiscal } from "@/types/supabase.types";

const notaFiscalService = {
  /**
   * Lista todas as notas fiscais
   */
  async listarNotas(filtros?: {
    status?: string;
    tipo?: string;
    dataInicio?: string;
    dataFim?: string;
    termo?: string;
  }): Promise<NotaFiscal[]> {
    let query = supabase
      .from('notas_fiscais')
      .select(`
        *,
        empresa_emitente:empresa_emitente_id(*),
        empresa_destinatario:empresa_destinatario_id(*)
      `);
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    
    if (filtros?.dataInicio) {
      query = query.gte('data_emissao', filtros.dataInicio);
    }
    
    if (filtros?.dataFim) {
      query = query.lte('data_emissao', filtros.dataFim);
    }
    
    if (filtros?.termo) {
      query = query.or(`
        numero.ilike.%${filtros.termo}%,
        chave_acesso.ilike.%${filtros.termo}%
      `);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao listar notas fiscais: ${error.message}`);
    }
    
    return data as NotaFiscal[];
  },

  /**
   * Busca uma nota fiscal pelo ID
   */
  async buscarNotaPorId(id: string): Promise<NotaFiscal> {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select(`
        *,
        empresa_emitente:empresa_emitente_id(*),
        empresa_destinatario:empresa_destinatario_id(*),
        itens:itens_nota_fiscal(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
    }
    
    return data as NotaFiscal;
  },

  /**
   * Registra a entrada de uma nota fiscal
   */
  async registrarEntrada(nota: Partial<NotaFiscal>, itens?: Partial<ItemNotaFiscal>[]): Promise<NotaFiscal> {
    // Iniciar uma transação
    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert({
        ...nota,
        data_entrada: new Date().toISOString(),
        status: 'recebido'
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao registrar entrada de nota fiscal: ${error.message}`);
    }

    // Se tiver itens, cadastra-os
    if (itens && itens.length > 0) {
      const itensComNotaId = itens.map(item => ({
        ...item,
        nota_fiscal_id: data.id
      }));
      
      const { error: errorItens } = await supabase
        .from('itens_nota_fiscal')
        .insert(itensComNotaId);
        
      if (errorItens) {
        throw new Error(`Erro ao registrar itens da nota fiscal: ${errorItens.message}`);
      }
    }
    
    return data as NotaFiscal;
  },

  /**
   * Registra a saída de uma nota fiscal
   */
  async registrarSaida(id: string): Promise<NotaFiscal> {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .update({
        data_saida: new Date().toISOString(),
        status: 'entregue'
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao registrar saída de nota fiscal: ${error.message}`);
    }
    
    return data as NotaFiscal;
  },

  /**
   * Atualiza os dados de uma nota fiscal
   */
  async atualizarNota(id: string, dados: Partial<NotaFiscal>): Promise<NotaFiscal> {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .update(dados)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao atualizar nota fiscal: ${error.message}`);
    }
    
    return data as NotaFiscal;
  },

  /**
   * Calcula métricas de tempo em galpão
   */
  async calcularTempoGalpao(filtros?: {
    dataInicio?: string;
    dataFim?: string;
  }) {
    let query = supabase
      .from('notas_fiscais')
      .select('tempo_armazenamento_horas')
      .not('tempo_armazenamento_horas', 'is', null);
    
    if (filtros?.dataInicio) {
      query = query.gte('data_entrada', filtros.dataInicio);
    }
    
    if (filtros?.dataFim) {
      query = query.lte('data_saida', filtros.dataFim);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao calcular tempo em galpão: ${error.message}`);
    }
    
    const tempos = data.map(item => item.tempo_armazenamento_horas);
    const somaTempo = tempos.reduce((acc, curr) => acc + curr, 0);
    
    return {
      media: tempos.length > 0 ? somaTempo / tempos.length : 0,
      total: somaTempo,
      quantidade: tempos.length
    };
  }
};

export default notaFiscalService;
