
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

      // Mapear os dados do formulário para o formato da NotaFiscal
      const notaFiscalData: Partial<NotaFiscal> = {
        // Campos obrigatórios
        numero: data.numeroNF,
        valor_total: data.valorTotal ? parseFloat(data.valorTotal.toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 0,
        data_emissao: data.dataHoraEmissao ? new Date(data.dataHoraEmissao).toISOString() : new Date().toISOString(),
        status: 'pendente',
        data_inclusao: new Date().toISOString()
      };

      // Adicionar campos opcionais apenas se tiverem valor
      if (data.serieNF) notaFiscalData.serie = data.serieNF;
      if (data.chaveNF) notaFiscalData.chave_acesso = data.chaveNF;
      if (data.pesoTotalBruto) notaFiscalData.peso_bruto = parseFloat(data.pesoTotalBruto.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
      if (data.volumesTotal) notaFiscalData.quantidade_volumes = parseInt(data.volumesTotal.toString());
      if (data.tipoOperacao) notaFiscalData.tipo_operacao = data.tipoOperacao;
      
      // Dados do emitente
      if (data.emitenteCNPJ) notaFiscalData.emitente_cnpj = data.emitenteCNPJ;
      if (data.emitenteRazaoSocial) notaFiscalData.emitente_razao_social = data.emitenteRazaoSocial;
      if (data.emitenteTelefone) notaFiscalData.emitente_telefone = data.emitenteTelefone;
      if (data.emitenteUF) notaFiscalData.emitente_uf = data.emitenteUF;
      if (data.emitenteCidade) notaFiscalData.emitente_cidade = data.emitenteCidade;
      if (data.emitenteBairro) notaFiscalData.emitente_bairro = data.emitenteBairro;
      if (data.emitenteEndereco) notaFiscalData.emitente_endereco = data.emitenteEndereco;
      if (data.emitenteNumero) notaFiscalData.emitente_numero = data.emitenteNumero;
      if (data.emitenteCEP) notaFiscalData.emitente_cep = data.emitenteCEP;
      
      // Dados do destinatário
      if (data.destinatarioCNPJ) notaFiscalData.destinatario_cnpj = data.destinatarioCNPJ;
      if (data.destinatarioRazaoSocial) notaFiscalData.destinatario_razao_social = data.destinatarioRazaoSocial;
      if (data.destinatarioTelefone) notaFiscalData.destinatario_telefone = data.destinatarioTelefone;
      if (data.destinatarioUF) notaFiscalData.destinatario_uf = data.destinatarioUF;
      if (data.destinatarioCidade) notaFiscalData.destinatario_cidade = data.destinatarioCidade;
      if (data.destinatarioBairro) notaFiscalData.destinatario_bairro = data.destinatarioBairro;
      if (data.destinatarioEndereco) notaFiscalData.destinatario_endereco = data.destinatarioEndereco;
      if (data.destinatarioNumero) notaFiscalData.destinatario_numero = data.destinatarioNumero;
      if (data.destinatarioCEP) notaFiscalData.destinatario_cep = data.destinatarioCEP;
      
      // Informações adicionais
      if (data.informacoesComplementares) notaFiscalData.informacoes_complementares = data.informacoesComplementares;
      if (data.numeroPedido) notaFiscalData.numero_pedido = data.numeroPedido;
      if (data.fobCif) notaFiscalData.fob_cif = data.fobCif;
      
      // Informações de transporte
      if (data.numeroColeta) notaFiscalData.numero_coleta = data.numeroColeta;
      if (data.valorColeta) notaFiscalData.valor_coleta = parseFloat(data.valorColeta.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
      if (data.numeroCTeColeta) notaFiscalData.numero_cte_coleta = data.numeroCTeColeta;
      if (data.numeroCTeViagem) notaFiscalData.numero_cte_viagem = data.numeroCTeViagem;
      if (data.dataEmbarque) notaFiscalData.data_embarque = new Date(data.dataEmbarque).toISOString();
      
      // Informações complementares
      if (data.dataHoraEntrada) notaFiscalData.data_entrada = new Date(data.dataHoraEntrada).toISOString();
      if (data.statusEmbarque) notaFiscalData.status_embarque = data.statusEmbarque;
      if (data.responsavelEntrega) notaFiscalData.responsavel_entrega = data.responsavelEntrega;
      if (data.motorista) notaFiscalData.motorista = data.motorista;
      if (data.tempoArmazenamento) notaFiscalData.tempo_armazenamento_horas = parseFloat(data.tempoArmazenamento.toString());
      if (data.entregueAoFornecedor) notaFiscalData.entregue_ao_fornecedor = data.entregueAoFornecedor;
      
      // Campos booleanos
      notaFiscalData.quimico = data.quimico === 'sim';
      notaFiscalData.fracionado = data.fracionado === 'sim';
      
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
