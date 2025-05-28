
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
      // Campos obrigatórios
      numero: notaFiscal.numero || '',
      valor_total: Number(notaFiscal.valor_total) || 0,
      data_emissao: notaFiscal.data_emissao || new Date().toISOString(),
      status: notaFiscal.status || 'pendente',
      
      // Campos básicos da NF
      serie: notaFiscal.serie || null,
      chave_acesso: notaFiscal.chave_acesso || null,
      peso_bruto: notaFiscal.peso_bruto ? Number(notaFiscal.peso_bruto) : null,
      quantidade_volumes: notaFiscal.quantidade_volumes ? Number(notaFiscal.quantidade_volumes) : null,
      data_entrada: notaFiscal.data_entrada || null,
      data_saida: notaFiscal.data_saida || null,
      tipo_operacao: notaFiscal.tipo_operacao || null,
      numero_pedido: notaFiscal.numero_pedido || null,
      
      // Dados do emitente (todos os campos)
      emitente_cnpj: notaFiscal.emitente_cnpj || null,
      emitente_razao_social: notaFiscal.emitente_razao_social || null,
      emitente_telefone: notaFiscal.emitente_telefone || null,
      emitente_uf: notaFiscal.emitente_uf || null,
      emitente_cidade: notaFiscal.emitente_cidade || null,
      emitente_bairro: notaFiscal.emitente_bairro || null,
      emitente_endereco: notaFiscal.emitente_endereco || null,
      emitente_numero: notaFiscal.emitente_numero || null,
      emitente_cep: notaFiscal.emitente_cep || null,
      
      // Dados do destinatário (todos os campos)
      destinatario_cnpj: notaFiscal.destinatario_cnpj || null,
      destinatario_razao_social: notaFiscal.destinatario_razao_social || null,
      destinatario_telefone: notaFiscal.destinatario_telefone || null,
      destinatario_uf: notaFiscal.destinatario_uf || null,
      destinatario_cidade: notaFiscal.destinatario_cidade || null,
      destinatario_bairro: notaFiscal.destinatario_bairro || null,
      destinatario_endereco: notaFiscal.destinatario_endereco || null,
      destinatario_numero: notaFiscal.destinatario_numero || null,
      destinatario_cep: notaFiscal.destinatario_cep || null,
      
      // Informações de transporte e logística
      informacoes_complementares: notaFiscal.informacoes_complementares || null,
      fob_cif: notaFiscal.fob_cif || null,
      numero_coleta: notaFiscal.numero_coleta || null,
      valor_coleta: notaFiscal.valor_coleta ? Number(notaFiscal.valor_coleta) : null,
      numero_cte_coleta: notaFiscal.numero_cte_coleta || null,
      numero_cte_viagem: notaFiscal.numero_cte_viagem || null,
      data_embarque: notaFiscal.data_embarque || null,
      status_embarque: notaFiscal.status_embarque || null,
      responsavel_entrega: notaFiscal.responsavel_entrega || null,
      motorista: notaFiscal.motorista || null,
      tempo_armazenamento_horas: notaFiscal.tempo_armazenamento_horas ? Number(notaFiscal.tempo_armazenamento_horas) : null,
      entregue_ao_fornecedor: notaFiscal.entregue_ao_fornecedor || null,
      observacoes: notaFiscal.observacoes || null,
      
      // Campos boolean
      quimico: Boolean(notaFiscal.quimico),
      fracionado: Boolean(notaFiscal.fracionado),
      
      // Campos de data adicionais
      data_hora_emissao: notaFiscal.data_hora_emissao || notaFiscal.data_emissao || null,
      data_hora_entrada: notaFiscal.data_hora_entrada || notaFiscal.data_entrada || null,
      
      // Referências para outras tabelas
      remetente_id: notaFiscal.remetente_id || null,
      destinatario_id: notaFiscal.destinatario_id || null,
      transportadora_id: notaFiscal.transportadora_id || null,
      ordem_carregamento_id: notaFiscal.ordem_carregamento_id || null,
      coleta_id: notaFiscal.coleta_id || null,
      
      // Campos de arquivo/documento
      arquivo_cte_coleta: notaFiscal.arquivo_cte_coleta || null,
      arquivo_cte_viagem: notaFiscal.arquivo_cte_viagem || null,
      lista_romaneio: notaFiscal.lista_romaneio || null,
      arquivos_diversos: notaFiscal.arquivos_diversos || null,
      
      // Tipo da nota fiscal
      tipo: notaFiscal.tipo || 'entrada'
    };
    
    console.log('Dados preparados para inserção:', notaFiscalToInsert);
    
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
      console.log('Criando itens da nota fiscal:', itensNotaFiscal);
      const itensComNotaId = itensNotaFiscal.map((item, index) => ({
        nota_fiscal_id: data.id,
        codigo_produto: item.codigo_produto || `PROD${index + 1}`,
        descricao: item.descricao || 'Produto',
        quantidade: Number(item.quantidade) || 0,
        valor_unitario: Number(item.valor_unitario) || 0,
        valor_total: Number(item.valor_total) || 0,
        sequencia: Number(item.sequencia) || index + 1
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
    
    console.log('Inserindo itens da nota fiscal:', itensNotaFiscal);
    
    const { data, error } = await supabase
      .from('itens_nota_fiscal')
      .insert(itensNotaFiscal)
      .select();
    
    if (error) {
      console.error('Erro ao inserir itens da nota fiscal:', error);
      throw new Error(`Erro ao criar itens da nota fiscal: ${error.message}`);
    }
    
    console.log('Itens da nota fiscal criados com sucesso:', data);
    return (data || []) as ItemNotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao criar itens da nota fiscal:', error);
    throw error;
  }
};
