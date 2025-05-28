
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal, ItemNotaFiscal } from "@/types/supabase.types";

/**
 * Creates a new nota fiscal in the database
 */
export const criarNotaFiscal = async (notaFiscal: Partial<NotaFiscal>, itensNotaFiscal?: Partial<ItemNotaFiscal>[]): Promise<NotaFiscal> => {
  try {
    console.log('Criando nota fiscal:', notaFiscal);
    
    // Preparar dados para inserção, garantindo que campos obrigatórios existam
    const notaFiscalToInsert = {
      numero: notaFiscal.numero || '',
      valor_total: notaFiscal.valor_total || 0,
      data_emissao: notaFiscal.data_emissao || new Date().toISOString(),
      status: notaFiscal.status || 'pendente',
      // Campos opcionais
      serie: notaFiscal.serie,
      chave_acesso: notaFiscal.chave_acesso,
      peso_bruto: notaFiscal.peso_bruto,
      quantidade_volumes: notaFiscal.quantidade_volumes,
      data_entrada: notaFiscal.data_entrada,
      data_saida: notaFiscal.data_saida,
      tipo_operacao: notaFiscal.tipo_operacao,
      numero_pedido: notaFiscal.numero_pedido,
      
      // Dados do emitente
      emitente_cnpj: notaFiscal.emitente_cnpj,
      emitente_razao_social: notaFiscal.emitente_razao_social,
      emitente_telefone: notaFiscal.emitente_telefone,
      emitente_uf: notaFiscal.emitente_uf,
      emitente_cidade: notaFiscal.emitente_cidade,
      emitente_bairro: notaFiscal.emitente_bairro,
      emitente_endereco: notaFiscal.emitente_endereco,
      emitente_numero: notaFiscal.emitente_numero,
      emitente_cep: notaFiscal.emitente_cep,
      
      // Dados do destinatário
      destinatario_cnpj: notaFiscal.destinatario_cnpj,
      destinatario_razao_social: notaFiscal.destinatario_razao_social,
      destinatario_telefone: notaFiscal.destinatario_telefone,
      destinatario_uf: notaFiscal.destinatario_uf,
      destinatario_cidade: notaFiscal.destinatario_cidade,
      destinatario_bairro: notaFiscal.destinatario_bairro,
      destinatario_endereco: notaFiscal.destinatario_endereco,
      destinatario_numero: notaFiscal.destinatario_numero,
      destinatario_cep: notaFiscal.destinatario_cep,
      
      // Informações adicionais
      informacoes_complementares: notaFiscal.informacoes_complementares,
      fob_cif: notaFiscal.fob_cif,
      numero_coleta: notaFiscal.numero_coleta,
      valor_coleta: notaFiscal.valor_coleta,
      numero_cte_coleta: notaFiscal.numero_cte_coleta,
      numero_cte_viagem: notaFiscal.numero_cte_viagem,
      data_embarque: notaFiscal.data_embarque,
      status_embarque: notaFiscal.status_embarque,
      responsavel_entrega: notaFiscal.responsavel_entrega,
      quimico: notaFiscal.quimico,
      fracionado: notaFiscal.fracionado,
      motorista: notaFiscal.motorista,
      tempo_armazenamento_horas: notaFiscal.tempo_armazenamento_horas,
      entregue_ao_fornecedor: notaFiscal.entregue_ao_fornecedor,
      observacoes: notaFiscal.observacoes,
      
      // Referências
      remetente_id: notaFiscal.remetente_id,
      destinatario_id: notaFiscal.destinatario_id,
      transportadora_id: notaFiscal.transportadora_id,
      ordem_carregamento_id: notaFiscal.ordem_carregamento_id,
      coleta_id: notaFiscal.coleta_id
    };
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert(notaFiscalToInsert)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao inserir nota fiscal:', error);
      throw new Error(`Erro ao criar nota fiscal: ${error.message}`);
    }
    
    console.log('Nota fiscal criada com sucesso:', data);
    
    // Se houver itens, criar os itens da nota fiscal
    if (itensNotaFiscal && itensNotaFiscal.length > 0) {
      const itensComNotaId = itensNotaFiscal.map(item => ({
        ...item,
        nota_fiscal_id: data.id
      }));
      
      await criarItensNotaFiscal(itensComNotaId);
    }
    
    return data as NotaFiscal;
  } catch (error) {
    console.error('Erro ao criar nota fiscal:', error);
    throw error;
  }
};

/**
 * Creates items for a nota fiscal
 */
export const criarItensNotaFiscal = async (itensNotaFiscal: Partial<ItemNotaFiscal>[]): Promise<ItemNotaFiscal[]> => {
  try {
    if (!itensNotaFiscal.length) return [];
    
    // Garantir que todos os campos obrigatórios existam
    const itemsWithRequiredProps = itensNotaFiscal.map((item, index) => ({
      codigo_produto: item.codigo_produto || `PROD${index + 1}`,
      descricao: item.descricao || 'Produto',
      quantidade: item.quantidade || 0,
      valor_unitario: item.valor_unitario || 0,
      valor_total: item.valor_total || 0,
      sequencia: item.sequencia || index + 1,
      nota_fiscal_id: item.nota_fiscal_id
    }));
    
    const { data, error } = await supabase
      .from('itens_nota_fiscal')
      .insert(itemsWithRequiredProps)
      .select();
    
    if (error) {
      console.error('Erro ao inserir itens da nota fiscal:', error);
      throw new Error(`Erro ao criar itens da nota fiscal: ${error.message}`);
    }
    
    return (data || []) as ItemNotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao criar itens da nota fiscal:', error);
    throw error;
  }
};
