
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
      console.log('Dados do formulário:', data);
      
      // Converter os dados do formulário para o formato da tabela notas_fiscais
      const notaFiscalData = {
        numero: data.numeroNF || '',
        serie: data.serieNF || null,
        chave_acesso: data.chaveNF || null,
        valor_total: parseFloat(data.valorTotal || '0'),
        peso_bruto: data.pesoTotalBruto ? parseFloat(data.pesoTotalBruto) : null,
        quantidade_volumes: data.volumesTotal ? parseInt(data.volumesTotal) : null,
        data_emissao: data.dataHoraEmissao ? new Date(data.dataHoraEmissao).toISOString() : new Date().toISOString(),
        data_entrada: data.dataHoraEntrada ? new Date(data.dataHoraEntrada).toISOString() : null,
        tipo_operacao: data.tipoOperacao || null,
        status: 'pendente',
        
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
        numero_pedido: data.numeroPedido || null,
        informacoes_complementares: data.informacoesComplementares || null,
        fob_cif: data.fobCif || null,
        numero_coleta: data.numeroColeta || null,
        valor_coleta: data.valorColeta ? parseFloat(data.valorColeta) : null,
        numero_cte_coleta: data.numeroCTeColeta || null,
        numero_cte_viagem: data.numeroCTeViagem || null,
        data_embarque: data.dataEmbarque ? new Date(data.dataEmbarque).toISOString() : null,
        status_embarque: data.statusEmbarque || null,
        responsavel_entrega: data.responsavelEntrega || null,
        quimico: data.quimico === 'sim',
        fracionado: data.fracionado === 'sim',
        motorista: data.motorista || null,
        tempo_armazenamento_horas: data.tempoArmazenamento ? parseFloat(data.tempoArmazenamento) : null,
        entregue_ao_fornecedor: data.entregueAoFornecedor || null,
        observacoes: data.informacoesComplementares || null
      };
      
      console.log('Dados para salvar no Supabase:', notaFiscalData);
      
      // Criar a nota fiscal usando o serviço
      const notaCriada = await criarNotaFiscal(notaFiscalData);
      
      console.log('Nota fiscal criada com sucesso:', notaCriada);
      
      toast({
        title: "Nota fiscal cadastrada",
        description: `Nota fiscal ${notaCriada.numero} foi cadastrada com sucesso.`,
      });

      // Reset form if function provided
      if (resetForm) {
        resetForm();
      }
      
      return notaCriada;
      
    } catch (error) {
      console.error("Erro ao cadastrar nota fiscal:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar a nota fiscal. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
