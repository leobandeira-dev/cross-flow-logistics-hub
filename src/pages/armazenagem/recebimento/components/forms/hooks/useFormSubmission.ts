
import { useState } from 'react';
import { NotaFiscalSchemaType } from '../notaFiscalSchema';
import { useToast } from "@/hooks/use-toast";
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';
import { NotaFiscal } from '@/types/supabase/fiscal.types';

export const useFormSubmission = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: NotaFiscalSchemaType) => {
    setIsLoading(true);
    try {
      console.log('=== INÍCIO DA SUBMISSÃO ===');
      console.log('Dados do formulário recebidos:', data);
      
      // Mapear os dados do formulário para o formato da NotaFiscal
      const notaFiscalData: Partial<NotaFiscal> = {
        // Dados básicos da nota fiscal
        numero: data.numeroNF || '',
        serie: data.serieNF || null,
        chave_acesso: data.chaveNF || null,
        data_emissao: data.dataHoraEmissao ? new Date(data.dataHoraEmissao).toISOString() : new Date().toISOString(),
        valor_total: data.valorTotal ? parseFloat(data.valorTotal.toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 0,
        peso_bruto: data.pesoTotalBruto ? parseFloat(data.pesoTotalBruto.toString().replace(/[^\d.,]/g, '').replace(',', '.')) : null,
        quantidade_volumes: data.volumesTotal ? parseInt(data.volumesTotal.toString()) : null,
        status: 'pendente',
        tipo_operacao: data.tipoOperacao || null,
        
        // Dados do emitente
        emitente_cnpj: data.emitenteCNPJ || null,
        emitente_razao_social: data.emitenteRazaoSocial || null,
        emitente_telefone: data.emitenteTelefone || null,
        emitente_uf: data.emitenteUF || null,
        emitente_cidade: data.emitenteCidade || null,
        emitente_bairro: data.emitenteBairro || null,
        emitente_endereco: data.emitenteEndereco || null,
        emitente_numero: data.emitenteNumero || null,
        emitente_cep: data.emitenteCEP || null,
        
        // Dados do destinatário
        destinatario_cnpj: data.destinatarioCNPJ || null,
        destinatario_razao_social: data.destinatarioRazaoSocial || null,
        destinatario_telefone: data.destinatarioTelefone || null,
        destinatario_uf: data.destinatarioUF || null,
        destinatario_cidade: data.destinatarioCidade || null,
        destinatario_bairro: data.destinatarioBairro || null,
        destinatario_endereco: data.destinatarioEndereco || null,
        destinatario_numero: data.destinatarioNumero || null,
        destinatario_cep: data.destinatarioCEP || null,
        
        // Informações adicionais
        informacoes_complementares: data.informacoesComplementares || null,
        numero_pedido: data.numeroPedido || null,
        fob_cif: data.fobCif || null,
        
        // Informações de transporte
        numero_coleta: data.numeroColeta || null,
        valor_coleta: data.valorColeta ? parseFloat(data.valorColeta.toString().replace(/[^\d.,]/g, '').replace(',', '.')) : null,
        numero_cte_coleta: data.numeroCTeColeta || null,
        numero_cte_viagem: data.numeroCTeViagem || null,
        data_embarque: data.dataEmbarque ? new Date(data.dataEmbarque).toISOString() : null,
        
        // Informações complementares
        data_entrada: data.dataHoraEntrada ? new Date(data.dataHoraEntrada).toISOString() : null,
        status_embarque: data.statusEmbarque || null,
        responsavel_entrega: data.responsavelEntrega || null,
        quimico: data.quimico === 'sim',
        fracionado: data.fracionado === 'sim',
        motorista: data.motorista || null,
        tempo_armazenamento_horas: data.tempoArmazenamento ? parseFloat(data.tempoArmazenamento.toString()) : null,
        entregue_ao_fornecedor: data.entregueAoFornecedor || null,
        
        // Garantir que data_inclusao seja definida
        data_inclusao: new Date().toISOString()
      };
      
      console.log('=== DADOS MAPEADOS PARA ENVIO ===');
      console.log('Dados mapeados para Supabase:', JSON.stringify(notaFiscalData, null, 2));
      
      // Criar a nota fiscal no banco de dados
      console.log('=== ENVIANDO PARA SUPABASE ===');
      const notaCriada = await criarNotaFiscal(notaFiscalData);
      
      console.log('=== RESPOSTA DO SUPABASE ===');
      console.log('Nota fiscal criada com sucesso:', notaCriada);
      
      toast({
        title: "✅ Nota Fiscal Cadastrada",
        description: `Nota fiscal ${notaCriada.numero} cadastrada com sucesso no sistema.`
      });
      
      return notaCriada;
    } catch (error) {
      console.error("=== ERRO NA SUBMISSÃO ===");
      console.error("Erro ao cadastrar nota fiscal:", error);
      console.error("Stack trace:", error instanceof Error ? error.stack : 'N/A');
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: "❌ Erro ao Cadastrar",
        description: `Falha ao cadastrar nota fiscal: ${errorMessage}`,
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    handleSubmit,
    isLoading
  };
};
