
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { NotaFiscalSchemaType } from '../notaFiscalSchema';
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';

export const useFormSubmission = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: NotaFiscalSchemaType) => {
    setIsLoading(true);
    try {
      console.log('Dados do formulário:', data);
      
      // Converter os dados do formulário para o formato da tabela notas_fiscais
      const notaFiscalData = {
        numero: data.numeroNF || '',
        serie: data.serieNF || '',
        chave_acesso: data.chaveNF || '',
        valor_total: parseFloat(data.valorTotal || '0'),
        peso_bruto: parseFloat(data.pesoTotalBruto || '0'),
        quantidade_volumes: parseInt(data.volumesTotal || '0'),
        data_emissao: data.dataHoraEmissao ? new Date(data.dataHoraEmissao).toISOString() : new Date().toISOString(),
        data_entrada: data.dataHoraEntrada ? new Date(data.dataHoraEntrada).toISOString() : null,
        tipo_operacao: data.tipoOperacao || '',
        status: 'pendente',
        
        // Dados do emitente
        emitente_cnpj: data.emitenteCNPJ || '',
        emitente_razao_social: data.emitenteRazaoSocial || '',
        emitente_telefone: data.emitenteTelefone || '',
        emitente_uf: data.emitenteUF || '',
        emitente_cidade: data.emitenteCidade || '',
        emitente_bairro: data.emitenteBairro || '',
        emitente_endereco: data.emitenteEndereco || '',
        emitente_numero: data.emitenteNumero || '',
        emitente_cep: data.emitenteCEP || '',
        
        // Dados do destinatário
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
        numero_pedido: data.numeroPedido || '',
        informacoes_complementares: data.informacoesComplementares || '',
        fob_cif: data.fobCif || '',
        numero_coleta: data.numeroColeta || '',
        valor_coleta: data.valorColeta ? parseFloat(data.valorColeta) : null,
        numero_cte_coleta: data.numeroCTeColeta || '',
        numero_cte_viagem: data.numeroCTeViagem || '',
        data_embarque: data.dataEmbarque ? new Date(data.dataEmbarque).toISOString() : null,
        status_embarque: data.statusEmbarque || '',
        responsavel_entrega: data.responsavelEntrega || '',
        quimico: data.quimico === 'sim',
        fracionado: data.fracionado === 'sim',
        motorista: data.motorista || '',
        tempo_armazenamento_horas: data.tempoArmazenamento ? parseFloat(data.tempoArmazenamento) : null,
        entregue_ao_fornecedor: data.entregueAoFornecedor || '',
        observacoes: ''
      };
      
      console.log('Dados para salvar no Supabase:', notaFiscalData);
      
      // Criar a nota fiscal usando o serviço
      const notaCriada = await criarNotaFiscal(notaFiscalData);
      
      console.log('Nota fiscal criada com sucesso:', notaCriada);
      
      toast({
        title: "Nota fiscal cadastrada",
        description: `Nota fiscal ${notaCriada.numero} foi cadastrada com sucesso.`,
      });
      
    } catch (error) {
      console.error("Erro ao cadastrar nota fiscal:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar a nota fiscal. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
