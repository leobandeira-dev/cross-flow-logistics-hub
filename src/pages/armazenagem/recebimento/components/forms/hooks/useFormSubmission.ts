
import { useState } from 'react';
import { NotaFiscalSchemaType } from '../notaFiscalSchema';
import { useToast } from "@/hooks/use-toast";
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';
import { NotaFiscal, ItemNotaFiscal } from '@/types/supabase.types';

export const useFormSubmission = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: NotaFiscalSchemaType) => {
    setIsLoading(true);
    try {
      console.log('Dados do formulário recebidos:', data);
      
      // Mapear os dados do formulário para o formato da NotaFiscal
      const notaFiscalData: Partial<NotaFiscal> = {
        numero: data.numeroNF || '',
        serie: data.serieNF,
        chave_acesso: data.chaveNF,
        data_emissao: data.dataHoraEmissao ? new Date(data.dataHoraEmissao).toISOString() : new Date().toISOString(),
        valor_total: data.valorTotal ? parseFloat(data.valorTotal.replace(/[^\d.,]/g, '').replace(',', '.')) : 0,
        peso_bruto: data.pesoTotalBruto ? parseFloat(data.pesoTotalBruto.replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
        quantidade_volumes: data.volumesTotal ? parseInt(data.volumesTotal) : undefined,
        status: 'pendente',
        tipo_operacao: data.tipoOperacao,
        
        // Dados do emitente
        emitente_cnpj: data.emitenteCNPJ,
        emitente_razao_social: data.emitenteRazaoSocial,
        emitente_telefone: data.emitenteTelefone,
        emitente_uf: data.emitenteUF,
        emitente_cidade: data.emitenteCidade,
        emitente_bairro: data.emitenteBairro,
        emitente_endereco: data.emitenteEndereco,
        emitente_numero: data.emitenteNumero,
        emitente_cep: data.emitenteCEP,
        
        // Dados do destinatário
        destinatario_cnpj: data.destinatarioCNPJ,
        destinatario_razao_social: data.destinatarioRazaoSocial,
        destinatario_telefone: data.destinatarioTelefone,
        destinatario_uf: data.destinatarioUF,
        destinatario_cidade: data.destinatarioCidade,
        destinatario_bairro: data.destinatarioBairro,
        destinatario_endereco: data.destinatarioEndereco,
        destinatario_numero: data.destinatarioNumero,
        destinatario_cep: data.destinatarioCEP,
        
        // Informações adicionais
        informacoes_complementares: data.informacoesComplementares,
        numero_pedido: data.numeroPedido,
        fob_cif: data.fobCif,
        
        // Informações de transporte
        numero_coleta: data.numeroColeta,
        valor_coleta: data.valorColeta ? parseFloat(data.valorColeta.replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
        numero_cte_coleta: data.numeroCTeColeta,
        numero_cte_viagem: data.numeroCTeViagem,
        data_embarque: data.dataEmbarque ? new Date(data.dataEmbarque).toISOString() : undefined,
        
        // Informações complementares
        data_entrada: data.dataHoraEntrada ? new Date(data.dataHoraEntrada).toISOString() : undefined,
        status_embarque: data.statusEmbarque,
        responsavel_entrega: data.responsavelEntrega,
        quimico: data.quimico === 'sim',
        fracionado: data.fracionado === 'sim',
        motorista: data.motorista,
        tempo_armazenamento_horas: data.tempoArmazenamento ? parseFloat(data.tempoArmazenamento) : undefined,
        entregue_ao_fornecedor: data.entregueAoFornecedor
      };
      
      console.log('Dados mapeados para envio:', notaFiscalData);
      
      // Criar a nota fiscal no banco de dados
      const notaCriada = await criarNotaFiscal(notaFiscalData);
      
      console.log('Nota fiscal criada com sucesso:', notaCriada);
      
      toast({
        title: "✅ Nota Fiscal Cadastrada",
        description: `Nota fiscal ${notaCriada.numero} cadastrada com sucesso no sistema.`
      });
      
      return notaCriada;
    } catch (error) {
      console.error("Erro ao cadastrar nota fiscal:", error);
      
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
