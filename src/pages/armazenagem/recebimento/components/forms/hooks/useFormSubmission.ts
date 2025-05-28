
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { NotaFiscalSchemaType } from '../notaFiscalSchema';
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';

export const useFormSubmission = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: NotaFiscalSchemaType, resetForm?: () => void) => {
    setIsLoading(true);
    try {
      console.log('Dados do formulário recebidos:', data);
      
      // Mapear todos os campos do formulário para a estrutura da tabela notas_fiscais
      const notaFiscalData = {
        // Campos básicos obrigatórios
        numero: data.numeroNF || '',
        serie: data.serieNF || null,
        chave_acesso: data.chaveNF || null,
        valor_total: data.valorTotal ? parseFloat(data.valorTotal) : 0,
        peso_bruto: data.pesoTotalBruto ? parseFloat(data.pesoTotalBruto) : null,
        quantidade_volumes: data.volumesTotal ? parseInt(data.volumesTotal) : null,
        data_emissao: data.dataHoraEmissao ? new Date(data.dataHoraEmissao).toISOString() : new Date().toISOString(),
        data_entrada: data.dataHoraEntrada ? new Date(data.dataHoraEntrada).toISOString() : null,
        tipo_operacao: data.tipoOperacao || null,
        numero_pedido: data.numeroPedido || null,
        status: 'pendente',
        tipo: 'entrada',
        
        // Dados completos do emitente
        emitente_cnpj: data.emitenteCNPJ || null,
        emitente_razao_social: data.emitenteRazaoSocial || null,
        emitente_telefone: data.emitenteTelefone || null,
        emitente_uf: data.emitenteUF || null,
        emitente_cidade: data.emitenteCidade || null,
        emitente_bairro: data.emitenteBairro || null,
        emitente_endereco: data.emitenteEndereco || null,
        emitente_numero: data.emitenteNumero || null,
        emitente_cep: data.emitenteCEP || null,
        
        // Dados completos do destinatário
        destinatario_cnpj: data.destinatarioCNPJ || null,
        destinatario_razao_social: data.destinatarioRazaoSocial || null,
        destinatario_telefone: data.destinatarioTelefone || null,
        destinatario_uf: data.destinatarioUF || null,
        destinatario_cidade: data.destinatarioCidade || null,
        destinatario_bairro: data.destinatarioBairro || null,
        destinatario_endereco: data.destinatarioEndereco || null,
        destinatario_numero: data.destinatarioNumero || null,
        destinatario_cep: data.destinatarioCEP || null,
        
        // Informações de transporte e logística
        informacoes_complementares: data.informacoesComplementares || null,
        fob_cif: data.fobCif || null,
        numero_coleta: data.numeroColeta || null,
        valor_coleta: data.valorColeta ? parseFloat(data.valorColeta) : null,
        numero_cte_coleta: data.numeroCTeColeta || null,
        numero_cte_viagem: data.numeroCTeViagem || null,
        data_embarque: data.dataEmbarque ? new Date(data.dataEmbarque).toISOString() : null,
        status_embarque: data.statusEmbarque || null,
        responsavel_entrega: data.responsavelEntrega || null,
        motorista: data.motorista || null,
        tempo_armazenamento_horas: data.tempoArmazenamento ? parseFloat(data.tempoArmazenamento) : null,
        entregue_ao_fornecedor: data.entregueAoFornecedor || null,
        observacoes: data.informacoesComplementares || null,
        
        // Campos boolean - fix type conversion
        quimico: data.quimico === 'sim',
        fracionado: data.fracionado === 'sim',
        
        // Referências (se existirem)
        remetente_id: data.remetente_id || null,
        destinatario_id: data.destinatario_id || null,
        transportadora_id: data.transportadora_id || null,
        ordem_carregamento_id: data.ordem_carregamento_id || null,
        coleta_id: data.coleta_id || null
      };
      
      console.log('Dados mapeados para o Supabase:', notaFiscalData);
      
      // Preparar itens da nota fiscal se existirem
      let itensNotaFiscal = [];
      if (data.itens && Array.isArray(data.itens) && data.itens.length > 0) {
        itensNotaFiscal = data.itens.map((item, index) => ({
          codigo_produto: item.codigoProduto || `PROD${index + 1}`,
          descricao: item.descricao || 'Produto',
          quantidade: parseFloat(item.quantidade) || 0,
          valor_unitario: parseFloat(item.valorUnitario) || 0,
          valor_total: parseFloat(item.valorTotal) || 0,
          sequencia: index + 1
        }));
        console.log('Itens da nota fiscal preparados:', itensNotaFiscal);
      }
      
      // Criar a nota fiscal usando o serviço
      const notaCriada = await criarNotaFiscal(notaFiscalData, itensNotaFiscal);
      
      console.log('Nota fiscal criada com sucesso:', notaCriada);
      
      toast({
        title: "✅ Nota fiscal cadastrada com sucesso!",
        description: `A nota fiscal nº ${notaCriada.numero} foi registrada e está disponível para consulta. ${itensNotaFiscal.length > 0 ? `Foram cadastrados ${itensNotaFiscal.length} itens.` : ''}`,
        duration: 5000,
      });

      // Reset form if function provided
      if (resetForm) {
        resetForm();
      }
      
      return notaCriada;
      
    } catch (error) {
      console.error("Erro ao cadastrar nota fiscal:", error);
      toast({
        title: "❌ Erro no cadastro",
        description: "Não foi possível cadastrar a nota fiscal. Verifique os dados e tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
