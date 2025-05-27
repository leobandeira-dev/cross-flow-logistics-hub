
import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/supabase/fiscal.types";

interface CreateNotaFiscalData {
  numero: string;
  serie?: string;
  chave_acesso?: string;
  valor_total: number;
  peso_bruto?: number;
  quantidade_volumes?: number;
  data_emissao: string;
  status?: string;
  tipo?: string;
  remetente_id?: string;
  destinatario_id?: string;
  transportadora_id?: string;
  observacoes?: string;
  
  // Novos campos do formulário
  data_hora_emissao?: string;
  tipo_operacao?: string;
  entregue_ao_fornecedor?: string;
  
  // Campos do emitente
  emitente_cnpj?: string;
  emitente_razao_social?: string;
  emitente_telefone?: string;
  emitente_uf?: string;
  emitente_cidade?: string;
  emitente_bairro?: string;
  emitente_endereco?: string;
  emitente_numero?: string;
  emitente_cep?: string;
  
  // Campos do destinatário
  destinatario_cnpj?: string;
  destinatario_razao_social?: string;
  destinatario_telefone?: string;
  destinatario_uf?: string;
  destinatario_cidade?: string;
  destinatario_bairro?: string;
  destinatario_endereco?: string;
  destinatario_numero?: string;
  destinatario_cep?: string;
  
  // Campos adicionais
  numero_pedido?: string;
  informacoes_complementares?: string;
  fob_cif?: string;
  numero_coleta?: string;
  valor_coleta?: number;
  numero_cte_coleta?: string;
  arquivo_cte_coleta?: string;
  numero_cte_viagem?: string;
  arquivo_cte_viagem?: string;
  data_hora_entrada?: string;
  status_embarque?: string;
  quimico?: boolean;
  fracionado?: boolean;
  responsavel_entrega?: string;
  lista_romaneio?: string;
  motorista?: string;
  data_embarque?: string;
  arquivos_diversos?: string;
  tempo_armazenamento_horas?: number;
}

/**
 * Creates a new nota fiscal in the database with all form fields
 */
export const criarNotaFiscal = async (data: CreateNotaFiscalData): Promise<NotaFiscal> => {
  try {
    console.log('=== INÍCIO CRIAÇÃO NOTA FISCAL ===');
    console.log('Dados recebidos:', data);
    
    // Validate required fields
    if (!data.numero) {
      throw new Error('Número da nota fiscal é obrigatório');
    }
    
    if (!data.data_emissao) {
      throw new Error('Data de emissão é obrigatória');
    }

    // Ensure data_emissao is a valid ISO string
    let validDataEmissao: string;
    try {
      validDataEmissao = new Date(data.data_emissao).toISOString();
      console.log('Data de emissão validada:', validDataEmissao);
    } catch (error) {
      console.error('Data de emissão inválida:', data.data_emissao);
      validDataEmissao = new Date().toISOString();
      console.log('Usando data atual:', validDataEmissao);
    }

    // Process data_hora_emissao if provided
    let validDataHoraEmissao: string | null = null;
    if (data.data_hora_emissao) {
      try {
        validDataHoraEmissao = new Date(data.data_hora_emissao).toISOString();
      } catch (error) {
        console.warn('Data hora emissão inválida:', data.data_hora_emissao);
      }
    }

    // Process other date fields
    let validDataHoraEntrada: string | null = null;
    if (data.data_hora_entrada) {
      try {
        validDataHoraEntrada = new Date(data.data_hora_entrada).toISOString();
      } catch (error) {
        console.warn('Data hora entrada inválida:', data.data_hora_entrada);
      }
    }

    let validDataEmbarque: string | null = null;
    if (data.data_embarque) {
      try {
        validDataEmbarque = new Date(data.data_embarque).toISOString();
      } catch (error) {
        console.warn('Data embarque inválida:', data.data_embarque);
      }
    }

    // Prepare insert data with all new fields
    const insertData = {
      numero: data.numero.toString(),
      serie: data.serie?.toString() || '1',
      chave_acesso: data.chave_acesso || null,
      valor_total: Number(data.valor_total) || 0,
      peso_bruto: data.peso_bruto ? Number(data.peso_bruto) : null,
      quantidade_volumes: data.quantidade_volumes ? Number(data.quantidade_volumes) : null,
      data_emissao: validDataEmissao,
      status: data.status || 'pendente',
      tipo: data.tipo || 'entrada',
      remetente_id: data.remetente_id || null,
      destinatario_id: data.destinatario_id || null,
      transportadora_id: data.transportadora_id || null,
      observacoes: data.observacoes || null,
      
      // Novos campos
      data_hora_emissao: validDataHoraEmissao,
      tipo_operacao: data.tipo_operacao || null,
      entregue_ao_fornecedor: data.entregue_ao_fornecedor || null,
      
      // Campos do emitente
      emitente_cnpj: data.emitente_cnpj || null,
      emitente_razao_social: data.emitente_razao_social || null,
      emitente_telefone: data.emitente_telefone || null,
      emitente_uf: data.emitente_uf || null,
      emitente_cidade: data.emitente_cidade || null,
      emitente_bairro: data.emitente_bairro || null,
      emitente_endereco: data.emitente_endereco || null,
      emitente_numero: data.emitente_numero || null,
      emitente_cep: data.emitente_cep || null,
      
      // Campos do destinatário
      destinatario_cnpj: data.destinatario_cnpj || null,
      destinatario_razao_social: data.destinatario_razao_social || null,
      destinatario_telefone: data.destinatario_telefone || null,
      destinatario_uf: data.destinatario_uf || null,
      destinatario_cidade: data.destinatario_cidade || null,
      destinatario_bairro: data.destinatario_bairro || null,
      destinatario_endereco: data.destinatario_endereco || null,
      destinatario_numero: data.destinatario_numero || null,
      destinatario_cep: data.destinatario_cep || null,
      
      // Campos adicionais
      numero_pedido: data.numero_pedido || null,
      informacoes_complementares: data.informacoes_complementares || null,
      fob_cif: data.fob_cif || null,
      numero_coleta: data.numero_coleta || null,
      valor_coleta: data.valor_coleta ? Number(data.valor_coleta) : null,
      numero_cte_coleta: data.numero_cte_coleta || null,
      arquivo_cte_coleta: data.arquivo_cte_coleta || null,
      numero_cte_viagem: data.numero_cte_viagem || null,
      arquivo_cte_viagem: data.arquivo_cte_viagem || null,
      data_hora_entrada: validDataHoraEntrada,
      status_embarque: data.status_embarque || null,
      quimico: data.quimico || false,
      fracionado: data.fracionado || false,
      responsavel_entrega: data.responsavel_entrega || null,
      lista_romaneio: data.lista_romaneio || null,
      motorista: data.motorista || null,
      data_embarque: validDataEmbarque,
      arquivos_diversos: data.arquivos_diversos || null,
      tempo_armazenamento_horas: data.tempo_armazenamento_horas ? Number(data.tempo_armazenamento_horas) : null
    };

    console.log('Dados preparados para inserção:', insertData);
    console.log('Tentando inserir no Supabase...');
    
    const { data: notaFiscal, error } = await supabase
      .from('notas_fiscais')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro do Supabase ao inserir:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Provide more specific error messages
      if (error.code === '23514') {
        throw new Error(`Erro de validação no banco de dados. Verifique se os valores dos campos estão corretos. Status usado: ${insertData.status}, Tipo usado: ${insertData.tipo}`);
      }
      
      throw new Error(`Erro ao criar nota fiscal: ${error.message}`);
    }
    
    console.log('✅ Nota fiscal criada com sucesso no Supabase:', notaFiscal);
    console.log('=== FIM CRIAÇÃO NOTA FISCAL ===');
    
    return notaFiscal as NotaFiscal;
  } catch (error: any) {
    console.error('❌ Erro geral ao criar nota fiscal:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};
