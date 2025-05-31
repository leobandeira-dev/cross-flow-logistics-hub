
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal, ItemNotaFiscal } from "@/types/supabase/fiscal.types";

/**
 * Creates a new nota fiscal in the database
 */
export const criarNotaFiscal = async (notaFiscal: Partial<NotaFiscal>, itensNotaFiscal?: Partial<ItemNotaFiscal>[]): Promise<NotaFiscal> => {
  try {
    console.log('=== INÍCIO DO SERVIÇO CRIAR NOTA FISCAL ===');
    console.log('Dados recebidos no serviço:', JSON.stringify(notaFiscal, null, 2));
    
    // Verificar se a conexão com Supabase está funcionando
    const { data: testConnection, error: testError } = await supabase
      .from('notas_fiscais')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Erro na conexão com Supabase:', testError);
      throw new Error(`Erro de conexão: ${testError.message}`);
    }
    
    console.log('Conexão com Supabase OK');
    
    // Preparar dados para inserção - garantindo que todos os campos obrigatórios estejam presentes
    const notaFiscalToInsert = {
      // Campos obrigatórios
      numero: notaFiscal.numero || '',
      valor_total: Number(notaFiscal.valor_total) || 0,
      data_emissao: notaFiscal.data_emissao || new Date().toISOString(),
      status: notaFiscal.status || 'pendente',
      data_inclusao: new Date().toISOString(),
      
      // Campos opcionais - incluir apenas se tiverem valor válido
      ...(notaFiscal.serie && { serie: notaFiscal.serie }),
      ...(notaFiscal.chave_acesso && { chave_acesso: notaFiscal.chave_acesso }),
      ...(notaFiscal.quantidade_volumes !== undefined && { quantidade_volumes: Number(notaFiscal.quantidade_volumes) }),
      ...(notaFiscal.peso_bruto !== undefined && { peso_bruto: Number(notaFiscal.peso_bruto) }),
      ...(notaFiscal.tipo_operacao && { tipo_operacao: notaFiscal.tipo_operacao }),
      
      // Dados do emitente
      ...(notaFiscal.emitente_cnpj && { emitente_cnpj: notaFiscal.emitente_cnpj }),
      ...(notaFiscal.emitente_razao_social && { emitente_razao_social: notaFiscal.emitente_razao_social }),
      ...(notaFiscal.emitente_telefone && { emitente_telefone: notaFiscal.emitente_telefone }),
      ...(notaFiscal.emitente_uf && { emitente_uf: notaFiscal.emitente_uf }),
      ...(notaFiscal.emitente_cidade && { emitente_cidade: notaFiscal.emitente_cidade }),
      ...(notaFiscal.emitente_bairro && { emitente_bairro: notaFiscal.emitente_bairro }),
      ...(notaFiscal.emitente_endereco && { emitente_endereco: notaFiscal.emitente_endereco }),
      ...(notaFiscal.emitente_numero && { emitente_numero: notaFiscal.emitente_numero }),
      ...(notaFiscal.emitente_cep && { emitente_cep: notaFiscal.emitente_cep }),
      
      // Dados do destinatário
      ...(notaFiscal.destinatario_cnpj && { destinatario_cnpj: notaFiscal.destinatario_cnpj }),
      ...(notaFiscal.destinatario_razao_social && { destinatario_razao_social: notaFiscal.destinatario_razao_social }),
      ...(notaFiscal.destinatario_telefone && { destinatario_telefone: notaFiscal.destinatario_telefone }),
      ...(notaFiscal.destinatario_uf && { destinatario_uf: notaFiscal.destinatario_uf }),
      ...(notaFiscal.destinatario_cidade && { destinatario_cidade: notaFiscal.destinatario_cidade }),
      ...(notaFiscal.destinatario_bairro && { destinatario_bairro: notaFiscal.destinatario_bairro }),
      ...(notaFiscal.destinatario_endereco && { destinatario_endereco: notaFiscal.destinatario_endereco }),
      ...(notaFiscal.destinatario_numero && { destinatario_numero: notaFiscal.destinatario_numero }),
      ...(notaFiscal.destinatario_cep && { destinatario_cep: notaFiscal.destinatario_cep }),
      
      // Informações adicionais
      ...(notaFiscal.informacoes_complementares && { informacoes_complementares: notaFiscal.informacoes_complementares }),
      ...(notaFiscal.numero_pedido && { numero_pedido: notaFiscal.numero_pedido }),
      ...(notaFiscal.fob_cif && { fob_cif: notaFiscal.fob_cif }),
      
      // Informações de transporte
      ...(notaFiscal.numero_coleta && { numero_coleta: notaFiscal.numero_coleta }),
      ...(notaFiscal.valor_coleta !== undefined && { valor_coleta: Number(notaFiscal.valor_coleta) }),
      ...(notaFiscal.numero_cte_coleta && { numero_cte_coleta: notaFiscal.numero_cte_coleta }),
      ...(notaFiscal.numero_cte_viagem && { numero_cte_viagem: notaFiscal.numero_cte_viagem }),
      ...(notaFiscal.data_embarque && { data_embarque: notaFiscal.data_embarque }),
      
      // Informações complementares
      ...(notaFiscal.data_entrada && { data_entrada: notaFiscal.data_entrada }),
      ...(notaFiscal.status_embarque && { status_embarque: notaFiscal.status_embarque }),
      ...(notaFiscal.responsavel_entrega && { responsavel_entrega: notaFiscal.responsavel_entrega }),
      ...(notaFiscal.motorista && { motorista: notaFiscal.motorista }),
      ...(notaFiscal.tempo_armazenamento_horas !== undefined && { tempo_armazenamento_horas: Number(notaFiscal.tempo_armazenamento_horas) }),
      ...(notaFiscal.entregue_ao_fornecedor && { entregue_ao_fornecedor: notaFiscal.entregue_ao_fornecedor }),
      ...(notaFiscal.observacoes && { observacoes: notaFiscal.observacoes }),
      
      // Campos booleanos com valor padrão
      quimico: Boolean(notaFiscal.quimico),
      fracionado: Boolean(notaFiscal.fracionado),
    };
    
    console.log('=== DADOS PREPARADOS PARA INSERÇÃO ===');
    console.log('Dados finais para inserção:', JSON.stringify(notaFiscalToInsert, null, 2));
    
    // Validação básica
    if (!notaFiscalToInsert.numero || notaFiscalToInsert.numero.trim() === '') {
      throw new Error('Número da nota fiscal é obrigatório');
    }
    
    console.log('=== EXECUTANDO INSERT NO SUPABASE ===');
    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert(notaFiscalToInsert)
      .select()
      .single();
    
    if (error) {
      console.error('=== ERRO NO INSERT ===');
      console.error('Erro detalhado do Supabase:', error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem do erro:', error.message);
      console.error('Detalhes:', error.details);
      console.error('Hint:', error.hint);
      throw new Error(`Erro ao criar nota fiscal: ${error.message} (Código: ${error.code})`);
    }
    
    console.log('=== SUCESSO NO INSERT ===');
    console.log('Nota fiscal criada com sucesso:', data);
    
    // Se houver itens, cria-los vinculados à nota fiscal
    if (itensNotaFiscal && itensNotaFiscal.length > 0) {
      console.log('=== CRIANDO ITENS DA NOTA FISCAL ===');
      const itensComNotaId = itensNotaFiscal.map(item => ({
        ...item,
        nota_fiscal_id: data.id
      }));
      
      await criarItensNotaFiscal(itensComNotaId);
    }
    
    return data as NotaFiscal;
  } catch (error) {
    console.error('=== ERRO GERAL NO SERVIÇO ===');
    console.error('Erro capturado:', error);
    throw error;
  }
};

/**
 * Creates items for a nota fiscal
 */
export const criarItensNotaFiscal = async (itensNotaFiscal: Partial<ItemNotaFiscal>[]): Promise<ItemNotaFiscal[]> => {
  try {
    if (!itensNotaFiscal.length) return [];
    
    console.log('=== CRIANDO ITENS DA NOTA FISCAL ===');
    console.log('Itens a serem criados:', itensNotaFiscal);
    
    // Ensure all required properties are present for each item
    const itemsWithRequiredProps = itensNotaFiscal.map((item, index) => ({
      codigo_produto: item.codigo_produto || 'N/A',
      descricao: item.descricao || 'N/A',
      quantidade: Number(item.quantidade) || 0,
      valor_unitario: Number(item.valor_unitario) || 0,
      valor_total: Number(item.valor_total) || 0,
      sequencia: item.sequencia || (index + 1),
      nota_fiscal_id: item.nota_fiscal_id,
    }));
    
    const { data, error } = await supabase
      .from('itens_nota_fiscal')
      .insert(itemsWithRequiredProps)
      .select();
    
    if (error) {
      console.error('Erro ao criar itens da nota fiscal:', error);
      throw new Error(`Erro ao criar itens da nota fiscal: ${error.message}`);
    }
    
    console.log('Itens criados com sucesso:', data);
    return data as ItemNotaFiscal[];
  } catch (error: any) {
    console.error('Erro ao criar itens da nota fiscal:', error);
    throw error;
  }
};
