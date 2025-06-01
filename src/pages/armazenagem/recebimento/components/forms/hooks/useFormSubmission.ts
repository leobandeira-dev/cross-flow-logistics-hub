
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
        // Campos obrigatórios - sempre incluir
        numero: data.numeroNF,
        valor_total: parseNumber(data.valorTotal),
        data_emissao: parseDate(data.dataHoraEmissao),
        status: 'pendente',
        data_inclusao: new Date().toISOString(),

        // Campos obrigatórios com valores padrão
        serie: data.serieNF || '1',
        chave_acesso: data.chaveNF || '',
        peso_bruto: parseNumber(data.pesoTotalBruto),
        quantidade_volumes: data.volumesTotal ? parseInt(data.volumesTotal.toString()) : 1,
        
        // Tipo de operação
        tipo_operacao: data.tipoOperacao || 'entrada',
        tipo: 'entrada',
        
        // Dados do emitente - sempre incluir mesmo que vazios
        emitente_cnpj: data.emitenteCNPJ || '',
        emitente_razao_social: data.emitenteRazaoSocial || '',
        emitente_telefone: data.emitenteTelefone || '',
        emitente_uf: data.emitenteUF || '',
        emitente_cidade: data.emitenteCidade || '',
        emitente_bairro: data.emitenteBairro || '',
        emitente_endereco: data.emitenteEndereco || '',
        emitente_numero: data.emitenteNumero || '',
        emitente_cep: data.emitenteCEP || '',
        
        // Dados do destinatário - sempre incluir mesmo que vazios
        destinatario_cnpj: data.destinatarioCNPJ || '',
        destinatario_razao_social: data.destinatarioRazaoSocial || '',
        destinatario_telefone: data.destinatarioTelefone || '',
        destinatario_uf: data.destinatarioUF || '',
        destinatario_cidade: data.destinatarioCidade || '',
        destinatario_bairro: data.destinatarioBairro || '',
        destinatario_endereco: data.destinatarioEndereco || '',
        destinatario_numero: data.destinatarioNumero || '',
        destinatario_cep: data.destinatarioCEP || '',
        
        // Informações adicionais
        informacoes_complementares: data.informacoesComplementares || '',
        numero_pedido: data.numeroPedido || '',
        fob_cif: data.tipoFrete || '',
        
        // Informações de transporte
        numero_coleta: data.numeroColeta || '',
        valor_coleta: parseNumber(data.valorColeta),
        numero_cte_coleta: data.numeroCTeColeta || '',
        numero_cte_viagem: data.numeroCTeViagem || '',
        data_embarque: data.dataEmbarque ? parseDate(data.dataEmbarque) : null,
        
        // Informações complementares - CORRIGIDO
        data_entrada: data.dataHoraEntrada ? parseDate(data.dataHoraEntrada) : null,
        status_embarque: data.statusEmbarque || '',
        responsavel_entrega: data.responsavelEntrega || '',
        motorista: data.motorista || '',
        tempo_armazenamento_horas: parseNumber(data.tempoArmazenamento),
        entregue_ao_fornecedor: data.entregueAoFornecedor || '',
        
        // Campos booleanos
        quimico: data.quimico === 'sim',
        fracionado: data.fracionado === 'sim',
        
        // Observações - alimentado com informações complementares
        observacoes: data.informacoesComplementares || '',
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
