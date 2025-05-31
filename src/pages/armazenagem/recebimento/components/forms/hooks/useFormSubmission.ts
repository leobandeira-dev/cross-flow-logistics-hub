
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
      
      // Validar dados obrigatórios
      if (!data.numeroNF || data.numeroNF.trim() === '') {
        throw new Error('Número da nota fiscal é obrigatório');
      }

      // Helper function para converter string para número
      const parseNumber = (value: any): number => {
        if (value === null || value === undefined || value === '') return 0;
        const numValue = typeof value === 'string' ? 
          parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) : 
          Number(value);
        return isNaN(numValue) ? 0 : numValue;
      };

      // Helper function para converter data
      const parseDate = (value: any): string => {
        if (!value) return new Date().toISOString();
        try {
          return new Date(value).toISOString();
        } catch {
          return new Date().toISOString();
        }
      };

      // Mapear os dados do formulário para o formato da NotaFiscal
      const notaFiscalData: Partial<NotaFiscal> = {
        // Campos obrigatórios
        numero: data.numeroNF,
        valor_total: parseNumber(data.valorTotal),
        data_emissao: parseDate(data.dataHoraEmissao),
        status: 'pendente',
        data_inclusao: new Date().toISOString(),

        // Adicionar campos opcionais apenas se tiverem valor válido
        ...(data.serieNF && { serie: data.serieNF }),
        ...(data.chaveNF && { chave_acesso: data.chaveNF }),
        ...(data.pesoTotalBruto && { peso_bruto: parseNumber(data.pesoTotalBruto) }),
        ...(data.volumesTotal && { quantidade_volumes: parseInt(data.volumesTotal.toString()) || 0 }),
        ...(data.tipoOperacao && { tipo_operacao: data.tipoOperacao }),
        
        // Dados do emitente
        ...(data.emitenteCNPJ && { emitente_cnpj: data.emitenteCNPJ }),
        ...(data.emitenteRazaoSocial && { emitente_razao_social: data.emitenteRazaoSocial }),
        ...(data.emitenteTelefone && { emitente_telefone: data.emitenteTelefone }),
        ...(data.emitenteUF && { emitente_uf: data.emitenteUF }),
        ...(data.emitenteCidade && { emitente_cidade: data.emitenteCidade }),
        ...(data.emitenteBairro && { emitente_bairro: data.emitenteBairro }),
        ...(data.emitenteEndereco && { emitente_endereco: data.emitenteEndereco }),
        ...(data.emitenteNumero && { emitente_numero: data.emitenteNumero }),
        ...(data.emitenteCEP && { emitente_cep: data.emitenteCEP }),
        
        // Dados do destinatário
        ...(data.destinatarioCNPJ && { destinatario_cnpj: data.destinatarioCNPJ }),
        ...(data.destinatarioRazaoSocial && { destinatario_razao_social: data.destinatarioRazaoSocial }),
        ...(data.destinatarioTelefone && { destinatario_telefone: data.destinatarioTelefone }),
        ...(data.destinatarioUF && { destinatario_uf: data.destinatarioUF }),
        ...(data.destinatarioCidade && { destinatario_cidade: data.destinatarioCidade }),
        ...(data.destinatarioBairro && { destinatario_bairro: data.destinatarioBairro }),
        ...(data.destinatarioEndereco && { destinatario_endereco: data.destinatarioEndereco }),
        ...(data.destinatarioNumero && { destinatario_numero: data.destinatarioNumero }),
        ...(data.destinatarioCEP && { destinatario_cep: data.destinatarioCEP }),
        
        // Informações adicionais
        ...(data.informacoesComplementares && { informacoes_complementares: data.informacoesComplementares }),
        ...(data.numeroPedido && { numero_pedido: data.numeroPedido }),
        ...(data.fobCif && { fob_cif: data.fobCif }),
        
        // Informações de transporte
        ...(data.numeroColeta && { numero_coleta: data.numeroColeta }),
        ...(data.valorColeta && { valor_coleta: parseNumber(data.valorColeta) }),
        ...(data.numeroCTeColeta && { numero_cte_coleta: data.numeroCTeColeta }),
        ...(data.numeroCTeViagem && { numero_cte_viagem: data.numeroCTeViagem }),
        ...(data.dataEmbarque && { data_embarque: parseDate(data.dataEmbarque) }),
        
        // Informações complementares
        ...(data.dataHoraEntrada && { data_entrada: parseDate(data.dataHoraEntrada) }),
        ...(data.statusEmbarque && { status_embarque: data.statusEmbarque }),
        ...(data.responsavelEntrega && { responsavel_entrega: data.responsavelEntrega }),
        ...(data.motorista && { motorista: data.motorista }),
        ...(data.tempoArmazenamento && { tempo_armazenamento_horas: parseNumber(data.tempoArmazenamento) }),
        ...(data.entregueAoFornecedor && { entregue_ao_fornecedor: data.entregueAoFornecedor }),
        
        // Campos booleanos
        quimico: data.quimico === 'sim',
        fracionado: data.fracionado === 'sim',
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
