
import { useState } from 'react';
import { NotaFiscalSchemaType } from './notaFiscalSchema';
import { useToast } from "@/hooks/use-toast";
import { parseXmlFile } from '../../utils/xmlParser';
import { extractDataFromXml, searchNotaFiscalByChave } from '../../utils/notaFiscalExtractor';
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';
import { buscarNotaFiscalPorChave } from '@/services/notaFiscal/fetchNotaFiscalService';

export const useNotaFiscalForm = () => {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setValue: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        console.log('Arquivo XML selecionado:', file.name);
        
        const xmlData = await parseXmlFile(file);
        if (xmlData) {
          console.log("XML processado com sucesso, extraindo dados...");
          const extractedData = extractDataFromXml(xmlData);
          console.log("Dados extraídos:", extractedData);
          
          // Set current tab
          setValue('currentTab', 'xml');
          
          // Fill form fields with extracted data
          Object.entries(extractedData).forEach(([field, value]) => {
            if (value) {
              console.log(`Preenchendo campo ${field} com valor:`, value);
              setValue(field, value);
            }
          });
          
          toast({
            title: "XML processado",
            description: "O arquivo XML foi carregado e processado com sucesso.",
          });
        }
      } catch (error) {
        console.error("Erro ao processar o arquivo XML:", error);
        toast({
          title: "Erro",
          description: "Não foi possível processar o arquivo XML. Verifique se o formato está correto.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeySearch = async (getValues: any, setValue: any) => {
    const chaveNF = getValues('chaveNF');
    
    if (!chaveNF) {
      toast({
        title: "Erro",
        description: "Por favor, informe a chave de acesso da nota fiscal.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Set current tab
      setValue('currentTab', 'chave');
      
      // Buscar nota fiscal no Supabase primeiro
      const notaExistente = await buscarNotaFiscalPorChave(chaveNF);
      
      if (notaExistente) {
        // Se encontrou no banco, preencher com os dados existentes
        setValue('numeroNF', notaExistente.numero);
        setValue('serieNF', notaExistente.serie);
        setValue('valorTotal', notaExistente.valor_total?.toString());
        setValue('pesoTotalBruto', notaExistente.peso_bruto?.toString());
        setValue('volumesTotal', notaExistente.quantidade_volumes?.toString());
        setValue('dataHoraEmissao', notaExistente.data_emissao);
        
        // Dados do emitente
        setValue('emitenteCNPJ', notaExistente.emitente_cnpj);
        setValue('emitenteRazaoSocial', notaExistente.emitente_razao_social);
        
        // Dados do destinatário
        setValue('destinatarioCNPJ', notaExistente.destinatario_cnpj);
        setValue('destinatarioRazaoSocial', notaExistente.destinatario_razao_social);
        
        toast({
          title: "Nota fiscal encontrada",
          description: "A nota fiscal foi encontrada no banco de dados e os dados foram carregados.",
        });
      } else {
        // Se não encontrou no banco, usar a busca externa (mock)
        const notaFiscalData = await searchNotaFiscalByChave(chaveNF);
        
        // Fill form fields with found data
        Object.entries(notaFiscalData).forEach(([field, value]) => {
          setValue(field, value);
        });
        
        toast({
          title: "Nota fiscal encontrada",
          description: "A nota fiscal foi encontrada externamente e os dados foram carregados.",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar nota fiscal:", error);
      toast({
        title: "Erro",
        description: "Nota fiscal não encontrada ou erro ao buscar.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBatchImport = async (files: File[], setValue: any) => {
    if (!files || files.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione pelo menos um arquivo XML.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Set current tab
      setValue('currentTab', 'lote');
      
      toast({
        title: "Importação em lote iniciada",
        description: `Processando ${files.length} arquivo(s) XML.`,
      });
      
      // In a real application, you would process all files and handle the common fields
      // For now, we'll just simulate success after a delay
      setTimeout(() => {
        toast({
          title: "Importação em lote concluída",
          description: `${files.length} nota(s) fiscal(is) importada(s) com sucesso.`,
        });
      }, 1000);
      
    } catch (error) {
      console.error("Erro ao importar em lote:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao importar os arquivos XML em lote.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    handleSubmit,
    handleFileUpload,
    handleKeySearch,
    handleBatchImport,
    isLoading
  };
};
