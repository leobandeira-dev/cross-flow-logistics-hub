
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
        serie: data.serieNF || undefined,
        chave_acesso: data.chaveNF || undefined,
        data_emissao: data.dataHoraEmissao ? new Date(data.dataHoraEmissao).toISOString() : new Date().toISOString(),
        valor_total: data.valorTotal ? parseFloat(data.valorTotal.toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 0,
        peso_bruto: data.pesoTotalBruto ? parseFloat(data.pesoTotalBruto.toString().replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
        quantidade_volumes: data.volumesTotal ? parseInt(data.volumesTotal.toString()) : undefined,
        status: 'pendente',
        tipo_operacao: data.tipoOperacao || undefined,
        
        // Dados do emitente
        emitente_cnpj: data.emitenteCNPJ || undefined,
        emitente_razao_social: data.emitenteRazaoSocial || undefined,
        emitente_telefone: data.emitenteTelefone || undefined,
        emitente_uf: data.emitenteUF || undefined,
        emitente_cidade: data.emitenteCidade || undefined,
        emitente_bairro: data.emitenteBairro || undefined,
        emitente_endereco: data.emitenteEndereco || undefined,
        emitente_numero: data.emitenteNumero || undefined,
        emitente_cep: data.emitenteCEP || undefined,
        
        // Dados do destinatário
        destinatario_cnpj: data.destinatarioCNPJ || undefined,
        destinatario_razao_social: data.destinatarioRazaoSocial || undefined,
        destinatario_telefone: data.destinatarioTelefone || undefined,
        destinatario_uf: data.destinatarioUF || undefined,
        destinatario_cidade: data.destinatarioCidade || undefined,
        destinatario_bairro: data.destinatarioBairro || undefined,
        destinatario_endereco: data.destinatarioEndereco || undefined,
        destinatario_numero: data.destinatarioNumero || undefined,
        destinatario_cep: data.destinatarioCEP || undefined,
        
        // Informações adicionais
        informacoes_complementares: data.informacoesComplementares || undefined,
        numero_pedido: data.numeroPedido || undefined,
        fob_cif: data.fobCif || undefined,
        
        // Informações de transporte
        numero_coleta: data.numeroColeta || undefined,
        valor_coleta: data.valorColeta ? parseFloat(data.valorColeta.toString().replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
        numero_cte_coleta: data.numeroCTeColeta || undefined,
        numero_cte_viagem: data.numeroCTeViagem || undefined,
        data_embarque: data.dataEmbarque ? new Date(data.dataEmbarque).toISOString() : undefined,
        
        // Informações complementares
        data_entrada: data.dataHoraEntrada ? new Date(data.dataHoraEntrada).toISOString() : undefined,
        status_embarque: data.statusEmbarque || undefined,
        responsavel_entrega: data.responsavelEntrega || undefined,
        quimico: data.quimico === 'sim',
        fracionado: data.fracionado === 'sim',
        motorista: data.motorista || undefined,
        tempo_armazenamento_horas: data.tempoArmazenamento ? parseFloat(data.tempoArmazenamento.toString()) : undefined,
        entregue_ao_fornecedor: data.entregueAoFornecedor || undefined,
        
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
