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
    
    // Preparar dados básicos obrigatórios primeiro
    const dadosBasicos = {
      numero: notaFiscal.numero || '',
      valor_total: notaFiscal.valor_total || 0,
      data_emissao: notaFiscal.data_emissao || new Date().toISOString(),
      status: notaFiscal.status || 'pendente',
      data_inclusao: new Date().toISOString()
    };

    // Adicionar campos opcionais apenas se não forem undefined
    const camposOpcionais: any = {};
    
    if (notaFiscal.serie !== undefined) camposOpcionais.serie = notaFiscal.serie;
    if (notaFiscal.chave_acesso !== undefined) camposOpcionais.chave_acesso = notaFiscal.chave_acesso;
    if (notaFiscal.quantidade_volumes !== undefined) camposOpcionais.quantidade_volumes = notaFiscal.quantidade_volumes;
    if (notaFiscal.peso_bruto !== undefined) camposOpcionais.peso_bruto = notaFiscal.peso_bruto;
    if (notaFiscal.tipo_operacao !== undefined) camposOpcionais.tipo_operacao = notaFiscal.tipo_operacao;
    
    // Dados do emitente
    if (notaFiscal.emitente_cnpj !== undefined) camposOpcionais.emitente_cnpj = notaFiscal.emitente_cnpj;
    if (notaFiscal.emitente_razao_social !== undefined) camposOpcionais.emitente_razao_social = notaFiscal.emitente_razao_social;
    if (notaFiscal.emitente_telefone !== undefined) camposOpcionais.emitente_telefone = notaFiscal.emitente_telefone;
    if (notaFiscal.emitente_uf !== undefined) camposOpcionais.emitente_uf = notaFiscal.emitente_uf;
    if (notaFiscal.emitente_cidade !== undefined) camposOpcionais.emitente_cidade = notaFiscal.emitente_cidade;
    if (notaFiscal.emitente_bairro !== undefined) camposOpcionais.emitente_bairro = notaFiscal.emitente_bairro;
    if (notaFiscal.emitente_endereco !== undefined) camposOpcionais.emitente_endereco = notaFiscal.emitente_endereco;
    if (notaFiscal.emitente_numero !== undefined) camposOpcionais.emitente_numero = notaFiscal.emitente_numero;
    if (notaFiscal.emitente_cep !== undefined) camposOpcionais.emitente_cep = notaFiscal.emitente_cep;
    
    // Dados do destinatário
    if (notaFiscal.destinatario_cnpj !== undefined) camposOpcionais.destinatario_cnpj = notaFiscal.destinatario_cnpj;
    if (notaFiscal.destinatario_razao_social !== undefined) camposOpcionais.destinatario_razao_social = notaFiscal.destinatario_razao_social;
    if (notaFiscal.destinatario_telefone !== undefined) camposOpcionais.destinatario_telefone = notaFiscal.destinatario_telefone;
    if (notaFiscal.destinatario_uf !== undefined) camposOpcionais.destinatario_uf = notaFiscal.destinatario_uf;
    if (notaFiscal.destinatario_cidade !== undefined) camposOpcionais.destinatario_cidade = notaFiscal.destinatario_cidade;
    if (notaFiscal.destinatario_bairro !== undefined) camposOpcionais.destinatario_bairro = notaFiscal.destinatario_bairro;
    if (notaFiscal.destinatario_endereco !== undefined) camposOpcionais.destinatario_endereco = notaFiscal.destinatario_endereco;
    if (notaFiscal.destinatario_numero !== undefined) camposOpcionais.destinatario_numero = notaFiscal.destinatario_numero;
    if (notaFiscal.destinatario_cep !== undefined) camposOpcionais.destinatario_cep = notaFiscal.destinatario_cep;
    
    // Campos de transporte e outros
    if (notaFiscal.informacoes_complementares !== undefined) camposOpcionais.informacoes_complementares = notaFiscal.informacoes_complementares;
    if (notaFiscal.numero_pedido !== undefined) camposOpcionais.numero_pedido = notaFiscal.numero_pedido;
    if (notaFiscal.fob_cif !== undefined) camposOpcionais.fob_cif = notaFiscal.fob_cif;
    if (notaFiscal.numero_coleta !== undefined) camposOpcionais.numero_coleta = notaFiscal.numero_coleta;
    if (notaFiscal.valor_coleta !== undefined) camposOpcionais.valor_coleta = notaFiscal.valor_coleta;
    if (notaFiscal.numero_cte_coleta !== undefined) camposOpcionais.numero_cte_coleta = notaFiscal.numero_cte_coleta;
    if (notaFiscal.numero_cte_viagem !== undefined) camposOpcionais.numero_cte_viagem = notaFiscal.numero_cte_viagem;
    if (notaFiscal.data_embarque !== undefined) camposOpcionais.data_embarque = notaFiscal.data_embarque;
    if (notaFiscal.data_entrada !== undefined) camposOpcionais.data_entrada = notaFiscal.data_entrada;
    if (notaFiscal.status_embarque !== undefined) camposOpcionais.status_embarque = notaFiscal.status_embarque;
    if (notaFiscal.responsavel_entrega !== undefined) camposOpcionais.responsavel_entrega = notaFiscal.responsavel_entrega;
    if (notaFiscal.motorista !== undefined) camposOpcionais.motorista = notaFiscal.motorista;
    if (notaFiscal.tempo_armazenamento_horas !== undefined) camposOpcionais.tempo_armazenamento_horas = notaFiscal.tempo_armazenamento_horas;
    if (notaFiscal.entregue_ao_fornecedor !== undefined) camposOpcionais.entregue_ao_fornecedor = notaFiscal.entregue_ao_fornecedor;
    if (notaFiscal.observacoes !== undefined) camposOpcionais.observacoes = notaFiscal.observacoes;
    
    // Campos booleanos (tratar especialmente)
    camposOpcionais.quimico = notaFiscal.quimico === true;
    camposOpcionais.fracionado = notaFiscal.fracionado === true;

    // Combinar dados básicos com opcionais
    const notaFiscalToInsert = { ...dadosBasicos, ...camposOpcionais };
    
    console.log('=== DADOS PREPARADOS PARA INSERÇÃO ===');
    console.log('Dados finais para inserção:', JSON.stringify(notaFiscalToInsert, null, 2));
    
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
      throw new Error(`Erro ao criar nota fiscal: ${error.message}`);
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
    const itemsWithRequiredProps = itensNotaFiscal.map(item => {
      return {
        codigo_produto: item.codigo_produto || 'N/A',
        descricao: item.descricao || 'N/A',
        quantidade: item.quantidade || 0,
        valor_unitario: item.valor_unitario || 0,
        valor_total: item.valor_total || 0,
        sequencia: item.sequencia || 1,
        nota_fiscal_id: item.nota_fiscal_id,
        // Optional fields
        id: item.id,
        created_at: item.created_at,
        updated_at: item.updated_at
      } as ItemNotaFiscal;
    });
    
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
